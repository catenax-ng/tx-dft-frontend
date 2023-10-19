/********************************************************************************
 * Copyright (c) 2021,2022,2023 T-Systems International GmbH
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

import { createSlice } from '@reduxjs/toolkit';

import { fetchUserPermissions } from './actions';
import { IAppSlice } from './types';

const initialState: IAppSlice = {
  pageLoading: false,
  loggedInUser: {
    userName: '',
    name: '',
    email: '',
    company: '',
    bpn: '',
    tenant: '',
    token: '',
    parsedToken: {},
  },
  permissions: [],
  sidebarExpanded: true,
  useCases: [],
  selectedUseCases: [],
  checkedUseCases: [],
};
export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload;
    },
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    setSidebarExpanded: state => {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    setSelectedUseCases: (state, action) => {
      state.selectedUseCases = action.payload;
    },
    setCheckeduseCases: (state, { payload }) => {
      state.checkedUseCases = payload;
    },
    setUseCases: (state, { payload }) => {
      state.useCases = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserPermissions.pending, state => {
      state.pageLoading = true;
    });
    builder.addCase(fetchUserPermissions.fulfilled, (state, action) => {
      state.permissions = action.payload;
      state.pageLoading = false;
    });
  },
});

export const {
  setPageLoading,
  setLoggedInUser,
  setSelectedUseCases,
  setSidebarExpanded,
  setCheckeduseCases,
  setUseCases,
} = appSlice.actions;
export default appSlice.reducer;
