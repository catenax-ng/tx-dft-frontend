/********************************************************************************
 * Copyright (c) 2024 T-Systems International GmbH
 * Copyright (c) 2024 Contributors to the Eclipse Foundation
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
import { setPageLoading } from '../../app/slice';

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    uploadFile: builder.mutation({
      query: ({ submodel, data }) => {
        return {
          method: 'POST',
          url: `${submodel}/upload`,
          body: data,
        };
      },
      invalidatesTags: ['Policies'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          dispatch(setPageLoading(true));
          await queryFulfilled;
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
    uploadManualEntry: builder.mutation({
      query: ({ submodel, data }) => {
        return {
          method: 'POST',
          url: `${submodel}/manualentry`,
          body: data,
        };
      },
      invalidatesTags: ['Policies'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          dispatch(setPageLoading(true));
          await queryFulfilled;
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),
  }),
});

export const { useUploadFileMutation, useUploadManualEntryMutation } = uploadApiSlice;
