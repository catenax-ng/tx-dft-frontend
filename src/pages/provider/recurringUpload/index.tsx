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
import { Tab, TabPanel, Tabs } from 'cx-portal-shared-components';
import { ReactElement, SyntheticEvent, useState } from 'react';

import PageHeading from '../../../components/PageHeading';
import { useTriggerUploadMutation } from '../../../features/provider/recurringUpload/apiSlice';
import Policies from '../../Policies';
import EmailConfiguration from './EmailConfiguration';
import Schedules from './Schedules';
import SftpConfiguration from './SftpConfiguration';
import UploadSettings from './UploadSettings';

interface IUploadTabs {
  label: string;
  component: ReactElement;
}

const RECURRING_UPLOAD_TABS: IUploadTabs[] = [
  { label: 'Policies', component: <Policies /> },
  { label: 'Schedules', component: <Schedules /> },
  { label: 'SFTP Configuration', component: <SftpConfiguration /> },
  { label: 'Email Configuration', component: <EmailConfiguration /> },
  { label: 'Settings', component: <UploadSettings /> },
];

function RecurringUpload() {
  const [activeTab, setActiveTab] = useState(0);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const [trigger, { isLoading }] = useTriggerUploadMutation();

  return (
    <>
      <PageHeading
        title="pages.recurringUpload"
        description="content.recurringUpload.description"
        showButton={true}
        buttonText="Trigger Now"
        refetch={trigger}
        isFetching={isLoading}
      />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleChange} aria-label="recurring upload tabs" sx={{ pt: 0 }}>
          {RECURRING_UPLOAD_TABS.map(e => (
            <Tab key={e.label} label={e.label} />
          ))}
        </Tabs>
      </Box>
      <Box>
        {RECURRING_UPLOAD_TABS.map((e, i) => (
          <TabPanel key={e.label} value={activeTab} index={i}>
            {e.component}
          </TabPanel>
        ))}
      </Box>
    </>
  );
}

export default RecurringUpload;
