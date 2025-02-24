import { AiMessageAvatar } from '@/components/chat-messages/ai-message-avatar';
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
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { EditorProvider } from '@appflowyinc/editor';

export function AssistantMessage({
  id,
  isHovered,
}: {
  id: number;
  isHovered: boolean;
}) {
  const isInitialLoad = useRef(true);
  const {
    getMessage,
  } = useChatMessagesContext();
  const {
    responseFormat,
    responseMode,
  } = useResponseFormatContext();
  const {
    fetchAnswerStream,
  } = useMessagesHandlerContext();

  const {
    getMessageSuggestions,
  } = useSuggestionsContext();

  const message = getMessage(id);
  const ref = useRef<HTMLDivElement>(null);
  const questionId = id - 1;
  const sources = message?.meta_data;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');

  const { t } = useTranslation();

  useEffect(() => {
    if(!questionId || !isInitialLoad.current || loading) return;
    void (async() => {
      setLoading(true);

      try {
        isInitialLoad.current = false;
        await fetchAnswerStream(questionId, responseMode === ChatInputMode.FormatResponse ? {
          output_content: responseFormat.output_content,
          output_layout: responseFormat.output_layout,
        } : undefined, (text, done) => {
          if(done || text) {
            setLoading(false);
          }
          setContent(text);
        });
        // eslint-disable-next-line
      } catch(e: any) {
        console.error(e);
        setError(true);
        setLoading(false);
      }
    })();
  }, [fetchAnswerStream, questionId, responseFormat, responseMode, loading]);

  const suggestions = useMemo(() => {
    if(!questionId) return null;
    return getMessageSuggestions(questionId);
  }, [questionId, getMessageSuggestions]);

  return (
    <div className={'assistant-message overflow-hidden transform transition-transform flex flex-col w-full gap-1'}>
      <div
        ref={ref}
        className={`flex gap-2 w-full  overflow-hidden`}
      >
        <div
          className={`flex gap-2 ${loading ? 'items-center' : ''}`}
        >
          <AiMessageAvatar id={id} />
          {loading && <span className={'text-foreground opacity-60 text-xs'}>
          {t('generating')}
        </span>}
          {loading && <LoadingDots />}
        </div>

        <div className={'flex-1 w-full overflow-hidden'}>
          {error && <Alert variant={'destructive'}>
            <AlertDescription>
              {t('errors.noLimit')}
            </AlertDescription>
          </Alert>}
          {content && <EditorProvider>
            <AnswerMd
              id={id}
              mdContent={content}
            />
          </EditorProvider>}
        </div>

      </div>
      {sources && sources.length > 0 ? <MessageSources sources={sources} /> : null}
      {message?.content && <MessageActions
        id={id}
        isHovered={isHovered}
      />}
      {suggestions && <MessageSuggestions suggestions={suggestions} />}
    </div>
  );
}

