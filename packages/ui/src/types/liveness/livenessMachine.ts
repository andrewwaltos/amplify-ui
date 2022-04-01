import { Interpreter, State } from 'xstate';

import {
  LivenessFlowProps,
  FaceMatchState,
  LivenessErrorState,
  LivenessOvalDetails,
  IlluminationState,
} from './liveness';
import { VideoRecorder } from '../../helpers';
import { Face, FaceDetection } from './faceDetection';

export interface LivenessContext {
  maxFailedAttempts: number;
  failedAttempts: number;
  flowProps: LivenessFlowProps;
  videoAssociatedParams: {
    videoConstraints: MediaTrackConstraints;
    videoEl: HTMLVideoElement;
    canvasEl: HTMLCanvasElement;
    videoMediaStream: MediaStream;
    videoRecorder: VideoRecorder;
    recordingStartTimestampMs: number;
  };
  ovalAssociatedParams: {
    faceDetector: FaceDetection;
    initialFace: Face;
    ovalDetails: LivenessOvalDetails;
  };
  faceMatchAssociatedParams: {
    illuminationState: IlluminationState;
    faceMatchState: FaceMatchState;
    faceMatchCount: number;
    currentDetectedFace: Face;
    startFace: Face;
    endFace: Face;
  };
  errorState: LivenessErrorState | null;
}

export type LivenessEventTypes =
  | 'BEGIN'
  | 'START_RECORDING'
  | 'TIMEOUT'
  | 'ERROR'
  | 'CANCEL';

export type LivenessEventData = Record<PropertyKey, any>; // TODO: this should be typed further

export interface LivenessEvent {
  type: LivenessEventTypes;
  data?: LivenessEventData;
}

export type LivenessMachineState = State<LivenessContext, LivenessEvent>;

export type LivenessInterpreter = Interpreter<
  LivenessContext,
  any,
  LivenessEvent
>;
