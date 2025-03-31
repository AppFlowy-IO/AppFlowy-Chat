import { AiWriterMenuContent } from '@/components/ai-writer/ai-writer-menu-content';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from '@/i18n';
import { AIAssistantType } from '@/types';
import { useWriterContext } from '@/writer/context';
import { ChevronDown } from 'lucide-react';
import MoreIcon from '@/assets/icons/ai-more.svg?react';
import { useCallback, useState } from 'react';

export function WritingMore({ input }: {
  input: string
}) {
  const { t } = useTranslation();
  const {
    isGlobalDocument,
  } = useWriterContext();

  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const isFilterOut = useCallback((type: AIAssistantType) => {
    if(isGlobalDocument) {
      return type !== AIAssistantType.ContinueWriting;
    }

    return type === AIAssistantType.AskAIAnything || type === AIAssistantType.ContinueWriting;
  }, [isGlobalDocument]);

  return <Popover
    onOpenChange={setOpen}
    open={open}
    modal={false}
  >
    <PopoverTrigger asChild>
      <Button
        className={'text-xs !gap-1 !text-secondary-foreground h-[28px]'}
        size={'sm'}
        startIcon={
          <MoreIcon className={'!w-5 !h-5'} />
        }
        variant={'ghost'}
      >
        <div className={'flex gap-0.5 items-center flex-1'}>
          {t('writer.button.more')}
          <ChevronDown className={'!w-2 !h-2'} />
        </div>

      </Button>
    </PopoverTrigger>
    <PopoverContent className={'min-w-[240px] !p-2'}>
      <AiWriterMenuContent
        input={input}
        isFilterOut={isFilterOut}
        onClicked={handleClose}
      />
    </PopoverContent>
  </Popover>;
}