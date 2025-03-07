import { WriterCard } from '@/dev/writer-card';
import { WriterRequest } from '@/request';
import { AIAssistantProvider } from '@/writer';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export function AIWriter() {
  const { workspaceId, chatId } = useParams();
  const request = useMemo(() => {
    return new WriterRequest(workspaceId, chatId);
  }, [chatId, workspaceId]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AIAssistantProvider request={request}>
        <WriterCard />
      </AIAssistantProvider>
    </div>
  );
}
