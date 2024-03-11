/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2024 T-Systems International GmbH
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

import InfoIcon from '@mui/icons-material/Info';
import { Box, Button, FormControl, FormLabel, Grid } from '@mui/material';
import { Input, SelectList, Tab, TabPanel, Tabs, Tooltips, Typography } from 'cx-portal-shared-components';
import { isArray, isEmpty, keys, pickBy } from 'lodash';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ADD_POLICY_DIALOG_TYPES, NEW_POLICY_ITEM, SELECT_POLICY_TYPES } from '../constants/policies';
import {
  useGetPoliciesQuery,
  useGetPolicyTemplateQuery,
  useGetSinglePolicyMutation,
} from '../features/provider/policies/apiSlice';
import { setPolicyDialog, setSelectedPolicy } from '../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { ISelectList } from '../models/Common';
import { PolicyHubModel } from '../models/Polices.models';
import { ALPHA_NUM_REGEX } from '../utils/constants';
import { toReadableCapitalizedCase } from '../utils/utils';

const PolicyHub = ({ onSubmit }: any) => {
  const { t } = useTranslation();
  const { selectedUseCases, useCaseNames } = useAppSelector(state => state.appSlice);
  const { policyDialogType, policyData, selectedPolicy } = useAppSelector(state => state.policySlice);

  const isEditPolicy = policyDialogType === 'Edit';

  const showPolicySelection = policyDialogType === 'FileWithPolicy' || policyDialogType === 'TableWithPolicy';

  const { data, isSuccess } = useGetPolicyTemplateQuery({
    useCases: useCaseNames,
  });
  const { data: policyListResponse, isSuccess: isPolicyDataSuccess } = useGetPoliciesQuery(
    {},
    { skip: !showPolicySelection },
  );
  const [getSinglePolicy] = useGetSinglePolicyMutation();

  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState(0);
  const [policyList, setPolicyList] = useState([]);
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const dispatch = useAppDispatch();

  const dialogTypeCheck = ADD_POLICY_DIALOG_TYPES.includes(policyDialogType);

  const { handleSubmit, control, reset } = useForm();

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  useEffect(() => {
    dispatch(setSelectedPolicy(NEW_POLICY_ITEM));
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      if (dialogTypeCheck) {
        const convertedData = PolicyHubModel.usecaseFilter(data, selectedUseCases);
        setFormData(convertedData);
      } else if (isEditPolicy) {
        setFormData(PolicyHubModel.prepareEditData(policyData, data));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, selectedUseCases]);

  useEffect(() => {
    if (isPolicyDataSuccess) {
      const list = policyListResponse?.items.map((policy: any) => {
        return {
          id: policy.uuid,
          title: policy.policy_name,
          value: 'EXISTING',
        };
      });
      setPolicyList([NEW_POLICY_ITEM, ...list]);
    }
  }, [isPolicyDataSuccess, policyListResponse]);

  const handleChange = (e: any, type: string, key: string) => {
    setFormData((prev: any) => {
      const updatedFormData = { ...prev };
      const policies = updatedFormData[type];
      // if its a valid policy not a custom values
      if (isArray(policies)) {
        // Find the object in the policies array with the given technicalKey
        const policyToUpdate = policies.find((policy: any) => policy.technicalKey === key);
        // If the policyToUpdate is found, update its value
        if (policyToUpdate) {
          policyToUpdate.value = e || '';
        }
      } else {
        updatedFormData[key] = e || '';
      }
      return updatedFormData;
    });
  };

  const handlePolicySelection = async (item: ISelectList) => {
    dispatch(setSelectedPolicy(item));
    if (item.value === 'NEW') {
      setFormData(PolicyHubModel.usecaseFilter(data, selectedUseCases));
    } else {
      await getSinglePolicy(item.id)
        .unwrap()
        .then((res: any) => {
          if (res) {
            setFormData(PolicyHubModel.prepareEditData(res, data));
          }
        });
    }
  };

  const formSubmit = (formOutput: any) => {
    onSubmit(PolicyHubModel.preparePayload(formOutput));
  };

  const renderFormField = (item: any, type: any) => {
    const firstAttribute = item?.attribute[0];
    if (!firstAttribute) return null;

    const formLabel = (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Typography variant={'body3'} mr={0.5} fontWeight={'bold'}>
          {toReadableCapitalizedCase(item.technicalKey)}
        </Typography>
        {!isEmpty(item.description) && (
          <Tooltips tooltipPlacement="top" tooltipText={item.description}>
            <span>
              <InfoIcon fontSize="small" color="disabled" />
            </span>
          </Tooltips>
        )}
      </Box>
    );

    if (firstAttribute?.key === 'Regex') {
      return (
        <FormControl fullWidth sx={{ '& .MuiBox-root': { marginTop: 0 } }}>
          <FormLabel>{formLabel}</FormLabel>
          <Input
            placeholder="Enter a value"
            value={item.value}
            onChange={e => {
              const { value } = e.target;
              if (ALPHA_NUM_REGEX.test(value) || value === '') {
                handleChange(value, type, item.technicalKey);
              }
            }}
            helperText="Invalid input"
          />
        </FormControl>
      );
    } else if (SELECT_POLICY_TYPES.includes(firstAttribute?.key)) {
      return (
        <FormControl fullWidth sx={{ '& .MuiBox-root': { marginTop: 0 } }}>
          <FormLabel>{formLabel}</FormLabel>
          <SelectList
            keyTitle="value"
            defaultValue={item.value}
            items={item.attribute}
            variant="filled"
            label={''}
            placeholder="Select a value"
            type={'text'}
            disableClearable={false}
            onChangeItem={e => handleChange(e, type, item.technicalKey)}
          />
        </FormControl>
      );
    } else {
      return null;
    }
  };

  if (isSuccess) {
    const policyTypes = keys(pickBy(formData, isArray));
    return (
      <form>
        {showPolicySelection && (
          <Box>
            <FormControl sx={{ mb: 3, width: 300 }}>
              <SelectList
                keyTitle="title"
                defaultValue={selectedPolicy}
                items={policyList}
                variant="filled"
                label={'Create new or choose existing policy'}
                placeholder="Select a value"
                type={'text'}
                disableClearable={false}
                onChangeItem={handlePolicySelection}
              />
            </FormControl>
          </Box>
        )}
        <FormControl sx={{ mb: 3, width: 300 }}>
          <Controller
            name="policy_name"
            control={control}
            rules={{
              required: true,
              minLength: 3,
              maxLength: 30,
              pattern: ALPHA_NUM_REGEX,
            }}
            render={({ fieldState: { error } }) => (
              <Input
                value={formData.policy_name}
                variant="filled"
                label={'Policy name'}
                placeholder={'Enter policy name'}
                type={'text'}
                error={!!error}
                onChange={e => {
                  const { value } = e.target;
                  if (ALPHA_NUM_REGEX.test(value) || value === '') {
                    handleChange(value, 'policy_name', 'policy_name');
                  }
                }}
                helperText={'Name required (min. 3 characters)'}
              />
            )}
          />
        </FormControl>
        {/* Policy tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="polcy type tabs" sx={{ pt: 0 }}>
            {policyTypes?.map((type: string) => (
              <Tab key={type} label={type} />
            ))}
          </Tabs>
        </Box>
        <Box>
          {policyTypes?.map((type: string, i: number) => {
            return (
              <TabPanel key={type} index={i} value={activeTab}>
                <Grid container spacing={3}>
                  {formData[type].map((item: any) => (
                    <Grid key={type + item.technicalKey} item xs={5}>
                      {renderFormField(item, type)}
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: 1, mt: 4 }}>
          <Button variant="contained" color="primary" type="submit" onClick={handleSubmit(formSubmit)}>
            {t('button.submit')}
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={() => dispatch(setPolicyDialog(false))}>
            {t('button.close')}
          </Button>
        </Box>
      </form>
    );
  } else return null;
};

export default PolicyHub;
