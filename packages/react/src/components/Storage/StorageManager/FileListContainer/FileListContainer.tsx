import React from 'react';
import { View } from '../../../../primitives';

export interface ContainerProps {
  children: React.ReactNode;
  className: string;
}

export function FileListContainer({
  children,
  className,
}: ContainerProps): JSX.Element {
  return <View className={className}>{children}</View>;
}
