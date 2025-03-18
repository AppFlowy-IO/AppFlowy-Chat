import { Button } from '@/components/ui/button';
import LoadingDots from '@/components/ui/loading-dots';
import { useTranslation } from '@/i18n';
import { useWriterContext } from '@/writer/context';
import StopIcon from '@/assets/icons/stop.svg?react';

export function Loading() {
  const { t } = useTranslation();
  const {
    isApplying,
    isFetching,
    stop,
  } = useWriterContext();

  return (
    <div className={'flex bg-background w-[500px] justify-between p-2 rounded-lg max-w-full border border-input shadow items-center gap-2'}>
      <div className={'flex text-foreground/70 text-xs items-center gap-2 px-2'}>
        {
          isFetching ? t('writer.analyzing') : isApplying ? t('writer.editing') : null
        }
        <LoadingDots />
      </div>

      <Button
        onMouseDown={e => {
          e.preventDefault();
        }}
        onClick={stop}
        size={'icon'}
        variant={'link'}
      >
        <StopIcon
          style={{
            width: 24,
            height: 24,
          }}
        />
      </Button>
    </div>
  );
}