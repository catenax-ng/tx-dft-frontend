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
import { Box } from '@mui/material';
import { GridColDef, GridSelectionModel, GridValidRowModel, GridValueGetterParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogHeader, Typography } from 'cx-portal-shared-components';
import saveAs from 'file-saver';
import { isEmpty, isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumeDataFilter from '../../components/ConsumeDataFilter';
import ConfirmTermsDialog from '../../components/dialogs/ConfirmTermsDialog';
import OfferDetailsDialog from '../../components/dialogs/OfferDetailsDialog';
import Permissions from '../../components/Permissions';
import DataTable from '../../components/table/DataTable';
import {
  setContractOffers,
  setFilterCompanyOptions,
  setFilterConnectors,
  setFilterProviderUrl,
  setFilterSelectedBPN,
  setFilterSelectedConnector,
  setIsMultipleContractSubscription,
  setSelectedFilterCompanyOption,
  setSelectedOffer,
  setSelectedOffersList,
  setSelectionModel,
} from '../../features/consumer/slice';
import { IConsumerDataOffers } from '../../features/consumer/types';
import { setSnackbarMessage } from '../../features/notifiication/slice';
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
  } = useAppSelector(state => state.consumerSlice);
  const [isOpenOfferDialog, setIsOpenOfferDialog] = useState<boolean>(false);
  const [isOpenOfferConfirmDialog, setIsOpenOfferConfirmDialog] = useState<boolean>(false);
  const [offerSubLoading, setOfferSubLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'title',
      flex: 1,
      headerName: t('content.consumeData.columns.title'),
    },
    {
      field: 'connectorId',
      flex: 1,
      headerName: 'BPN',
    },
    {
      field: 'assetId',
      flex: 1,
      headerName: t('content.consumeData.columns.assetId'),
    },
    {
      field: 'created',
      flex: 1,
      headerName: t('content.consumeData.columns.created'),
      sortingOrder: ['desc', 'asc'],
      sortComparator: (_v1: any, _v2: any, param1: any, param2: any) => param1.id - param2.id,
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.created),
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
    setIsOpenOfferDialog(flag);
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
      usage_policies: selectedList[0].policy.usage_policies,
    };
  };

  const handleConfirmTermDialog = async () => {
    setOfferSubLoading(true);
    await ConsumerService.getInstance()
      .subscribeToOffers(preparePayload())
      .then(response => {
        if (response.status == 200) {
          saveAs(new Blob([response.data]), 'data-offer.zip');
          dispatch(
            setSnackbarMessage({
              message: 'alerts.subscriptionSuccess',
              type: 'success',
            }),
          );
          setIsOpenOfferDialog(false);
          setIsOpenOfferConfirmDialog(false);
          dispatch(setIsMultipleContractSubscription(false));
          dispatch(setSelectedOffer(null));
          dispatch(setSelectedOffersList([]));
          dispatch(setSelectionModel([]));
        }
      })
      .catch(error => console.log('err', error))
      .finally(() => setOfferSubLoading(false));
  };

  const onRowClick = (params: any) => {
    dispatch(setSelectedOffer(params.row));
    toggleDialog(true);
  };

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const showAddDialog = () => {
    setDialogOpen(prev => !prev);
  };

  const checkoutSelectedOffers = () => {
    if (selectedOffersList.length === 1) {
      dispatch(setIsMultipleContractSubscription(false));
      dispatch(setSelectedOffer(selectedOffersList[0]));
      toggleDialog(true);
      return;
    }
    const useCasesList: any[] = [];
    selectedOffersList.forEach((offer: IConsumerDataOffers) => {
      if (!isEmpty(offer.policy.usage_policies)) {
        useCasesList.push(offer.policy.usage_policies);
      } else {
        useCasesList.push([]);
      }
    });
    const isUsagePoliciesEqual = useCasesList.every((item, index, array) => isEqual(item, array[0]));
    if (isUsagePoliciesEqual) {
      setIsOpenOfferDialog(true);
      dispatch(setIsMultipleContractSubscription(true));
    } else {
      showAddDialog();
      setIsOpenOfferDialog(false);
      dispatch(setIsMultipleContractSubscription(false));
    }
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
        <Permissions values={['consumer_subscribe_download_data_offers']}>
          <Button
            variant="contained"
            size="small"
            onClick={checkoutSelectedOffers}
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
            handleSelectionModel={newSelectionModel => handleSelectionModel(newSelectionModel)}
            selectionModel={selectionModel}
          />
        </Box>
      </Permissions>
      {isMultipleContractSubscription && (
        <>
          <OfferDetailsDialog
            open={isOpenOfferDialog}
            offerObj={selectedOffersList[0]}
            handleConfirm={setIsOpenOfferConfirmDialog}
            handleClose={toggleDialog}
            isMultiple
          />
          <ConfirmTermsDialog
            offerObj={{
              offers: selectedOffersList || [],
              provider: selectedOffersList[0]?.publisher ? selectedOffersList[0].publisher : ' ',
              offerCount: selectedOffersList.length,
            }}
            isProgress={offerSubLoading}
            open={isOpenOfferConfirmDialog}
            handleConfirm={handleConfirmTermDialog}
            handleClose={setIsOpenOfferConfirmDialog}
          />
        </>
      )}
      {selectedOffer && (
        <>
          <OfferDetailsDialog
            open={isOpenOfferDialog}
            offerObj={selectedOffer}
            handleConfirm={setIsOpenOfferConfirmDialog}
            handleClose={toggleDialog}
          />
          <ConfirmTermsDialog
            offerObj={{
              offers: selectedOffer ? [selectedOffer] : [],
              provider: selectedOffer ? selectedOffer.publisher : ' ',
              offerCount: 0,
            }}
            isProgress={offerSubLoading}
            open={isOpenOfferConfirmDialog}
            handleConfirm={handleConfirmTermDialog}
            handleClose={setIsOpenOfferConfirmDialog}
          />
        </>
      )}
      <Dialog open={dialogOpen}>
        <DialogHeader title={t('dialog.samePolicies.title')} />
        <DialogContent>{t('dialog.samePolicies.content')}</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={showAddDialog}>
            {t('button.okay')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
