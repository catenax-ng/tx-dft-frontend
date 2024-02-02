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

import { GridSelectionModel } from '@mui/x-data-grid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

import { epochToDate } from '../../utils/utils';
import { IConsumerDataOffers, IConsumerSlice, IContractAgreements, IntConnectorItem, IntOption } from './types';

const initialState: IConsumerSlice = {
  offersLoading: false,
  contractOffers: [],
  selectedOffersList: [],
  selectedOffer: null,
  isMultipleContractSubscription: false,
  // search filter
  searchFilterByType: {},
  filterProviderUrl: '',
  filterCompanyOptions: [],
  filterCompanyOptionsLoading: false,
  filterSelectedCompanyOption: null,
  filterSelectedBPN: '',
  filterConnectors: [],
  filterSelectedConnector: {},
  contractAgreements: [],
  isContractAgreementsLoading: false,
  manufacturerPartId: '',
  bpnNumber: '',
  selectionModel: [],
};

export const consumerSlice = createSlice({
  name: 'consumerSlice',
  initialState,
  reducers: {
    setOffersLoading: (state, action: PayloadAction<boolean>) => {
      state.offersLoading = action.payload;
    },
    setContractOffers: (state, action: PayloadAction<IConsumerDataOffers[]>) => {
      const modifiedData = action.payload
        .sort(
          (contract1: IConsumerDataOffers, contract2: IConsumerDataOffers) =>
            moment(contract1.created, 'DD/MM/YYYY HH:mm:ss').unix() -
            moment(contract2.created, 'DD/MM/YYYY HH:mm:ss').unix(),
        )
        .map((item: IConsumerDataOffers, index: number) => {
          return { ...item, ...{ id: index } };
        });
      state.contractOffers = modifiedData;
    },
    setSelectedOffersList: (state, action: PayloadAction<IConsumerDataOffers[]>) => {
      state.selectedOffersList = action.payload;
    },
    setSelectedOffer: (state, action: PayloadAction<IConsumerDataOffers>) => {
      state.selectedOffer = action.payload;
    },
    setIsMultipleContractSubscription: (state, action: PayloadAction<boolean>) => {
      state.isMultipleContractSubscription = action.payload;
    },
    setSearchFilterByType: (state, action: PayloadAction<IntConnectorItem>) => {
      state.searchFilterByType = action.payload;
    },
    setFilterProviderUrl: (state, action: PayloadAction<string>) => {
      state.filterProviderUrl = action.payload;
    },
    setFilterCompanyOptions: (state, action: PayloadAction<IntOption[]>) => {
      state.filterCompanyOptions = action.payload;
    },
    setFfilterCompanyOptionsLoading: (state, action: PayloadAction<boolean>) => {
      state.filterCompanyOptionsLoading = action.payload;
    },
    setSelectedFilterCompanyOption: (state, action: PayloadAction<IntOption>) => {
      state.filterSelectedCompanyOption = action.payload;
    },
    setFilterSelectedBPN: (state, action: PayloadAction<string>) => {
      state.filterSelectedBPN = action.payload;
    },
    setFilterConnectors: (state, action: PayloadAction<IntConnectorItem[]>) => {
      state.filterConnectors = action.payload;
    },
    setFilterSelectedConnector: (state, action: PayloadAction<IntConnectorItem>) => {
      state.filterSelectedConnector = action.payload;
    },
    setContractAgreements: (state, action: PayloadAction<IContractAgreements[]>) => {
      const modifiedData = action.payload
        .sort(
          (contract1: IContractAgreements, contract2: IContractAgreements) =>
            epochToDate(contract2.dateUpdated).valueOf() - epochToDate(contract1.dateUpdated).valueOf(),
        )
        .map((item: IContractAgreements, index: number) => {
          return { ...item, ...{ id: index } };
        });
      state.contractAgreements = modifiedData;
    },
    setIsContractAgreementsLoading: (state, action: PayloadAction<boolean>) => {
      state.isContractAgreementsLoading = action.payload;
    },
    setManufacturerPartIdValue: (state, action: PayloadAction<string>) => {
      state.manufacturerPartId = action.payload;
    },
    setBpnNumberValue: (state, action: PayloadAction<string>) => {
      state.bpnNumber = action.payload;
    },
    setSelectionModel: (state, action: PayloadAction<GridSelectionModel>) => {
      state.selectionModel = action.payload;
    },
  },
});

export const {
  setOffersLoading,
  setContractOffers,
  setSelectedOffersList,
  setSelectedOffer,
  setIsMultipleContractSubscription,
  setSearchFilterByType,
  setFilterProviderUrl,
  setFilterCompanyOptions,
  setFfilterCompanyOptionsLoading,
  setSelectedFilterCompanyOption,
  setFilterConnectors,
  setFilterSelectedConnector,
  setFilterSelectedBPN,
  setContractAgreements,
  setIsContractAgreementsLoading,
  setManufacturerPartIdValue,
  setBpnNumberValue,
  setSelectionModel,
} = consumerSlice.actions;
export default consumerSlice.reducer;
