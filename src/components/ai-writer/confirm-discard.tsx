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
import React from 'react';

export const ConfirmDiscard = React.forwardRef<HTMLDivElement, {
  open: boolean;
  onClose: () => void;
}>(({ open, onClose }, ref) => {
  const { t } = useTranslation();
  const { exit } = useWriterContext();

  return <Dialog
    open={open}
    onOpenChange={(open) => !open && onClose()}
  >
    <DialogContent
      ref={ref}
      onOpenAutoFocus={e => e.preventDefault()}
      onCloseAutoFocus={e => e.preventDefault()}
    >
      <DialogHeader className={'!text-left'}>
        <DialogTitle>{t('writer.discard')}</DialogTitle>
        <DialogDescription>
          {t('writer.confirm-discard')}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant={'outline'}
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
});