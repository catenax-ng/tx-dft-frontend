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

import { FormControl, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

// Reusable input component
function FormControllerInput({ name, control, label, placeholder, register, type, required }: any) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { name: fieldName, ref, onChange, value }, fieldState: { error } }) => (
          <>
            <TextField
              {...register(fieldName, { required })}
              variant="filled"
              name={fieldName}
              inputRef={ref}
              label={label}
              error={!!error}
              placeholder={placeholder}
              onChange={onChange}
              type={type || 'text'}
              value={value}
            />
          </>
        )}
      />
    </FormControl>
  );
}

export default FormControllerInput;
