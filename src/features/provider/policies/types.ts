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

import { Key } from 'react';

import { PolicyModel } from '../../../models/RecurringUpload.models';

export interface IAccessPolicyState {
  openDialog: boolean;
  policyData: PolicyModel;
  policyDialog: boolean;
  policyDialogType: string;
  policyName: string;
}
export interface PolicyHubResponse {
  technicalKey: string;
  type: string[];
  description: string;
  useCase: string[];
  attribute: { key: string; value: string; id?: Key }[];
  technicalEnforced: boolean;
  value: string;
}
