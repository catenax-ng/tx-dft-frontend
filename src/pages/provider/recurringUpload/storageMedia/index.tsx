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

import { Box } from '@mui/material';
import { Tab, TabPanel, Tabs, Typography } from 'cx-portal-shared-components';
import { ReactElement, SyntheticEvent, useState } from 'react';

import { useGetStorageMediaQuery } from '../../../../features/provider/recurringUpload/apiSlice';
import MinioConfiguration from './MinioConfiguration';
import SftpConfiguration from './SftpConfiguration';

interface IStorageMediaTabs {
  label: string;
  value: string;
  component: ReactElement;
}

const STORAGE_MEDIA_TABS: IStorageMediaTabs[] = [
  { label: 'Minio', value: 'minio', component: <MinioConfiguration /> },
  { label: 'SFTP', value: 'sftp', component: <SftpConfiguration /> },
];

function StorageMediaTab() {
  const { data, isSuccess } = useGetStorageMediaQuery({});

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <>
      <Typography mb={3} variant="body1">
        Current active storage media: <b> {isSuccess ? data.active : 'NA'} </b>
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleChange} aria-label="storage media tabs" sx={{ pt: 0 }}>
          {STORAGE_MEDIA_TABS.map(e => (
            <Tab key={e.label} label={e.label} />
          ))}
        </Tabs>
      </Box>
      <Box>
        {STORAGE_MEDIA_TABS.map((e, i) => (
          <TabPanel key={e.label} value={activeTab} index={i}>
            {e.component}
          </TabPanel>
        ))}
      </Box>
    </>
  );
}
export default StorageMediaTab;
