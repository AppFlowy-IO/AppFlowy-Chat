import { useChatContext } from '@/chat/context';
import { useToast } from '@/hooks/use-toast';
import { ChatSettings } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function useChatSettingsLoader() {
  const [loading, setLoading] = useState(true);
  const [chatSettings, setChatSettings] = useState<ChatSettings | null>(null);
  const {
    requestInstance,
    chatId,
  } = useChatContext();

  const {
    toast,
  } = useToast();

  useEffect(() => {
    return () => {
      setLoading(true);
      setChatSettings(null);
    };
  }, [chatId]);

  const fetchChatSettings = useCallback(async() => {
    try {
      const data = await requestInstance.getChatSettings();
      setLoading(false);
      setChatSettings(data);
      return data;
      // eslint-disable-next-line
    } catch(e: any) {
      setLoading(false);
    }
  }, [requestInstance]);

  const updateChatSettings = useCallback(async(payload: Partial<ChatSettings>) => {
    try {
      await requestInstance.updateChatSettings(payload);
      // eslint-disable-next-line
    } catch(e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      });
    }
  }, [requestInstance, toast]);

  return {
    loading,
    fetchChatSettings,
    updateChatSettings,
    chatSettings,
  };
}