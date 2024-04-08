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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  LoadingButton,
} from '@catena-x/portal-shared-components';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { setOpenOfferConfirmDialog } from '../../features/consumer/slice';
import { IConsumerDataOffers } from '../../features/consumer/types';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { splitWithFirstOcc } from '../../utils/utils';

interface IntConfirmOffer {
  offers?: IConsumerDataOffers[] | [];
  offerCount?: number;
  provider: string;
}
interface IntDialogProps {
  handleConfirm?: () => void;
  isProgress?: boolean;
  offerObj?: IntConfirmOffer;
}

const ConfirmTermsDialog: React.FC<IntDialogProps> = ({ handleConfirm, isProgress = false, offerObj }) => {
  const { openOfferConfirmDialog } = useAppSelector(state => state.consumerSlice);
  const [isAgreed, setIsAgreed] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <Dialog open={openOfferConfirmDialog}>
      <DialogHeader
        closeWithIcon
        onCloseWithIcon={() => dispatch(setOpenOfferConfirmDialog(false))}
        title={t('dialog.prompt.confirm')}
      />
      <DialogContent dividers sx={{ py: 3 }}>
        <>
          <Box sx={{ mb: 1 }}>
            {offerObj?.offerCount !== 0 && (
              <Box>
                <Trans i18nKey={'dialog.offerDetails.confirmTermsTitle'} count={offerObj.offerCount} />
              </Box>
            )}
            <Box>
              {t('dialog.offerDetails.cofirmTermsSubtitle')}
              {offerObj ? <b style={{ margin: '0 5px' }}>{splitWithFirstOcc(offerObj.provider)}</b> : '-.'}
            </Box>
            <Box>{t('dialog.offerDetails.confirmHeading')}</Box>
          </Box>
          <Box>(1) {t('dialog.offerDetails.point1')}</Box>
          <Box>(2) {t('dialog.offerDetails.point2')}</Box>
          <Box>(3) {t('dialog.offerDetails.point3')}</Box>
          <FormControlLabel
            control={<Checkbox checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} name="gilad" />}
            label={t('content.common.agree')}
          />
        </>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disabled={isProgress} onClick={() => dispatch(setOpenOfferConfirmDialog(false))}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          color="primary"
          variant="contained"
          disabled={isProgress || !isAgreed}
          label={t('button.confirm')}
          loadIndicator={t('content.common.loading')}
          onButtonClick={() => handleConfirm()}
          loading={isProgress}
          sx={{ ml: 3 }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmTermsDialog;
