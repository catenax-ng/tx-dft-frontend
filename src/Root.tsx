/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2021,2022 Contributors to the CatenaX (ng) GitHub Organisation
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
import App from './App';
import { setLoggedInUser } from './features/app/slice';
import { IUser } from './models/User';
import { useAppDispatch } from './store/store';
import { Config } from './utils/config';

export default function Root({ loggedInUser }: { loggedInUser: IUser }) {
  const dispatch = useAppDispatch();
  dispatch(setLoggedInUser(loggedInUser));
  const access = loggedInUser?.parsedToken?.resource_access;
  return (
    <>
      {access?.hasOwnProperty(Config.REACT_APP_CLIENT_ID) ? (
        <App />
      ) : (
        <ErrorPage header="This webpage is not available." title="Sorry for this inconvenience." />
      )}
    </>
  );
}
