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
import { IconButton, LoadingButton, Table, Tooltips, Typography } from '@catena-x/portal-shared-components';
import { Refresh } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Grid, LinearProgress } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { capitalize } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import UploadHistoryErrorDialog from '../components/dialogs/UploadHistoryErrorDialog';
import NoDataPlaceholder from '../components/NoDataPlaceholder';
import Permissions from '../components/Permissions';
import { Status } from '../enums';
import {
  useDeleteHistoryMutation,
  useDownloadCsvMutation,
  useGetHistoryQuery,
} from '../features/provider/history/apiSlice';
import { setCurrentProcessId, setErrorsList, setIsLoding } from '../features/provider/history/slice';
import { useAppDispatch } from '../features/store';
import { csvFileDownload } from '../helpers/FileDownloadHelper';
import { ProcessReport } from '../models/ProcessReport';
import ProviderService from '../services/ProviderService';
import { MAX_CONTRACTS_AGREEMENTS, STATUS_COLOR_MAPPING } from '../utils/constants';
import { formatDate } from '../utils/utils';

function UploadHistoryNew() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [showErrorLogsDialog, setShowErrorLogsDialog] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { data, isSuccess, isFetching, refetch } = useGetHistoryQuery({ pageSize: MAX_CONTRACTS_AGREEMENTS });
  const [deleteHistory] = useDeleteHistoryMutation();
  const handleErrorDialogClose = () => setShowErrorLogsDialog(false);
  const [downloadCsv] = useDownloadCsvMutation();

  async function download({ csvType, processId }: Partial<ProcessReport>) {
    await downloadCsv({ csvType, processId })
      .unwrap()
      .then(res => {
        const fileName = `${csvType}-${processId}`;
        csvFileDownload(res, fileName);
      })
      .catch(e => console.error(e));
  }

  const showUploadErrors = async (subModel: ProcessReport) => {
    setShowErrorLogsDialog(true);
    dispatch(setErrorsList([]));
    dispatch(setIsLoding(true));
    dispatch(setCurrentProcessId(subModel.processId));
    const resp = await ProviderService.getInstance().getUplodHistoryErrors(subModel.processId);
    dispatch(setErrorsList(resp.data));
    dispatch(setIsLoding(false));
  };

  const renderStatusCell = (row: ProcessReport) => {
    if (row.status === Status.completed && row.numberOfFailedItems > 0) {
      return (
        <Typography
          color={STATUS_COLOR_MAPPING.ERROR}
          variant="body2"
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => showUploadErrors(row)}
        >
          View errors
        </Typography>
      );
    } else {
      return (
        <Typography color={STATUS_COLOR_MAPPING[row.status]} variant="body2">
          {capitalize(row.status)}
        </Typography>
      );
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'processId',
      headerName: 'Process Id',
      minWidth: 200,
      flex: 1,
      renderCell: ({ row }) => (
        <>
          {row.referenceProcessId ? (
            <Tooltips
              tooltipPlacement="top-start"
              tooltipText={`${row.processId} (Deletion of ${row.referenceProcessId})`}
            >
              <span>
                {row.processId} (Deletion of <span style={{ color: 'red' }}>{row.referenceProcessId}</span>)
              </span>
            </Tooltips>
          ) : (
            <Tooltips tooltipPlacement="top-start" tooltipText={row.processId}>
              <span>{row.processId}</span>
            </Tooltips>
          )}
        </>
      ),
    },
    {
      field: 'csvType',
      headerName: 'CSV Type',
      minWidth: 100,
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top-start" tooltipText={row.csvType}>
          <span>{row.csvType}</span>
        </Tooltips>
      ),
    },
    {
      field: 'numberOfSucceededItems',
      headerName: 'Created',
      flex: 1,
    },
    {
      field: 'numberOfUpdatedItems',
      headerName: 'Updated',
      flex: 1,
    },
    {
      field: 'numberOfDeletedItems',
      headerName: 'Deleted',
      flex: 1,
    },
    {
      field: 'numberOfFailedItems',
      headerName: 'Failed',
      flex: 1,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      minWidth: 200,
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltips tooltipPlacement="top" tooltipText={formatDate(row.startDate)}>
          <span>{formatDate(row.startDate)}</span>
        </Tooltips>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      sortable: false,
      renderCell: ({ row }) => renderStatusCell(row),
    },
    {
      field: 'actions',
      headerName: '',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <>
            <Permissions values={['provider_delete_contract_offer']}>
              {row.numberOfDeletedItems === 0 && !row.referenceProcessId && (
                <Tooltips tooltipPlacement="bottom" tooltipText="Delete">
                  <span>
                    <IconButton aria-label="delete" size="small" onClick={() => deleteHistory(row)} sx={{ mr: 2 }}>
                      <DeleteIcon color="action" fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltips>
              )}
            </Permissions>
            <Permissions values={['provider_download_own_data']}>
              {row.numberOfDeletedItems === 0 && !row.referenceProcessId && (
                <Tooltips tooltipPlacement="bottom" tooltipText="Download">
                  <span>
                    <IconButton aria-label="download" size="small" onClick={() => download(row)}>
                      <DownloadIcon color="primary" fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltips>
              )}
            </Permissions>
          </>
        );
      },
    },
  ];

  if (isSuccess) {
    return (
      <>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <Typography variant="h3" mb={1}>
              {t('pages.uploadHistory')}
            </Typography>
            <Typography variant="body1">{t('content.uploadHistory.description')}</Typography>
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
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Table
            loading={isFetching}
            rowCount={data.totalItems}
            title={''}
            getRowId={row => row.processId}
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableRowSelectionOnClick
            columns={columns}
            rows={data.items}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            components={{
              LoadingOverlay: LinearProgress,
              NoRowsOverlay: () => NoDataPlaceholder('content.common.noData'),
              NoResultsOverlay: () => NoDataPlaceholder('content.common.noResults'),
            }}
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                textOverflow: 'clip',
                whiteSpace: 'break-spaces !important',
                maxHeight: 'none !important',
                lineHeight: 1.4,
              },
              '& .MuiBox-root': { display: 'none' },
            }}
          />
        </Box>
        <Box>
          <UploadHistoryErrorDialog open={showErrorLogsDialog} handleDialogClose={handleErrorDialogClose} />
        </Box>
      </>
    );
  } else return null;
}

export default UploadHistoryNew;
