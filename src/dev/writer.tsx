import { WriterCard } from '@/dev/writer-card';
import { PromptModalProvider } from '@/provider/prompt-modal-provider';
import { WriterRequest } from '@/request';
import { AIAssistantProvider } from '@/writer';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ViewLoaderProvider } from '..';

export function AIWriter() {
  const { workspaceId, chatId } = useParams();
  const request = useMemo(() => {
    return new WriterRequest(workspaceId, chatId);
  }, [chatId, workspaceId]);

  const [container, setContainer] = useState<HTMLDivElement | undefined>(
    undefined,
  );

  if (!chatId || !workspaceId) return null;

  return (
    <div
      ref={(el) => {
        if (el && !container) {
          setContainer(el);
        }
      }}
      className='w-full h-full overflow-y-auto overflow-hidden flex items-center justify-center'
    >
      <ViewLoaderProvider
        getView={request.getView}
        fetchViews={request.fetchViews}
      >
        <PromptModalProvider workspaceId={workspaceId}>
          <AIAssistantProvider
            viewId={chatId}
            request={request}
            scrollContainer={container}
          >
            <WriterCard />
          </AIAssistantProvider>
        </PromptModalProvider>
      </ViewLoaderProvider>
    </div>
  );
}
