import { createMachine, assign, actions, send, spawn } from 'xstate';
import { getFreshnessColorsFromSessionInformation } from '../../helpers/liveness/liveness';

import {
  Face,
  LivenessContext,
  LivenessEvent,
  FaceMatchState,
  LivenessErrorState,
  IlluminationState,
} from '../../types';
import {
  ChallengeType,
  ClientSessionInformation,
} from '../../types/liveness/liveness-service-types';
import {
  BlazeFaceFaceDetection,
  drawLivenessOvalInCanvas,
  getFaceMatchStateInLivenessOval,
  getRandomLivenessOvalDetails,
  LivenessStreamProvider,
  estimateIllumination,
  recordLivenessAnalyticsEvent,
  LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
  isCameraDeviceVirtual,
  FreshnessColorDisplay,
} from '../../helpers';
import { v4 } from 'uuid';
import { isServerSesssionInformationEvent } from '../../helpers/liveness/liveness-event-utils';

export const MIN_FACE_MATCH_COUNT = 5;

// timer metrics variables
let faceDetectedTimestamp: number;
let ovalDrawnTimestamp: number;
let freshnessTimeoutId: NodeJS.Timeout;

let responseStream = undefined;

export const livenessMachine = createMachine<LivenessContext, LivenessEvent>(
  {
    id: 'livenessMachine',
    initial: 'start',
    context: {
      challengeId: v4(),
      maxFailedAttempts: 3,
      failedAttempts: 0,
      flowProps: undefined,
      sessionInformation: undefined,
      videoAssociatedParams: undefined,
      ovalAssociatedParams: undefined,
      faceMatchAssociatedParams: {
        illuminationState: undefined,
        faceMatchState: undefined,
        faceMatchCount: 0,
        currentDetectedFace: undefined,
        startFace: undefined,
        endFace: undefined,
      },
      freshnessColorAssociatedParams: {
        freshnessColorEl: undefined,
        freshnessColors: [],
        freshnessColorsComplete: false,
        freshnessColorDisplay: undefined,
      },
      errorState: null,
      livenessStreamProvider: undefined,
      responseStreamActorRef: undefined,
    },
    on: {
      CANCEL: 'userCancel',
      TIMEOUT: {
        target: 'retryableTimeout',
        actions: 'updateErrorStateForTimeout',
      },
      SET_SESSION_INFO: {
        internal: true,
        actions: 'updateSessionInfo',
      },
    },
    states: {
      start: {
        on: {
          BEGIN: 'cameraCheck',
        },
      },
      cameraCheck: {
        entry: ['setVideoConstraints', 'initializeFaceDetector'],
        invoke: {
          src: 'checkVirtualCameraAndGetStream',
          onDone: {
            target: 'initializeLivenessStream',
            actions: ['updateVideoMediaStream'],
          },
          onError: {
            target: 'permissionDenied',
          },
        },
      },
      initializeLivenessStream: {
        invoke: {
          src: 'openLivenessStreamConnection',
          onDone: {
            target: 'notRecording',
            actions: [
              'updateLivenessStreamProvider',
              'spawnResponseStreamActor',
            ],
          },
        },
      },
      notRecording: {
        on: {
          START_RECORDING: 'recording',
        },
      },
      recording: {
        entry: [
          'setDOMAndCameraDetails',
          'startRecording',
          'clearErrorState',
          'sendTimeoutAfterOvalDrawingDelay',
        ],
        initial: 'ovalDrawing',
        states: {
          ovalDrawing: {
            invoke: {
              src: 'detectInitialFaceAndDrawOval',
              onDone: {
                target: 'checkFaceDetected',
                actions: [
                  'updateOvalAndFaceDetailsPostDraw',
                  'sendTimeoutAfterOvalMatchDelay',
                ],
              },
              onError: {
                target: '#livenessMachine.error',
                actions: 'updateErrorStateForRuntime',
              },
            },
          },
          checkFaceDetected: {
            after: {
              0: {
                target: 'ovalMatching',
                cond: 'hasSingleFace',
              },
              100: { target: 'ovalDrawing' },
            },
          },
          ovalMatching: {
            entry: ['cancelOvalDrawingTimeout', 'resetFreshness'],
            invoke: {
              src: 'detectFaceAndMatchOval',
              onDone: {
                target: 'checkMatch',
                actions: 'updateFaceDetailsPostMatch',
              },
            },
          },
          checkMatch: {
            after: {
              0: {
                target: 'flashFreshnessColors',
                cond: 'hasFaceMatchedInOvalWithMinCount',
                actions: ['updateEndFaceMatch', 'setupFlashFreshnessColors'],
              },
              0.1: {
                target: 'ovalMatching',
                cond: 'hasFaceMatchedInOval',
                actions: 'increaseFaceMatchCountAndStartFace',
              },
              100: {
                target: 'ovalMatching',
                actions: 'resetFaceMatchCountAndStartFace',
              },
            },
          },
          flashFreshnessColors: {
            entry: ['cancelOvalMatchTimeout'],
            invoke: {
              src: 'flashColors',
              onDone: [
                {
                  target: 'success',
                  cond: 'hasFreshnessColorShown',
                },
                {
                  target: 'flashFreshnessColors',
                  actions: 'updateFreshnessDetails',
                },
              ],
              onError: {
                target: 'flashFreshnessColorError',
              },
            },
          },
          flashFreshnessColorError: {
            entry: ['resetFreshness'],
            after: {
              5000: {
                target: 'ovalMatching',
              },
            },
          },
          success: {
            entry: ['stopRecording'],
            type: 'final',
          },
        },
        onDone: 'uploading',
      },
      uploading: {
        initial: 'pending',
        states: {
          pending: {
            invoke: {
              src: 'putLivenessVideo',
              onDone: 'checking',
              onError: {
                target: '#livenessMachine.error',
                actions: 'updateErrorStateForRuntime',
              },
            },
          },
          checking: {
            always: [
              {
                target: '#livenessMachine.checkSucceeded',
                cond: 'hasLivenessCheckSucceeded',
              },
              { target: '#livenessMachine.checkFailed' },
            ],
          },
        },
      },
      retryableTimeout: {
        entry: 'updateFailedAttempts',
        always: [
          {
            target: 'timeout',
            cond: 'shouldTimeoutOnFailedAttempts',
          },
          { target: 'notRecording' },
        ],
      },
      permissionDenied: {
        entry: 'callUserPermissionDeniedCallback',
      },
      timeout: {
        entry: 'callUserTimeoutCallback',
      },
      error: {
        entry: 'callErrorCallback',
      },
      checkFailed: {},
      checkSucceeded: {
        entry: 'callSuccessCallback',
      },
      userCancel: {
        entry: 'callUserCancelCallback',
        type: 'final',
      },
    },
  },
  {
    actions: {
      spawnResponseStreamActor: assign({
        responseStreamActorRef: () => spawn(responseStreamActor),
      }),
      updateFailedAttempts: assign({
        failedAttempts: (context) => {
          recordLivenessAnalyticsEvent(context.flowProps, {
            event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
            attributes: { action: 'Timeout' },
            metrics: { count: 1 },
          });

          return context.failedAttempts + 1;
        },
      }),
      setVideoConstraints: assign({
        videoAssociatedParams: (context, event) => ({
          ...context.videoAssociatedParams,
          videoConstraints: event.data?.videoConstraints,
        }),
      }),
      updateVideoMediaStream: assign({
        videoAssociatedParams: (context, event) => ({
          ...context.videoAssociatedParams,
          videoMediaStream: event.data?.stream,
        }),
      }),
      initializeFaceDetector: assign({
        ovalAssociatedParams: (context) => {
          const faceDetector = new BlazeFaceFaceDetection();
          faceDetector.triggerModelLoading();

          return {
            ...context.ovalAssociatedParams,
            faceDetector,
          };
        },
      }),
      updateLivenessStreamProvider: assign({
        livenessStreamProvider: (context, event) => {
          return event.data?.livenessStreamProvider;
        },
      }),
      setDOMAndCameraDetails: assign({
        videoAssociatedParams: (context, event) => ({
          ...context.videoAssociatedParams,
          videoEl: event.data?.videoEl,
          canvasEl: event.data?.canvasEl,
        }),
        freshnessColorAssociatedParams: (context, event) => ({
          ...context.freshnessColorAssociatedParams,
          freshnessColorEl: event.data?.freshnessColorEl,
        }),
      }),
      startRecording: assign({
        videoAssociatedParams: (context) => {
          recordLivenessAnalyticsEvent(context.flowProps, {
            event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
            attributes: { action: 'AttemptLivenessCheck' },
            metrics: { count: 1 },
          });

          if (!context.sessionInformation) {
            throw new Error(
              'Session information was not received from response stream'
            );
          }
          if (
            context.livenessStreamProvider.videoRecorder &&
            context.livenessStreamProvider.videoRecorder.getState() !==
              'recording'
          ) {
            context.livenessStreamProvider.startRecordingLivenessVideo();
          }

          return {
            ...context.videoAssociatedParams,
            recordingStartTimestampMs: Date.now(),
          };
        },
      }),
      stopRecording: (context) => {
        recordLivenessAnalyticsEvent(context.flowProps, {
          event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
          attributes: { action: 'Success' },
          metrics: { count: 1 },
        });
      },
      updateOvalAndFaceDetailsPostDraw: assign({
        ovalAssociatedParams: (context, event) => ({
          ...context.ovalAssociatedParams,
          initialFace: event.data.initialFace,
          ovalDetails: event.data.ovalDetails,
        }),
        faceMatchAssociatedParams: (context, event) => ({
          ...context.faceMatchAssociatedParams,
          faceMatchState: event.data.faceMatchState,
          illuminationState: event.data.illuminationState,
        }),
      }),
      updateFaceDetailsPostMatch: assign({
        faceMatchAssociatedParams: (context, event) => ({
          ...context.faceMatchAssociatedParams,
          faceMatchState: event.data.faceMatchState,
          illuminationState: event.data.illuminationState,
          currentDetectedFace: event.data.detectedFace,
        }),
      }),
      updateEndFaceMatch: assign({
        faceMatchAssociatedParams: (context) => ({
          ...context.faceMatchAssociatedParams,
          endFace: context.faceMatchAssociatedParams.currentDetectedFace,
        }),
      }),
      increaseFaceMatchCountAndStartFace: assign({
        faceMatchAssociatedParams: (context) => ({
          ...context.faceMatchAssociatedParams,
          faceMatchCount: context.faceMatchAssociatedParams.faceMatchCount + 1,
          startFace:
            context.faceMatchAssociatedParams.faceMatchCount === 0
              ? context.faceMatchAssociatedParams.currentDetectedFace
              : context.faceMatchAssociatedParams.startFace,
        }),
      }),
      resetFaceMatchCountAndStartFace: assign({
        faceMatchAssociatedParams: (context) => ({
          ...context.faceMatchAssociatedParams,
          faceMatchCount: 0,
          startFace: undefined,
          endFace: undefined,
        }),
      }),
      updateErrorStateForTimeout: assign({
        errorState: (_) => LivenessErrorState.TIMEOUT,
      }),
      updateErrorStateForRuntime: assign({
        errorState: (_) => LivenessErrorState.RUNTIME_ERROR,
      }),
      clearErrorState: assign({
        errorState: (_) => null,
      }),
      updateSessionInfo: assign({
        sessionInformation: (_, event) => {
          return event.data.sessionInfo;
        },
      }),
      updateFreshnessDetails: assign({
        freshnessColorAssociatedParams: (context, event) => {
          return {
            ...context.freshnessColorAssociatedParams,
            freshnessColorsComplete: event.data.freshnessColorsComplete,
          };
        },
      }),
      resetFreshness: (context) => {
        const {
          freshnessColorAssociatedParams: { freshnessColorEl },
        } = context;
        freshnessColorEl.hidden = true;
        if (freshnessTimeoutId) {
          clearTimeout(freshnessTimeoutId);
        }
      },
      setupFlashFreshnessColors: assign({
        freshnessColorAssociatedParams: (context) => {
          const {
            flowProps: { sessionInformation },
          } = context;
          const freshnessColors =
            getFreshnessColorsFromSessionInformation(sessionInformation);
          const freshnessColorDisplay = new FreshnessColorDisplay(
            context,
            freshnessColors
          );

          return {
            ...context.freshnessColorAssociatedParams,
            freshnessColors,
            freshnessColorDisplay,
          };
        },
      }),

      // timeouts
      sendTimeoutAfterOvalDrawingDelay: actions.send(
        { type: 'TIMEOUT' },
        {
          delay: 5000,
          id: 'ovalDrawingTimeout',
        }
      ),
      cancelOvalDrawingTimeout: actions.cancel('ovalDrawingTimeout'),
      sendTimeoutAfterOvalMatchDelay: actions.send(
        { type: 'TIMEOUT' },
        {
          delay: 5000,
          id: 'ovalMatchTimeout',
        }
      ),
      cancelOvalMatchTimeout: actions.cancel('ovalMatchTimeout'),

      // callbacks
      callUserPermissionDeniedCallback: (context) => {
        recordLivenessAnalyticsEvent(context.flowProps, {
          event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
          attributes: { action: 'PermissionDenied' },
          metrics: { count: 1 },
        });

        context.flowProps.onUserPermissionDeined?.();
      },
      callUserCancelCallback: (context) => {
        context.flowProps.onUserCancel?.();
      },
      callUserTimeoutCallback: (context) => {
        recordLivenessAnalyticsEvent(context.flowProps, {
          event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
          attributes: { action: 'FailedWithTimeout' },
          metrics: { count: 1 },
        });

        context.flowProps.onUserTimeout?.();
      },
      callSuccessCallback: (context) => {
        context.flowProps.onSuccess?.();
      },
      callErrorCallback: (context, event) => {
        context.flowProps.onError?.(event.data as Error);
      },
    },
    guards: {
      shouldTimeoutOnFailedAttempts: (context) =>
        context.failedAttempts >= context.maxFailedAttempts,
      hasFaceMatchedInOvalWithMinCount: (context) => {
        const { faceMatchState, faceMatchCount } =
          context.faceMatchAssociatedParams;
        const hasMatched =
          faceMatchState === FaceMatchState.MATCHED &&
          faceMatchCount >= MIN_FACE_MATCH_COUNT;

        if (hasMatched) {
          recordLivenessAnalyticsEvent(context.flowProps, {
            event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
            attributes: { action: 'FaceMatched' },
            metrics: {
              duration: Date.now() - ovalDrawnTimestamp,
            },
          });
        }

        return hasMatched;
      },
      hasFaceMatchedInOval: (context) => {
        return (
          context.faceMatchAssociatedParams.faceMatchState ===
          FaceMatchState.MATCHED
        );
      },
      hasSingleFace: (context) => {
        return (
          context.faceMatchAssociatedParams.faceMatchState ===
          FaceMatchState.FACE_IDENTIFIED
        );
      },
      hasLivenessCheckSucceeded: (_, __, meta) => meta.state.event.data.isLive,
      hasFreshnessColorShown: (context) =>
        context.freshnessColorAssociatedParams.freshnessColorsComplete,
    },
    services: {
      async checkVirtualCameraAndGetStream(context) {
        const { videoConstraints } = context.videoAssociatedParams;

        // Get initial stream to enumerate devices with non-empty labels
        const initialStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false,
        });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const realVideoDevices = devices
          .filter((device) => device.kind === 'videoinput')
          .filter((device) => !isCameraDeviceVirtual(device));

        if (!realVideoDevices.length) {
          recordLivenessAnalyticsEvent(context.flowProps, {
            event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
            attributes: { action: 'NoRealDeviceFound' },
            metrics: { count: 1 },
          });
          throw new Error('No real video devices found');
        }

        // If the initial stream is of real camera, use it otherwise use the first real camera
        const initialStreamDeviceId = initialStream
          .getTracks()[0]
          .getSettings().deviceId;
        const isInitialStreamFromRealDevice = realVideoDevices.some(
          (device) => device.deviceId === initialStreamDeviceId
        );

        let realVideoDeviceStream = initialStream;
        if (!isInitialStreamFromRealDevice) {
          realVideoDeviceStream = await navigator.mediaDevices.getUserMedia({
            video: {
              ...videoConstraints,
              deviceId: { exact: realVideoDevices[0].deviceId },
            },
            audio: false,
          });
        }

        return { stream: realVideoDeviceStream };
      },
      async openLivenessStreamConnection(context) {
        const livenessStreamProvider = new LivenessStreamProvider(
          context.flowProps.sessionId,
          context.videoAssociatedParams.videoMediaStream
        );

        responseStream =
          await livenessStreamProvider.startLivenessVideoConnection();
        return { livenessStreamProvider };
      },
      async detectInitialFaceAndDrawOval(context) {
        const {
          videoAssociatedParams: {
            videoEl,
            canvasEl,
            videoMediaStream,
            recordingStartTimestampMs,
          },
          ovalAssociatedParams: { faceDetector },
          flowProps: { sessionInformation },
        } = context;

        // initialize models
        try {
          await faceDetector.modelLoadingPromise;
        } catch (err) {
          console.log({ err });
        }

        // detect face
        const startDetectTime = Date.now();
        const detectedFaces = await faceDetector.detectFaces(videoEl);
        let initialFace: Face;
        let faceMatchState: FaceMatchState;
        let illuminationState: IlluminationState;

        switch (detectedFaces.length) {
          case 0: {
            // no face detected;
            recordLivenessAnalyticsEvent(context.flowProps, {
              event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
              attributes: { action: 'NoFaceDetected' },
              metrics: { count: 1 },
            });

            faceMatchState = FaceMatchState.CANT_IDENTIFY;
            illuminationState = estimateIllumination(videoEl);
            break;
          }
          case 1: {
            //exactly one face detected;
            faceDetectedTimestamp = Date.now();
            recordLivenessAnalyticsEvent(context.flowProps, {
              event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
              attributes: { action: 'FaceDetected' },
              metrics: {
                duration: faceDetectedTimestamp - startDetectTime,
              },
            });

            faceMatchState = FaceMatchState.FACE_IDENTIFIED;
            initialFace = detectedFaces[0];
            break;
          }
          default: {
            //more than one face detected ;
            faceMatchState = FaceMatchState.TOO_MANY;
            break;
          }
        }

        if (!initialFace) {
          return { faceMatchState, illuminationState };
        }

        // generate oval details from initialFace and video dimensions
        const { width, height } = videoMediaStream.getTracks()[0].getSettings();
        const ovalDetails = getRandomLivenessOvalDetails({
          width,
          height,
          initialFace,
          sessionInformation,
        });

        // draw oval on canvas
        canvasEl.width = width;
        canvasEl.height = height;
        drawLivenessOvalInCanvas(canvasEl, ovalDetails);
        ovalDrawnTimestamp = Date.now();
        recordLivenessAnalyticsEvent(context.flowProps, {
          event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
          attributes: { action: 'RenderOval' },
          metrics: {
            duration: ovalDrawnTimestamp - faceDetectedTimestamp,
          },
        });

        // Send client info for initial face position
        const flippedInitialFaceLeft =
          width - initialFace.left - initialFace.width;
        context.livenessStreamProvider.sendClientInfo({
          challenges: [
            {
              type: ChallengeType.FACE_MOVEMENT,
              faceMovementChallenge: {
                initialFacePosition: {
                  height: initialFace.height,
                  width: initialFace.width,
                  top: initialFace.top,
                  left: flippedInitialFaceLeft,
                },
                targetFacePosition: {
                  height: ovalDetails.height,
                  width: ovalDetails.width,
                  top: ovalDetails.centerY - ovalDetails.height / 2,
                  left: ovalDetails.centerX - ovalDetails.width / 2,
                },
                recordingTimestamps: {
                  videoStart: recordingStartTimestampMs,
                  initialFaceDetected: initialFace.timestampMs,
                },
              },
            },
          ],
        });

        return { faceMatchState, ovalDetails, initialFace };
      },
      async detectFaceAndMatchOval(context) {
        const {
          videoAssociatedParams: { videoEl },
          ovalAssociatedParams: { faceDetector, ovalDetails },
        } = context;

        // detect face
        const detectedFaces = await faceDetector.detectFaces(videoEl);
        let faceMatchState: FaceMatchState;
        let detectedFace: Face;
        let illuminationState: IlluminationState;

        switch (detectedFaces.length) {
          case 0: {
            //no face detected;
            faceMatchState = FaceMatchState.CANT_IDENTIFY;
            illuminationState = estimateIllumination(videoEl);
            break;
          }
          case 1: {
            //exactly one face detected, match face with oval;
            detectedFace = detectedFaces[0];
            faceMatchState = getFaceMatchStateInLivenessOval(
              detectedFace,
              ovalDetails
            );
            break;
          }
          default: {
            //more than one face detected ;
            faceMatchState = FaceMatchState.TOO_MANY;
            break;
          }
        }

        return { faceMatchState, illuminationState, detectedFace };
      },
      async flashColors(context) {
        const {
          freshnessColorAssociatedParams: {
            freshnessColorsComplete,
            freshnessColorDisplay,
          },
        } = context;

        if (freshnessColorsComplete) {
          return;
        }

        const completed = await freshnessColorDisplay.displayColorTick();

        return { freshnessColorsComplete: completed };
      },
      async putLivenessVideo(context) {
        const {
          challengeId,
          flowProps: { sessionId, onGetLivenessDetection },
          videoAssociatedParams: {
            videoMediaStream,
            recordingStartTimestampMs,
          },
          ovalAssociatedParams: { initialFace, ovalDetails },
          faceMatchAssociatedParams: { startFace, endFace },
          livenessStreamProvider,
        } = context;

        const { width, height } = videoMediaStream.getTracks()[0].getSettings();

        const flippedInitialFaceLeft =
          width - initialFace.left - initialFace.width;
        const livenessActionDocument: ClientSessionInformation = {
          deviceInformation: {
            videoHeight: height,
            videoWidth: width,
          },
          challenge: {
            faceMovementAndLightChallenge: {
              challengeId,
              initialFacePosition: {
                height: initialFace.height,
                width: initialFace.width,
                top: initialFace.top,
                left: flippedInitialFaceLeft,
              },
              targetFacePosition: {
                height: ovalDetails.height,
                width: ovalDetails.width,
                top: ovalDetails.centerY - ovalDetails.height / 2,
                left: ovalDetails.centerX - ovalDetails.width / 2,
              },
              recordingTimestamps: {
                videoStart: recordingStartTimestampMs,
                initialFaceDetected: initialFace.timestampMs,
                faceDetectedInTargetPositionStart: startFace.timestampMs,
                faceDetectedInTargetPositionEnd: endFace.timestampMs,
              },
              colorSequence: {
                colorTimestampList: [],
              },
            },
          },
        };

        await livenessStreamProvider.videoRecorder.getBlob(); // fixme: waits for the video queue to flush before moving ending stream
        livenessStreamProvider.sendClientInfo(livenessActionDocument);

        livenessStreamProvider.endStream();

        const endStreamLivenessVideoTime = Date.now();
        recordLivenessAnalyticsEvent(context.flowProps, {
          event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
          attributes: { action: 'streamLivenessVideo' },
          metrics: {
            duration: endStreamLivenessVideoTime - recordingStartTimestampMs,
          },
        });

        // Get liveness result
        const { isLive } = await onGetLivenessDetection(sessionId);
        recordLivenessAnalyticsEvent(context.flowProps, {
          event: LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
          attributes: { action: 'getLivenessDetection' },
          metrics: {
            duration: Date.now() - endStreamLivenessVideoTime,
          },
        });

        return { isLive };
      },
    },
  }
);

const responseStreamActor = async (callback) => {
  // FIXME: hard coded response stream for now
  const asyncIterable = {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        next() {
          const done = i === 1;
          i++;
          return Promise.resolve({
            value: {
              SessionInformation: {
                Challenge: {
                  FaceMovementAndLightChallenge: {
                    OvalScaleFactors: {
                      Width: 0.03534782,
                      CenterX: 0.86087984,
                      CenterY: 0.8648628,
                    },
                  },
                },
              },
            },
            done,
          });
        },
        return() {
          // This will be reached if the consumer called 'break' or 'return' early in the loop.
          return { done: true };
        },
      };
    },
  };
  for await (const event of asyncIterable) {
    if (isServerSesssionInformationEvent(event)) {
      callback({
        type: 'SET_SESSION_INFO',
        data: { sessionInfo: event.SessionInformation },
      });
    }
  }
};
