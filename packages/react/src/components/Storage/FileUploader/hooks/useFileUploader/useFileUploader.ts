import React, { useState } from 'react';
import { checkMaxSize, returnAcceptedFiles } from '@aws-amplify/ui';

import { Files, FileState, FileStatuses } from '../../types';
import { UseFileUploader, UseFileUploaderProps } from './types';

export function useFileUploader({
  maxFileSize,
  acceptedFileTypes,
  allowMultipleFiles,
  isLoading,
}: UseFileUploaderProps): UseFileUploader {
  const [fileStatuses, setFileStatuses] = useState<FileStatuses>([]);
  const [showPreviewer, setShowPreviewer] = useState(false);

  const [inDropZone, setInDropZone] = useState(false);

  const updateFileStatusArray = (files: Files, fileStatuses: FileStatuses) => {
    const statuses = [...fileStatuses];
    [...files].forEach((file) => {
      const errorFile = checkMaxSize(maxFileSize, file);

      statuses.unshift({
        fileState: errorFile ? FileState.ERROR : FileState.INIT,
        fileErrors: errorFile,
        file,
        name: file.name,
      });
    });
    setFileStatuses(statuses);
  };

  const addTargetFiles = (targetFiles: File[]): number => {
    // Only accept accepted files
    const targets = returnAcceptedFiles([...targetFiles], acceptedFileTypes);
    // return if no accepted files
    if (!targets) return 0;

    // If not multiple and files already selected return
    if (!allowMultipleFiles && fileStatuses.length > 0)
      return fileStatuses.length;

    // if not multiple and only 1 file selected save
    if (!allowMultipleFiles && targets.length == 1) {
      updateFileStatusArray([...targets], fileStatuses);
      return targets.length;
    }

    // if not multiple save just the first target into the array
    if (!allowMultipleFiles && targets.length > 1) {
      updateFileStatusArray([targets[0]], fileStatuses);
      return 1;
    }

    if (targets.length > 0) {
      updateFileStatusArray([...targets], fileStatuses);
    } else {
      return 0;
    }
    return targets.length + fileStatuses.length;
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.clearData();
  };
  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return false;
    setInDropZone(false);
  };
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return false;
    setInDropZone(true);
    event.dataTransfer.dropEffect = 'copy';
  };
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return false;
    const { files } = event.dataTransfer;
    const addedFilesLength = addTargetFiles([...files]);
    if (addedFilesLength > 0) {
      setShowPreviewer(true);
    }
    setInDropZone(false);
  };

  return {
    inDropZone,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
    setInDropZone,
    setShowPreviewer,
    addTargetFiles,
    showPreviewer,
    fileStatuses,
    setFileStatuses,
  };
}

export default useFileUploader;
