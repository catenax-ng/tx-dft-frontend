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

import BusinessIcon from '@mui/icons-material/Business';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HistoryIcon from '@mui/icons-material/History';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import UploadIcon from '@mui/icons-material/Upload';

export const icons = {
  CloudUploadIcon,
  UploadIcon,
  HistoryIcon,
  HelpOutlineIcon,
  ManageSearchIcon,
  HomeOutlinedIcon,
  FormatListBulletedIcon,
  BusinessIcon,
};

export interface IntMenuItem {
  text: string;
  to?: string;
  menuIcon?: keyof typeof icons;
  dataId?: string;
  isHeading?: boolean;
  permissions?: string[];
}

export interface IntMenu extends IntMenuItem {
  childrens?: IntMenuItem[];
}

// menu items
export const MenuItems: IntMenu[] = [
  {
    text: 'pages.home',
    menuIcon: 'HomeOutlinedIcon',
    to: '/',
    dataId: 'homePage',
    isHeading: false,
  },
  {
    text: 'pages.about',
    menuIcon: 'BusinessIcon',
    to: '/about',
    dataId: 'aboutPage',
    isHeading: false,
  },
  {
    text: 'pages.provider',
    isHeading: true,
    childrens: [
      {
        text: 'pages.manualUpload',
        menuIcon: 'UploadIcon',
        to: '/provider/manual-upload',
        dataId: 'manualUpload',
        permissions: ['provider_create_contract_offer'],
      },
      {
        text: 'pages.recurringUpload',
        menuIcon: 'CloudUploadIcon',
        to: '/provider/recurring-upload',
        dataId: 'recurringUpload',
        permissions: ['auto_config_management'],
      },
      {
        text: 'pages.uploadHistory',
        menuIcon: 'HistoryIcon',
        to: '/provider/upload-history',
        dataId: 'uploadHistoryMenu',
        permissions: ['provider_view_history'],
      },
      {
        text: 'pages.contracts',
        menuIcon: 'FormatListBulletedIcon',
        to: '/provider/contracts',
        dataId: 'pContracts',
        permissions: ['provider_view_contract_agreement'],
      },
      {
        text: 'pages.help',
        menuIcon: 'HelpOutlineIcon',
        to: '/provider/help',
        dataId: 'helpMenu',
      },
    ],
  },
  {
    text: 'pages.consumer',
    isHeading: true,
    childrens: [
      {
        text: 'pages.consumeData',
        menuIcon: 'ManageSearchIcon',
        to: '/consumer/consume-data',
        dataId: 'uploadFileMenu',
        permissions: [
          'consumer_search_connectors',
          'consumer_view_contract_offers',
          'consumer_establish_contract_agreement',
        ],
      },
      {
        text: 'pages.offerDownloadHistory',
        menuIcon: 'HistoryIcon',
        to: '/consumer/offers-download-history',
        dataId: 'offersDownloadHistoryMenu',
        permissions: ['consumer_view_download_history'],
      },
      {
        text: 'pages.contracts',
        menuIcon: 'FormatListBulletedIcon',
        to: '/consumer/contracts',
        dataId: 'uploadHistoryMenu',
        permissions: ['consumer_view_contract_agreement'],
      },
    ],
  },
];
