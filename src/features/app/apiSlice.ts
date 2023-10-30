/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2021,2022,2023 T-Systems International GmbH
 * Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
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
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { apiBaseQuery } from '../../services/RequestService';
import { setSnackbarMessage } from '../notifiication/slice';
import { setPageLoading, setPermissions, setUseCases } from './slice';
import { IExtraOptions, UseCaseSelectionModel } from './types';

const baseQuery = fetchBaseQuery(apiBaseQuery());
const baseQueryInterceptor: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, IExtraOptions> = async (
  args,
  api,
  extraOptions,
) => {
  const { error, data }: any = await baseQuery(args, api, extraOptions);
  // Common error handling for all the rtk queries
  if (error) {
    const { data: errorData } = error;
    api.dispatch(
      setSnackbarMessage({
        message: errorData?.msg ? errorData?.msg : 'alerts.somethingWrong',
        type: 'error',
      }),
    );
  } else if (extraOptions?.showNotification) {
    // Backend should send/handle success messages, which isnt done
    api.dispatch(
      setSnackbarMessage({
        message: data?.msg ? data.msg : extraOptions?.message,
        type: 'success',
      }),
    );
  }
  return { data };
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryInterceptor,
  endpoints: builder => ({
    getUseCases: builder.query({
      query: () => {
        return {
          url: '/usecases',
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setPageLoading(true));
          const data = UseCaseSelectionModel.create((await queryFulfilled).data);
          dispatch(setUseCases(data));
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
    getPermissions: builder.query({
      query: () => {
        return {
          url: '/user/role/permissions',
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setPageLoading(true));
          const data = (await queryFulfilled).data;
          dispatch(setPermissions(data));
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
  tagTypes: [
    'UploadHistory',
    'DeleteContract',
    'DownloadHistoryList',
    'SftpConfig',
    'StorageMediaConfig',
    'MinioConfig',
    'EmailConfig',
    'SettingsConfig',
    'ScheduleConfig',
    'Policies',
  ],
});

export const { useGetUseCasesQuery, useGetPermissionsQuery } = apiSlice;
