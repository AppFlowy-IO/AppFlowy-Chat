import { useChatContext } from '@/chat/context';
import { ChatInputMode, OutputContent, OutputLayout, ResponseFormat } from '@/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ResponseFormatContextTypes {
  responseFormat: ResponseFormat;
  responseMode: ChatInputMode;
  setResponseFormat: (responseFormat: ResponseFormat) => void;
  setResponseMode: (responseMode: ChatInputMode) => void;
}

export const ResponseFormatContext = createContext<ResponseFormatContextTypes | undefined>(undefined);

export function useResponseFormatContext() {
  const context = useContext(ResponseFormatContext);

  if(!context) {
    throw new Error('useResponseFormatContext must be used within a ResponseFormatProvider');
  }

  return context;
}

export const ResponseFormatProvider = ({ children }: { children: ReactNode }) => {
  const [responseFormat, setResponseFormat] = useState<ResponseFormat>({
    output_layout: OutputLayout.BulletList,
    output_content: OutputContent.TEXT,
  });
  const [responseMode, setResponseMode] = useState<ChatInputMode>(ChatInputMode.FormatResponse);

  const {
    chatId,
  } = useChatContext();

  useEffect(() => {
    return () => {
      setResponseFormat({
        output_layout: OutputLayout.BulletList,
        output_content: OutputContent.TEXT,
      });
      setResponseMode(ChatInputMode.FormatResponse);
    };
  }, [chatId]);

  return (
    <ResponseFormatContext.Provider
      value={{
        responseMode,
        responseFormat,
        setResponseFormat,
        setResponseMode,
      }}
    >
      {children}
    </ResponseFormatContext.Provider>
  );
};