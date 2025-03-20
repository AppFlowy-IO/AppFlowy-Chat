import { ExplainToolbar } from '@/components/ai-writer/toolbar/explain-toolbar';
import { WritingInput } from '@/components/ai-writer/writing-input';
import { ApplyingState, useWriterContext } from '@/writer/context';
import { useCallback } from 'react';

export function Explain() {
  const { askAIAnythingWithRequest, applyingState } = useWriterContext();

  const showToolbar = applyingState === ApplyingState.completed;

  const handleSubmit = useCallback(async(content: string) => {
    return askAIAnythingWithRequest(content);
  }, [askAIAnythingWithRequest]);

  return <div className={'flex bg-background shadow ring-1 ring-input overflow-hidden rounded-[12px] flex-col'}>
    {showToolbar && <ExplainToolbar />}
    <WritingInput onSubmit={handleSubmit} />
  </div>;
}