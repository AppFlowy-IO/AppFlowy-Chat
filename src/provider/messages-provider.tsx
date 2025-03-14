import { useChatContext } from '@/chat/context';
import { AuthorType, ChatMessage, ChatMessageMetadata } from '@/types';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface ChatMessagesContextTypes {
  messageIds: number[];
  getMessage: (id: number) => ChatMessage | undefined;
  addMessages: (messages: ChatMessage[]) => void;
  removeMessages: (ids: number[]) => ChatMessage[];
  insertMessage: (message: ChatMessage, index: number) => void;
  saveMessageContent: (messageId: number, content: string, metadata: ChatMessageMetadata[]) => void;
}

export const ChatMessagesContext = createContext<ChatMessagesContextTypes | undefined>(undefined);

export function useChatMessagesContext() {
  const context = useContext(ChatMessagesContext);

  if (!context) {
    throw new Error('useMessagesManager: useMessagesManager must be used within a ChatMessagesProvider');
  }
  return context;
}

export const ChatMessagesProvider = ({ children }: { children: ReactNode }) => {
  const { chatId, onUpdateHasMessages } = useChatContext();
  const [messageIds, setMessageIds] = useState<number[]>([]);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    return () => {
      setMessageIds([]);
      messagesRef.current = [];
    };
  }, [chatId]);

  const getMessage = useCallback((id: number) => {
    return messagesRef.current.find((message) => message.message_id === id);
  }, []);

  const addMessages = useCallback(
    (messages: ChatMessage[]) => {
      for (const message of messages) {
        messagesRef.current.push(message);
      }

      if (messages.find((m) => m.author.author_type === AuthorType.AI)) {
        onUpdateHasMessages?.(true);
      }
      setMessageIds(messagesRef.current.map((message) => message.message_id));
    },
    [onUpdateHasMessages],
  );

  const removeMessages = useCallback((ids: number[]) => {
    messagesRef.current = messagesRef.current.filter((message) => !ids.includes(message.message_id));

    setMessageIds(messagesRef.current.map((message) => message.message_id));

    return messagesRef.current;
  }, []);

  const insertMessage = useCallback(
    (message: ChatMessage, index: number) => {
      const newMessages = [...messagesRef.current];
      newMessages.splice(index, 0, message);
      messagesRef.current = newMessages;
      if (newMessages.some((m) => m.author.author_type === AuthorType.AI)) {
        onUpdateHasMessages?.(true);
      }
      setMessageIds(messagesRef.current.map((message) => message.message_id));
    },
    [onUpdateHasMessages],
  );

  const saveMessageContent = useCallback((messageId: number, content: string, metadata: ChatMessageMetadata[]) => {
    const message = messagesRef.current.find((message) => message.message_id === messageId);
    if (message) {
      message.content = content;
      message.meta_data = [...metadata];
    }
  }, []);

  return (
    <ChatMessagesContext.Provider
      value={{
        messageIds,
        getMessage,
        addMessages,
        removeMessages,
        insertMessage,
        saveMessageContent,
      }}
    >
      {children}
    </ChatMessagesContext.Provider>
  );
};
