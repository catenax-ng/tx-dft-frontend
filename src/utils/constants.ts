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

import { theme } from 'cx-portal-shared-components';

import { IDefaultObject, ISelectList } from '../models/Common';

const USER_GUIDE_URL =
  'https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/blob/main/docs/user-guide/README.md';

const ONLY_NUM_REGEX = /^[1-9]\d*$/;

const ALPHA_NUM_REGEX = /[a-zA-Z0-9]$/;

const SPACE_CHECK_REGEX = /^\S*$/;

const DATE_TIME_FORMAT = 'DD-MM-YYYY H:mm:ss';

const CONTRACT_STATES: string[] = ['FINALIZED', 'DECLINED', 'TERMINATED', 'ERROR'];

const STATUS_COLOR_MAPPING: IDefaultObject = {
  IN_PROGRESS: theme.palette.info.main,
  FINALIZED: theme.palette.success.main,
  COMPLETED: theme.palette.success.main,
  TERMINATED: theme.palette.error.main,
  DECLINED: theme.palette.error.main,
  ERROR: theme.palette.error.main,
  FAILED: theme.palette.error.main,
  PARTIALLY_FAILED: theme.palette.error.main,
};

const USER_TYPE_SWITCH: IDefaultObject = {
  provider: 'consumer',
  consumer: 'provider',
};

const DURATION_UNITS: ISelectList[] = [
  {
    id: 0,
    title: 'Hour',
    value: 'HOUR',
  },
  {
    id: 1,
    title: 'Day',
    value: 'DAY',
  },
  {
    id: 2,
    title: 'Month',
    value: 'MONTH',
  },
  {
    id: 3,
    title: 'Year',
    value: 'YEAR',
  },
];

const DURATION_UNIT_MAPPING = {
  HOUR: 'hours',
  DAY: 'days',
  MONTH: 'months',
  YEAR: 'years',
};

const PURPOSE_VALUES: ISelectList[] = [
  {
    id: 0,
    title: 'ID 3.0 Trace',
    value: 'ID 3.0 Trace',
  },
];

const SCHEDULE_TYPE: ISelectList[] = [
  { id: 0, value: 'HOURLY', title: 'Hourly' },
  { id: 1, value: 'DAILY', title: 'Daily' },
  { id: 2, value: 'WEEKLY', title: 'Weekly' },
];

const WEEK_DAYS: ISelectList[] = [
  { id: 0, value: 'sunday', title: 'Sunday' },
  { id: 1, value: 'monday', title: 'Monday' },
  { id: 2, value: 'tuesday', title: 'Tuesday' },
  { id: 2, value: 'wednesday', title: 'Wednesday' },
  { id: 2, value: 'thursday', title: 'Thursday' },
  { id: 2, value: 'friday', title: 'Friday' },
  { id: 2, value: 'saturday', title: 'Saturday' },
];

const SFTP_FORM_FIELDS = [
  { name: 'host', label: 'Host Name', placeholder: 'Enter host name' },
  { name: 'port', label: 'Port Name', placeholder: 'Enter port name' },
  { name: 'username', label: 'User name', placeholder: 'Enter user name' },
  { name: 'password', label: 'Password', placeholder: 'Enter password' },
  { name: 'accessKey', label: 'Access Key', placeholder: 'Enter access key' },
  { name: 'toBeProcessedLocation', label: 'To Be Processed Location', placeholder: 'Enter to be processed location' },
  { name: 'inProgressLocation', label: 'In Progress Location', placeholder: 'Enter in progress location' },
  { name: 'successLocation', label: 'Success Location', placeholder: 'Enter success location' },
  {
    name: 'partialSuccessLocation',
    label: 'Partial Success Location',
    placeholder: 'Enter partial success location',
  },
  { name: 'failedLocation', label: 'Failed Location', placeholder: 'Enter failed location' },
];

const EMAIL_CONFIG_FORM_FIELDS = [
  { name: 'to_email', label: 'To email address', placeholder: 'Enter to email address', type: 'email' },
  { name: 'cc_email', label: 'CC email address', placeholder: 'Enter cc email address', type: 'email' },
];

const UPLOAD_CONFIG_FORM_FIELDS = [
  { name: 'automatic_upload', label: 'Automatic Upload', placeholder: '' },
  { name: 'email_notification', label: 'Email Notification', placeholder: '' },
];

const HOURS: ISelectList[] = [...Array(24)].map((_e, i) => ({
  id: i + 1,
  value: `${i + 1}`,
  title: `Every ${i + 1} hour`,
}));

export {
  ALPHA_NUM_REGEX,
  CONTRACT_STATES,
  DATE_TIME_FORMAT,
  DURATION_UNIT_MAPPING,
  DURATION_UNITS,
  EMAIL_CONFIG_FORM_FIELDS,
  HOURS,
  ONLY_NUM_REGEX,
  PURPOSE_VALUES,
  SCHEDULE_TYPE,
  SFTP_FORM_FIELDS,
  SPACE_CHECK_REGEX,
  STATUS_COLOR_MAPPING,
  UPLOAD_CONFIG_FORM_FIELDS,
  USER_GUIDE_URL,
  USER_TYPE_SWITCH,
  WEEK_DAYS,
};
