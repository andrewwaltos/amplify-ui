/**
 * The props for the FaceLivenessDetector
 */
export interface FaceLivenessDetectorProps {
  /**
   * The sessionId as returned by CreateStreamingLivenessSession API
   */
  sessionId: string;

  /**
   * Callback called when the API request to Liveness for GetStreamingLivenessSessionResults
   * is to be made. This callback is required to be passed to
   * proxy the call to Liveness through their backend to encapsulate business
   * logic on confidence scores and not expose the score on client
   *
   */
  handleGetLivenessDetection: (sessionId: string) => Promise<void>;

  /**
   * Callback called when the user cancels the flow
   */
  onUserCancel?: (event?: CustomEvent) => void;

  /**
   * Callback called when there is error occured on any step
   */
  onError?: (error: Error) => void;

  /**
   * Optional parameter for the disabling the Start/Get Ready Screen, default: false
   */
  disableStartScreen?: boolean;

  /**
   * Optional parameter for advanced options for the component
   */
  options?: FaceLivenessDetectorOptions;
}

export interface FaceLivenessDetectorOptions {
  /**
   * overrides the TFJS Wasm backend binary CDN path
   * default is https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.11.0/dist/.
   * When overriding this path ensure that the wasm version matches the version of @tensorflow/tfjs-backend-wasm installed by npm
   */
  tfjsWasmPath?: string;

  /**
   * overrides the Blazeface model and weights bin CDN URL
   * default is https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/model.json?tfjs-format=file
   */
  blazefaceModelUrl?: string;
}

/**
 * The coordiates of any bounding box
 */
export interface BoundingBox {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * The details of the generated liveness oval
 */
export interface LivenessOvalDetails {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

/**
 * The illumination states
 */
export enum IlluminationState {
  DARK = 'dark',
  BRIGHT = 'bright',
  NORMAL = 'normal',
}

/**
 * The detected face states with respect to the liveness oval
 */
export enum FaceMatchState {
  MATCHED = 'MATCHED',
  TOO_LEFT = 'TOO LEFT',
  TOO_RIGHT = 'TOO RIGHT',
  TOO_FAR = 'TOO FAR',
  TOO_CLOSE = 'TOO CLOSE',
  CANT_IDENTIFY = 'CANNOT IDENTIFY',
  FACE_IDENTIFIED = 'ONE FACE IDENTIFIED',
  TOO_MANY = 'TOO MANY FACES',
}

/**
 * The liveness error states
 */
export enum LivenessErrorState {
  TIMEOUT = 'TIMEOUT',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  FRESHNESS_TIMEOUT = 'FRESHNESS_TIMEOUT',
  SERVER_ERROR = 'SERVER_ERROR',
  CAMERA_FRAMERATE_ERROR = 'CAMERA_FRAMERATE_ERROR',
  CAMERA_ACCESS_ERROR = 'CAMERA_ACCESS_ERROR',
  FACE_DISTANCE_ERROR = 'FACE_DISTANCE_ERROR',
  MOBILE_LANDSCAPE_ERROR = 'MOBILE_LANDSCAPE_ERROR',
}
