import * as React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  renderWithLivenessProvider,
  getMockedFunction,
} from '../../utils/test-utils';
import { useLivenessActor } from '../../hooks/useLivenessActor';
import { getVideoConstraints } from '../helpers';
import { StartLiveness, INSTRUCTIONS } from '../StartLiveness';

jest.mock('../../hooks/useLivenessActor');
jest.mock('../../shared/CancelButton');
jest.mock('../helpers');

const mockUseLivenessActor = getMockedFunction(useLivenessActor);
const mockGetVideoConstraints = getMockedFunction(getVideoConstraints);

describe('StartLiveness', () => {
  const mockActorState: any = {};
  const mockActorSend = jest.fn();

  const beginCheckBtnName = 'Begin check';

  beforeEach(() => {
    mockUseLivenessActor.mockReturnValue([mockActorState, mockActorSend]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the StartLiveness component and content appropriately', () => {
    renderWithLivenessProvider(<StartLiveness />);

    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText(/Legal desclaimer/)).toBeInTheDocument();

    INSTRUCTIONS.forEach(({ title, desc }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(desc)).toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: beginCheckBtnName })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should call the send method on begin check', () => {
    const mockVideoConstraints = {};
    mockGetVideoConstraints.mockReturnValue(mockVideoConstraints);

    renderWithLivenessProvider(<StartLiveness />);

    userEvent.click(screen.getByRole('button', { name: beginCheckBtnName }));

    expect(mockActorSend).toHaveBeenCalledWith({
      type: 'BEGIN',
      data: {
        videoConstraints: mockVideoConstraints,
      },
    });
  });
});
