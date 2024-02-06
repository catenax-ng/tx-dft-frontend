/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2021,2022,2023,2024 T-Systems International GmbH
 * Copyright (c) 2022,2023,2024 Contributors to the Eclipse Foundation
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

import { LinearProgress } from '@mui/material';
import { GridColDef, GridEventListener, GridSelectionModel, GridValidRowModel } from '@mui/x-data-grid';
import { Table } from 'cx-portal-shared-components';
import { useState } from 'react';

import NoDataPlaceholder from '../NoDataPlaceholder';

interface IDataTable {
  data: GridValidRowModel[];
  columns: GridColDef[];
  isFetching?: boolean;
  checkboxSelection?: boolean;
  onRowClick?: GridEventListener<'rowClick'>;
  handleSelectionModel?: (selectionModel: GridSelectionModel) => void;
  selectionModel?: GridSelectionModel;
  isRowSelectable?: (params: any) => boolean;
}

function DataTable({
  data,
  columns,
  isFetching = false,
  checkboxSelection = false,
  handleSelectionModel,
  onRowClick,
  selectionModel,
  isRowSelectable,
}: Readonly<IDataTable>) {
  const [pageSize, setPageSize] = useState<number>(10);
  return (
    <Table
      title={''}
      autoHeight={true}
      getRowId={row => row.id}
      rows={data}
      onRowClick={onRowClick}
      isRowSelectable={isRowSelectable}
      checkboxSelection={checkboxSelection}
      columns={columns}
      loading={isFetching}
      pagination
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      rowsPerPageOptions={[10, 25, 50, 100]}
      components={{
        LoadingOverlay: LinearProgress,
        NoRowsOverlay: () => NoDataPlaceholder('content.common.noData'),
        NoResultsOverlay: () => NoDataPlaceholder('content.common.noResults'),
      }}
      selectionModel={selectionModel}
      onSelectionModelChange={newSelectionModel => handleSelectionModel(newSelectionModel)}
      disableColumnMenu
      disableColumnSelector
      disableDensitySelector
      disableSelectionOnClick
      disableColumnFilter
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          textOverflow: 'clip',
          whiteSpace: 'break-spaces !important',
          maxHeight: 'none !important',
          lineHeight: 1.4,
        },
        '& .MuiDataGrid-columnHeaderCheckbox': {
          height: 'auto !important',
        },
      }}
    />
  );
}

export default DataTable;
