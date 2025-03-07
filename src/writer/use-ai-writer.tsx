import { ContextPlaceholder } from '@/writer/context-placeholder';
import { useWriterContext } from '@/writer/provider';
import { useMemo } from 'react';

export function useAIWriter() {
  const context = useWriterContext();

  const contextPlaceholder = useMemo(() => {
    return <ContextPlaceholder />;
  }, []);

  return {
    contextPlaceholder,
  };
}