/********************************************************************************
 * Copyright (c) 2024 T-Systems International GmbH
 * Copyright (c) 2024 Contributors to the Eclipse Foundation
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

import { Button, Dialog, DialogActions, DialogContent, DialogHeader } from '@catena-x/portal-shared-components';
import { useTranslation } from 'react-i18next';

function PartnerCheckDialog({
  partnerCheckDialog,
  setPartnerCheck,
  diaglogData,
  handlePartnerCheck,
}: {
  partnerCheckDialog: boolean;
  setPartnerCheck: (status: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  diaglogData: any;
  handlePartnerCheck: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={partnerCheckDialog}>
      <DialogHeader title={t('content.consumeData.noConnectors')} />
      <DialogContent>{diaglogData?.msg}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setPartnerCheck(false);
          }}
        >
          {t('button.cancel')}
        </Button>
        <Button variant="contained" onClick={handlePartnerCheck}>
          Add BPN
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PartnerCheckDialog;
