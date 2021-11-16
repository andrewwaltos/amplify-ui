import React from 'react';
import { I18n } from 'aws-amplify';

import { useTheme } from '../../../hooks';
import { useThemeBreakpoint } from '../../../hooks/useThemeBreakpoint';
import { LivenessCameraModule } from './LivenessCameraModule';
import { useLivenessActor } from '../hooks';
import { CancelButton } from '../shared';
import { Text, Flex, Heading, Divider } from '../../..';

function getVideoConstraints(
  isMobileScreen: boolean,
  currentScreen: Screen
): MediaTrackConstraints {
  return isMobileScreen
    ? {
        width: { min: 240, ideal: currentScreen.width, max: 1080 },
        height: { min: 320, ideal: currentScreen.height, max: 1920 },
        facingMode: 'user',
      }
    : {
        width: { min: 320, ideal: 640, max: 1920 },
        height: { min: 240, ideal: 480, max: 1080 },
        facingMode: 'user',
      };
}

export const LivenessCheck: React.FC = () => {
  const { tokens } = useTheme();
  const breakpoint = useThemeBreakpoint();
  const [state] = useLivenessActor();

  const isMobileScreen = breakpoint === 'base';
  const videoConstraints = getVideoConstraints(isMobileScreen, screen);

  return (
    <Flex
      direction="column"
      position="relative"
      padding={{ medium: `${tokens.space.medium} ${tokens.space.large}` }}
    >
      {!isMobileScreen && (
        <Heading level={3}>{I18n.get('Liveness check')}</Heading>
      )}
      {!state.matches('permissionDenied') ? (
        <LivenessCameraModule
          isMobileScreen={isMobileScreen}
          videoConstraints={videoConstraints}
        />
      ) : (
        <Flex
          backgroundColor={`${tokens.colors.black}`}
          alignSelf="center"
          alignItems="center"
          justifyContent="center"
          height={`${(videoConstraints.height as ConstrainULongRange).ideal}`}
          width={`${(videoConstraints.width as ConstrainULongRange).ideal}`}
        >
          <Text color={`${tokens.colors.white}`}>
            {I18n.get(
              'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta atque' +
                'architecto consequatur suscipit. Accusantium deleniti quibusdam'
            )}
          </Text>
        </Flex>
      )}
      {!isMobileScreen && (
        <Flex direction="column" alignItems="flex-end">
          <Divider />
          <CancelButton />
        </Flex>
      )}
    </Flex>
  );
};
