import {
  LivenessOvalDetails,
  IlluminationState,
  Face,
  FaceMatchState,
  BoundingBox,
  LivenessErrorState,
} from '../../types';
import { ClientActionDocument } from '../../types/liveness/liveness-service-types';
import { translate } from '../../i18n';

/**
 * Returns the random number between min and max
 * seeded with the provided random seed.
 */
function getScaledValueFromRandomSeed(
  randomSeed: number,
  min: number,
  max: number
): number {
  return randomSeed * (max - min) + min;
}

/**
 * Returns the ratio of intersection and union of two bounding boxes.
 */
function getIntersectionOverUnion(
  box1: BoundingBox,
  box2: BoundingBox
): number {
  const xA = Math.max(box1.left, box2.left);
  const yA = Math.max(box1.top, box2.top);
  const xB = Math.min(box1.right, box2.right);
  const yB = Math.min(box1.bottom, box2.bottom);

  const intersectionArea = Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);

  const boxAArea = (box1.bottom - box1.top + 1) * (box1.right - box1.left + 1);
  const boxBArea = (box2.bottom - box2.top + 1) * (box2.right - box2.left + 1);

  return intersectionArea / (boxAArea + boxBArea - intersectionArea);
}

/**
 * Accepts clientActionDocument as string and return the 3 attributes
 * width: number;
 * centerX: number;
 * centerY: number;
 */
export function getRandomScalingAttributes(clientActionDocumentStr: string) {
  const clientActionDocument: ClientActionDocument = JSON.parse(
    clientActionDocumentStr
  );
  if (
    clientActionDocument.challenges.length === 0 ||
    clientActionDocument.challenges.length > 1
  ) {
    throw new Error('Invalid clientActionDocument');
  }

  const ovalScaleFactors =
    clientActionDocument.challenges[0].faceMovementChallenge.ovalScaleFactors;

  return {
    centerX: ovalScaleFactors.centerX,
    centerY: ovalScaleFactors.centerY,
    width: ovalScaleFactors.width,
  };
}

/**
 * Returns the details of a randomly generated liveness oval
 * based on the video dimensions, initial face and the provided seed.
 */
export function getRandomLivenessOvalDetails({
  width,
  height,
  initialFace,
  clientActionDocument,
}: {
  width: number;
  height: number;
  initialFace: Face;
  clientActionDocument: string;
}): LivenessOvalDetails {
  const videoHeight = height;
  let videoWidth = width;
  let ovalWidthOffset = 0;
  let ovalWidthMinProportion = 0.3;
  let ovalWidthMaxProportion = 0.8;
  let ovalThresholdMultiplier = 0.5;

  // if the video is landscape, convert to portrait
  if (width > height) {
    videoWidth = height ** 2 / width;
    ovalWidthOffset = (width ** 2 - height ** 2) / (2 * width);
    ovalWidthMinProportion = 0.4;
    ovalWidthMaxProportion = 0.9;
    ovalThresholdMultiplier =
      (ovalWidthMinProportion + ovalWidthMaxProportion) / 2;
  }

  // center of oval
  const minOvalCenterX = (2 * videoWidth) / 5 + ovalWidthOffset;
  const maxOvalCenterX = (3 * videoWidth) / 5 + ovalWidthOffset;
  const minOvalCenterY = (2 * videoHeight) / 5;
  const maxOvalCenterY = (3 * videoHeight) / 5;

  const randomScalingAttributes =
    getRandomScalingAttributes(clientActionDocument);

  const ovalCenterX = getScaledValueFromRandomSeed(
    randomScalingAttributes.centerX,
    minOvalCenterX,
    maxOvalCenterX
  );
  const ovalCenterY = getScaledValueFromRandomSeed(
    randomScalingAttributes.centerY,
    minOvalCenterY,
    maxOvalCenterY
  );

  // dimensions of oval
  const GOLDEN_RATIO = 1.618;

  const minOvalWidth = videoWidth * ovalWidthMinProportion;
  const maxOvalWidth = videoWidth * ovalWidthMaxProportion;

  const ovalThreshold = videoWidth * ovalThresholdMultiplier;
  const faceWidthHeight = (initialFace.width + initialFace.height) / 2;

  let ovalWidth: number;
  if (faceWidthHeight > ovalThreshold) {
    ovalWidth =
      minOvalWidth *
      getScaledValueFromRandomSeed(randomScalingAttributes.width, 1, 4 / 3);
  } else {
    ovalWidth =
      maxOvalWidth *
      getScaledValueFromRandomSeed(randomScalingAttributes.width, 3 / 4, 1);
  }

  const ovalHeight = GOLDEN_RATIO * ovalWidth;

  return {
    centerX: Math.floor(ovalCenterX),
    centerY: Math.floor(ovalCenterY),
    width: Math.floor(ovalWidth),
    height: Math.floor(ovalHeight),
  };
}

/**
 * Draws the provided liveness oval on the canvas.
 */
export function drawLivenessOvalInCanvas(
  canvas: HTMLCanvasElement,
  oval: LivenessOvalDetails
) {
  const { centerX, centerY, width, height } = oval;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // fill the canvas with a transparent rectangle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // draw the oval path
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);

  // add stroke to the oval path
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.clip();

  // clear the oval content from the rectangle
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // draw vertical dotted line in the middle of the oval
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 3]);
  ctx.moveTo(centerX, centerY - height / 2);
  ctx.lineTo(centerX, centerY + height / 2);
  ctx.stroke();
}

/**
 * Returns the state of the provided face with respect to the provided liveness oval.
 */
export function getFaceMatchStateInLivenessOval(
  face: Face,
  ovalDetails: LivenessOvalDetails
): FaceMatchState {
  let faceMatchState: FaceMatchState;

  const minFaceX = face.left;
  const maxFaceX = face.left + face.width;
  const minFaceY = face.top;
  const maxFaceY = face.top + face.height;

  const minOvalX = ovalDetails.centerX - ovalDetails.width / 2;
  const maxOvalX = ovalDetails.centerX + ovalDetails.width / 2;
  const minOvalY = ovalDetails.centerY - ovalDetails.height / 2;
  const maxOvalY = ovalDetails.centerY + ovalDetails.height / 2;

  const faceBoundingBox: BoundingBox = {
    left: minFaceX,
    top: minFaceY,
    right: maxFaceX,
    bottom: maxFaceY,
  };
  const ovalBoundingBox: BoundingBox = {
    left: minOvalX,
    top: minOvalY,
    right: maxOvalX,
    bottom: maxOvalY,
  };

  const intersection = getIntersectionOverUnion(
    faceBoundingBox,
    ovalBoundingBox
  );

  const intersectionThreshold = 0.5;
  const ovalMatchWidthThreshold = ovalDetails.width * 0.25;
  const ovalMatchHeightThreshold = ovalDetails.height * 0.25;
  const faceDetectionWidthThreshold = ovalDetails.width * 0.15;
  const faceDetectionHeightThreshold = ovalDetails.height * 0.15;

  if (
    intersection > intersectionThreshold &&
    Math.abs(minOvalX - minFaceX) < ovalMatchWidthThreshold &&
    Math.abs(maxOvalX - maxFaceX) < ovalMatchWidthThreshold &&
    Math.abs(maxOvalY - maxFaceY) < ovalMatchHeightThreshold
  ) {
    faceMatchState = FaceMatchState.MATCHED;
  } else if (
    minOvalX - minFaceX > faceDetectionWidthThreshold &&
    maxOvalX - maxFaceX > faceDetectionWidthThreshold
  ) {
    faceMatchState = FaceMatchState.TOO_LEFT;
  } else if (
    minFaceX - minOvalX > faceDetectionWidthThreshold &&
    maxFaceX - maxOvalX > faceDetectionWidthThreshold
  ) {
    faceMatchState = FaceMatchState.TOO_RIGHT;
  } else if (
    minOvalY - minFaceY > faceDetectionHeightThreshold ||
    maxFaceY - maxOvalY > faceDetectionHeightThreshold ||
    (minOvalX - minFaceX > faceDetectionWidthThreshold &&
      maxFaceX - maxOvalX > faceDetectionWidthThreshold)
  ) {
    faceMatchState = FaceMatchState.TOO_CLOSE;
  } else {
    faceMatchState = FaceMatchState.TOO_FAR;
  }

  return faceMatchState;
}

/**
 * Returns the illumination state in the provided video frame.
 */
export function estimateIllumination(
  videoEl: HTMLVideoElement
): IlluminationState {
  const canvasEl = document.createElement('canvas');
  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;

  const ctx = canvasEl.getContext('2d');
  ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
  const frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height).data;

  // histogram
  const MAX_SCALE = 8;
  const hist = new Array(MAX_SCALE).fill(0);

  for (let i = 0; i < frame.length; i++) {
    const luma = Math.round(
      frame[i++] * 0.2126 + frame[i++] * 0.7152 + frame[i++] * 0.0722
    );
    hist[luma % 32]++;
  }

  let ind = -1,
    maxCount = 0;
  for (let i = 0; i < MAX_SCALE; i++) {
    if (hist[i] > maxCount) {
      maxCount = hist[i];
      ind = i;
    }
  }

  canvasEl.remove();

  if (ind === 0) return IlluminationState.DARK;
  if (ind === MAX_SCALE) return IlluminationState.BRIGHT;
  return IlluminationState.NORMAL;
}

/**
 * Checks if the provided media device is a virtual camera.
 * @param device
 */
export function isCameraDeviceVirtual(device: MediaDeviceInfo): boolean {
  return device.label.toLowerCase().includes('virtual');
}

export const IlluminationStateStringMap: Record<IlluminationState, string> = {
  [IlluminationState.BRIGHT]: translate('Environment too bright'),
  [IlluminationState.DARK]: translate('Environment too dark'),
  [IlluminationState.NORMAL]: translate('Lighting conditions normal'),
};

export const FaceMatchStateStringMap: Record<FaceMatchState, string> = {
  [FaceMatchState.CANT_IDENTIFY]: translate('No face detected'),
  [FaceMatchState.FACE_IDENTIFIED]: translate('Face detected'),
  [FaceMatchState.TOO_MANY]: translate('Multiple faces detected'),
  [FaceMatchState.TOO_CLOSE]: translate('Move the face further away.'),
  [FaceMatchState.TOO_FAR]: translate('Move the face closer.'),
  [FaceMatchState.TOO_LEFT]: translate('Move the face to the right.'),
  [FaceMatchState.TOO_RIGHT]: translate('Move the face to the left.'),
  [FaceMatchState.MATCHED]: translate('Face matched!'),
};

export const LivenessErrorStateStringMap: Record<LivenessErrorState, string> = {
  [LivenessErrorState.RUNTIME_ERROR]: translate(
    'Liveness encountered an error. Please try again.'
  ),
  [LivenessErrorState.TIMEOUT]: translate<string>('Timeout!'),
};

export const ColorArr = [
  'rgb(0, 0, 0)', // black
  'rgb(255, 255, 255)', // white
  'rgb(255, 0, 0)', // red
  'rgb(255, 255, 0)', // yellow
  'rgb(0, 255, 0)', // lime
  'rgb(0, 255, 255)', // cyan
  'rgb(0, 0, 255)', // blue,
  'rgb(255, 0, 255)', // violet
];

export function getShortCp2Permutations(colorArr, colorNum = 12) {
  const randomColorIndices = [0];

  let prevColorIndex = 0;
  for (let i = 0; i < colorNum - 2; i++) {
    let randomIndex = Math.floor(Math.random() * (colorArr.length - 1) + 1);
    while (prevColorIndex === randomIndex) {
      randomIndex = Math.floor(Math.random() * (colorArr.length - 1) + 1);
    }
    randomColorIndices.push(randomIndex);
    prevColorIndex = randomIndex;
  }
  randomColorIndices.splice(6, 0, 0);

  const permutations = [];
  for (let i = 0; i < colorNum - 1; i++) {
    permutations.push([randomColorIndices[i], randomColorIndices[i]]);
    permutations.push([randomColorIndices[i], randomColorIndices[i + 1]]);
  }
  permutations.push([randomColorIndices[11], randomColorIndices[11]]);

  return permutations;
}

interface FillOverlayCanvasFractionalInput {
  overlayCanvas: HTMLCanvasElement;
  prevColor: string;
  nextColor: string;
  ovalCanvas: HTMLCanvasElement;
  ovalDetails: any;
  heightFraction: number;
}

const INITIAL_ALPHA = 0.9;
const SECONDARY_ALPHA = 0.75;

export function fillOverlayCanvasFractional({
  overlayCanvas,
  prevColor,
  nextColor,
  ovalCanvas,
  ovalDetails,
  heightFraction,
}: FillOverlayCanvasFractionalInput) {
  const boudingRect = ovalCanvas.getBoundingClientRect();
  const ovalCanvasX = boudingRect.x;
  const ovalCanvasY = boudingRect.y;

  const { centerX, centerY, width, height } = ovalDetails;

  const updatedCenterX = centerX + ovalCanvasX;
  const updatedCenterY = centerY + ovalCanvasY;

  const canvasWidth = overlayCanvas.width;
  const canvasHeight = overlayCanvas.height;
  const ctx = overlayCanvas.getContext('2d');

  // Because the canvas is set to to 100% we need to manually set the height for the canvas to use pixel values
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // fill the complete canvas
  fillFractionalContext(ctx, prevColor, nextColor, heightFraction);

  // save the current state
  ctx.save();

  // draw the rectangle path and fill it
  ctx.beginPath();
  ctx.rect(ovalCanvasX, ovalCanvasY, ovalCanvas.width, ovalCanvas.height);
  ctx.clip();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.globalAlpha = INITIAL_ALPHA;
  fillFractionalContext(ctx, prevColor, nextColor, heightFraction);

  // // draw the oval path and fill it
  ctx.beginPath();
  ctx.ellipse(
    updatedCenterX,
    updatedCenterY,
    width / 2,
    height / 2,
    0,
    0,
    2 * Math.PI
  );
  ctx.clip();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.globalAlpha = SECONDARY_ALPHA;
  fillFractionalContext(ctx, prevColor, nextColor, heightFraction);

  // restore the state
  ctx.restore();
}

function fillFractionalContext(ctx, prevColor, nextColor, fraction) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  ctx.fillStyle = nextColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight * fraction);

  if (fraction !== 1) {
    ctx.fillStyle = prevColor;
    ctx.fillRect(
      0,
      canvasHeight * fraction,
      canvasWidth,
      canvasHeight * (1 - fraction)
    );
  }
}

// If we have been on a flat color for 100 ms then increment the colorPermutationInd
// Or if we have been downscrolling for more than 300 ms then increment the colorPermutationInd
export function shouldChangeColorStage(
  timeSinceLastColorChange: number,
  colorPermutation: number[],
  flatDuration: number,
  scrollingDuration: number
) {
  return (
    (timeSinceLastColorChange >= flatDuration &&
      colorPermutation[0] === colorPermutation[1]) ||
    (timeSinceLastColorChange >= scrollingDuration &&
      colorPermutation[0] !== colorPermutation[1])
  );
}
