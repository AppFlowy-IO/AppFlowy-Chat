import { Banner } from '@/components/multi-selection/banner';
import { useChatMessagesContext } from '@/provider/messages-provider';
import { AuthorType, ChatMessage } from '@/types';
import { CheckStatus } from '@/types/checkbox';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useChatContext } from '@/chat/context';

interface SelectionModeContextTypes {
  messages: ChatMessage[];
  toggleMessage: (message: ChatMessage) => void;
}

export const SelectionModeContext = createContext<SelectionModeContextTypes | undefined>(undefined);

export function useSelectionModeContext() {
  const context = useContext(SelectionModeContext);

  if(!context) {
    throw new Error('useSelectionModeContext must be used within a SelectionModeProvider');
  }

  return context;
}

export const SelectionModeProvider = ({ children }: { children: ReactNode }) => {
  const {
    chatId,
    selectionMode,
  } = useChatContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [checkStatus, setCheckStatus] = useState<CheckStatus>(CheckStatus.Unchecked);

  useEffect(() => {
    return () => {
      setMessages([]);
      setCheckStatus(CheckStatus.Unchecked);
    };
  }, [chatId]);

  useEffect(() => {
    if(!selectionMode) {
      setMessages([]);
      setCheckStatus(CheckStatus.Unchecked);
    }
  }, [selectionMode]);

  const {
    messageIds,
    getMessage,
  } = useChatMessagesContext();

  const toggleMessage = useCallback((message: ChatMessage) => {
    setMessages(messages => {
      if(messages.find(m => m.message_id === message.message_id)) {
        return messages.filter(m => m.message_id !== message.message_id);
      }
      return [...messages, message];
    });
  }, []);

  const allMessages = useMemo(() => {
    return messageIds.map(getMessage).filter(item => {
      if(item?.author?.author_type !== undefined && [AuthorType.Assistant, AuthorType.AI].includes(item?.author?.author_type)) {
        return item;
      }
    }) as ChatMessage[];
  }, [getMessage, messageIds]);

  useEffect(() => {
    const isAllChecked = allMessages.length > 0 && messages.length === allMessages.length;
    const isAllUnchecked = messages.length === 0;
    setCheckStatus(isAllChecked ? CheckStatus.Checked : isAllUnchecked ? CheckStatus.Unchecked : CheckStatus.Indeterminate);
  }, [allMessages, messages]);

  const handleSelectAll = useCallback(() => {
    setMessages(allMessages);
  }, [allMessages]);

  const handleUnselectAll = useCallback(() => {
    setMessages([]);
  }, []);

  return <SelectionModeContext.Provider
    value={{
      messages,
      toggleMessage,
    }}
  >
    <div className={'flex flex-col h-full w-full'}>
      <Banner
        messages={messages}
        onSelectAll={handleSelectAll}
        onClearAll={handleUnselectAll}
        checkStatus={checkStatus}
      />
      {children}
    </div>
  </SelectionModeContext.Provider>;
};