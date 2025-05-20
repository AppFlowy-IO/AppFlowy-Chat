import { AnswerMd } from '@/components/chat-messages/answer-md';
import { MessageActions } from '@/components/chat-messages/message-actions';
import MessageSources from '@/components/chat-messages/message-sources';
import { ChatMessageMetadata } from '@/types';
import { EditorProvider } from '@appflowyinc/editor';
import MessageCheckbox from './message-checkbox';

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
    <div className={`chat-message flex flex-col w-full pl-0.5 relative`}>
      <div className={'flex gap-2 w-full overflow-hidden py-1'}>
        <MessageCheckbox id={id} />
        <EditorProvider>
          <AnswerMd id={id} mdContent={content} />
        </EditorProvider>
      </div>
      {sources && sources.length > 0 ? (
        <MessageSources sources={sources} />
      ) : null}
      <MessageActions id={id} isHovered={isHovered} />
    </div>
  );
}
