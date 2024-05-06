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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Typography,
} from '@catena-x/portal-shared-components';
import { useTranslation } from 'react-i18next';

import { setPcfValueDialog } from '../../features/pcfExchange/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';

function ViewPCFData() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { pcfValueData, pcfValueDialog } = useAppSelector(state => state.pcfExchangeSlice);

  return (
    <Dialog open={pcfValueDialog}>
      <DialogHeader
        closeWithIcon
        onCloseWithIcon={() => dispatch(setPcfValueDialog(false))}
        title={t('content.pcfExchange.viewPCFModelTitle')}
      />
      <DialogContent>
        <Typography variant="body2">
          <b>{t('content.pcfExchange.viewPCFModelTitleDescription')}</b>
        </Typography>

        <pre>{JSON.stringify(pcfValueData.pcfData, null, 2)}</pre>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => dispatch(setPcfValueDialog(false))}>
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewPCFData;
