import { useChatContext } from '@/chat/context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/i18n';
import { MESSAGE_VARIANTS } from '@/lib/animations';
import { useMessagesHandlerContext } from '@/provider/messages-handler-provider';
import { Suggestions } from '@/types';
import ChatIcon from '@/assets/icons/chat-outlined.svg?react';
import { motion } from 'framer-motion';

interface MessageSuggestionsProps {
  suggestions: Suggestions;
}

const EmptySuggestions = () => {
  return (
    <div className={'flex flex-col gap-4 w-full overflow-hidden mr-auto'}>
      <Label className={'opacity-60'}>No suggestions</Label>
    </div>
  );
};

export function MessageSuggestions({ suggestions }: MessageSuggestionsProps) {
  const { t } = useTranslation();
  const { selectionMode } = useChatContext();
  const { submitQuestion } = useMessagesHandlerContext();

  const handleClick = async (content: string) => {
    try {
      await submitQuestion(content);
    } catch (e) {
      console.error(e);
    }
  };

  if (selectionMode) {
    return null;
  }

  return (
    <motion.div
      initial={'hidden'}
      animate="visible"
      variants={MESSAGE_VARIANTS.getSuggestionsVariants()}
      className={'flex flex-col gap-4 w-full overflow-hidden mr-auto'}
    >
      <Label className={'opacity-60'}>{t('suggestion.title')}</Label>
      <div className={'flex gap-2 flex-col items-start w-full overflow-hidden'}>
        {suggestions.items.length === 0 ? (
          <EmptySuggestions />
        ) : (
          suggestions.items.map((suggestion, index) => (
            <Button
              key={index}
              className={'w-full justify-start overflow-hidden h-fit p-2'}
              onClick={() => handleClick(suggestion.content)}
              startIcon={
                <span className={'text-primary'}>
                  <ChatIcon />
                </span>
              }
              variant={'ghost'}
            >
              <span className={'text-wrap !text-foreground/85 text-start'}>{suggestion.content}</span>
            </Button>
          ))
        )}
      </div>
    </motion.div>
  );
}
