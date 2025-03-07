import SendIcon from '@/assets/icons/arrow-up.svg?react';
import AutoTextIcon from '@/assets/icons/auto-text.svg?react';
import ImageTextIcon from '@/assets/icons/image-text.svg?react';
import StopIcon from '@/assets/icons/stop.svg?react';
import { useChatContext } from '@/chat/context';
import { FormatGroup } from '@/components/ui/format-group';
import { RelatedViews } from '@/components/chat-input/related-views';
import { Button } from '@/components/ui/button';
import LoadingDots from '@/components/ui/loading-dots';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import { MESSAGE_VARIANTS } from '@/lib/animations';
import { useMessagesHandlerContext } from '@/provider/messages-handler-provider';
import { useResponseFormatContext } from '@/provider/response-format-provider';
import { ChatInputMode } from '@/types';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_HEIGHT = 200;

export function ChatInput() {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [message, setMessage] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    submitQuestion,
    cancelAnswerStream,
    answerApplying,
    questionSending,
  } = useMessagesHandlerContext();
  const {
    responseFormat,
    responseMode,
    setResponseFormat,
    setResponseMode,
  } = useResponseFormatContext();

  const {
    chatId,

  } = useChatContext();

  const disabled = questionSending;

  useEffect(() => {
    return () => {
      setMessage('');
    };
  }, [chatId]);

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
    if(questionSending || answerApplying) {
      toast({
        variant: 'destructive',
        description: `${t('errors.wait')}`,
      });
      return;
    }
    setMessage('');
    adjustHeight();

    try {
      await submitQuestion(message);

    } catch(e) {
      console.error(e);
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

  const formatTooltip = responseMode === ChatInputMode.FormatResponse ? t('input.button.auto') : t('input.button.format');
  const FormatIcon = responseMode === ChatInputMode.FormatResponse ? AutoTextIcon : ImageTextIcon;

  return (
    <motion.div
      variants={MESSAGE_VARIANTS.getInputVariants()}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={'w-full'}
    >
      <div
        ref={containerRef}
        className={`border relative justify-between gap-1 flex flex-col ${focused ? 'ring-1 ring-ring border-primary' : 'ring-0'} border-border py-1 px-2 focus:border-primary w-full rounded-[12px]`}
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
          autoFocus
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
          className={'resize-none caret-primary min-h-[32px] !py-1 !px-1.5 !border-none !shadow-none w-full !ring-0 h-full !outline-none'}
        />

        <div className={'flex justify-between items-center gap-4'}>
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
          </Tooltip>
          <div className={'flex items-center gap-2'}>
            <RelatedViews />
            {
              answerApplying ? <Button
                onClick={cancelAnswerStream}
                size={'icon'}
                variant={'link'}
              >
                <StopIcon
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </Button> : <Button
                onClick={handleSubmit}
                size={'icon'}
                variant={'link'}
                className={'w-7 h-7 text-primary'}
                disabled={!message.trim() || disabled}
              >
                {questionSending ? <LoadingDots /> : <SendIcon
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />}

              </Button>

            }

          </div>

        </div>
      </div>

    </motion.div>
  );
}

