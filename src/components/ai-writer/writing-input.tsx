import SendIcon from '@/assets/icons/arrow-up.svg?react';
import AutoTextIcon from '@/assets/icons/auto-text.svg?react';
import ImageTextIcon from '@/assets/icons/image-text.svg?react';
import { ViewTree } from '@/components/ai-writer/view-tree';
import { WritingMore } from '@/components/ai-writer/writing-more';
import { Button } from '@/components/ui/button';
import { FormatGroup } from '@/components/ui/format-group';
import LoadingDots from '@/components/ui/loading-dots';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { usePromptModal } from '@/provider/prompt-modal-provider';
import { ChatInputMode } from '@/types';
import { AiPrompt } from '@/types/prompt';
import { useWriterContext } from '@/writer/context';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PromptModal } from '../chat-input/prompt-modal';

const MAX_HEIGHT = 200;
// Prevent focus on page load and cause the page to scroll
const FOCUS_DELAY = 250;

export function WritingInput({ onSubmit, noBorder, noSwitchMode }: {
  onSubmit: (message: string) => Promise<() => void>;
  noBorder?: boolean;
  noSwitchMode?: boolean;
}) {

  const { t } = useTranslation();

  const [, setFocused] = useState(false);
  const [message, setMessage] = useState('');
  const {
    assistantType,
    isApplying,
    isFetching,
    responseMode,
    responseFormat,
    setResponseFormat,
    setResponseMode,
    hasAIAnswer,
    scrollContainer,
  } = useWriterContext();
  const { openModal, currentPromptId, updateCurrentPromptId } =
    usePromptModal();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(assistantType === undefined) {
      setMessage('');
    }
  }, [assistantType]);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if(!textarea) return;

    // reset height
    textarea.style.height = 'auto';

    // calculate height
    const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
    textarea.style.height = `${newHeight}px`;

    // toggle overflowY
    textarea.style.overflowY = textarea.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden';

    // adjust container height
    if(containerRef.current) {
      containerRef.current.style.height = `${newHeight + (responseMode === ChatInputMode.FormatResponse ? 54 + 24 : 30 + 16)}px`; // 32px padding
    }

  }, [responseMode]);

  const handleInput = () => {
    adjustHeight();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  const handleSubmit = async() => {
    if(!message.trim()) {
      toast({
        variant: 'destructive',
        description: `${t('errors.emptyMessage')}`,
      });
      return;
    }
    if(isFetching || isApplying) {
      toast({
        variant: 'destructive',
        description: `${t('errors.wait')}`,
      });
      return;
    }
    setMessage('');
    adjustHeight();

    try {
      await onSubmit(message);
      // eslint-disable-next-line
    } catch(e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if(message) {
        adjustHeight();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustHeight, message]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  useEffect(() => {
    setTimeout(() => {
      const rect = textareaRef.current?.getBoundingClientRect();
      const containerRect = scrollContainer?.getBoundingClientRect();
      if(!rect || !containerRect) return;

      const inViewport = rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
      const bottomInView = rect.top < containerRect.top && rect.bottom > containerRect.top;
      const topInView = rect.bottom > containerRect.bottom && rect.top < containerRect.bottom;

      if(inViewport || bottomInView || topInView) {
        textareaRef.current?.focus();
        return;
      }

      console.error('Disable focus on page load', {
        rect,
        containerRect,
      });
    }, FOCUS_DELAY);
  }, [scrollContainer]);
  
  useEffect(() => {
    adjustHeight();
  }, [adjustHeight, currentPromptId]);

  const handleUsePrompt = useCallback(
    (prompt: AiPrompt) => {
      updateCurrentPromptId(prompt.id);
      setResponseMode(ChatInputMode.Auto);
      setMessage(prompt.content);
      if (textareaRef) {
        textareaRef.current?.focus();
        setFocused(true);
      }
    },
    [setResponseMode, updateCurrentPromptId],
  );

  const formatTooltip = responseMode === ChatInputMode.FormatResponse ? t('input.button.auto') : t('input.button.format');
  const FormatIcon = responseMode === ChatInputMode.FormatResponse ? AutoTextIcon : ImageTextIcon;
  return (
    <div className={cn('writer-anchor flex w-full flex-col', noBorder ? '' : 'pb-[150px]')}>
      <div
        ref={containerRef}
        style={{
          borderTop: noBorder ? 'none' : undefined,
          borderTopLeftRadius: noBorder ? 0 : undefined,
          borderTopRightRadius: noBorder ? 0 : undefined,
          border: noBorder ? 'none' : undefined,
        }}
        className={cn(
          noBorder ? '' : 'shadow-menu',
          'border bg-input-background w-full relative justify-between gap-1 flex flex-col border-border py-1 px-2 focus:border-primary rounded-[12px]',
          noBorder ? 'ring-0' : 'ring-[0.5px] ring-input')}
      >
        {responseMode === ChatInputMode.FormatResponse &&
          <FormatGroup
            setOutputLayout={(newOutLayout) => {
              setResponseFormat({
                ...responseFormat,
                output_layout: newOutLayout,
              });
            }}
            setOutputContent={(newOutContent) => {
              setResponseFormat({
                ...responseFormat,
                output_content: newOutContent,
              });
            }}
            outputContent={responseFormat.output_content}
            outputLayout={responseFormat.output_layout}
          />}
        <Textarea
          value={message}
          onChange={handleChange}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          ref={textareaRef}
          onFocus={() => {
            setFocused(true);
          }}
          placeholder={t('input.placeholder')}
          onBlur={() => {
            setFocused(false);
          }}
          rows={1}
          className={'resize-none select-text writer-input !text-sm caret-primary min-h-[32px] !py-1 !px-1.5 !border-none !shadow-none w-full !ring-0 h-full !outline-none'}
        />

        <div className={'flex justify-between items-center gap-4'}>
          <div className='flex items-center'>
            {!noSwitchMode ?
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onMouseDown={e => {
                      e.preventDefault();
                    }}
                    variant={'ghost'}
                    size={'icon'}
                    className={'w-7 h-7'}
                    onClick={() => {
                      setResponseMode(responseMode === ChatInputMode.FormatResponse ? ChatInputMode.Auto : ChatInputMode.FormatResponse);
                    }}
                  >
                    <FormatIcon
                      style={{
                        width: 20,
                        height: 20,
                      }}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  align={'center'}
                  side={'right'}
                >
                  {formatTooltip}
                </TooltipContent>
              </Tooltip> : <div />}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  variant={'ghost'}
                  className={'h-7 text-xs'}
                  onClick={openModal}
                >
                  {t('customPrompt.browsePrompts')}
                </Button>
              </TooltipTrigger>
              <TooltipContent align={'center'} side={'right'}>
                {t('customPrompt.browsePrompts')}
              </TooltipContent>
            </Tooltip>
  
            <PromptModal onUsePrompt={handleUsePrompt} />
          </div>
          
          <div className={'flex gap-1 items-center'}>
            <ViewTree />
            {!hasAIAnswer() && <WritingMore input={message} />}

            <span
              onMouseDown={e => {
                e.preventDefault();
              }}
            ><Button
              onClick={handleSubmit}
              size={'icon'}
              variant={'link'}
              className={'w-7 h-7 text-primary'}
              disabled={!message.trim() || isFetching}
            >
              {isFetching ? <LoadingDots /> : <SendIcon
                style={{
                  width: 24,
                  height: 24,
                }}
              />}

            </Button>
          </span>

          </div>

        </div>
      </div>
    </div>

  );
}

