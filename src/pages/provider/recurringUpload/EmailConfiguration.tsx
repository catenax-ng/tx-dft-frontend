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

import { Button } from 'cx-portal-shared-components';
import { useForm } from 'react-hook-form';

import FormControllerInput from '../../../components/form/FormControllerInput';
import { EmailConfigFormData } from '../../../models/RecurringUpload.models';
import { EMAIL_CONFIG_FORM_FIELDS } from '../../../utils/constants';

function EmailConfiguration() {
  const {
    control,
    handleSubmit,
    register,
  } = useForm<EmailConfigFormData>({
    defaultValues: {
      toEmail: '',
      ccEmail: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: 300 }}>
      {EMAIL_CONFIG_FORM_FIELDS.map(({ name, label, placeholder, type }) => (
        <FormControllerInput
          key={placeholder + label}
          name={name}
          control={control}
          label={label}
          placeholder={placeholder}
          register={register}
          type={type}
        />
      ))}
      <Button type="submit">submit</Button>
    </form>
  );
}

export default EmailConfiguration;
