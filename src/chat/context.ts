import { ChatProps } from '@/types';
import { createContext, useContext } from 'react';

export const ChatContext = createContext<ChatProps | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if(!context) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }

  return context;
}
