import { useTranslation } from '@/i18n';
import { ERROR_CODE_NO_LIMIT } from '@/lib/const';
import { useWriterContext } from '@/writer/context';
import XCircleIcon from '@/assets/icons/error.svg?react';

export function Error() {
  const { t } = useTranslation();

  const { error, rewrite } = useWriterContext();

  return (
    <div className={'writer-anchor flex bg-background w-full justify-between p-2 rounded-lg max-w-full border border-input shadow-toast items-center gap-2'}>
      <div className={'flex text-foreground/70 text-sm items-center gap-2 p-2'}>
        <XCircleIcon className={'text-destructive min-w-4 w-4 h-4'} />
        {error?.code === undefined ? <span>
          {t('writer.errors.connection')}
          <span
            className={'hover:underline mx-1 text-primary cursor-pointer'}
            onClick={() => {
              rewrite();
            }}
          >{t('writer.button.retry')}</span>
        </span> : error?.code === ERROR_CODE_NO_LIMIT ? t('writer.errors.noLimit') : error?.message}
      </div>

    </div>
  );
}