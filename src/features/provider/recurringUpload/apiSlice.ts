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
import { apiSlice } from '../../app/apiSlice';

export const recurringUploadApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getScheduleConfig: builder.query({
      query: () => {
        return {
          url: '/scheduler',
        };
      },
      providesTags: ['ScheduleConfig'],
    }),
    putScheduleConfig: builder.mutation({
      query: body => {
        return {
          url: '/scheduler',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['ScheduleConfig'],
    }),
    getSftpConfig: builder.query({
      query: () => {
        return {
          url: '/sftp',
        };
      },
      providesTags: ['SftpConfig'],
    }),
    putSftpConfig: builder.mutation({
      query: body => {
        return {
          url: '/sftp',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['SftpConfig'],
    }),
    getEmailConfig: builder.query({
      query: () => {
        return {
          url: '/notification',
        };
      },
      providesTags: ['EmailConfig'],
    }),
    putEmailConfig: builder.mutation({
      query: body => {
        return {
          url: '/notification',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['EmailConfig'],
    }),
    getSettingsConfig: builder.query({
      query: () => {
        return {
          url: '/job-maintenance',
        };
      },
      providesTags: ['SettingsConfig'],
    }),
    putSettingsConfig: builder.mutation({
      query: body => {
        return {
          url: '/job-maintenance',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['SettingsConfig'],
    }),
  }),
});

export const {
  useGetScheduleConfigQuery,
  usePutScheduleConfigMutation,
  useGetSftpConfigQuery,
  usePutSftpConfigMutation,
  useGetEmailConfigQuery,
  usePutEmailConfigMutation,
  useGetSettingsConfigQuery,
  usePutSettingsConfigMutation,
} = recurringUploadApiSlice;
