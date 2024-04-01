/********************************************************************************
 * Copyright (c) 2024 T-Systems International GmbH
 * Copyright (c) 2024 Contributors to the Eclipse Foundation
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

import { Box, FormControl } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogHeader, Input } from 'cx-portal-shared-components';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { setSnackbarMessage } from '../../features/notifiication/slice';
import { useRequestNonExistPcfDataMutation } from '../../features/pcfExchange/apiSlice';
import { handleReqestPcfDialog } from '../../features/pcfExchange/slice';
import { useValidateBpnMutation } from '../../features/provider/policies/apiSlice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import ValidateBpn from '../policies/ValidateBpn';
import PartnerCheckDialog from './PartnerCheckDialog';

type IRequestPcfFormData = {
  productId: string;
  inputBpn: string;
  bpnNumber: string;
  message: string;
};

function RequestPcfDialog() {
  const { t } = useTranslation();
  const { requestPcfDialog } = useAppSelector(state => state.pcfExchangeSlice);
  const dispatch = useAppDispatch();
  const [partnerCheckDialog, setPartnerCheckDialog] = useState(false);

  const formMethods = useForm<IRequestPcfFormData>({ defaultValues: { productId: '', bpnNumber: '', message: '' } });
  const { reset } = formMethods;

  useEffect(() => {
    reset();
  }, [reset, requestPcfDialog]);

  const [requestNonExistPcfData] = useRequestNonExistPcfDataMutation();
  const [validateBpn, { data }] = useValidateBpnMutation();

  const onSubmit = formMethods.handleSubmit(async (formData: IRequestPcfFormData) => {
    try {
      const res = await validateBpn(formData.bpnNumber).unwrap();
      if (res?.bpnStatus === 'FULL_PARTNER') {
        await requestNonExistPcfData(formData)
          .unwrap()
          .then(() => dispatch(handleReqestPcfDialog(false)));
      } else if (res?.bpnStatus === 'PARTNER') {
        setPartnerCheckDialog(true);
      } else if (res?.bpnStatus === 'NOT_PARTNER') {
        dispatch(setSnackbarMessage({ message: res?.msg, type: 'error' }));
      }
    } catch (error) {
      console.error('handleSubmit error:', error);
    }
  });

  const handlePartnerCheck = formMethods.handleSubmit(async (formData: IRequestPcfFormData) => {
    try {
      await requestNonExistPcfData(formData)
        .unwrap()
        .then(() => {
          setPartnerCheckDialog(false);
          dispatch(handleReqestPcfDialog(false));
        });
    } catch (error) {
      console.error('handlePartnerCheck error:', error);
    }
  });

  return (
    <div>
      <div>
        <Dialog
          open={requestPcfDialog}
          additionalModalRootStyles={{
            width: '50%',
          }}
        >
          <DialogHeader
            closeWithIcon
            onCloseWithIcon={() => dispatch(handleReqestPcfDialog(false))}
            title={t('button.newPcfRequest')}
          ></DialogHeader>
          <FormProvider {...formMethods}>
            <form>
              <DialogContent sx={{ textAlign: 'left', padding: '0px 50px' }}>
                <FormControl sx={{ width: 350, '& .MuiBox-root': { marginTop: 0 } }}>
                  <Controller
                    name="productId"
                    control={formMethods.control}
                    rules={{
                      required: true,
                      maxLength: 100,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        variant="filled"
                        label={'Product ID*'}
                        placeholder={'Enter a value'}
                        type={'text'}
                        error={!!error}
                      />
                    )}
                  />
                </FormControl>
                <ValidateBpn />
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name="message"
                    control={formMethods.control}
                    rules={{
                      required: true,
                      maxLength: 250,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        multiline
                        minRows={3}
                        label={'Message*'}
                        placeholder={'Enter your message'}
                        error={!!error}
                      />
                    )}
                  />
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: 1, mt: 4 }}>
                  <Button variant="contained" sx={{ ml: 2 }} onClick={() => dispatch(handleReqestPcfDialog(false))}>
                    {t('button.close')}
                  </Button>
                  <Button variant="contained" color="primary" type="submit" onClick={onSubmit}>
                    {t('button.submit')}
                  </Button>
                </Box>
              </DialogActions>
            </form>
          </FormProvider>
        </Dialog>
      </div>
      <PartnerCheckDialog
        partnerCheckDialog={partnerCheckDialog}
        setPartnerCheck={setPartnerCheckDialog}
        diaglogData={data}
        handlePartnerCheck={handlePartnerCheck}
      />
    </div>
  );
}

export default RequestPcfDialog;
