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

import { Grid } from '@mui/material';
import { Typography } from 'cx-portal-shared-components';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { IUsageControl } from '../../features/consumer/types';

function UsagePolicies({ usagePolicies }: { usagePolicies: IUsageControl[] }) {
  const { t } = useTranslation();
  return (
    <>
      {!isEmpty(usagePolicies) ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.entries(usagePolicies).map(([key, item]: any) => (
          <Grid item xs={6} sx={{ mb: 1 }} key={key}>
            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
              {key.toLowerCase()}
            </Typography>
            <Typography variant="body2">
              {t('dialog.offerDetails.type')}:<strong>{item.typeOfAccess}</strong>
            </Typography>

            {item.typeOfAccess.toLowerCase() !== 'unrestricted' && (
              <>
                <Typography variant="body2">
                  {t('dialog.offerDetails.value')}:
                  <strong>
                    {item.value || '-'} {item.durationUnit}
                  </strong>
                </Typography>
              </>
            )}
          </Grid>
        ))
      ) : (
        <Typography variant="body2">Not Available</Typography>
      )}
    </>
  );
}

export default UsagePolicies;
