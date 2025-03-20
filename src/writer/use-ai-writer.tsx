import { useWriterContext } from '@/writer/context';

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
    inputContext,
  } = useWriterContext();

  return {
    continueWriting,
    askAIAnything,
    improveWriting,
    explain,
    makeLonger,
    makeShorter,
    fixSpelling,
    setInputContext,
    inputContext,
  };
}