/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
 * Copyright (c) 2021,2022 T-Systems International GmbH
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
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
console.log('HELLO THERE');
import './index.scss';

import { SharedCssBaseline, SharedThemeProvider } from 'cx-portal-shared-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import I18nService from './services/i18nService';
import UserService from './services/UserService';
import { store } from './store/store';

I18nService.init();
console.log('HELLO THERE2');
UserService.initKeycloak(user => {
  console.log('INDEX====>', user);
  ReactDOM.render(
    <React.StrictMode>
      <SharedCssBaseline />
      <Provider store={store}>
        <SharedThemeProvider>
          <App loggedUser={user} />
        </SharedThemeProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
});
