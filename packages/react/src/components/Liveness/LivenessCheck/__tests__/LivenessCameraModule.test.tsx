import * as React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { when, resetAllWhenMocks } from 'jest-when';
import userEvent from '@testing-library/user-event';

import {
  renderWithLivenessProvider,
  getMockedFunction,
} from '../../utils/test-utils';
import {
  useLivenessActor,
  useLivenessSelector,
  useMediaStreamInVideo,
} from '../../hooks';
import {
  LivenessCameraModule,
  selectVideoConstraints,
  selectVideoStream,
} from '../LivenessCameraModule';

jest.mock('../../hooks');
jest.mock('../../hooks/useLivenessSelector');
// jest.mock('../../shared/CancelButton');
jest.mock('../../shared/Instruction');

const mockUseLivenessActor = getMockedFunction(useLivenessActor);
const mockUseLivenessSelector = getMockedFunction(useLivenessSelector);
const mockUseMediaStreamInVideo = getMockedFunction(useMediaStreamInVideo);
const cancelButtonName = 'Cancel Liveness check';

describe('LivenessCameraModule', () => {
  const mockActorState: any = {
    matches: jest.fn(),
  };
  const mockActorSend = jest.fn();

  let isCheckingCamera = false;
  let isNotRecording = false;
  let isRecording = false;

  function mockStateMatchesAndSelectors() {
    when(mockActorState.matches)
      .calledWith('cameraCheck')
      .mockReturnValue(isCheckingCamera)
      .calledWith('notRecording')
      .mockReturnValue(isNotRecording)
      .calledWith('recording')
      .mockReturnValue(isRecording);
  }

  beforeEach(() => {
    mockUseLivenessActor.mockReturnValue([mockActorState, mockActorSend]);
    mockUseLivenessSelector.mockReturnValueOnce({}).mockReturnValueOnce({});
    mockUseMediaStreamInVideo.mockReturnValue({
      videoRef: { current: document.createElement('video') },
      videoHeight: 100,
      videoWidth: 100,
      streamOffset: 20,
    });

    // Fixes Warning: unstable_flushDiscreteUpdates
    Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
      set: jest.fn(),
    });
  });

  afterEach(() => {
    isCheckingCamera = false;
    isNotRecording = false;
    isRecording = false;

    jest.clearAllMocks();
    jest.clearAllTimers();
    resetAllWhenMocks();
  });

  it('should render centered loader when isCheckingCamera true', () => {
    isCheckingCamera = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<LivenessCameraModule isMobileScreen={false} />);

    expect(screen.getByTestId('centered-loader')).toBeInTheDocument();
  });

  it('should render video and timer when isNotRecording true', async () => {
    isNotRecording = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<LivenessCameraModule isMobileScreen={true} />);

    const videoEl = screen.getByTestId('video');

    expect(screen.getByTestId('centered-loader')).toBeInTheDocument();
    expect(videoEl).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: cancelButtonName })
    ).toBeInTheDocument();

    videoEl.dispatchEvent(new Event('canplay'));

    expect(screen.queryByTestId('centered-loader')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Countdown timer')).toBeInTheDocument();
    expect(screen.getByText('Instruction')).toBeInTheDocument();

    await waitFor(() => expect(mockActorSend).toHaveBeenCalledTimes(1), {
      timeout: 5000,
    });
    expect(mockActorSend).toHaveBeenCalledWith({
      type: 'START_RECORDING',
      data: {
        videoEl: expect.any(HTMLVideoElement),
        canvasEl: expect.any(HTMLCanvasElement),
      },
    });
  });

  it('should render recording icon when isRecording true', () => {
    isRecording = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(<LivenessCameraModule isMobileScreen={false} />);
    const videoEl = screen.getByTestId('video');
    videoEl.dispatchEvent(new Event('canplay'));

    expect(screen.getByTestId('rec-icon')).toBeInTheDocument();
  });

  it('should create appropriate selectors', () => {
    const expectedConstraints = { width: 100 };
    const expectedStream = { getTracks: () => [] };

    const state: any = {
      context: {
        videoAssociatedParams: {
          videoConstraints: expectedConstraints,
          videoMediaStream: expectedStream,
        },
      },
    };

    const actualConstraints = selectVideoConstraints(state);
    const actualStream = selectVideoStream(state);

    expect(actualConstraints).toEqual(expectedConstraints);
    expect(actualStream).toEqual(expectedStream);
  });

  it('should call the onUserCancel and onExit props on user cancel', () => {
    const onUserCancel = jest.fn();
    const onExit = jest.fn();

    isRecording = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(
      <LivenessCameraModule isMobileScreen={false} />,
      onUserCancel,
      onExit
    );

    userEvent.click(screen.getByRole('button', { name: cancelButtonName }));
    expect(onUserCancel).toHaveBeenCalledTimes(1);
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('should not call onExit prop if the default is prevented in onUserCancel', () => {
    const onUserCancel = jest.fn((event: CustomEvent) => {
      event.preventDefault();
    });
    const onExit = jest.fn();

    isRecording = true;
    mockStateMatchesAndSelectors();

    renderWithLivenessProvider(
      <LivenessCameraModule isMobileScreen={false} />,
      onUserCancel,
      onExit
    );

    userEvent.click(screen.getByRole('button', { name: cancelButtonName }));
    expect(onUserCancel).toHaveBeenCalledTimes(1);
    expect(onExit).not.toHaveBeenCalled();
  });
});
