import { AnswerMd } from '@/components/chat-messages/answer-md';
import { MessageActions } from '@/components/chat-messages/message-actions';
import MessageSources from '@/components/chat-messages/message-sources';
import { MessageSuggestions } from '@/components/chat-messages/message-suggestions';
import LoadingDots from '@/components/ui/loading-dots';
import { useTranslation } from '@/i18n';
import { useMessagesHandlerContext } from '@/provider/messages-handler-provider';
import { useChatMessagesContext } from '@/provider/messages-provider';
import { useResponseFormatContext } from '@/provider/response-format-provider';
import { useSuggestionsContext } from '@/provider/suggestions-provider';
import { ChatInputMode } from '@/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EditorProvider } from '@appflowyinc/editor';
import Error from '@/assets/icons/error.svg?react';
import MessageCheckbox from './message-checkbox';
import { cn } from '@/lib/utils';

export function AssistantMessage({ id, isHovered }: { id: number; isHovered: boolean }) {
  const isInitialLoad = useRef(true);
  const { getMessage, messageIds } = useChatMessagesContext();
  const { responseFormat, responseMode } = useResponseFormatContext();
  const { fetchAnswerStream } = useMessagesHandlerContext();

  const { getMessageSuggestions } = useSuggestionsContext();

  const message = getMessage(id);

  const isLast = messageIds.indexOf(id) === 0;
  const questionId = id - 1;
  const sources = message?.meta_data;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [done, setDone] = useState<boolean>(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (!questionId || !isInitialLoad.current || loading) return;
    void (async () => {
      setLoading(true);

      try {
        isInitialLoad.current = false;
        await fetchAnswerStream(
          questionId,
          responseMode === ChatInputMode.FormatResponse
            ? {
                output_content: responseFormat.output_content,
                output_layout: responseFormat.output_layout,
              }
            : undefined,
          (text, done) => {
            if (done || text) {
              setLoading(false);
            }
            setDone(done || false);
            setContent(text);
          },
        );
        // eslint-disable-next-line
      } catch (e: any) {
        console.error(e);
        setError(true);
        setLoading(false);
      }
    })();
  }, [fetchAnswerStream, questionId, responseFormat, responseMode, loading]);

  const suggestions = useMemo(() => {
    if (!questionId) return null;
    return getMessageSuggestions(questionId);
  }, [questionId, getMessageSuggestions]);

  return (
    <div
      className={cn(
        'assistant-message overflow-hidden transform transition-transform flex flex-col w-full gap-1',
        error || loading ? 'mb-9' : '',
        !done || isLast ? 'mb-9' : 'mb-5',
      )}
    >
      {error ? (
        <div className={`flex items-center w-full justify-center`}>
          <div className="max-w-[480px]">
            <Alert className={'border-none text-foreground bg-red-500/10'}>
              <AlertDescription>
                <div className="flex gap-3 items-center">
                  <div className={'!w-4 !h-4 !min-w-4 !min-h-4'}>
                    <Error />
                  </div>
                  {t('errors.noLimit')}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      ) : loading
        ? (
          <div className={`flex gap-2 overflow-hidden items-center`}>
            <span className={'text-foreground opacity-60 text-sm'}>{t('generating')}</span>
            <LoadingDots />
          </div>
        ) :
        content && (
          <div className={'flex gap-2 w-full overflow-hidden py-1'}>
            <MessageCheckbox id={id} />
            <EditorProvider>
              <AnswerMd id={id} mdContent={content} />
            </EditorProvider>
          </div>
        )
      }
      {sources && sources.length > 0 ? <MessageSources sources={sources} /> : null}
      {done && <MessageActions id={id} isHovered={isHovered} />}
      {suggestions && suggestions.items.length > 0 ? <MessageSuggestions suggestions={suggestions} /> : null}
    </div>
  );
}
