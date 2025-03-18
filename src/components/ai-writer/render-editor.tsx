import { Alert, AlertDescription } from '@/components/ui/alert';

import { useWriterContext } from '@/writer/context';
import { Editor, useEditor } from '@appflowyinc/editor';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function RenderEditor() {
  const {
    placeholderContent,
    setEditorData,
  } = useWriterContext();
  const editor = useEditor();

  useEffect(() => {
    editor.applyMarkdown(placeholderContent || '');
    setEditorData(editor.getData());
  }, [placeholderContent, editor, setEditorData]);

  return (
    <div className={'relative text-left w-full h-full'}>
      <ErrorBoundary
        fallback={<Alert variant={'destructive'}>
          <AlertDescription>
            Failed to render content
          </AlertDescription>
        </Alert>}
      >
        {placeholderContent &&
          <Editor readOnly />}

      </ErrorBoundary>
    </div>
  );
}