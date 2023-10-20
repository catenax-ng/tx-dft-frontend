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
import { ErrorPage } from 'cx-portal-shared-components';
import { Outlet } from 'react-router-dom';

import customConfig from './assets/customConfig/custom-config.json';
import AppLayout from './components/layouts/AppLayout';
import { IUser } from './features/app/types';
import UserService from './services/UserService';

export default function Main({ loggedUser }: { loggedUser: IUser }) {
  document.title = customConfig.title;

  return (
    <>
      {UserService.hasValidResource() ? (
        <AppLayout loggedUser={loggedUser}>
          <Outlet />
        </AppLayout>
      ) : (
        <ErrorPage header="This webpage is not available." title="Sorry for this inconvenience." />
      )}
    </>
  );
}
