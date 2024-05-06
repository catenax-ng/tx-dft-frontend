/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2021,2024 T-Systems International GmbH
 * Copyright (c) 2022,2024 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/
import { Button, DropArea, DropPreview, UploadStatus } from '@catena-x/portal-shared-components';
import { Box } from '@mui/material';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { setPageLoading } from '../features/app/slice';
import { setSnackbarMessage } from '../features/notifiication/slice';
import { setPolicyDialog, setPolicyDialogType } from '../features/provider/policies/slice';
import { removeSelectedFiles } from '../features/provider/upload/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { csvHeaderValidation, fileSizeCheck } from '../helpers/FileDownloadHelper';
import { Config } from '../utils/config';
import { trimText } from '../utils/utils';
import UploadInfo from './provider/UploadInfo';

export default function UploadFile() {
  const { selectedFiles } = useAppSelector(state => state.uploadFileSlice);
  const { row } = useAppSelector(state => state.submodelSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleFiles = (file: File) => {
    dispatch(setPageLoading(false));
    const maxFileSize = parseInt(Config.REACT_APP_FILESIZE);
    if (file.size < maxFileSize) {
      csvHeaderValidation(file, row);
    } else {
      dispatch(
        setSnackbarMessage({
          message: 'alerts.largeFile',
          type: 'error',
        }),
      );
    }
  };

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) dispatch(setSnackbarMessage({ type: 'error', message: 'alerts.invalidFile' }));
    else handleFiles(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'text/csv': ['.csv'],
    },
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          width: '100%',
          height: '100%',
        }}
      >
        <Button
          disabled={!selectedFiles.length}
          size="small"
          variant="contained"
          onClick={() => {
            dispatch(setPolicyDialogType('FileWithPolicy'));
            dispatch(setPolicyDialog(true));
          }}
        >
          {t('content.policies.configure')}
        </Button>
      </Box>
      <Box sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box {...getRootProps()}>
            <input {...getInputProps()} />
            <DropArea
              translations={{
                title: t('content.dropzone.title'),
                subTitle: t('content.dropzone.subTitle'),
                errorTitle: t('content.dropzone.errorTitle'),
              }}
            />
          </Box>
          {selectedFiles.length ? (
            <Box sx={{ display: 'flex', mt: 2, flexDirection: 'column' }}>
              <DropPreview
                onDelete={() => dispatch(removeSelectedFiles())}
                translations={{
                  placeholder: '',
                  uploadError: '',
                  uploadProgess: t('content.provider.uploadedFile'),
                  uploadSuccess: '',
                }}
                uploadFiles={[
                  {
                    name: trimText(selectedFiles[0].name, 20),
                    size: parseInt(fileSizeCheck(selectedFiles[0].size), 10),
                    status: UploadStatus.NEW,
                  },
                ]}
              />
            </Box>
          ) : (
            ''
          )}
        </Box>
      </Box>
      <UploadInfo />
    </>
  );
}
