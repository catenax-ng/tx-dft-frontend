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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IPCFResponsePojo, IPCFValueState } from './types';

const initialState: IPCFValueState = {
  openDialog: false,
  pcfValueData: {} as IPCFResponsePojo,
  pcfValueDialog: false,
};

export const viewPcfValueSlice = createSlice({
  name: 'viewPcfValueSlice',
  initialState,
  reducers: {
    setPcfValueData: (state, action: PayloadAction<IPCFResponsePojo>) => {
      state.pcfValueData = action.payload;
    },
    setPcfValueDialog: (state, action: PayloadAction<boolean>) => {
      state.pcfValueDialog = action.payload;
    },
    handleDialogClose: state => Object.assign(state, initialState),
  },
});

export const { setPcfValueData, setPcfValueDialog, handleDialogClose } = viewPcfValueSlice.actions;

export default viewPcfValueSlice.reducer;