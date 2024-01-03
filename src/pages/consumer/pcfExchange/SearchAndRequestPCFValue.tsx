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
import { Box, Grid, LinearProgress } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
  GridToolbar,
  GridValidRowModel,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Input,
  LoadingButton,
} from 'cx-portal-shared-components';
import { isEmpty, isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmTermsDialog from '../../../components/dialogs/ConfirmTermsDialog';
import OfferDetailsDialog from '../../../components/dialogs/OfferDetailsDialog';
import NoDataPlaceholder from '../../../components/NoDataPlaceholder';
import Permissions from '../../../components/Permissions';
import {
  setBpnNumberValue,
  setContractOffers,
  setIsMultipleContractSubscription,
  setManufacturerPartIdValue,
  setOffersLoading,
  setSelectedOffer,
  setSelectedOffersList,
} from '../../../features/consumer/slice';
import { IConsumerDataOffers } from '../../../features/consumer/types';
import { setSnackbarMessage } from '../../../features/notifiication/slice';
import { useAppDispatch, useAppSelector } from '../../../features/store';
import { handleBlankCellValues } from '../../../helpers/ConsumerOfferHelper';
import ConsumerService from '../../../services/ConsumerService';
import { ALPHA_NUM_REGEX } from '../../../utils/constants';

export default function SearchRequestPCFValue() {
  const {
    contractOffers,
    offersLoading,
    selectedOffer,
    selectedOffersList,
    isMultipleContractSubscription,
    bpnNumber,
    manufacturerPartId,
  } = useAppSelector(state => state.consumerSlice);
  const [isOpenOfferDialog, setIsOpenOfferDialog] = useState<boolean>(false);
  const [isOpenOfferConfirmDialog, setIsOpenOfferConfirmDialog] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

  const [offerSubLoading, setOfferSubLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'title',
      flex: 1,
      headerName: t('content.pcfExchange.columns.title'),
    },
    {
      field: 'assetId',
      flex: 1,
      headerName: t('content.pcfExchange.columns.assetId'),
    },
    {
      field: 'created',
      flex: 1,
      headerName: t('content.pcfExchange.columns.created'),
      sortingOrder: ['desc', 'asc'],
      sortComparator: (_v1: any, _v2: any, param1: any, param2: any) => param1.id - param2.id,
      valueGetter: (params: GridValueGetterParams) => handleBlankCellValues(params.row.created),
    },
    {
      field: 'publisher',
      flex: 1,
      headerName: t('content.pcfExchange.columns.publisher'),
    },
    {
      field: 'description',
      flex: 1,
      editable: false,
      headerName: t('content.pcfExchange.columns.description'),
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
    let payload;
    const offersList: unknown[] = [];
    // multiselect or single selected
    if (isMultipleContractSubscription) {
      selectedOffersList.forEach((offer: IConsumerDataOffers) => {
        offersList.push({
          offerId: offer.offerId || '',
          assetId: offer.assetId || '',
          policyId: offer.policyId || '',
        });
      });
      payload = {
        connectorId: selectedOffersList[0].connectorId,
        providerUrl: selectedOffersList[0].connectorOfferUrl,
        offers: offersList,
        policies: selectedOffersList[0].usagePolicies,
      };
    } else {
      const { usagePolicies, offerId, assetId, policyId, connectorId, connectorOfferUrl } = selectedOffer;
      offersList.push({
        offerId: offerId || '',
        assetId: assetId || '',
        policyId: policyId || '',
      });
      payload = {
        connectorId: connectorId,
        providerUrl: connectorOfferUrl,
        offers: offersList,
        policies: usagePolicies,
      };
    }
    return payload;
  };

  const handleConfirmTermDialog = async () => {
    setOfferSubLoading(true);
    await ConsumerService.getInstance()
      .requestForPCFValue(manufacturerPartId, preparePayload())
      .then(response => {
        if (response.status == 200) {
          setIsOpenOfferDialog(false);
          setIsOpenOfferConfirmDialog(false);
          dispatch(setIsMultipleContractSubscription(false));
          dispatch(setSelectedOffer(null));
          dispatch(setSelectedOffersList([]));
          setSelectionModel([]);
          dispatch(
            setSnackbarMessage({
              message: response.data.msg,
              type: 'error',
            }),
          );
        }
      })
      .catch(error => console.log('err', error))
      .finally(() => setOfferSubLoading(false));
  };

  const onRowClick = (params: any) => {
    dispatch(setSelectedOffer(params.row));
    toggleDialog(true);
  };

  const searchPCFDataOffers = async () => {
    try {
      dispatch(setOffersLoading(true));
      const response = await ConsumerService.getInstance()
        .searchPCFDataOffers({
          manufacturerPartId: manufacturerPartId,
          bpnNumber: bpnNumber,
        })
        .then(res => {
          dispatch(
            setSnackbarMessage({
              message: res.msg,
              type: 'success',
            }),
          );
          return res;
        });
      dispatch(setContractOffers(response));
      dispatch(setOffersLoading(false));
    } catch (error) {
      dispatch(setContractOffers([]));
      dispatch(setOffersLoading(false));
    }
  };

  // enter key fetch data
  const handleKeypress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', 'NumpadEnter'].includes(e.key)) {
      await searchPCFDataOffers();
    }
  };
  const [dialogOpen, setdialogOpen] = useState<boolean>(false);
  const showAddDialog = () => {
    setdialogOpen(prev => !prev);
  };

  const requestPCFValue = () => {
    if (selectedOffersList.length === 1) {
      dispatch(setSelectedOffer(selectedOffersList[0]));
      toggleDialog(true);
      return;
    }
    const useCasesList: any[] = [];
    selectedOffersList.forEach((offer: IConsumerDataOffers) => {
      if (!isEmpty(offer.usagePolicies)) {
        useCasesList.push(offer.usagePolicies);
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
    setSelectionModel(newSelectionModel);
  };

  const init = () => {
    dispatch(setContractOffers([]));
    dispatch(setSelectedOffer(null));
    dispatch(setManufacturerPartIdValue(null));
    dispatch(setBpnNumberValue(null));
    dispatch(setSelectedOffersList([]));
    setSelectionModel([]);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="end">
        <Grid item xs={4}>
          <Input
            value={manufacturerPartId || ''}
            type="text"
            onChange={(e: { target: { value: string } }) => dispatch(setManufacturerPartIdValue(e.target.value))}
            onKeyDown={handleKeypress}
            fullWidth
            size="small"
            label={t('content.pcfExchange.manufacturerPartId')}
            placeholder={t('content.pcfExchange.manufacturerPartId')}
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            value={bpnNumber || ''}
            type="text"
            inputProps={{ maxLength: 16 }}
            onChange={e => {
              const value = e.target.value;
              if (value === '' || ALPHA_NUM_REGEX.test(value)) {
                dispatch(setBpnNumberValue(e.target.value));
              }
            }}
            onKeyDown={handleKeypress}
            fullWidth
            size="small"
            label={t('content.pcfExchange.bpnNumber')}
            placeholder={t('content.pcfExchange.bpnNumber')}
          />
        </Grid>
        <Grid item>
          <Permissions values={['search_pcf']}>
            <LoadingButton
              color="primary"
              variant="contained"
              disabled={isEmpty(manufacturerPartId)}
              label={t('button.search')}
              loadIndicator={t('content.common.loading')}
              onButtonClick={searchPCFDataOffers}
              loading={offersLoading}
              sx={{ ml: 3 }}
            />
          </Permissions>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" my={3}>
        <Permissions values={['request_for_pcf_value']}>
          <Button variant="contained" size="small" onClick={requestPCFValue} disabled={!selectedOffersList.length}>
            {t('button.requestPCF')}
          </Button>
        </Permissions>
      </Box>
      <Box sx={{ height: 'auto', overflow: 'auto', width: '100%' }}>
        <DataGrid
          autoHeight={true}
          getRowId={row => row.id}
          rows={contractOffers}
          onRowClick={onRowClick}
          columns={columns}
          loading={offersLoading}
          checkboxSelection
          pagination
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onSelectionModelChange={newSelectionModel => handleSelectionModel(newSelectionModel)}
          selectionModel={selectionModel}
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: LinearProgress,
            NoRowsOverlay: () => NoDataPlaceholder('content.common.noData'),
            NoResultsOverlay: () => NoDataPlaceholder('content.common.noResults'),
          }}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              textOverflow: 'clip',
              whiteSpace: 'break-spaces',
              lineHeight: 1.5,
              textAlign: 'center',
            },
            '& .MuiDataGrid-columnHeaderCheckbox': {
              height: 'auto !important',
            },
          }}
        />
      </Box>

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
