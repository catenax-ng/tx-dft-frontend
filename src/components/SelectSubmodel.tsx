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
import { SelectList } from '@catena-x/portal-shared-components';
import { useTranslation } from 'react-i18next';

import { useGetSubmodelsListQuery } from '../features/provider/submodels/apiSlice';
import { useAppSelector } from '../features/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectSubmodel = ({ defaultValue, onChange, disableClearable }: any) => {
  const { selectedUseCases } = useAppSelector(state => state.appSlice);
  const { t } = useTranslation();

  const { data, isSuccess } = useGetSubmodelsListQuery({ usecases: selectedUseCases });

  if (isSuccess) {
    return (
      <SelectList
        keyTitle="name"
        label={t('content.provider.selectSubmodel')}
        defaultValue={defaultValue}
        onChangeItem={e => onChange(e)}
        items={data}
        placeholder={t('content.provider.selectSubmodel')}
        disableClearable={disableClearable}
      />
    );
  } else return null;
};

export default SelectSubmodel;
