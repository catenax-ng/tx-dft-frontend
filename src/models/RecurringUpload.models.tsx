/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { find } from 'lodash';

import { PURPOSE_VALUES } from '../utils/constants';

export type SchedulesFormData = {
  type: string;
  hour: string; // 1 to 24 max
  time: string; // timeStamp only in hours
  day: string; // time 0 - 6, SUN-SAT
};

export type SftpFormData = {
  host: string;
  port: number;
  username: string;
  password: string;
  accessKey: null;
  toBeProcessedLocation: string;
  inProgressLocation: string;
  successLocation: string;
  partialSuccessLocation: string;
  failedLocation: string;
};
export type MinioFormData = {
  endpoint: string;
  bucketName: string;
  accessKey: string;
  secretKey: string;
  toBeProcessedLocation: string;
  inProgressLocation: string;
  successLocation: string;
  partialSuccessLocation: string;
  failedLocation: string;
};

export type EmailConfigFormData = {
  cc_email: string;
  to_email: string;
};

export class EmailConfig {
  to_email: string;

  cc_email: string;

  constructor(config: EmailConfigFormData) {
    this.to_email = config.to_email.toString();
    this.cc_email = config.cc_email.toString();
  }
}

export type UploadSettingsFormData = {
  automatic_upload: string;
  email_notification: string;
};

export class PolicyModel {
  uuid: string;

  policy_name: string;

  inputBpn: string;

  type_of_access: string;

  access_policy: any;

  usage_policies: any;

  constructor(policyData: any) {
    this.uuid = policyData.uuid;
    this.policy_name = policyData.policy_name;
    this.inputBpn = policyData.inputBpn;
    this.type_of_access = policyData.type_of_access;
    this.access_policy = {
      bpn_numbers: {
        value: policyData.bpn_numbers,
      },
      membership: {
        value: false,
      },
      dismantler: {
        value: false,
      },
    };
    this.usage_policies = {
      membership: {
        value: false,
      },
      dismantler: {
        value: false,
      },
      purpose: {
        typeOfAccess: policyData?.usage_policies?.purpose?.typeOfAccess,
        value: find(PURPOSE_VALUES, e => e.value === policyData?.usage_policies?.PURPOSE?.value) || '',
      },
    };
  }
}

export class PolicyPayload {
  uuid: string;

  policy_name: string;

  inputBpn: string;

  type_of_access: string;

  access_policy: any;

  usage_policies: any;

  constructor(policyData: any) {
    this.uuid = policyData.uuid;
    this.policy_name = policyData.policy_name;
    this.access_policy = [
      {
        technicalKey: 'BusinessPartnerNumber',
        value: policyData.access_policy.bpn_numbers.value,
      },
      {
        technicalKey: 'Membership',
        value: policyData.access_policy.membership.value,
      },
      {
        technicalKey: 'Dismantler',
        value: policyData.access_policy.dismantler.value,
      },
    ];
    this.usage_policies = [
      {
        technicalKey: 'Membership',
        value: policyData.usage_policies.membership.value,
      },
      {
        technicalKey: 'Dismantler',
        value: policyData.usage_policies.dismantler.value,
      },
      {
        technicalKey: 'PURPOSE',
        value: policyData.usage_policies.purpose.value,
      },
      {
        technicalKey: 'CUSTOM',
        value: '',
      },
    ];
  }
}
