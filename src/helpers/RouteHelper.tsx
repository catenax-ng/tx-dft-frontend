/********************************************************************************
 * Copyright (c) 2021,2022,2023 T-Systems International GmbH
 * Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
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
import { lazy, ReactElement } from 'react';

import AddEditPolicy from '../components/policies/AddEditPolicy';

// General Pages
const Help = lazy(() => import('../pages/Help'));
const Home = lazy(() => import('../pages/Home'));
const Logout = lazy(() => import('../pages/Logout'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));
const About = lazy(() => import('../pages/About'));

// Provider Pages
const ConsumeData = lazy(() => import('../pages/consumer/ConsumeData'));
const RecurringUpload = lazy(() => import('../pages/provider/recurringUpload'));
const ProviderContracts = lazy(() => import('../pages/ProviderContracts'));
const UploadHistoryNew = lazy(() => import('../pages/UploadHistoryNew'));
const Policies = lazy(() => import('../pages/Policies'));

// Consumer Pages
const ConsumerContracts = lazy(() => import('../pages/consumer/ConsumerContracts'));
const CreateData = lazy(() => import('../pages/CreateData'));
const OffersDownloadHistory = lazy(() => import('../pages/consumer/OffersDownloadHistory'));

export interface IRoutes {
  key?: string;
  path: string;
  element: ReactElement;
  permissions?: string[];
}
export const ROUTES: IRoutes[] = [
  // Common routes
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/policy',
    element: <AddEditPolicy />,
  },
  // Provider routes
  {
    path: '/provider/manual-upload',
    element: <CreateData />,
    permissions: ['provider_create_contract_offer'],
  },
  {
    path: '/provider/recurring-upload',
    element: <RecurringUpload />,
    permissions: ['auto_config_management'],
  },
  {
    path: '/provider/policies',
    element: <Policies />,
    permissions: ['policy_management'],
  },
  {
    path: 'provider/upload-history',
    element: <UploadHistoryNew />,
    permissions: ['provider_view_history'],
  },
  {
    path: '/provider/contracts',
    element: <ProviderContracts />,
    permissions: ['provider_view_contract_agreement'],
  },
  {
    path: '/provider/help',
    element: <Help />,
  },
  // Consumer routes
  {
    path: '/consumer/consume-data',
    element: <ConsumeData />,
    permissions: [
      'consumer_search_connectors',
      'consumer_view_contract_offers',
      'consumer_establish_contract_agreement',
    ],
  },
  {
    path: '/consumer/contracts',
    element: <ConsumerContracts />,
    permissions: ['consumer_view_contract_agreement'],
  },
  {
    path: '/consumer/offers-download-history',
    element: <OffersDownloadHistory />,
    permissions: ['consumer_view_download_history'],
  },
];
