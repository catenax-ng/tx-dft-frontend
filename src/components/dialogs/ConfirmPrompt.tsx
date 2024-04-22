import { Button, Dialog, DialogActions, DialogContent, DialogHeader } from '@catena-x/portal-shared-components';
import { useTranslation } from 'react-i18next';

import { handleConfirmActionDialog } from '../../features/pcfExchange/slice';
import { useAppDispatch, useAppSelector } from '../../features/store';

function ConfirmPrompt({ status, handleDialogSubmit }: Readonly<{ status: string; handleDialogSubmit: () => void }>) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { confirmActionDialog } = useAppSelector(state => state.pcfExchangeSlice);

  return (
    <Dialog
      open={confirmActionDialog}
      additionalModalRootStyles={{
        width: '40%',
      }}
    >
      <DialogHeader title={t('dialog.prompt.confirm')} />
      <DialogContent>{t('dialog.prompt.requestPcf', { status: status })}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            dispatch(handleConfirmActionDialog(false));
          }}
        >
          No
        </Button>
        <Button variant="contained" onClick={handleDialogSubmit}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmPrompt;
