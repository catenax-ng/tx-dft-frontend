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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Typography,
} from '@catena-x/portal-shared-components';
import { Box } from '@mui/material';
import { GridColDef, GridSelectionModel, GridValidRowModel, GridValueGetterParams } from '@mui/x-data-grid';
import saveAs from 'file-saver';
import { isEmpty, isEqual, map, pick } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumeDataFilter from '../../components/ConsumeDataFilter';
import ConfirmTermsDialog from '../../components/dialogs/ConfirmTermsDialog';
import OfferDetailsDialog from '../../components/dialogs/OfferDetailsDialog';
import RequestPcfDialog from '../../components/dialogs/RequestPcfDialog';
import Permissions from '../../components/Permissions';
import DataTable from '../../components/table/DataTable';
import { useGetOfferPolicyDetailsMutation } from '../../features/consumer/apiSlice';
import {
  setContractOffers,
  setFilterCompanyOptions,
  setFilterConnectors,
  setFilterProviderUrl,
  setFilterSelectedBPN,
  setFilterSelectedConnector,
  setIsMultipleContractSubscription,
  setOpenOfferConfirmDialog,
  setOpenOfferDetailsDialog,
  setSelectedFilterCompanyOption,
  setSelectedOffer,
  setSelectedOffersList,
  setSelectionModel,
} from '../../features/consumer/slice';
import { IConsumerDataOffers } from '../../features/consumer/types';
import { setSnackbarMessage } from '../../features/notifiication/slice';
import { useRequestPcfValuesMutation } from '../../features/pcfExchange/apiSlice';
import { handleReqestPcfDialog } from '../../features/pcfExchange/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { handleBlankCellValues } from '../../helpers/ConsumerOfferHelper';
import ConsumerService from '../../services/ConsumerService';

export default function ConsumeData() {
  const {
    contractOffers,
    offersLoading,
    selectedOffer,
    selectedOffersList,
    isMultipleContractSubscription,
    selectionModel,
    isPcf,
    openOfferDetailsDialog,
  } = useAppSelector(state => state.consumerSlice);
  const [offerSubLoading, setOfferSubLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [requestPcfValues] = useRequestPcfValuesMutation();
  const [getPolicyDetails] = useGetOfferPolicyDetailsMutation();

  const columns: GridColDef[] = [
    {
      field: 'title',
      flex: 1,
      headerName: t('content.consumeData.columns.title'),
    },
    {
      field: 'publisher',
      flex: 1,
      headerName: t('content.consumeData.columns.publisher'),
    },
    {
      field: 'assetId',
      flex: 1,
      headerName: t('content.consumeData.columns.assetId'),
    },
    {
      field: 'sematicVersion',
      flex: 1,
      headerName: t('content.consumeData.columns.sematicVersion'),
    },
    {
      field: 'description',
      flex: 1,
      editable: false,
      headerName: t('content.consumeData.columns.description'),
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.description),
    },
  ];

  const toggleDialog = (flag: boolean) => {
    dispatch(setOpenOfferDetailsDialog(flag));
    if (flag === false) {
      dispatch(setSelectedOffer(null));
    }
  };

  const preparePayload = () => {
    const selectedList = isMultipleContractSubscription ? selectedOffersList : [selectedOffer];
    const offersList = selectedList.map(offer => ({
      connectorId: offer.connectorId,
      connectorOfferUrl: offer.connectorOfferUrl,
      offerId: offer.offerId || '',
      assetId: offer.assetId || '',
      policyId: offer.policyId || '',
    }));
    return {
      offers: offersList,
      usage_policies: selectedList[0].policy.Usage,
    };
  };

  const handleConfirmTermDialog = async () => {
    try {
      setOfferSubLoading(true);

      const handleSuccess = () => {
        dispatch(setOpenOfferDetailsDialog(false));
        dispatch(setOpenOfferConfirmDialog(false));
        dispatch(setIsMultipleContractSubscription(false));
        dispatch(setSelectedOffer(null));
        dispatch(setSelectedOffersList([]));
        dispatch(setSelectionModel([]));
      };

      if (isPcf) {
        await requestPcfValues({
          manufacturerPartId: selectedOffer?.manufacturerPartId,
          offers: preparePayload(),
        })
          .unwrap()
          .then(handleSuccess);
      } else {
        const response = await ConsumerService.getInstance().subscribeToOffers(preparePayload());

        if (response.status === 200) {
          saveAs(new Blob([response.data]), 'data-offer.zip');
          dispatch(setSnackbarMessage({ message: 'alerts.subscriptionSuccess', type: 'success' }));
          handleSuccess();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setOfferSubLoading(false);
    }
  };

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const showAddDialog = () => {
    setDialogOpen(prev => !prev);
  };

  const checkoutSelectedOffers = async (offers: IConsumerDataOffers[]) => {
    try {
      const extractedData = map(offers, item => pick(item, ['assetId', 'connectorOfferUrl']));
      const offerDetails = await getPolicyDetails(extractedData).unwrap();
      const mergeSelectedOffers: IConsumerDataOffers[] = offerDetails.map((policyOffer: IConsumerDataOffers) => ({
        ...policyOffer,
        ...offers.find((orgOffer: IConsumerDataOffers) => orgOffer.assetId === policyOffer.assetId),
      }));
      dispatch(setSelectedOffersList(mergeSelectedOffers));

      if (offerDetails.length === 1) {
        dispatch(setIsMultipleContractSubscription(false));
        dispatch(setSelectedOffer(mergeSelectedOffers[0]));
        toggleDialog(true);
        return;
      }

      const usagePolicies: IConsumerDataOffers[] = offerDetails.map((offer: IConsumerDataOffers) =>
        isEmpty(offer.policy.Usage) ? [] : offer.policy.Usage,
      );
      const isUsagePoliciesEqual = usagePolicies.every((item, _index, array) => isEqual(item, array[0]));
      if (isUsagePoliciesEqual) {
        dispatch(setOpenOfferDetailsDialog(true));
        dispatch(setIsMultipleContractSubscription(true));
      } else {
        dispatch(setOpenOfferDetailsDialog(false));
        showAddDialog();
        dispatch(setIsMultipleContractSubscription(false));
      }
    } catch (error) {
      console.log('getPolicyDetails', error);
    }
  };

  const onRowClick = (params: GridValidRowModel) => {
    checkoutSelectedOffers([params.row]);
  };

  const handleSelectionModel = (newSelectionModel: GridSelectionModel) => {
    const selectedIDs = new Set(newSelectionModel);
    const selectedRowData = contractOffers.filter((row: GridValidRowModel) => selectedIDs.has(row.id));
    dispatch(setSelectedOffersList(selectedRowData));
    dispatch(setSelectionModel(newSelectionModel));
  };

  const init = () => {
    dispatch(setContractOffers([]));
    dispatch(setSelectedOffer(null));
    dispatch(setSelectedOffersList([]));
    dispatch(setSelectionModel([]));
    dispatch(setSelectedFilterCompanyOption(null));
    dispatch(setFilterCompanyOptions([]));
    dispatch(setFilterProviderUrl(''));
    dispatch(setFilterSelectedBPN(''));
    dispatch(setFilterConnectors([]));
    dispatch(setFilterSelectedConnector(null));
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderOfferDialogs = (offerObj: IConsumerDataOffers, offerCount: number) => (
    <>
      <OfferDetailsDialog offerObj={offerObj} isMultiple={offerCount > 1} />
      <ConfirmTermsDialog
        offerObj={{
          offers: offerCount > 0 ? [offerObj] : [],
          provider: offerObj?.publisher || '',
          offerCount: offerCount,
        }}
        isProgress={offerSubLoading}
        handleConfirm={handleConfirmTermDialog}
      />
    </>
  );

  return (
    <>
      <Typography variant="h3" mb={1}>
        {t('pages.consumeData')}
      </Typography>
      <Typography variant="body1" mb={4} maxWidth={900}>
        {t('content.consumeData.description')}
      </Typography>
      <ConsumeDataFilter />
      <Box display="flex" justifyContent="flex-end" my={3}>
        <Button variant="contained" size="small" onClick={() => dispatch(handleReqestPcfDialog(true))} sx={{ mr: 2 }}>
          {t('button.newPcfRequest')}
        </Button>
        <Permissions values={['consumer_subscribe_download_data_offers']}>
          <Button
            variant="contained"
            size="small"
            onClick={() => checkoutSelectedOffers(selectedOffersList)}
            disabled={!selectedOffersList.length}
          >
            {t('button.subscribeSelected')}
          </Button>
        </Permissions>
      </Box>
      <Permissions values={['consumer_view_contract_offers']}>
        <Box sx={{ height: 'auto', overflow: 'auto', width: '100%' }}>
          <DataTable
            data={contractOffers}
            columns={columns}
            isFetching={offersLoading}
            checkboxSelection={true}
            onRowClick={onRowClick}
            handleSelectionModel={(newSelectionModel: GridSelectionModel) => handleSelectionModel(newSelectionModel)}
            selectionModel={selectionModel}
            isRowSelectable={(params: any) => params.row.type !== 'PCFExchangeEndpoint'}
          />
        </Box>
      </Permissions>

      {openOfferDetailsDialog && renderOfferDialogs(selectedOffersList[0], selectedOffersList.length)}

      <Dialog open={dialogOpen}>
        <DialogHeader title={t('dialog.samePolicies.title')} />
        <DialogContent>{t('dialog.samePolicies.content')}</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={showAddDialog}>
            {t('button.okay')}
          </Button>
        </DialogActions>
      </Dialog>
      <RequestPcfDialog />
    </>
  );
}
