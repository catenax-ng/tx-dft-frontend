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

import { Box, FormControl, FormControlLabel } from '@mui/material';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Input,
  SelectList,
  Typography,
} from 'cx-portal-shared-components';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { uploadFileWithPolicy, uploadTableWithPolicy } from '../../features/provider/policies/actions';
import { useCreatePolicyMutation, useUpdatePolicyMutation } from '../../features/provider/policies/apiSlice';
import { setPolicyDialog } from '../../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { PolicyModel, PolicyPayload } from '../../models/RecurringUpload.models';
import { FRAMEWORKS } from '../../utils/constants';
import ValidateBpn from './ValidateBpn';

function AddEditPolicy() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { policyDialog, policyDialogType, policyData } = useAppSelector(state => state.policySlice);
  const { rows } = useAppSelector(state => state.submodelSlice);

  const { control, handleSubmit, watch, resetField, getValues, setValue, reset } = useForm<PolicyModel>({
    mode: 'onSubmit',
  });

  useEffect(() => {
    reset(policyData);
  }, [policyData, reset]);

  const inputBpn = watch('inputBpn');

  const showPolicyName = policyDialogType === 'Add' || policyDialogType === 'Edit';

  const [createPolicy] = useCreatePolicyMutation();
  const [updatePolicy] = useUpdatePolicyMutation();

  const onSubmit = async (data: PolicyModel) => {
    const payload = new PolicyPayload(data);
    try {
      switch (policyDialogType) {
        case 'Add':
          await createPolicy({ ...payload });
          break;
        case 'Edit':
          await updatePolicy({ ...payload });
          break;
        case 'FileWithPolicy':
          await dispatch(uploadFileWithPolicy(payload));
          break;
        case 'TableWithPolicy':
          await dispatch(uploadTableWithPolicy({ ...payload, row_data: rows }));
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={policyDialog}>
      <DialogHeader
        closeWithIcon
        onCloseWithIcon={() => dispatch(setPolicyDialog(false))}
        title={t(policyDialogType === 'Edit' ? 'content.policies.editPolicy' : 'content.policies.addPolicy')}
      />
      <DialogContent>
        <Typography variant="body2">
          <b>{t('content.policies.description')}</b>
        </Typography>
        <ol style={{ padding: '0 0 0 16px' }}>
          <li>
            <Typography variant="body2">{t('content.policies.description_1')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t('content.policies.description_2')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t('content.policies.description_3')}</Typography>
          </li>
        </ol>
        <form>
          {showPolicyName && (
            <FormControl sx={{ mb: 3, width: 300 }}>
              <Controller
                name="policy_name"
                control={control}
                rules={{
                  required: showPolicyName,
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    variant="filled"
                    label={'Policy name'}
                    placeholder={'Enter policy name'}
                    type={'text'}
                    error={!!error}
                  />
                )}
              />
            </FormControl>
          )}
          {/* access policy starts */}
          <Typography fontWeight={'bold'} mb={3}>
            {t('content.policies.accessPolicy')}
          </Typography>
          <ValidateBpn
            control={control}
            watch={watch}
            resetField={resetField}
            getValues={getValues}
            inputBpn={inputBpn}
            setValue={setValue}
          />
          <FormControl fullWidth>
            <Controller
              name="access_policies.membership.value"
              control={control}
              render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Membership" />}
            />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name="access_policies.dismantler.value"
              control={control}
              render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Dismantler" />}
            />
          </FormControl>
          {/* access policy ends */}
          {/* usage policy starts */}
          <Typography fontWeight={'bold'} my={3}>
            {t('content.policies.usagePolicy')}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="usage_policies.membership.value"
              control={control}
              render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Membership" />}
            />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name="usage_policies.dismantler.value"
              control={control}
              render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Dismantler" />}
            />
          </FormControl>
          {FRAMEWORKS.map((item: any) => (
            <Box>
              <FormControl sx={{ mb: 3, width: 300 }} key={item.name}>
                <Controller
                  name={`usage_policies.${item.name}.value`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectList
                      keyTitle="value"
                      defaultValue={field.value}
                      items={item.values}
                      {...field}
                      variant="filled"
                      label={item.title}
                      placeholder="Select a version"
                      type={'text'}
                      error={!!error}
                      disableClearable={true}
                      onChangeItem={e => {
                        field.onChange(e);
                        console.log(e);
                      }}
                    />
                  )}
                />
              </FormControl>
            </Box>
          ))}
          {/* usage policy ends */}
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => dispatch(setPolicyDialog(false))}>
          {t('button.close')}
        </Button>
        <Button variant="contained" type="submit" onClick={handleSubmit(onSubmit)}>
          {t('button.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditPolicy;
