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
