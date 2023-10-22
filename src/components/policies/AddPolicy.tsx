/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { Button, Dialog, DialogActions, DialogContent, DialogHeader, Typography } from 'cx-portal-shared-components';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { uploadFileWithPolicy, uploadTableWithPolicy } from '../../features/provider/policies/actions';
import { handleDialogClose } from '../../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import AccessPolicy from './AccessPolicy';
import UsagePolicy from './UsagePolicy';

export default function AddPolicy() {
  const {
    openDialog,
    accessType,
    bpnList,
    companyBpn,
    uploadData,
    uploadType,
    duration,
    durationValue,
    durationUnit,
    purpose,
    purposeValue,
    role,
    roleValue,
    custom,
    customValue,
  } = useAppSelector(state => state.accessUsagePolicySlice);
  const [showError, setshowError] = useState(false);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const durationCheck = duration === 'RESTRICTED' && durationValue === '';
    const purposeCheck = purpose === 'RESTRICTED' && isEmpty(purposeValue);
    const roleCheck = role === 'RESTRICTED' && roleValue === '';
    const customCheck = custom === 'RESTRICTED' && customValue === '';
    setshowError(() => durationCheck || purposeCheck || roleCheck || customCheck);
    return () => {};
  }, [duration, durationValue, purpose, purposeValue, role, roleValue, custom, customValue]);

  const payload = {
    bpn_numbers: accessType === 'restricted' ? [companyBpn, ...bpnList] : [],
    type_of_access: accessType,
    row_data: uploadData,
    usage_policies: {
      DURATION: {
        typeOfAccess: duration,
        value: durationValue,
        durationUnit: durationUnit.value,
      },
      ROLE: {
        typeOfAccess: role,
        value: roleValue,
      },
      PURPOSE: {
        typeOfAccess: purpose,
        value: purposeValue.value,
      },
      CUSTOM: {
        typeOfAccess: custom,
        value: customValue,
      },
    },
  };

  async function handleSubmitData() {
    switch (uploadType) {
      case 'file':
        await dispatch(uploadFileWithPolicy(payload));
        break;
      case 'json':
        await dispatch(uploadTableWithPolicy(payload));
        break;
      default:
        break;
    }
  }

  return (
    <Dialog open={openDialog}>
      <DialogHeader
        closeWithIcon
        onCloseWithIcon={() => dispatch(handleDialogClose())}
        title={t(uploadType === 'createPolicy' ? 'content.policies.addPolicy' : 'content.policies.title')}
      />
      <DialogContent>
        <Typography variant="body2">
          <b>{t('content.policies.description')}</b>
        </Typography>
        <ol style={{ padding: '0 0 16px 16px' }}>
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
        <AccessPolicy />
        <UsagePolicy />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => dispatch(handleDialogClose())}>
          {t('button.close')}
        </Button>
        <Button variant="contained" onClick={handleSubmitData} disabled={showError}>
          {t('button.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
