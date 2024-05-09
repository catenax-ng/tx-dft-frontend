/********************************************************************************
 * Copyright (c) 2021,2022 FEV Consulting GmbH
 * Copyright (c) 2021,2024 T-Systems International GmbH
 * Copyright (c) 2022,2024 Contributors to the Eclipse Foundation
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

import { SharedCssBaseline, SharedThemeProvider } from '@catena-x/portal-shared-components';
import { ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './features/store';
import I18nService from './services/i18nService';
import UserService from './services/UserService';
import { sdeTheme } from './theme';
import { clearConsoles } from './utils/utils';

clearConsoles();
I18nService.init();

UserService.initKeycloak(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <SharedCssBaseline />
      <Provider store={store}>
        <SharedThemeProvider>
          <ThemeProvider theme={sdeTheme}>
            <App />
          </ThemeProvider>
        </SharedThemeProvider>
      </Provider>
    </StrictMode>,
  );
});
