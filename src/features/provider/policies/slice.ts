/********************************************************************************
 * Copyright (c) 2022,2024 T-Systems International GmbH
 * Copyright (c) 2022,2024 Contributors to the Eclipse Foundation
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

import { NEW_POLICY_ITEM } from '../../../constants/policies';
import { ISelectList } from '../../../models/Common';
import { IAccessPolicyState } from './types';

const initialState: IAccessPolicyState = {
  openDialog: false,
  policyData: {},
  policyDialog: false,
  policyDialogType: '',
  selectedPolicy: NEW_POLICY_ITEM,
};

export const policySlice = createSlice({
  name: 'policySlice',
  initialState,
  reducers: {
    setPolicyData: (state, action: PayloadAction) => {
      state.policyData = action.payload;
    },
    setPolicyDialog: (state, action: PayloadAction<boolean>) => {
      state.policyDialog = action.payload;
    },
    setPolicyDialogType: (state, action: PayloadAction<string>) => {
      state.policyDialogType = action.payload;
    },
    handleDialogClose: state => Object.assign(state, initialState),
    setSelectedPolicy: (state, action: PayloadAction<ISelectList>) => {
      state.selectedPolicy = action.payload;
    },
  },
});

export const { setPolicyData, setPolicyDialog, setPolicyDialogType, handleDialogClose, setSelectedPolicy } =
  policySlice.actions;

export default policySlice.reducer;
