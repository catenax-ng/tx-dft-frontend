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

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, LinearProgress } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Button, IconButton, Table, Tooltips, Typography } from 'cx-portal-shared-components';
import { find } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import NoDataPlaceholder from '../components/NoDataPlaceholder';
import AddEditPolicy from '../components/policies/AddEditPolicy';
import { useDeletePolicyMutation, useGetPoliciesQuery } from '../features/provider/policies/apiSlice';
import { setPolicyData, setPolicyDialog, setPolicyDialogType } from '../features/provider/policies/slice';
import { useAppDispatch } from '../features/store';
import { DEFAULT_POLICY_DATA, MAX_CONTRACTS_AGREEMENTS } from '../utils/constants';

function Policies() {
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Get
  const { data, isSuccess, isFetching } = useGetPoliciesQuery({
    offset: 0,
    maxLimit: MAX_CONTRACTS_AGREEMENTS,
  });

  // Delete
  const [deletePolicy] = useDeletePolicyMutation();

  const columns: GridColDef[] = [
    {
      field: 'policy_name',
      headerName: 'Name',
      flex: 1,
      sortable: false,
    },
    {
      field: 'bpn_numbers',
      headerName: 'Access BPNs',
      flex: 1,
      sortable: false,
    },
    {
      field: 'durationUnit',
      headerName: 'Usage duration',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const duration = find(row?.usage_policies, { type: 'DURATION' });
        return duration?.value ? `${duration?.value} ${duration?.durationUnit}` : 'NA';
      },
    },
    {
      field: 'purpose',
      headerName: 'Usage purpose',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const purpose = find(row?.usage_policies, { type: 'PURPOSE' });
        return purpose?.value || 'NA';
      },
    },
    {
      field: 'actions',
      headerName: '',
      align: 'right',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <>
            <Tooltips tooltipPlacement="bottom" tooltipText="Edit">
              <span>
                <IconButton
                  aria-label="edit"
                  size="small"
                  sx={{ mr: 3 }}
                  onClick={() => {
                    dispatch(setPolicyDialogType('Edit'));
                    dispatch(setPolicyData(row));
                    dispatch(setPolicyDialog(true));
                  }}
                >
                  <EditIcon color="action" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>
            <Tooltips tooltipPlacement="bottom" tooltipText="Delete">
              <span>
                <IconButton aria-label="delete" size="small" onClick={() => deletePolicy(row.uuid)}>
                  <DeleteIcon color="action" fontSize="small" />
                </IconButton>
              </span>
            </Tooltips>
          </>
        );
      },
    },
  ];

  if (isSuccess) {
    return (
      <>
        <Grid container spacing={2} alignItems="center" mb={4}>
          <Grid item xs={9}>
            <Typography variant="h4">Policies List</Typography>
          </Grid>
          <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => {
                dispatch(setPolicyDialogType('Add'));
                dispatch(setPolicyData(DEFAULT_POLICY_DATA));
                dispatch(setPolicyDialog(true));
              }}
            >
              {t('content.policies.addPolicy')}
            </Button>
          </Grid>
        </Grid>
        <Table
          loading={isFetching}
          rowCount={data.totalItems}
          title={''}
          getRowId={row => row.uuid}
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          disableSelectionOnClick
          columns={columns}
          rows={data.items}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          page={page}
          onPageChange={setPage}
          rowsPerPageOptions={[10, 15, 20, 100]}
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              textOverflow: 'clip',
              whiteSpace: 'break-spaces !important',
              maxHeight: 'none !important',
              lineHeight: 1.4,
            },
            '& .MuiBox-root': { display: 'none' },
          }}
          components={{
            LoadingOverlay: LinearProgress,
            NoRowsOverlay: () => NoDataPlaceholder('content.common.noData'),
            NoResultsOverlay: () => NoDataPlaceholder('content.common.noResults'),
          }}
        />
        <AddEditPolicy />
      </>
    );
  } else return null;
}

export default Policies;
