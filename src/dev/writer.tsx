import { WriterCard } from '@/dev/writer-card';
import { WriterRequest } from '@/request';
import { AIAssistantProvider } from '@/writer';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

export function AIWriter() {
  const { workspaceId, chatId } = useParams();
  const request = useMemo(() => {
    return new WriterRequest(workspaceId, chatId);
  }, [chatId, workspaceId]);

  const [container, setContainer] = useState<HTMLDivElement | undefined>(undefined);

  if(!chatId) return null;

  return (
    <div
      ref={el => {
        if(el && !container) {
          setContainer(el);
        }
      }}
      className="w-full h-full overflow-y-auto overflow-hidden flex items-center justify-center"
    >
      <AIAssistantProvider
        viewId={chatId}
        request={request}
        scrollContainer={container}
      >
        <WriterCard />
      </AIAssistantProvider>
    </div>
  );
}
