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

import ButtonLoading from '../../../../components/form/ButtonLoading';
import FormControllerInput from '../../../../components/form/FormControllerInput';
import {
  useGetSftpConfigQuery,
  usePutSftpConfigMutation,
} from '../../../../features/provider/recurringUpload/apiSlice';
import { SftpFormData } from '../../../../models/RecurringUpload.models';
import { SFTP_FORM_FIELDS } from '../../../../utils/constants';

function SftpConfiguration() {
  const { data, isSuccess, isFetching } = useGetSftpConfigQuery({});
  const [putSftpConfig, { isLoading: isPuttingConfig }] = usePutSftpConfigMutation();

  const { control, handleSubmit, register, reset } = useForm<SftpFormData>();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  if (isSuccess) {
    return (
      <form onSubmit={handleSubmit(putSftpConfig)} style={{ width: 300 }}>
        {SFTP_FORM_FIELDS.map(({ name, label, placeholder }) => (
          <FormControllerInput
            key={placeholder + label}
            name={name}
            control={control}
            label={label}
            placeholder={placeholder}
            register={register}
          />
        ))}
        <ButtonLoading type="submit" loading={isFetching || isPuttingConfig} />
      </form>
    );
  } else return <CircularProgress color="primary" />;
}

export default SftpConfiguration;
