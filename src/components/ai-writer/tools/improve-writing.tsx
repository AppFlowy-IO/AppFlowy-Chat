import { ImproveWritingToolbar } from '@/components/ai-writer/toolbar/improve-writing-toolbar';
import { WritingInput } from '@/components/ai-writer/writing-input';
import { ApplyingState, useWriterContext } from '@/writer/context';
import { useCallback } from 'react';

export function ImproveWriting() {
  const { askAIAnythingWithRequest, applyingState } = useWriterContext();

  const showToolbar = applyingState === ApplyingState.completed;

  const handleSubmit = useCallback(async(content: string) => {
    return askAIAnythingWithRequest(content);
  }, [askAIAnythingWithRequest]);

  return <div className={'flex flex-col gap-1'}>
    {showToolbar && <ImproveWritingToolbar />}
    <WritingInput onSubmit={handleSubmit} />
  </div>;
}