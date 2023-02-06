import * as React from 'react';
import { screen } from '@testing-library/react';
import { when, resetAllWhenMocks } from 'jest-when';
import {
  IlluminationState,
  IlluminationStateStringMap,
  FaceMatchState,
  FaceMatchStateStringMap,
  LivenessErrorState,
  LivenessErrorStateStringMap,
} from '@aws-amplify/ui';

import {
  renderWithLivenessProvider,
  getMockedFunction,
} from '../../utils/test-utils';
import { useLivenessActor, useLivenessSelector } from '../../hooks';
import {
  Instruction,
  selectErrorState,
  selectFaceMatchState,
  selectIlluminationState,
} from '../Instruction';

jest.mock('../../hooks');
jest.mock('../../hooks/useLivenessSelector');

const mockUseLivenessActor = getMockedFunction(useLivenessActor);
const mockUseLivenessSelector = getMockedFunction(useLivenessSelector);

describe('Instruction', () => {
  const mockActorState: any = {
    matches: jest.fn(),
  };
  const mockActorSend = jest.fn();

  let errorState: LivenessErrorState = null;
  let faceMatchState: FaceMatchState = null;
  let illuminationState: IlluminationState = null;
  let faceMatchStateBeforeStart: FaceMatchState = null;
  let isFaceFarEnoughBeforeRecordingState: boolean = null;

  let isNotRecording = false;
  let isUploading = false;
  let isCheckSuccessful = false;
  let isCheckFailed = false;
  let isCheckFaceDetectedBeforeStart = false;
  let isCheckFaceDistanceBeforeRecording = false;
  let isWaitingForSessionInfo = false;
  let isFlashingFreshness = false;

  function mockStateMatchesAndSelectors() {
    mockUseLivenessSelector
      .mockReturnValueOnce(errorState)
      .mockReturnValueOnce(faceMatchState)
      .mockReturnValueOnce(illuminationState)
      .mockReturnValueOnce(faceMatchStateBeforeStart)
      .mockReturnValueOnce(isFaceFarEnoughBeforeRecordingState);

    when(mockActorState.matches)
      .calledWith('notRecording')
      .mockReturnValue(isNotRecording)
      .calledWith('uploading')
      .mockReturnValue(isUploading)
      .calledWith('checkSucceeded')
      .mockReturnValue(isCheckSuccessful)
      .calledWith('checkFailed')
      .mockReturnValue(isCheckFailed)
      .calledWith('checkFaceDetectedBeforeStart')
      .mockReturnValue(isCheckFaceDetectedBeforeStart)
      .calledWith('checkFaceDistanceBeforeRecording')
      .mockReturnValue(isCheckFaceDistanceBeforeRecording)
      .calledWith('waitForSessionInfo')
      .mockReturnValue(isWaitingForSessionInfo)
      .calledWith({ recording: 'flashFreshnessColors' })
      .mockReturnValue(isFlashingFreshness);
  }

  beforeEach(() => {
    mockUseLivenessActor.mockReturnValue([mockActorState, mockActorSend]);
  });

  afterEach(() => {
    errorState = null;
    faceMatchState = null;
    illuminationState = null;
    faceMatchStateBeforeStart = null;
    isFaceFarEnoughBeforeRecordingState = null;

    isNotRecording = false;
    isUploading = false;
    isCheckSuccessful = false;
    isCheckFailed = false;
    isCheckFaceDetectedBeforeStart = false;
    isCheckFaceDistanceBeforeRecording = false;
    isWaitingForSessionInfo = false;
    isFlashingFreshness = false;

    jest.clearAllMocks();
    resetAllWhenMocks();
  });

  it('should render nothing if error', () => {
    errorState = LivenessErrorState.FACE_DISTANCE_ERROR;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(
      screen.queryByText('Hold face position during countdown')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Move face in front of camera')
    ).not.toBeInTheDocument();
  });

  it('should render nothing if failed', () => {
    isCheckFailed = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(
      screen.queryByText('Hold face position during countdown')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Move face in front of camera')
    ).not.toBeInTheDocument();
  });

  it('should render instruction to move only one face onto camera view if isCheckFaceDetectedBeforeStart is true', () => {
    isCheckFaceDetectedBeforeStart = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(
      screen.getByText('Move face in front of camera')
    ).toBeInTheDocument();
  });

  it('should render instruction to about too many faces faceMatchStateBeforeStart is TOO_MANY', () => {
    isCheckFaceDetectedBeforeStart = true;
    faceMatchStateBeforeStart = FaceMatchState.TOO_MANY;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(
      screen.getByText(FaceMatchStateStringMap[faceMatchStateBeforeStart])
    ).toBeInTheDocument();
  });

  it('should render instruction to move face further away if checking face distance before recording is false', () => {
    isCheckFaceDistanceBeforeRecording = true;
    isFaceFarEnoughBeforeRecordingState = false;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(screen.getByText('Move face further away')).toBeInTheDocument();
  });

  it('should render connecting message if waiting for session info', () => {
    isWaitingForSessionInfo = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('should render hold face in oval message if flashing freshness colors', () => {
    isFlashingFreshness = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(screen.getByText('Hold face in oval')).toBeInTheDocument();
  });

  it('should render not recording state if present', () => {
    isNotRecording = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(
      screen.getByText('Hold face position during countdown')
    ).toBeInTheDocument();
  });

  it('should render uploading state if present', () => {
    isUploading = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(screen.getByText('Verifying...')).toBeInTheDocument();
  });

  it('should not render check succeeded state if present', () => {
    isCheckSuccessful = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(screen.queryByText('Check successful')).not.toBeInTheDocument();
  });

  it('should render illumination state if present', () => {
    illuminationState = IlluminationState.DARK;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(
      screen.getByText(IlluminationStateStringMap[IlluminationState.DARK])
    ).toBeInTheDocument();
  });

  it('should not render illumination state if NORMAL', () => {
    illuminationState = IlluminationState.NORMAL;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(
      screen.queryByText(IlluminationStateStringMap[IlluminationState.NORMAL])
    ).not.toBeInTheDocument();
  });

  it('should render face match state if present', () => {
    faceMatchState = FaceMatchState.TOO_CLOSE;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<Instruction />);

    expect(
      screen.getByText(FaceMatchStateStringMap[FaceMatchState.TOO_CLOSE])
    ).toBeInTheDocument();
  });

  it('should create appropriate selectors', () => {
    const expectedErrorState = LivenessErrorState.RUNTIME_ERROR;
    const expectedFaceMatchState = FaceMatchState.TOO_CLOSE;
    const expectedIlluminationState = IlluminationState.DARK;

    const state: any = {
      context: {
        errorState: expectedErrorState,
        faceMatchAssociatedParams: {
          faceMatchState: expectedFaceMatchState,
          illuminationState: expectedIlluminationState,
        },
      },
    };

    const actualErrorState = selectErrorState(state);
    const actualFaceMatchState = selectFaceMatchState(state);
    const actualIlluminationState = selectIlluminationState(state);

    expect(actualErrorState).toEqual(expectedErrorState);
    expect(actualFaceMatchState).toEqual(expectedFaceMatchState);
    expect(actualIlluminationState).toEqual(expectedIlluminationState);
  });
});