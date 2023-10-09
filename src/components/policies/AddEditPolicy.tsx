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

import { FormControl, FormControlLabel, FormLabel, Grid, RadioGroup } from '@mui/material';
import { Button, Input, Radio, SelectList, Typography } from 'cx-portal-shared-components';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { PolicyModel } from '../../models/RecurringUpload.models';
import { DEFAULT_POLICY_DATA, DURATION_UNITS, ONLY_NUM_REGEX, PURPOSE_VALUES } from '../../utils/constants';
import ValidateBpn from './ValidateBpn';

function AddEditPolicy({ type, policyData }: { type?: string; policyData?: PolicyModel }) {
  const { t } = useTranslation();
  const [formData, setformData] = useState<PolicyModel>(
    new PolicyModel(type === 'Edit' ? policyData : DEFAULT_POLICY_DATA),
  );

  const { control, handleSubmit, watch, reset, resetField, getValues, setValue } = useForm<PolicyModel>({
    defaultValues: { ...formData },
  });
  const inputBpn = watch('inputBpn');
  const purposeType = watch('usage_policies.purpose.typeOfAccess');
  const durationType = watch('usage_policies.duration.typeOfAccess');

  const onSubmit = (data: PolicyModel) => {
    console.log(data);
    setformData(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth sx={{ mb: 3 }}>
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
        reset={reset}
        resetField={resetField}
        getValues={getValues}
        inputBpn={inputBpn}
        setValue={setValue}
      />
      <Typography fontWeight={'bold'} mb={3}>
        {t('content.policies.usagePolicy')}
      </Typography>
      {/* duraion fields */}
      <FormControl fullWidth>
        <FormLabel sx={{ mb: 2 }}>{t('content.policies.duration')}</FormLabel>
        <Controller
          rules={{ required: true }}
          control={control}
          name="usage_policies.duration.typeOfAccess"
          render={({ field }) => (
            <RadioGroup
              {...field}
              row
              onChange={e => {
                field.onChange(e);
                resetField('usage_policies.duration.value');
              }}
            >
              <FormControlLabel value="UNRESTRICTED" control={<Radio />} label="Unrestricted" />
              <FormControlLabel value="RESTRICTED" control={<Radio />} label="Restricted" />
            </RadioGroup>
          )}
        />
      </FormControl>
      {durationType === 'RESTRICTED' && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant="body1">{t('content.policies.durationNote')}</Typography>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <Controller
                name="usage_policies.duration.value"
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
                name="usage_policies.duration.durationUnit"
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

      {/* purpose field */}
      <FormControl fullWidth>
        <FormLabel sx={{ mb: 2 }}>{t('content.policies.purpose')}</FormLabel>
        <Controller
          rules={{ required: true }}
          control={control}
          name="usage_policies.purpose.typeOfAccess"
          render={({ field }) => (
            <RadioGroup
              {...field}
              row
              onChange={e => {
                field.onChange(e);
                resetField('usage_policies.purpose.value');
              }}
            >
              <FormControlLabel value="UNRESTRICTED" control={<Radio />} label="Unrestricted" />
              <FormControlLabel value="RESTRICTED" control={<Radio />} label="Restricted" />
            </RadioGroup>
          )}
        />
      </FormControl>
      {purposeType === 'RESTRICTED' && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant="body1">{t('content.policies.purposeNote')}</Typography>
          <Controller
            name="usage_policies.purpose.value"
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
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default AddEditPolicy;
