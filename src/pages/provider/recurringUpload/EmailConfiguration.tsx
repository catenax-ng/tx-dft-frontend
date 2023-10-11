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

import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import ButtonLoading from '../../../components/form/ButtonLoading';
import FormControllerInput from '../../../components/form/FormControllerInput';
import { useGetEmailConfigQuery, usePutEmailConfigMutation } from '../../../features/provider/recurringUpload/apiSlice';
import { EmailConfigFormData } from '../../../models/RecurringUpload.models';
import { EMAIL_CONFIG_FORM_FIELDS } from '../../../utils/constants';

function EmailConfiguration() {
  const { data, isSuccess, isLoading } = useGetEmailConfigQuery({});
  const [putEmailConfig, { isLoading: isPuttingConfig }] = usePutEmailConfigMutation();

  const { control, handleSubmit, register, reset } = useForm<EmailConfigFormData>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  if (isSuccess) {
    return (
      <form onSubmit={handleSubmit(putEmailConfig)} style={{ width: 300 }}>
        {EMAIL_CONFIG_FORM_FIELDS.map(({ name, label, placeholder }) => (
          <FormControllerInput
            key={placeholder + label}
            name={name}
            control={control}
            label={label}
            placeholder={placeholder}
            register={register}
          />
        ))}
        <ButtonLoading type="submit" loading={isLoading || isPuttingConfig} />
      </form>
    );
  } else return <CircularProgress color="primary" />;
}

export default EmailConfiguration;
