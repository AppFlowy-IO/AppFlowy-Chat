import { AiMessageAvatar } from '@/components/chat-messages/ai-message-avatar';
import { AnswerMd } from '@/components/chat-messages/answer-md';
import { MessageActions } from '@/components/chat-messages/message-actions';
import MessageSources from '@/components/chat-messages/message-sources';
import { ChatMessageMetadata } from '@/types';
import { EditorProvider } from '@appflowyinc/editor';

export function AIAnswer({
  content,
  id,
  sources,
  isHovered,
}: {
  content: string;
  id: number;
  sources?: ChatMessageMetadata[];
  isHovered: boolean;
}) {

  return (
    <div className={'chat-message flex flex-col w-full gap-1'}>
      <div className={`flex gap-2 w-full`}>
        <AiMessageAvatar id={id} />

        <div className={'flex-1 w-full overflow-hidden'}>
          <EditorProvider>
            <AnswerMd
              id={id}
              mdContent={content}
            />
          </EditorProvider>
        </div>
      </div>
      {sources && sources.length > 0 ? <MessageSources sources={sources} /> : null}
      <MessageActions
        id={id}
        isHovered={isHovered}
      />
    </div>

  );
}

