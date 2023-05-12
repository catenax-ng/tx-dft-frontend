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
import { Box, List, useTheme } from '@mui/material';

import { useAppSelector } from '../../features/store';
import { MenuItems } from '../../helpers/SidebarHelper';
import CollapseMenuItem from './CollapseMenuItem';
import MenuItemHeading from './MenuHeading';
import MenuItem from './MenuItem';
import PoweredByMenuItem from './PoweredByMenuItem';

export default function Sidebar() {
  const theme = useTheme();
  const { sidebarExpanded } = useAppSelector(state => state.appSlice);
  return (
    <Box
      sx={{
        width: sidebarExpanded ? 200 : 56,
        height: '100vh',
        overflow: 'hidden',
        borderRight: `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      <List
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100vh - 64px)',
        }}
      >
        <Box>
          {MenuItems.map((menuItem, index) => (
            <Box key={index}>
              {/* Menu heading */}
              {menuItem.isHeading ? <MenuItemHeading text={menuItem.text} /> : <MenuItem key={index} item={menuItem} />}
              {/* Menu children */}
              {menuItem.childrens?.map((children, k) => (
                <MenuItem key={k} item={children} />
              ))}
            </Box>
          ))}
        </Box>
        <Box>
          <CollapseMenuItem sidebarExpanded={sidebarExpanded} />
          <PoweredByMenuItem sidebarExpanded={sidebarExpanded} />
        </Box>
      </List>
    </Box>
  );
}
