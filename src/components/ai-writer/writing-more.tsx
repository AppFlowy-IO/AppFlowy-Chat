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
    inputContext,
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
    modal
  >
    <PopoverTrigger asChild>
      <Button
        disabled={!inputContext}
        className={'text-xs !text-icon h-[28px]'}
        startIcon={
          <MoreIcon className={'!w-5 !h-5'} />
        }
        size={'sm'}
        variant={'ghost'}
      >
        {t('writer.button.more')}
        <ChevronDown className={'!w-3 !h-3'} />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <AiWriterMenuContent
        input={input}
        isFilterOut={isFilterOut}
        onClicked={handleClose}
      />
    </PopoverContent>
  </Popover>;
}