import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { useWriterContext } from '@/writer/context';
import { CheckIcon, XIcon } from 'lucide-react';
import TryAgainIcon from '@/assets/icons/undo.svg?react';

export function AskAnythingToolbar() {
  const { t } = useTranslation();
  const {
    rewrite,
    keep,
    exit,
  } = useWriterContext();
  return (
    <div className={'flex rounded-lg py-1 px-1 items-center w-fit gap-1 bg-background border border-input shadow'}>
      <Button
        onClick={keep}
        startIcon={<CheckIcon className={'text-success'} />}
        variant={'ghost'}
        className={'text-sm !h-[28px]'}
      >{t('writer.button.keep')}</Button>
      <Button
        onClick={exit}
        startIcon={<XIcon className={'text-destructive'} />}
        variant={'ghost'}
        className={'text-sm !h-[28px]'}
      >{t('writer.button.discard')}</Button>
      <Button
        onClick={() => rewrite()}
        startIcon={<TryAgainIcon />}
        variant={'ghost'}
        className={'text-sm !h-[28px]'}
      >{t('writer.button.rewrite')}</Button>
    </div>
  );
}