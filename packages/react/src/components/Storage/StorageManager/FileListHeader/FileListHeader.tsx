import React from 'react';
import { StorageManagerDisplayText } from '../displayText';
import { ComponentClassNames, Text } from '../../../../primitives';

export interface FileListHeaderProps {
  fileCount: number;
  remainingFilesCount: number;
  displayText: StorageManagerDisplayText;
  allUploadsSuccessful: boolean;
}

export function FileListHeader({
  fileCount,
  remainingFilesCount,
  displayText,
  allUploadsSuccessful,
}: FileListHeaderProps): JSX.Element {
  const { getFilesUploadedText, getRemainingFilesText } = displayText;
  return (
    <Text className={ComponentClassNames.StorageManagerPreviewerText}>
      {allUploadsSuccessful
        ? getFilesUploadedText(fileCount)
        : getRemainingFilesText(remainingFilesCount)}
    </Text>
  );
}
