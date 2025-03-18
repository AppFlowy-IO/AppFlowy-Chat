import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/i18n';
import { useWriterContext } from '@/writer/context';

export function ConfirmDiscard({ open, onClose }: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { exit } = useWriterContext();

  return <Dialog
    open={open}
    onOpenChange={(open) => !open && onClose()}
  >
    <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
      <DialogHeader className={'!text-left'}>
        <DialogTitle>{t('writer.discard')}</DialogTitle>
        <DialogDescription>
          {t('writer.confirm-discard')}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant={'secondary'}
          onClick={onClose}
        >{t('writer.button.cancel')}</Button>
        <Button
          onClick={() => {
            exit();
            onClose();
          }}
          variant={'destructive'}
          type="submit"
        >{t('writer.button.discard')}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}