/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { Autocomplete, Box, FormControl, Grid } from '@mui/material';
import { Input, SelectList, Typography } from 'cx-portal-shared-components';
import { debounce, inRange } from 'lodash';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

import { setFfilterCompanyOptionsLoading, setFilterCompanyOptions } from '../../features/consumer/slice';
import { ILegalEntityContent, IntOption } from '../../features/consumer/types';
import { useAppDispatch, useAppSelector } from '../../features/store';
import ConsumerService from '../../services/ConsumerService';
import { ALPHA_NUM_REGEX, BPN_TYPE_FIELDS } from '../../utils/constants';

function ValidateBpn() {
  const [searchPopup, setSearchPopup] = useState(false);
  const [selectType, setSelectType] = useState(BPN_TYPE_FIELDS[0]);
  const [conKey, setConKey] = useState(uuid());

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { control, resetField } = useFormContext();
  const { filterCompanyOptions, filterCompanyOptionsLoading } = useAppSelector(state => state.consumerSlice);

  // get company name on input change
  const onChangeSearchInputValue = async (params: string) => {
    const searchStr = params.toLowerCase();
    if (searchStr.length > 2) {
      setSearchPopup(true);
      dispatch(setFilterCompanyOptions([]));
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
      setSearchPopup(false);
      dispatch(setFilterCompanyOptions([]));
    }
  };

  return (
    <>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={5}>
          <SelectList
            keyTitle="title"
            label={t('content.consumeData.selectType')}
            fullWidth
            size="small"
            onChangeItem={e => {
              setSelectType(e);
              resetField('bpnNumber', { defaultValue: '' });
              setConKey(uuid());
            }}
            items={BPN_TYPE_FIELDS}
            defaultValue={selectType}
            placeholder={t('content.consumeData.selectType')}
            disableClearable
          />
        </Grid>
        <Grid item xs={7}>
          <FormControl fullWidth>
            <Controller
              name="bpnNumber"
              control={control}
              rules={{
                required: true,
                validate: val => {
                  if (inRange(val.length, 1, 16)) {
                    return val;
                  }
                },
              }}
              render={({ field, fieldState: { error } }) =>
                selectType.value === 'bpn' ? (
                  <Input
                    label={`${t('content.consumeData.enterBPN')}*`}
                    placeholder={t('content.consumeData.enterBPN')}
                    variant="filled"
                    value={field.value}
                    onChange={e => {
                      const value = e.target.value;
                      if (value === '' || ALPHA_NUM_REGEX.test(value)) {
                        console.log(value);
                        field.onChange(value);
                      }
                    }}
                    error={!!error}
                    helperText="Incorrect BPN"
                  />
                ) : (
                  <Autocomplete
                    key={conKey}
                    open={searchPopup}
                    options={filterCompanyOptions}
                    includeInputInList
                    loading={filterCompanyOptionsLoading}
                    onChange={(_e, value: any) => field.onChange(value?.bpn)}
                    onInputChange={debounce(async (_event, newInputValue) => {
                      await onChangeSearchInputValue(newInputValue);
                    }, 1000)}
                    onClose={() => setSearchPopup(false)}
                    onBlur={() => setSearchPopup(false)}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={option => {
                      return typeof option === 'string' ? option : `${option.value}`;
                    }}
                    noOptionsText={t('content.consumeData.noCompany')}
                    renderInput={params => (
                      <Input
                        {...params}
                        label={`${t('content.consumeData.searchCompany')}*`}
                        placeholder={t('content.consumeData.searchPlaceholder')}
                        fullWidth
                        error={!!error}
                        helperText="Select a company"
                      />
                    )}
                    renderOption={(props, option: IntOption) => (
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
                  />
                )
              }
            />
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}

export default ValidateBpn;
