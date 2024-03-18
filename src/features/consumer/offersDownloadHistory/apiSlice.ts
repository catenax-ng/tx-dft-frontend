/********************************************************************************
 * Copyright (c) 2023 T-Systems International GmbH
 * Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
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

import { setLoadingHandler } from '../../../helpers/ApiHelper';
import { apiSlice } from '../../app/apiSlice';

export const offersDownloadHistoryApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    offersDownloadHistory: builder.query({
      query: params => {
        return {
          url: '/view-download-history',
          params,
        };
      },
      providesTags: ['DownloadHistoryList'],
    }),
    downloadDataOffers: builder.mutation({
      query: params => {
        return {
          method: 'GET',
          url: '/download-data-offers',
          params,
          responseHandler: response => response.blob(),
        };
      },
      invalidatesTags: ['DownloadHistoryList'],
      onQueryStarted: setLoadingHandler,
    }),
    getUploadErrors: builder.mutation({
      query: processId => {
        return {
          method: 'GET',
          url: `/processing-report/failure-details/${processId}`,
        };
      },
      onQueryStarted: setLoadingHandler,
    }),
  }),
});

export const { useOffersDownloadHistoryQuery, useDownloadDataOffersMutation } = offersDownloadHistoryApiSlice;
