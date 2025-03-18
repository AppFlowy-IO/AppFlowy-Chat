import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { ERROR_CODE_NO_LIMIT } from '@/lib/const';
import { useWriterContext } from '@/writer/context';
import XCircleIcon from '@/assets/icons/error.svg?react';

export function Error() {
  const { t } = useTranslation();

  const { error, rewrite } = useWriterContext();

  return (
    <div className={'flex bg-background w-[500px] justify-between p-2 rounded-lg max-w-full border border-input shadow items-center gap-2'}>
      <div className={'flex text-foreground/70 text-sm items-center gap-2 px-2'}>
        <XCircleIcon className={'text-destructive min-w-5 w-5 h-5'} />
        {error?.code === undefined ? <span>
          {t('writer.errors.connection')}
          <Button
            size={'sm'}
            onClick={() => {
              rewrite();
            }}
            variant={'link'}
          >{t('writer.button.retry')}</Button>
        </span> : error?.code === ERROR_CODE_NO_LIMIT ? t('writer.errors.noLimit') : error?.message}
      </div>

    </div>
  );
}