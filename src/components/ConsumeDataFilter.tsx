/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2024 T-Systems International GmbH
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

import { Autocomplete, Box, Grid } from '@mui/material';
import { Input, LoadingButton, SelectList, Typography } from 'cx-portal-shared-components';
import { debounce, isEmpty } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  setContractOffers,
  setFfilterCompanyOptionsLoading,
  setFilterCompanyOptions,
  setFilterConnectors,
  setFilterProviderUrl,
  setFilterSelectedBPN,
  setFilterSelectedConnector,
  setManufacturerPartIdValue,
  setOffersLoading,
  setSearchFilterByType,
  setSelectedFilterCompanyOption,
} from '../features/consumer/slice';
import { ILegalEntityContent, IntConnectorItem, IntOption } from '../features/consumer/types';
import { useAppDispatch, useAppSelector } from '../features/store';
import ConsumerService from '../services/ConsumerService';
import { ALPHA_NUM_REGEX, MAX_CONTRACTS_AGREEMENTS } from '../utils/constants';
import Permissions from './Permissions';
import SelectSubmodel from './SelectSubmodel';

const ITEMS: IntConnectorItem[] = [
  {
    id: 1,
    title: 'Company Name',
    value: 'company',
  },
  {
    id: 2,
    title: 'Business Partner Number',
    value: 'bpn',
  },
];

function ConsumeDataFilter() {
  const {
    offersLoading,
    searchFilterByType,
    filterSelectedCompanyOption,
    filterCompanyOptions,
    filterCompanyOptionsLoading,
    filterSelectedBPN,
    manufacturerPartId,
  } = useAppSelector(state => state.consumerSlice);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bpnError, setBpnError] = useState(false);
  const [submodelFilter, setSubmodelFilter] = useState<any>({});
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // get company name oninput change
  const onChangeSearchInputValue = async (params: string) => {
    const searchStr = params.toLowerCase();
    if (searchStr.length > 2) {
      if (open) setSearchOpen(true);
      dispatch(setFilterCompanyOptions([]));
      dispatch(setFilterSelectedConnector(null));
      dispatch(setFfilterCompanyOptionsLoading(true));
      const res: [] = await ConsumerService.getInstance().searchLegalEntities(searchStr);
      dispatch(setFfilterCompanyOptionsLoading(false));
      if (res.length > 0) {
        const filterContent = res.map((item: ILegalEntityContent, index) => {
          return {
            _id: index,
            bpn: item.bpn,
            value: item.name,
          };
        });
        dispatch(setFilterCompanyOptions(filterContent));
      }
    } else {
      setSearchOpen(false);
      dispatch(setFilterCompanyOptions([]));
    }
  };

  // on change search type filter option
  const handleSearchTypeChange = (value: IntConnectorItem) => {
    dispatch(setSearchFilterByType(value));
    dispatch(setSelectedFilterCompanyOption(null));
    dispatch(setFilterProviderUrl(''));
    dispatch(setFilterSelectedBPN(''));
    dispatch(setFilterConnectors([]));
    dispatch(setFilterSelectedConnector(null));
  };

  // on option selected of company dropdown
  const onCompanyOptionChange = async (value: IntOption | string) => {
    const payload = value as IntOption;
    dispatch(setSelectedFilterCompanyOption(payload));
  };
  const handleBPNchange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === '' || ALPHA_NUM_REGEX.test(value)) {
      dispatch(setFilterSelectedBPN(value));
    }
  };
  const handleLoadingButton = () => {
    if (ALPHA_NUM_REGEX.test(filterSelectedBPN) && filterSelectedBPN.length == 16) {
      console.log(ALPHA_NUM_REGEX.test(filterSelectedBPN));
      return true;
    } else return false;
  };
  const fetchConsumerDataOffers = async () => {
    try {
      let bpn = '';
      if (searchFilterByType.value === 'company') {
        bpn = filterSelectedCompanyOption.bpn;
      } else if (searchFilterByType.value === 'bpn') {
        bpn = filterSelectedBPN;
      }
      dispatch(setOffersLoading(true));
      const response = await ConsumerService.getInstance().fetchConsumerDataOffers({
        offset: 0,
        maxLimit: MAX_CONTRACTS_AGREEMENTS,
        manufacturerPartId: manufacturerPartId,
        bpnNumber: bpn,
        submodel: submodelFilter?.value || '',
      });
      dispatch(setContractOffers(response.data));
      dispatch(setOffersLoading(false));
    } catch (error) {
      dispatch(setContractOffers([]));
      dispatch(setOffersLoading(false));
    }
  };
  const init = () => {
    dispatch(setSearchFilterByType(ITEMS[0]));
    dispatch(setManufacturerPartIdValue(''));
  };
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filterSelectedBPN.length == 16 || filterSelectedBPN.length == 0) setBpnError(false);
    else setBpnError(true);
  }, [filterSelectedBPN]);

  return (
    <Grid container spacing={2} alignItems="end">
      <Grid item xs={3}>
        <Typography variant="h4">Filters</Typography>
        <SelectList
          keyTitle="title"
          label={t('content.consumeData.selectType')}
          placeholder={t('content.consumeData.selectType')}
          defaultValue={searchFilterByType}
          items={ITEMS}
          onChangeItem={e => handleSearchTypeChange(e)}
          disableClearable={true}
        />
      </Grid>
      <Grid item xs={3}>
        {searchFilterByType.value === 'bpn' ? (
          <Input
            value={filterSelectedBPN}
            type="text"
            fullWidth
            size="small"
            label={t('content.consumeData.enterBPN') + '*'}
            placeholder={t('content.consumeData.enterBPN')}
            inputProps={{ maxLength: 16 }}
            error={bpnError}
            onChange={handleBPNchange}
            helperText={t('alerts.bpnValidation')}
          />
        ) : (
          <Autocomplete
            open={searchOpen}
            options={filterCompanyOptions}
            includeInputInList
            loading={filterCompanyOptionsLoading}
            onChange={async (event, value: any) => {
              await onCompanyOptionChange(value);
            }}
            onInputChange={debounce(async (event, newInputValue) => {
              await onChangeSearchInputValue(newInputValue);
            })}
            onSelect={() => setSearchOpen(false)}
            onBlur={() => setSearchOpen(false)}
            onClose={() => setSearchOpen(false)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={option => {
              return typeof option === 'string' ? option : `${option.value}`;
            }}
            noOptionsText={t('content.consumeData.noCompany')}
            renderInput={params => (
              <Input
                {...params}
                label={t('content.consumeData.searchCompany') + '*'}
                placeholder={t('content.consumeData.searchPlaceholder')}
                fullWidth
              />
            )}
            renderOption={(props, option: any) => (
              <Box
                component="li"
                {...props}
                key={option.bpn}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'initial!important',
                  justifyContent: 'initial',
                }}
              >
                <Typography variant="subtitle1">{option.value}</Typography>
                <Typography variant="subtitle2">{option.bpn}</Typography>
              </Box>
            )}
            sx={{
              '& .MuiFilledInput-root': {
                pt: '0px!important',
                minHeight: '55px',
              },
            }}
          />
        )}
      </Grid>
      <Grid item xs={3}>
        <Input
          value={manufacturerPartId || ''}
          type="text"
          onChange={(e: { target: { value: string } }) => dispatch(setManufacturerPartIdValue(e.target.value))}
          fullWidth
          size="small"
          label={t('content.pcfExchange.manufacturerPartId')}
          placeholder={t('content.pcfExchange.manufacturerPartId')}
        />
      </Grid>
      <Grid item xs={3}>
        <SelectSubmodel defaultValue={submodelFilter} onChange={setSubmodelFilter} />
      </Grid>
      <Grid item>
        <Permissions values={['consumer_search_connectors']}>
          <LoadingButton
            color="primary"
            variant="contained"
            disabled={!handleLoadingButton() && isEmpty(filterSelectedCompanyOption)}
            label={t('button.search')}
            loadIndicator={t('content.common.loading')}
            onButtonClick={fetchConsumerDataOffers}
            loading={offersLoading}
          />
        </Permissions>
      </Grid>
    </Grid>
  );
}

export default ConsumeDataFilter;
