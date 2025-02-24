import Chat from '@/chat';
import { ChatRequest } from '@/request';
import { User } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

function AIChat() {
  const { workspaceId, chatId } = useParams();
  const [currentUser, setCurrentUser] = useState<User>();
  const requestInstance = useMemo(() => {
    if(!workspaceId || !chatId) {
      throw new Error('Invalid chat request');
    }

    return new ChatRequest(workspaceId, chatId);
  }, [workspaceId, chatId]);

  useEffect(() => {
    const fetchCurrentUser = async() => {
      try {
        const user = await requestInstance.getCurrentUser();
        setCurrentUser(user);
      } catch(error) {
        console.error('Failed to fetch current user', error);
      }
    };

    void fetchCurrentUser();
  }, [requestInstance]);
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
      currentUser={currentUser}
    />
  );
}

export default AIChat;