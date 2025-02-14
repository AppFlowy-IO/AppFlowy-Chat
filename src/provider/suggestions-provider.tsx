import { useToast } from '@/hooks/use-toast';
import { Suggestions } from '@/types';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useChatContext } from '@/chat/context';

interface SuggestionsContextTypes {
  registerFetchSuggestions: (messageId: number) => void;
  unregisterFetchSuggestions: (messageId: number) => void;
  startFetchSuggestions: () => Promise<void>;
  getMessageSuggestions: (messageId: number) => Suggestions | undefined;
  clearSuggestions: () => void;
}

export const SuggestionsContext = createContext<SuggestionsContextTypes | undefined>(undefined);

export function useSuggestionsContext() {
  const context = useContext(SuggestionsContext);

  if(!context) {
    throw new Error('useSuggestionsContext must be used within a SuggestionsProvider');
  }

  return context;
}

export const SuggestionsProvider = ({ children }: { children: ReactNode }) => {
  const {
    chatId,
    requestInstance,
  } = useChatContext();
  const [suggestions, setSuggestions] = useState<Map<number, Suggestions>>(new Map());

  const { toast } = useToast();
  const fetchingMessageIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    return () => {
      setSuggestions(new Map());
      fetchingMessageIdsRef.current.clear();
    };
  }, [chatId]);

  const clearSuggestions = useCallback(() => {
    setSuggestions(new Map());
  }, []);

  const registerFetchSuggestions = useCallback((messageId: number) => {
    clearSuggestions();
    fetchingMessageIdsRef.current.add(messageId);
  }, [clearSuggestions]);

  const unregisterFetchSuggestions = useCallback((messageId: number) => {
    fetchingMessageIdsRef.current.delete(messageId);
  }, []);

  const getMessageSuggestions = useCallback((messageId: number) => {
    return suggestions.get(messageId);
  }, [suggestions]);

  const startFetchSuggestions = useCallback(async() => {
    const messageId = Array.from(fetchingMessageIdsRef.current)[0];
    if(!messageId) {
      return;
    }
    try {
      const data = await requestInstance.getSuggestions(messageId);

      setSuggestions(suggestions => {
        const newSuggestions = new Map(suggestions);
        newSuggestions.set(messageId, data);
        return newSuggestions;
      });

      // eslint-disable-next-line
    } catch(e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      });
    } finally {
      unregisterFetchSuggestions(messageId);
    }
  }, [requestInstance, toast, unregisterFetchSuggestions]);

  return (
    <SuggestionsContext.Provider
      value={{
        getMessageSuggestions,
        startFetchSuggestions,
        clearSuggestions,
        registerFetchSuggestions,
        unregisterFetchSuggestions,
      }}
    >
      {children}
    </SuggestionsContext.Provider>
  );
};