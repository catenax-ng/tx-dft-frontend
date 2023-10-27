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

import { CircularProgress, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import ButtonLoading from '../../../../components/form/ButtonLoading';
import FormControllerInput from '../../../../components/form/FormControllerInput';
import {
  useGetMinioConfigQuery,
  usePutMinioConfigMutation,
} from '../../../../features/provider/recurringUpload/apiSlice';
import { MinioFormData } from '../../../../models/RecurringUpload.models';
import { MINIO_FORM_FIELDS } from '../../../../utils/constants';

function MinioConfiguration() {
  const { data, isSuccess, isFetching } = useGetMinioConfigQuery({});
  const [putMinioConfig, { isLoading: isPuttingConfig }] = usePutMinioConfigMutation();

  const { control, handleSubmit, register, reset } = useForm<MinioFormData>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  if (isSuccess) {
    return (
      <form onSubmit={handleSubmit(putMinioConfig)} style={{ width: 600 }}>
        <Grid container spacing={3}>
          {MINIO_FORM_FIELDS.map(({ name, label, placeholder, required }) => (
            <Grid item xs={6} key={label + placeholder}>
              <FormControllerInput
                key={placeholder + label}
                name={name}
                control={control}
                label={label}
                placeholder={placeholder}
                register={register}
                required={required}
              />
            </Grid>
          ))}
        </Grid>
        <ButtonLoading type="submit" loading={isFetching || isPuttingConfig} />
      </form>
    );
  } else return <CircularProgress color="primary" />;
}

export default MinioConfiguration;