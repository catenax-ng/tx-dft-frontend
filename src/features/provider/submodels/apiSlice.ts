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

import { indexOf } from 'lodash';

import { setLoadingHandler } from '../../../helpers/ApiHelper';
import { apiSlice } from '../../app/apiSlice';

export const helpApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getHelpPageData: builder.query({
      query: params => {
        return {
          url: '/submodels/schema-details',
          params,
        };
      },
      transformResponse: (response: any[]) => {
        const pageData = response.map(submodel => {
          return {
            name: `${submodel.title} - ${submodel.version}`,
            description: submodel.description,
            id: submodel.id,
            rows: Object.entries(submodel.items.properties).map(([key, value]: any, index) => ({
              id: index,
              name: key,
              mandatory: indexOf(submodel.items.required, key) > -1 ? 'true' : 'false',
              order: index + 1,
              description: value.description,
            })),
          };
        });
        return pageData;
      },
      onQueryStarted: setLoadingHandler,
    }),
    downloadSample: builder.mutation({
      query: ({ submodel, type }) => {
        return {
          method: 'GET',
          url: `/submodels/csvfile/${submodel}?type=${type}`,
          responseHandler: response => response.blob(),
        };
      },
    }),
  }),
});

export const { useGetHelpPageDataQuery, useDownloadSampleMutation } = helpApiSlice;
