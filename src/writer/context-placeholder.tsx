import { AIAssistant } from '@/components/ai-writer';
import { RenderEditor } from '@/components/ai-writer/render-editor';
import { Toaster } from '@/components/ui/toaster';
import { AIAssistantType } from '@/types';
import { useWriterContext } from '@/writer/context';
import { EditorProvider } from '@appflowyinc/editor';

export function ContextPlaceholder() {
  const {
    assistantType,
  } = useWriterContext();

  if(assistantType === undefined) return null;

  return <div
    id={'appflowy-ai-writer'}
    className={'w-full h-full overflow-hidden'}
  >
    <AIAssistant>
      {assistantType === AIAssistantType.Explain ? <div /> : <EditorProvider>
        <RenderEditor />
      </EditorProvider>}
    </AIAssistant>
    <Toaster />
  </div>;
}