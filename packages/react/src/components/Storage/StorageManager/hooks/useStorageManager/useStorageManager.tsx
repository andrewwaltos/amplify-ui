import React from 'react';

import { UploadTask } from '@aws-amplify/storage';

import { StorageFiles, FileStatus, DefaultFile } from '../../types';
import { OnFilesChange } from '../../StorageManager/types';
import { Action, GetFileErrorMessage, UseStorageManagerState } from './types';
import { createStorageManagerStateReducer } from './reducer';
import {
  addFilesAction,
  removeUploadAction,
  setUploadingFileAction,
  setUploadProgressAction,
  setUploadStatusAction,
} from './actions';

export interface UseStorageManager {
  addFiles: (params: {
    files: File[];
    getFileErrorMessage: GetFileErrorMessage;
  }) => void;
  setUploadingFile: (params: { id: string; uploadTask?: UploadTask }) => void;
  setUploadProgress: (params: { id: string; progress: number }) => void;
  setUploadSuccess: (params: { id: string }) => void;
  setUploadResumed: (params: { id: string }) => void;
  setUploadPaused: (params: { id: string }) => void;
  removeUpload: (params: { id: string }) => void;
  files: StorageFiles;
}

export function useStorageManager(
  defaultFiles: Array<DefaultFile> = [],
  onFilesChange?: OnFilesChange
): UseStorageManager {
  const reducer = React.useMemo(() => {
    return createStorageManagerStateReducer(onFilesChange);
  }, [onFilesChange]);

  const [{ files }, dispatch] = React.useReducer<
    (
      prevState: UseStorageManagerState,
      action: Action
    ) => UseStorageManagerState
  >(reducer, {
    files: defaultFiles.map((file) => {
      return {
        ...file,
        id: file.s3Key,
        name: file.s3Key,
        status: FileStatus.UPLOADED,
      };
    }) as StorageFiles,
  });

  const addFiles: UseStorageManager['addFiles'] = ({
    files,
    getFileErrorMessage,
  }) => {
    dispatch(addFilesAction({ files, getFileErrorMessage }));
  };

  const setUploadingFile: UseStorageManager['setUploadingFile'] = ({
    uploadTask,
    id,
  }) => {
    dispatch(setUploadingFileAction({ id, uploadTask }));
  };

  const setUploadProgress: UseStorageManager['setUploadProgress'] = ({
    progress,
    id,
  }) => {
    dispatch(setUploadProgressAction({ id, progress }));
  };

  const setUploadSuccess: UseStorageManager['setUploadSuccess'] = ({ id }) => {
    dispatch(setUploadStatusAction({ id, status: FileStatus.UPLOADED }));
  };

  const setUploadPaused: UseStorageManager['setUploadPaused'] = ({ id }) => {
    dispatch(setUploadStatusAction({ id, status: FileStatus.PAUSED }));
  };

  const setUploadResumed: UseStorageManager['setUploadPaused'] = ({ id }) => {
    dispatch(setUploadStatusAction({ id, status: FileStatus.UPLOADING }));
  };

  const removeUpload: UseStorageManager['removeUpload'] = ({ id }) => {
    dispatch(removeUploadAction({ id }));
  };

  return {
    removeUpload,
    setUploadPaused,
    setUploadProgress,
    setUploadResumed,
    setUploadSuccess,
    setUploadingFile,
    addFiles,
    files,
  };
}
