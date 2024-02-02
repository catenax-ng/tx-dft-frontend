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
import ReplayIcon from '@mui/icons-material/Replay';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { Box, Grid } from '@mui/material';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import { IconButton, LoadingButton, Tooltips, Typography } from 'cx-portal-shared-components';
import { useTranslation } from 'react-i18next';

import Permissions from '../components/Permissions';
import {
  useActionOnPCFRequestMutation,
  useGetPcfExchangeQuery,
  useViewPCFDataMutation,
} from '../features/pcfExchange/apiSlice';
import { handleBlankCellValues } from '../helpers/ConsumerOfferHelper';
import {
  MAX_CONTRACTS_AGREEMENTS,
  PCF_CONSUMER_STATES,
  PCF_PUSH_FAILED_STATES,
  PCF_STATES,
  USER_TYPE_SWITCH,
} from '../utils/constants';
import { convertEpochToDate } from '../utils/utils';
import ViewPCFData from './dialogs/ViewPCFData';
import DataTable from './table/DataTable';

interface IPCFExchangeTable {
  type: string;
  title: string;
  subtitle: string;
}
function PCFExchangeTable({ type, title, subtitle }: Readonly<IPCFExchangeTable>) {
  const { t } = useTranslation();
  const pageType = `pages.${USER_TYPE_SWITCH[type]}`; // to avoid nested template literals

  const { data, isFetching, isSuccess, refetch } = useGetPcfExchangeQuery({
    type: type,
    params: {
      offset: 0,
      maxLimit: MAX_CONTRACTS_AGREEMENTS,
    },
  });

  const [pcfRequestAction] = useActionOnPCFRequestMutation({});

  const [viewPCFData] = useViewPCFDataMutation({});

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
        <Tooltips tooltipPlacement="top-start" tooltipArrow={false} tooltipText={handleBlankCellValues(row.bpnNumber)}>
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
          <Tooltips tooltipPlacement="top" tooltipText={convertEpochToDate(row?.requestedTime)}>
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
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top-start" tooltipArrow={false} tooltipText={handleBlankCellValues(row.status)}>
          <span>{handleBlankCellValues(row.status)}</span>
        </Tooltips>
      ),
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
          <Tooltips tooltipPlacement="top" tooltipText={convertEpochToDate(row?.lastUpdatedTime)}>
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
        const checkFailedState = PCF_PUSH_FAILED_STATES.some(e => e === row.status);
        if (checkState) {
          return (
            <>
              <Tooltips tooltipPlacement="bottom" tooltipText={t('button.approvePCFRequest')}>
                <span>
                  <IconButton
                    aria-label="approval"
                    size="small"
                    onClick={() =>
                      pcfRequestAction({
                        productId: row.productId,
                        requestId: row.requestId,
                        bpnNumber: row.bpnNumber,
                        status: 'APPROVED',
                      })
                    }
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
                    onClick={() =>
                      pcfRequestAction({
                        productId: row.productId,
                        requestId: row.requestId,
                        bpnNumber: row.bpnNumber,
                        status: 'REJECTED',
                      })
                    }
                    sx={{ mr: 2 }}
                  >
                    <CancelIcon color="action" fontSize="small" />
                  </IconButton>
                </span>
              </Tooltips>
            </>
          );
        } else if (checkFailedState) {
          return (
            <Tooltips tooltipPlacement="bottom" tooltipText={t('button.retryPCFRequest')}>
              <span>
                <IconButton
                  aria-label="retry"
                  size="small"
                  onClick={() =>
                    pcfRequestAction({
                      productId: row.productId,
                      requestId: row.requestId,
                      bpnNumber: row.bpnNumber,
                      status: row.status,
                    })
                  }
                  sx={{ mr: 2 }}
                >
                  <ReplayIcon color="primary" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>
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
            <Tooltips tooltipPlacement="bottom" tooltipText={t('button.viewPCFData')}>
              <span>
                <IconButton
                  aria-label="view"
                  size="small"
                  onClick={() =>
                    viewPCFData({
                      requestId: row.requestId,
                    })
                  }
                  sx={{ mr: 2 }}
                >
                  <ViewInArIcon color="action" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>
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
            <Typography variant="h3">{title}</Typography>
            <Typography variant="body1" mt={1}>
              {subtitle}
            </Typography>
          </Grid>
          <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
            <Permissions values={['view_pcf_history']}>
              <LoadingButton
                size="small"
                variant="contained"
                label={t('button.refresh')}
                onButtonClick={refetch}
                startIcon={<Refresh />}
                loadIndicator={t('content.common.loading')}
                loading={isFetching}
              />
            </Permissions>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ height: 'auto', overflow: 'auto', width: '100%' }}>
              <DataTable
                data={data?.pcfdatahistory}
                columns={type === 'provider' ? [...columns, ...actionCol] : [...columns, ...viewActionCol]}
                isFetching={isFetching}
              />
            </Box>
          </Grid>
        </Grid>
        <Box>
          <ViewPCFData />
        </Box>
      </>
    );
  } else return null;
}

export default PCFExchangeTable;
