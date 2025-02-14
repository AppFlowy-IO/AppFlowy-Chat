import Chat from '@/chat';
import { ChatRequest } from '@/request';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

function AIChat() {
  const { workspaceId, chatId } = useParams();
  const requestInstance = useMemo(() => {
    if(!workspaceId || !chatId) {
      throw new Error('Invalid chat request');
    }

    return new ChatRequest(workspaceId, chatId);
  }, [workspaceId, chatId]);
  const [selectionMode, setSelectionMode] = useState(false);
  const handleOpenSelectionMode = useCallback(() => {
    setSelectionMode(true);
  }, []);

  const handleCloseSelectionMode = useCallback(() => {
    setSelectionMode(false);
  }, []);

  if(!requestInstance || !chatId) {
    return null;
  }
  return (
    <Chat
      requestInstance={requestInstance}
      chatId={chatId}
      selectionMode={selectionMode}
      onOpenSelectionMode={handleOpenSelectionMode}
      onCloseSelectionMode={handleCloseSelectionMode}
    />
  );
}

export default AIChat;