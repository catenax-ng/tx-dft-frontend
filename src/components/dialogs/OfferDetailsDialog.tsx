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

import { Divider, Grid } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogHeader, Typography } from 'cx-portal-shared-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Permissions from '../../components/Permissions';
import { IConsumerDataOffers } from '../../features/consumer/types';
import UsagePolicies from './UsagePolicies';

interface IntDialogProps {
  open: boolean;
  offerObj?: IConsumerDataOffers;
  handleConfirm?: (state: boolean) => void;
  handleClose?: (state: boolean) => void;
  isMultiple?: boolean;
}

const OfferDetailsDialog = ({ open, offerObj, handleConfirm, handleClose, isMultiple }: IntDialogProps) => {
  const [offer] = useState(offerObj);
  const { title, created, description, publisher, usagePolicies, fileContentType } = offer;
  const { t } = useTranslation();

  function splitWithFirstOcc(str: string) {
    const regX = /:(.*)/s;
    return str.split(regX);
  }

  return (
    <Dialog open={open}>
      <DialogHeader closeWithIcon onCloseWithIcon={() => handleClose(false)} title={t('dialog.offerDetails.title')} />
      {isMultiple ? (
        <>
          <DialogContent dividers sx={{ pt: 3 }}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1, display: 'block' }}>
                  {t('content.policies.usagePolicy')}
                </Typography>
              </Grid>
              <UsagePolicies usagePolicies={usagePolicies} />
            </Grid>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogContent dividers>
            <Grid container mt={3}>
              <Grid item xs={6} sx={{ mb: 1 }}>
                <Typography variant="body2">{t('dialog.offerDetails.titleText')}</Typography>
                <Typography variant="body2">
                  <strong>{title || '-'}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ mb: 1 }}>
                <Typography variant="body2">{t('dialog.offerDetails.created')}</Typography>
                <Typography variant="body2">
                  <strong>{created || '-'}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ mb: 1 }}>
                <Typography variant="body2">{t('dialog.offerDetails.dataFormat')}</Typography>
                <Typography variant="body2">
                  <strong>{fileContentType || '-'}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ mb: 1 }}>
                <Typography variant="body2">{t('dialog.offerDetails.description')}</Typography>
                <Typography variant="body2">
                  <strong>{description || '-'}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ mb: 1 }}>
                <Typography variant="body2">{t('dialog.offerDetails.publisher')}</Typography>
                <Typography variant="body2">
                  <strong>{splitWithFirstOcc(publisher)[0] || '-'}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ mb: 1 }}>
                <Typography variant="body2">{t('dialog.offerDetails.publisherUrl')}</Typography>
                <Typography variant="body2">
                  <strong>{splitWithFirstOcc(publisher)[1] || '-'}</strong>
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ m: 1 }} />
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1, display: 'block' }}>
                  {t('content.policies.usagePolicy')}
                </Typography>
              </Grid>
              <UsagePolicies usagePolicies={usagePolicies} />
            </Grid>
          </DialogContent>
        </>
      )}
      <DialogActions>
        <Button variant="contained" onClick={() => handleClose(false)}>
          {t('button.close')}
        </Button>
        <Permissions values={['consumer_subscribe_download_data_offers']}>
          <Button variant="contained" onClick={() => handleConfirm(true)}>
            {t('button.subscribeSelected')}
          </Button>
        </Permissions>
      </DialogActions>
    </Dialog>
  );
};

export default OfferDetailsDialog;
