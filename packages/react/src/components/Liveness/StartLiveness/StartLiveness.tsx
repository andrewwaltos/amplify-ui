import * as React from 'react';
import {
  translate,
  recordLivenessAnalyticsEvent,
  LIVENESS_EVENT_GET_READY_SCREEN,
} from '@aws-amplify/ui';

import { useTheme } from '../../../hooks';
import { CancelButton, DescriptionBullet } from '../shared';
import { useLivenessFlow } from '../providers';
import {
  Flex,
  Heading,
  Button,
  Collection,
  Divider,
  Text,
  View,
} from '../../../primitives';

export const INSTRUCTIONS = [
  {
    title: translate('Provide camera permissions'),
    desc: translate(
      "Liveness needs permission to use your device's camera to verify your presence and identity."
    ),
  },
  {
    title: translate('Liveness check'),
    desc: translate(
      'Follow instructions on the screen to record a short video of yourself and verify your identity and presence.'
    ),
  },
];

export interface StartLivenessProps {
  beginLivenessCheck: () => void;
}

export function StartLiveness(props: StartLivenessProps): JSX.Element {
  const { beginLivenessCheck } = props;
  const { tokens } = useTheme();
  const { flowProps } = useLivenessFlow();

  React.useEffect(() => {
    recordLivenessAnalyticsEvent(flowProps, {
      event: LIVENESS_EVENT_GET_READY_SCREEN,
      attributes: { action: 'AttemptLiveness' },
      metrics: { count: 1 },
    });
    const pageLoadTime = Date.now();

    return () => {
      recordLivenessAnalyticsEvent(flowProps, {
        event: LIVENESS_EVENT_GET_READY_SCREEN,
        attributes: { action: 'TimeSpent' },
        metrics: {
          duration: Date.now() - pageLoadTime,
        },
      });
    };
  }, [flowProps]);

  return (
    <>
      <Heading level={3}>{translate('How it works')}</Heading>
      <Collection
        type="list"
        items={INSTRUCTIONS}
        gap={`${tokens.space.large}`}
      >
        {(item, index) => (
          <DescriptionBullet
            key={item.title}
            index={index + 1}
            title={item.title}
            desc={item.desc}
          />
        )}
      </Collection>
      <Divider />
      <Flex
        direction={{ base: 'column-reverse', medium: 'row' }}
        justifyContent="flex-end"
      >
        <CancelButton sourceScreen={LIVENESS_EVENT_GET_READY_SCREEN} />

        <Button variation="primary" type="button" onClick={beginLivenessCheck}>
          {translate('Begin check')}
        </Button>
      </Flex>

      <View
        textAlign={{ medium: 'end' }}
        style={{ marginTop: `calc(-1 * ${tokens.space.small})` }}
      >
        <Text
          as="span"
          fontSize={`${tokens.fontSizes.xs}`}
          fontWeight={`${tokens.fontWeights.bold}`}
          color={`${tokens.colors.font.tertiary}`}
        >
          {translate<string>('Legal desclaimer: ')}
        </Text>
        <Text
          as="span"
          fontSize={`${tokens.fontSizes.xs}`}
          color={`${tokens.colors.font.tertiary}`}
        >
          {translate<string>(
            'By using this service, you provide your express, informed, written release and consent for this app and Amazon Web Services to collect, use and store your biometric data.'
          )}
        </Text>
      </View>
    </>
  );
}
