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
import { SelectList } from 'cx-portal-shared-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchSubmodelList } from '../features/provider/submodels/actions';
import { useAppDispatch, useAppSelector } from '../features/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectSubmodel = ({ defaultValue, onChange, disableClearable }: any) => {
  const { submodelList } = useAppSelector(state => state.submodelSlice);
  const { selectedUseCases } = useAppSelector(state => state.appSlice);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchSubmodelList(selectedUseCases));
  }, [dispatch, selectedUseCases]);

  return (
    <SelectList
      keyTitle="title"
      label={t('content.provider.selectSubmodel')}
      defaultValue={defaultValue}
      onChangeItem={e => onChange(e)}
      items={submodelList}
      placeholder={t('content.provider.selectSubmodel')}
      disableClearable={disableClearable}
    />
  );
};

export default SelectSubmodel;
