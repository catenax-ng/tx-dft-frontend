/********************************************************************************
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
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

import { Backdrop, CircularProgress } from '@mui/material';
import { Typography } from 'cx-portal-shared-components';

import { useAppSelector } from '../features/store';

export default function PageLoading() {
  const { pageLoading } = useAppSelector(state => state.appSlice);
  // const isFetching = useAppSelector(state =>
  //   Object.values(state.api.queries).some(query => query.status === 'pending'),
  // );
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 2000, flexDirection: 'column' }} open={pageLoading}>
      <CircularProgress color="inherit" />
      <Typography mt={4}>Loading...</Typography>
    </Backdrop>
  );
}
