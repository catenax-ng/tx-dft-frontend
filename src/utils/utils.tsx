/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
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

export function formatDate(isoDate: string | number) {
  const date = new Date(isoDate);
  const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
  const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function convertEpochToDate(epoch: string) {
  const epochToMilliseconds = +epoch * 1000;
  return formatDate(epochToMilliseconds);
}

export function epochToDate(epoch: number) {
  const epochToMilliseconds = epoch * 1000;
  return new Date(epochToMilliseconds);
}
// Removing console logs except local dev env
export function clearConsoles() {
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.error = () => {};
    console.debug = () => {};
  }
}

export function trimText(string: string, length: number) {
  return string.length > length ? string.substring(0, length) + '...' : string;
}

export const openInNewTab = (url: string) => {
  window.open(url, '_blank');
};

export const toReadableCapitalizedCase = (input: string): string => {
  const parts = input.replace(/\./g, ' ').split(' ');
  return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};
