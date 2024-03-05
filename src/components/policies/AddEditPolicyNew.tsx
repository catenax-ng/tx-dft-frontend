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

import { Dialog, DialogContent, DialogHeader, Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import { uploadFileWithPolicy, uploadTableWithPolicy } from '../../features/provider/policies/actions';
import { useCreatePolicyMutation, useUpdatePolicyMutation } from '../../features/provider/policies/apiSlice';
import { setPolicyDialog } from '../../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import PolicyHub from '../../pages/PolicyHub';

function AddEditPolicyNew() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { policyDialog, policyDialogType } = useAppSelector(state => state.policySlice);
  const { rows } = useAppSelector(state => state.submodelSlice);

  const [createPolicy] = useCreatePolicyMutation();
  const [updatePolicy] = useUpdatePolicyMutation();

  // eslint-disable-next-line no-unused-vars
  const onSubmit = async (payload: any) => {
    console.log(payload);
    try {
      switch (policyDialogType) {
        case 'Add':
          await createPolicy({ ...payload });
          break;
        case 'Edit':
          await updatePolicy({ ...payload });
          break;
        case 'FileWithPolicy':
          await dispatch(uploadFileWithPolicy(payload));
          break;
        case 'TableWithPolicy':
          await dispatch(uploadTableWithPolicy({ ...payload, row_data: rows }));
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={policyDialog}>
      <DialogHeader
        closeWithIcon
        onCloseWithIcon={() => dispatch(setPolicyDialog(false))}
        title={t(policyDialogType === 'Edit' ? 'content.policies.editPolicy' : 'content.policies.addPolicy')}
      />
      <DialogContent>
        <Typography variant="body2">
          <b>{t('content.policies.description')}</b>
        </Typography>
        <ol style={{ padding: '0 0 0 16px' }}>
          {[1, 2, 3, 4].map(e => (
            <li key={e}>
              <Typography variant="body2">{t(`content.policies.description_${e}`)}</Typography>
            </li>
          ))}
        </ol>
        <PolicyHub onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}

export default AddEditPolicyNew;
