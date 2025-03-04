import Chat from '@/chat';
import { ChatRequest } from '@/request';
import { User } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

function AIChat() {
  const { workspaceId, chatId } = useParams();
  const [search, setSearch] = useSearchParams();
  const selectionMode = search.get('selectable') === 'true';
  const handleCloseSelectionMode = useCallback(() => {
    return setSearch(prev => {
      prev.delete('selectable');
      return prev;
    });
  }, [setSearch]);
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

  if(!requestInstance || !chatId) {
    return null;
  }
  return (
    <div className={'flex transform w-full justify-center'}>
      <div className={'max-w-full w-[988px] px-24'}>
        <Chat
          requestInstance={requestInstance}
          chatId={chatId}
          selectionMode={selectionMode}
          onCloseSelectionMode={handleCloseSelectionMode}
          currentUser={currentUser}
        />
      </div>

    </div>

  );
}

export default AIChat;