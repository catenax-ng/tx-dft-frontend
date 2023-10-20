/********************************************************************************
 * Copyright (c) 2023 T-Systems International GmbH
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
import { setPageLoading, setPermissions, setUseCases } from '../app/slice';
import { UseCaseSelectionModel } from '../app/types';

export const homeApiSlice = apiSlice.injectEndpoints({
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
});

export const { useGetUseCasesQuery, useGetPermissionsQuery } = homeApiSlice;
