import { ContextPlaceholder } from '@/writer/context-placeholder';
import { useWriterContext } from '@/provider/ai-assistant-provider';
import { useMemo } from 'react';

export function useAIWriter() {
  const {
    continueWriting,
    askAIAnything,
    improveWriting,
    explain,
    makeLonger,
    makeShorter,
    fixSpelling,
    setInputContext,
  } = useWriterContext();

  const contextPlaceholder = useMemo(() => {
    return <ContextPlaceholder />;
  }, []);

  return {
    contextPlaceholder,
    continueWriting,
    askAIAnything,
    improveWriting,
    explain,
    makeLonger,
    makeShorter,
    fixSpelling,
    setInputContext,
  };
}