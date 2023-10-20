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

import { Box, FormControl, FormControlLabel, FormLabel, Grid, RadioGroup } from '@mui/material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Input,
  Radio,
  SelectList,
  Typography,
} from 'cx-portal-shared-components';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCreatePolicyMutation, useUpdatePolicyMutation } from '../../features/provider/policies/apiSlice';
import { setPolicyDialog } from '../../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { PolicyModel, PolicyPayload } from '../../models/RecurringUpload.models';
import { DURATION_UNITS, ONLY_NUM_REGEX, PURPOSE_VALUES } from '../../utils/constants';
import ValidateBpn from './ValidateBpn';

function AddEditPolicy() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { policyDialog, policyDialogType, policyData } = useAppSelector(state => state.accessUsagePolicySlice);

  const { control, handleSubmit, watch, resetField, getValues, setValue, reset } = useForm<PolicyModel>({
    mode: 'onSubmit',
  });

  useEffect(() => {
    reset(policyData);
  }, [policyData, reset]);

  const inputBpn = watch('inputBpn');
  const purposeType = watch('usage_policies.PURPOSE.typeOfAccess');
  const durationType = watch('usage_policies.DURATION.typeOfAccess');

  const [createPolicy] = useCreatePolicyMutation();
  const [updatePolicy] = useUpdatePolicyMutation();

  const onSubmit = async (data: PolicyModel) => {
    const payload = new PolicyPayload(data);
    if (policyDialogType === 'Add') {
      await createPolicy({ ...payload })
        .unwrap()
        .then(res => {
          console.log(res);
          dispatch(setPolicyDialog(false));
        });
    } else if (policyDialogType === 'Edit') {
      await updatePolicy({ ...payload })
        .unwrap()
        .then(() => {
          dispatch(setPolicyDialog(false));
        });
    }
  };

  return (
    <Dialog open={policyDialog}>
      <DialogHeader
        closeWithIcon
        onCloseWithIcon={() => dispatch(setPolicyDialog(false))}
        title={t(policyDialogType === 'Add' ? 'content.policies.addPolicy' : 'content.policies.title')}
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
          <FormControl sx={{ mb: 3, width: 300 }}>
            <Controller
              name="policy_name"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  variant="filled"
                  inputRef={field.ref}
                  label={'Policy name'}
                  placeholder={'Enter policy name'}
                  type={'text'}
                  error={!!error}
                />
              )}
            />
          </FormControl>
          <Typography fontWeight={'bold'}>{t('content.policies.accessPolicy')}</Typography>
          <ValidateBpn
            control={control}
            watch={watch}
            resetField={resetField}
            getValues={getValues}
            inputBpn={inputBpn}
            setValue={setValue}
          />
          <Typography fontWeight={'bold'} mb={3}>
            {t('content.policies.usagePolicy')}
          </Typography>
          {/* duraion fields */}
          <Box mb={2}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t('content.policies.duration')}</FormLabel>
              <Controller
                rules={{ required: true }}
                control={control}
                name="usage_policies.DURATION.typeOfAccess"
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    onChange={e => {
                      field.onChange(e);
                      resetField('usage_policies.DURATION.value');
                    }}
                  >
                    <FormControlLabel value="UNRESTRICTED" control={<Radio />} label="Unrestricted" />
                    <FormControlLabel value="RESTRICTED" control={<Radio />} label="Restricted" />
                  </RadioGroup>
                )}
              />
            </FormControl>
            {durationType === 'RESTRICTED' && (
              <FormControl fullWidth>
                <Typography variant="body1">{t('content.policies.durationNote')}</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <Controller
                      name="usage_policies.DURATION.value"
                      control={control}
                      rules={{
                        required: durationType === 'RESTRICTED',
                        pattern: ONLY_NUM_REGEX,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          {...field}
                          variant="filled"
                          inputRef={field.ref}
                          label={t('content.common.enterValue')}
                          placeholder={t('content.common.enterValue')}
                          type="number"
                          error={!!error}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name="usage_policies.DURATION.durationUnit"
                      control={control}
                      rules={{
                        required: durationType === 'RESTRICTED',
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <SelectList
                          {...field}
                          keyTitle="title"
                          defaultValue={field.value}
                          items={DURATION_UNITS}
                          variant="filled"
                          inputRef={field.ref}
                          label={t('content.policies.selectDuration')}
                          placeholder={t('content.policies.selectDuration')}
                          error={!!error}
                          disableClearable={true}
                          onChangeItem={field.onChange}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            )}
          </Box>

          {/* purpose field */}
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('content.policies.purpose')}</FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="usage_policies.PURPOSE.typeOfAccess"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  onChange={e => {
                    field.onChange(e);
                    resetField('usage_policies.PURPOSE.value');
                  }}
                >
                  <FormControlLabel value="UNRESTRICTED" control={<Radio />} label="Unrestricted" />
                  <FormControlLabel value="RESTRICTED" control={<Radio />} label="Restricted" />
                </RadioGroup>
              )}
            />
          </FormControl>
          {purposeType === 'RESTRICTED' && (
            <FormControl sx={{ mb: 3, width: 300 }}>
              <Typography variant="body1">{t('content.policies.purposeNote')}</Typography>
              <Controller
                name="usage_policies.PURPOSE.value"
                control={control}
                rules={{
                  required: purposeType === 'RESTRICTED',
                }}
                render={({ field, fieldState: { error } }) => (
                  <SelectList
                    keyTitle="title"
                    defaultValue={field.value}
                    items={PURPOSE_VALUES}
                    {...field}
                    variant="filled"
                    inputRef={field.ref}
                    label={t('content.policies.purposeLabel')}
                    placeholder={t('content.policies.purposeLabel')}
                    type={'text'}
                    error={!!error}
                    disableClearable={true}
                    onChangeItem={e => {
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </FormControl>
          )}
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
