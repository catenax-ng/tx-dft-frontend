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

import { Checkbox } from '@catena-x/portal-shared-components';
import { CircularProgress, FormControl, FormControlLabel } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import ButtonLoading from '../../../components/form/ButtonLoading';
import {
  useGetSettingsConfigQuery,
  usePutSettingsConfigMutation,
} from '../../../features/provider/recurringUpload/apiSlice';
import { UploadSettingsFormData } from '../../../models/RecurringUpload.models';
import { UPLOAD_CONFIG_FORM_FIELDS } from '../../../utils/constants';

function UploadSettings() {
  const { data, isSuccess, isLoading } = useGetSettingsConfigQuery({});
  const [putSettingsConfig, { isLoading: isPutSettings }] = usePutSettingsConfigMutation();

  const { control, handleSubmit, reset } = useForm<UploadSettingsFormData>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  if (isSuccess) {
    return (
      <form onSubmit={handleSubmit(putSettingsConfig)} style={{ width: 200 }}>
        {UPLOAD_CONFIG_FORM_FIELDS.map(({ name, label }: any) => (
          <FormControl key={name + label} sx={{ mb: 2 }} fullWidth>
            <Controller
              name={name}
              control={control}
              render={({ field: { ref, onChange, value } }) => (
                <FormControlLabel
                  inputRef={ref}
                  control={<Checkbox checked={!!value} onChange={onChange} name={name} />}
                  label={label}
                />
              )}
            />
          </FormControl>
        ))}
        <ButtonLoading type="submit" loading={isLoading || isPutSettings} />
      </form>
    );
  } else return <CircularProgress color="primary" />;
}

export default UploadSettings;
