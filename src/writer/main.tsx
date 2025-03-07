import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWriterContext } from '@/provider/ai-assistant-provider';
import { Editor, useEditor } from '@appflowyinc/editor';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function Main() {
  const {
    placeholderContent,
  } = useWriterContext();
  const editor = useEditor();

  useEffect(() => {
    console.log('applyMarkdown', placeholderContent);
    editor.applyMarkdown(placeholderContent || '');
  }, [placeholderContent, editor]);

  return (
    <div className={'relative w-full h-full'}>
      <ErrorBoundary
        fallback={<Alert variant={'destructive'}>
          <AlertDescription>
            Failed to render content
          </AlertDescription>
        </Alert>}
      >
        {placeholderContent && <Editor readOnly />}

      </ErrorBoundary>
      <div className={'absolute'}></div>
    </div>
  );
}