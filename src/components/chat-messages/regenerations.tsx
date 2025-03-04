import { FormatGroup } from '@/components/chat-input/format-group';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import RegenerateIcon from '@/assets/icons/change-font.svg?react';
import { useTranslation } from '@/i18n';
import { useMessagesHandlerContext } from '@/provider/messages-handler-provider';
import { useChatMessagesContext } from '@/provider/messages-provider';
import { OutputContent, OutputLayout, ResponseFormat } from '@/types';
import { useCallback, useState } from 'react';
import RegenerateCircleIcon from '@/assets/icons/regenerate-circle.svg?react';
import TryAgainIcon from '@/assets/icons/undo.svg?react';
import ChevronIcon from '@/assets/icons/chevron.svg?react';

export function Regenerations({ id }: {
  id: number;
}) {
  const { t } = useTranslation();
  const {
    messageIds,
  } = useChatMessagesContext();

  const { regenerateAnswer } = useMessagesHandlerContext();

  const [outputContent, setOutputContent] = useState<OutputContent>(OutputContent.TEXT);
  const [outputLayout, setOutputLayout] = useState<OutputLayout>(OutputLayout.BulletList);
  const regenerate = useCallback((format?: ResponseFormat) => {
    const index = messageIds.indexOf(id);
    if(index < 0) {
      return;
    }

    const questionId = id - 1;

    void regenerateAnswer(questionId, format);
  }, [id, messageIds, regenerateAnswer]);
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onMouseDown={e => {
              e.preventDefault();
            }}
            onClick={() => {
              void regenerate();
            }}
            variant={'ghost'}
            size={'icon'}
            className={`h-7 !p-0 w-7`}
          >
            <TryAgainIcon
              style={{
                width: 16,
                height: 16,
              }}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          align={'center'}
          side={'bottom'}
        >
          {t('button.tryAgain')}

        </TooltipContent>
      </Tooltip>
      <Popover modal>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                onMouseDown={e => {
                  e.preventDefault();
                }}
                variant={'ghost'}
                size={'icon'}
                className={`h-7 !p-0 w-10`}
              >
                <RegenerateIcon
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
                <ChevronIcon
                  style={{
                    width: 12,
                    height: 12,
                  }}
                />
              </Button>

            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent
            align={'center'}
            side={'bottom'}
          >
            {t('button.changeFormat')}
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          onOpenAutoFocus={e => e.preventDefault()}
          onCloseAutoFocus={e => e.preventDefault()}
          className={'flex items-center gap-2'}
        >
          <FormatGroup
            outputContent={outputContent}
            outputLayout={outputLayout}
            setOutputContent={setOutputContent}
            setOutputLayout={setOutputLayout}
          />
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant={'link'}
                size={'icon'}
                onClick={() => {
                  void regenerate({
                    output_content: outputContent,
                    output_layout: outputLayout,
                  });
                }}
              >
                <RegenerateCircleIcon
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('button.regenerateWithNewFormat')}
            </TooltipContent>
          </Tooltip>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default Regenerations;