import { WriterRequest } from '@/request';
import { AIAssistantType } from '@/types/writer';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface WriterContextTypes {
  // generate a new answer markdown string
  placeholderContent?: string;
  setPlaceholderContent: (content: string) => void;

  // generating a new answer
  isFetching: boolean;
  assistantType: AIAssistantType;
  setInputContext: (content: string) => void;
  improveWriting: (content?: string) => void;
  askAIAnything: (content?: string) => void;
  continueWriting: (content?: string) => void;
  explain: (content?: string) => void;
  fixSpelling: (content?: string) => void;
  makeLonger: (content?: string) => void;
  makeShorter: (content?: string) => void;

}

const WriterContext = createContext<WriterContextTypes | undefined>(undefined);

export function useWriterContext() {
  const context = useContext(WriterContext);

  if(!context) {
    throw new Error('useWriterContext must be used within a WriterProvider');
  }

  return context;
}

export const AIAssistantProvider = ({ request, children }: { children: ReactNode; request: WriterRequest }) => {
  const [inputContext, setInputContext] = useState<string>('');
  const [placeholderContent, setPlaceholderContent] = useState<string>('');
  const [assistantType, setAssistantType] = useState<AIAssistantType>(AIAssistantType.AskAIAnything);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [isApplying, setApplying] = useState<boolean>(false);

  const handleMessageChange = useCallback((text: string, done?: boolean) => {
    setFetching(false);

    setPlaceholderContent(text);

    if(done) {
      setApplying(false);
    }

  }, []);
  const improveWriting = useCallback(async(content?: string) => {
    setAssistantType(AIAssistantType.ImproveWriting);
    setFetching(true);
    const inputText = content || inputContext;
    if(content) {
      setInputContext(content);
    }

    await request.fetchAIAssistant({
      inputText,
      assistantType: AIAssistantType.ImproveWriting,
      ragIds: [],
    }, handleMessageChange);
  }, [handleMessageChange, inputContext, request]);

  const askAIAnything = useCallback(() => {
    setAssistantType(AIAssistantType.AskAIAnything);

  }, []);

  const continueWriting = useCallback(async() => {
    setAssistantType(AIAssistantType.ContinueWriting);
    setFetching(true);

  }, []);

  const explain = useCallback(() => {
    setAssistantType(AIAssistantType.Explain);
    setFetching(true);

  }, []);

  const fixSpelling = useCallback(() => {
    setAssistantType(AIAssistantType.FixSpelling);
    setFetching(true);

  }, []);

  const makeLonger = useCallback(() => {
    setAssistantType(AIAssistantType.MakeLonger);
    setFetching(true);

  }, []);

  const makeShorter = useCallback(() => {
    setAssistantType(AIAssistantType.MakeShorter);
    setFetching(true);

  }, []);

  return (
    <WriterContext.Provider
      value={{
        placeholderContent,
        setPlaceholderContent,
        improveWriting,
        assistantType,
        isFetching,
        askAIAnything,
        continueWriting,
        explain,
        fixSpelling,
        makeLonger,
        makeShorter,
        setInputContext,
      }}
    >
      {children}
    </WriterContext.Provider>
  );
};
