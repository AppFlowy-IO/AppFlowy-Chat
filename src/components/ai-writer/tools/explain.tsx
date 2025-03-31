import { ExplainToolbar } from '@/components/ai-writer/tools/explain-toolbar';
import { WritingInput } from '@/components/ai-writer/writing-input';
import { ApplyingState, useWriterContext } from '@/writer/context';
import { useCallback } from 'react';

export function Explain() {
  const { askAIAnythingWithRequest, applyingState } = useWriterContext();

  const showToolbar = applyingState === ApplyingState.completed;

  const handleSubmit = useCallback(async(content: string) => {
    return askAIAnythingWithRequest(content);
  }, [askAIAnythingWithRequest]);

  return <div className={'writer-anchor pb-[150px] flex flex-col'}>
    <div className={'flex bg-secondary-background shadow-menu ring-[1.5px] ring-input overflow-hidden rounded-[12px] flex-col'}>
      {showToolbar && <ExplainToolbar />}
      <WritingInput
        onSubmit={handleSubmit}
        noBorder={true}
      />
    </div>
  </div>;
}