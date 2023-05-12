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

import './styles/index.scss';

import { ThemeProvider } from '@mui/material';
import { SharedCssBaseline } from 'cx-portal-shared-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './features/store';
import I18nService from './services/i18nService';
import UserService from './services/UserService';
import { sdeTheme } from './utils/theme';
import { clearConsoles } from './utils/utils';

clearConsoles();
I18nService.init();

UserService.initKeycloak(user => {
  ReactDOM.render(
    <React.StrictMode>
      <SharedCssBaseline />
      <Provider store={store}>
        <ThemeProvider theme={sdeTheme}>
          <App loggedUser={user} />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
});
