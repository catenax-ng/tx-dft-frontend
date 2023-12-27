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
import { Refresh } from '@mui/icons-material';
import ApprovalIcon from '@mui/icons-material/Approval';
import CancelIcon from '@mui/icons-material/Cancel';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { Box, Grid, LinearProgress } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridValidRowModel } from '@mui/x-data-grid';
import { IconButton, LoadingButton, Tooltips, Typography } from 'cx-portal-shared-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { setPageLoading } from '../features/app/slice';
import { useActionOnPCFRequestMutation, useGetPcfExchangeQuery } from '../features/pcfExchange/apiSlice';
import { useAppDispatch } from '../features/store';
import { handleBlankCellValues } from '../helpers/ConsumerOfferHelper';
import { MAX_CONTRACTS_AGREEMENTS, PCF_CONSUMER_STATES, PCF_STATES, USER_TYPE_SWITCH } from '../utils/constants';
import { convertEpochToDate } from '../utils/utils';
import NoDataPlaceholder from './NoDataPlaceholder';

interface IPCFExchangeTable {
  type: string;
  title: string;
}
function PCFExchangeTable({ type, title }: IPCFExchangeTable) {
  const [pageSize, setPageSize] = useState<number>(10);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const pageType = `pages.${USER_TYPE_SWITCH[type]}`; // to avoid nested template literals

  const { isLoading, data, isFetching, isSuccess, refetch } = useGetPcfExchangeQuery({
    type: type,
    params: {
      offset: 0,
      maxLimit: MAX_CONTRACTS_AGREEMENTS,
    },
  });

  const [approvePCFRequest, { isLoading: isApproval }] = useActionOnPCFRequestMutation({});

  const [rejectPCFRequest, { isLoading: isRejecting }] = useActionOnPCFRequestMutation({});

  const [viewPCFData ] = useActionOnPCFRequestMutation({});


  useEffect(() => {
    dispatch(setPageLoading(isLoading));
  }, [dispatch, isLoading, isApproval, isRejecting ]);

  const columns: GridColDef[] = [
    {
      field: 'productId',
      flex: 1,
      headerName: t('content.pcfExchangeTable.columns.productId'),
      valueGetter: ({ row }) => row?.assetId,
      valueFormatter: ({ value }) => value?.productId,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top-start" tooltipArrow={false} tooltipText={row?.productId}>
          <span>{handleBlankCellValues(row?.productId)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'requestId',
      flex: 1,
      headerName: t('content.pcfExchangeTable.columns.requestedId'),
      valueGetter: ({ row }) => row?.requestId,
      valueFormatter: ({ value }) => value?.requestId,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top-start" tooltipArrow={false} tooltipText={row?.requestId}>
          <span>{handleBlankCellValues(row?.requestId)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'bpnNumber',
      flex: 1,
      headerName: `${t(pageType)} ${t('content.pcfExchangeTable.columns.counterParty')}`,
      renderCell: ({ row }) => (
        <Tooltips
          tooltipPlacement="top-start"
          tooltipArrow={false}
          tooltipText={handleBlankCellValues(row.bpnNumber)}
        >
          <span>{handleBlankCellValues(row.bpnNumber)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'requestedTime',
      flex: 1,
      maxWidth: 200,
      headerName: t('content.pcfExchangeTable.columns.requestedDate'),
      sortingOrder: ['asc', 'desc'],
      sortComparator: (v1, v2, param1: GridValidRowModel, param2: GridValidRowModel) => param2.id - param1.id,
      valueGetter: ({ row }) => convertEpochToDate(row?.requestedTime),
      valueFormatter: ({ value }) => convertEpochToDate(value?.requestedTime),
      renderCell: ({ row }) =>
        row?.requestedTime ? (
          <Tooltips
            tooltipPlacement="top"
            tooltipText={convertEpochToDate(row?.requestedTime)}
          >
            <span>{convertEpochToDate(row?.requestedTime)}</span>
          </Tooltips>
        ) : (
          '-'
        ),
    },
    {
      field: 'status',
      maxWidth: 200,
      flex: 1,
      headerName: t('content.pcfExchangeTable.columns.status'),
      renderCell: ({ row }) => ( row?.status ),
    },
    {
      field: 'lastUpdatedTime',
      flex: 1,
      maxWidth: 200,
      headerName: t('content.pcfExchangeTable.columns.lastUpdatedTime'),
      sortingOrder: ['asc', 'desc'],
      sortComparator: (v1, v2, param1: GridValidRowModel, param2: GridValidRowModel) => param2.id - param1.id,
      valueGetter: ({ row }) => convertEpochToDate(row?.lastUpdatedTime),
      valueFormatter: ({ value }) => convertEpochToDate(value?.lastUpdatedTime),
      renderCell: ({ row }) =>
        row?.lastUpdatedTime ? (
          <Tooltips
            tooltipPlacement="top"
            tooltipText={convertEpochToDate(row?.lastUpdatedTime)}
          >
            <span>{convertEpochToDate(row?.lastUpdatedTime)}</span>
          </Tooltips>
        ) : (
          '-'
        ),
    },
  ];

  const actionCol: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      maxWidth: 120,
      sortable: false,
      disableExport: true,
      renderCell: ({ row }) => {
        const checkState = PCF_STATES.some(e => e === row.status);
        if (checkState) {
          return (
            <>
            <Tooltips tooltipPlacement="bottom" tooltipText={t('button.approvePCFRequest')}>
              <span>
                <IconButton
                  aria-label="approval"
                  size="small"
                  onClick={() => approvePCFRequest({ productId: row.productId, requestId: row.requestId, bpnNumber: row.bpnNumber, status: 'APPROVED' })}
                  sx={{ mr: 2 }}
                >
                  <ApprovalIcon color="action" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>

            <Tooltips tooltipPlacement="bottom" tooltipText={t('button.rejectPCFRequest')}>
            <span>
              <IconButton
                aria-label="reject"
                size="small"
                onClick={() => rejectPCFRequest({ productId: row.productId, requestId: row.requestId, bpnNumber: row.bpnNumber, status: 'REJECTED' })}
                sx={{ mr: 2 }}
              >
                <CancelIcon color="action" fontSize="small" />
              </IconButton>
            </span>
          </Tooltips>
          </>
          );
        }
      },
    },
  ];

  const viewActionCol: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      maxWidth: 120,
      sortable: false,
      disableExport: true,
      renderCell: ({ row }) => {
        const checkState = PCF_CONSUMER_STATES.some(e => e === row.status);
        if (checkState) {
          return (
            <>
            <Tooltips tooltipPlacement="bottom" tooltipText={t('button.viewPCFData')}>
              <span>
                <IconButton
                  aria-label="view"
                  size="small"
                  onClick={() => viewPCFData({ productId: row.productId, requestId: row.requestId, bpnNumber: row.bpnNumber, status: 'APPROVED' })}
                  sx={{ mr: 2 }}
                >
                  <ViewInArIcon color="action" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>
          </>
          );
        }
      },
    },
  ];

  if (isSuccess) {
    return (
      <>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <Typography variant="body1" mt={1}>
              {title}
            </Typography>
          </Grid>
          <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
            <LoadingButton
              size="small"
              variant="contained"
              label={t('button.refresh')}
              onButtonClick={refetch}
              startIcon={<Refresh />}
              loadIndicator={t('content.common.loading')}
              loading={isFetching}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ height: 'auto', overflow: 'auto', width: '100%' }}>
              <DataGrid
                autoHeight={true}
                getRowId={row => row.id}
                rows={data.contracts}
                columns={type === 'provider' ? [...columns, ...actionCol] : [...columns, ...viewActionCol]}
                loading={isFetching}
                pagination
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                components={{
                  Toolbar: GridToolbar,
                  LoadingOverlay: LinearProgress,
                  NoRowsOverlay: () => NoDataPlaceholder('content.common.noData'),
                  NoResultsOverlay: () => NoDataPlaceholder('content.common.noResults'),
                }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-columnHeaderTitle': {
                    textOverflow: 'clip',
                    whiteSpace: 'break-spaces !important',
                    maxHeight: 'none !important',
                    lineHeight: 1.4,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </>
    );
  } else return null;
}

export default PCFExchangeTable;

