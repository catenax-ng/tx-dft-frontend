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

import { apiSlice } from '../app/apiSlice';
import { setPageLoading } from '../app/slice';
import { setPcfValueData, setPcfValueDialog } from './slice';
import { IPCFRequestHistory } from './types';

export const pcfExchangeSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPcfExchange: builder.query({
      query: ({ type, params }) => {
        return {
          url: `/pcf/${type}/requests`,
          params,
        };
      },
      providesTags: ['PCFExchangeRequest'],
      transformResponse: async ({ items }) => {
        const modifieldData = items.map((item: IPCFRequestHistory, index: number) => {
          return { ...{ id: index, ...item } };
        });
        return { pcfdatahistory: modifieldData };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setPageLoading(true));
          await queryFulfilled;
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),

    viewPCFData: builder.mutation({
      query: ({ requestId }) => {
        return {
          url: `/pcf/request/${requestId}`,
          method: 'GET',
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setPageLoading(true));
          const { data } = await queryFulfilled;
          dispatch(setPcfValueData(data));
          dispatch(setPcfValueDialog(true));
        } finally {
          dispatch(setPageLoading(false));
        }
      },
    }),

    actionOnPCFRequest: builder.mutation({
      query: body => {
        return {
          url: '/pcf/actionsonrequest',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['PCFExchangeRequest'],
      extraOptions: {
        showNotification: true,
        message: 'Action on PCF request completed and sending notification to consumer',
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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

export const { useGetPcfExchangeQuery, useActionOnPCFRequestMutation, useViewPCFDataMutation } = pcfExchangeSlice;
