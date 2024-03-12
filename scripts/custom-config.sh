#!/bin/bash

#################################################################################
# Copyright (c) 2023 T-Systems International GmbH
# Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
#
# See the NOTICE file(s) distributed with this work for additional
# information regarding copyright ownership.
#
# This program and the accompanying materials are made available under the
# terms of the Apache License, Version 2.0 which is available at
# https://www.apache.org/licenses/LICENSE-2.0.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# SPDX-License-Identifier: Apache-2.0
################################################################################

# Values inside theme is to replace the existing styles in Catena-X theme
# Learn more about MUI theming - https://mui.com/material-ui/customization/theming/

custom_theme_config='{
  "theme": {},
  "showSdeVersion": true,
  "title": "Simple Data Exchanger",
  "poweredBy": {
    "visible": false,
    "name": "",
    "logoUrl": "",
    "redirectUrl": ""
  },
  "helpLink": "",
  "restrictedRoutes":[]
}'

echo -e "Updated configuration 🍻: \n\n$custom_theme_config\n\n"

# Write the final result to custom-config.json
echo "$custom_theme_config" >src/assets/customConfig/custom-config.json