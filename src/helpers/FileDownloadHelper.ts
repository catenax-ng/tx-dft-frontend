/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2023 T-Systems International GmbH
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
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

import { GridValidRowModel } from '@mui/x-data-grid';
import saveAs from 'file-saver';
import { isEqual } from 'lodash';

import { FileSize, FileType } from '../enums';
import { setSnackbarMessage } from '../features/notifiication/slice';
import { setSelectedFiles } from '../features/provider/upload/slice';
import { store } from '../features/store';

const csvFileDownload = (data: BlobPart, name: string) => {
  const file = new File([data], `${name}.csv`, { type: 'text/csv;charset=utf-8' });
  saveAs(file);
  store.dispatch(
    setSnackbarMessage({
      message: 'alerts.downloadSuccess',
      type: 'success',
    }),
  );
};

const csvHeaderValidation = (file: File, row: GridValidRowModel) => {
  if (file.type === FileType.csv) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      // Access to content with e.target.result
      const fileData: any = e.target.result;
      // seperate header from first row and columns from rest all
      const [header] = fileData.split('\n').map((item: any) => item.trim().split(';'));
      const validateHeaders = isEqual(header, Object.keys(row));
      if (validateHeaders) {
        localStorage.setItem('uploadedfileData', fileData);
        store.dispatch(setSelectedFiles(file));
      } else store.dispatch(setSnackbarMessage({ type: 'error', message: 'alerts.incorrectColumns' }));
    };
    reader.readAsText(file);
  } else
    store.dispatch(
      setSnackbarMessage({
        message: 'alerts.invalidFile',
        type: 'error',
      }),
    );
};

const fileSizeCheck = (size: number) => {
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes: string[] = Object.keys(FileSize);
  const i = Math.floor(Math.log(size) / Math.log(k));
  return `${parseFloat((size / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export { csvFileDownload, csvHeaderValidation, fileSizeCheck };
