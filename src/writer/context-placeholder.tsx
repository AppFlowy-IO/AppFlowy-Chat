import { AIAssistant } from '@/components/ai-writer';
import { RenderEditor } from '@/components/ai-writer/render-editor';
import { Toaster } from '@/components/ui/toaster';
import useEnsureBottomVisible from '@/components/ai-writer/use-ensure-bottom-visible';
import { AIAssistantType } from '@/types';
import { useWriterContext } from '@/writer/context';
import { EditorProvider } from '@appflowyinc/editor';

export function ContextPlaceholder() {
  const {
    assistantType,
    placeholderContent,
    setEditorData,
  } = useWriterContext();

  useEnsureBottomVisible();

  if(!assistantType) {
    return null;
  }

  return <div
    id={'appflowy-ai-writer'}
    className={'w-full select-none scroll-mb-[48px] relative h-full flex flex-col overflow-hidden'}
  >
    <AIAssistant>
      {assistantType === AIAssistantType.Explain ? <div /> : <EditorProvider>
        <RenderEditor
          content={placeholderContent || ''}
          onDataChange={setEditorData}
        />
      </EditorProvider>}
    </AIAssistant>
    
    <Toaster />
  </div>;
}