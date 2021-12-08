import { useState } from 'react';
import { LivenessFlowProps } from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';
import useSWR from 'swr';

export function useLiveness() {
  const [isLivenessActive, setLivenessActive] = useState(false);

  const {
    data: startLivenessApiData,
    error: startLivenessApiError,
    isValidating: startLivenessApiLoading,
    mutate,
  } = useSWR(
    'StartLiveness',
    () => API.post('SampleBackend', '/liveness/start', {}),
    { revalidateOnFocus: false }
  );

  const handleStartLiveness = () => {
    setLivenessActive(true);
  };

  const handleExit = () => {
    stopLiveness();
  };

  const handleUserExit = (event: CustomEvent) => {
    event.preventDefault();
    stopLiveness();
  };

  const handleSuccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    stopLiveness();
  };

  const stopLiveness = () => {
    setLivenessActive(false);
    mutate();
  };

  const handleGetLivenessDetection: LivenessFlowProps['onGetLivenessDetection'] =
    async (sessionId) => {
      const response = await API.get(
        'SampleBackend',
        `/liveness/${sessionId}`,
        {}
      );
      return { isLive: response.isLive };
    };

  return {
    isLivenessActive,
    handleStartLiveness,
    handleExit,
    handleUserExit,
    handleSuccess,
    handleGetLivenessDetection,
    stopLiveness,
    startLivenessApiData,
    startLivenessApiError,
    startLivenessApiLoading,
  };
}
