import { Alert, AlertDescription } from '@/components/ui/alert';

import { Editor, EditorData, useEditor } from '@appflowyinc/editor';

import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function RenderEditor({
  content,
  onDataChange,
}: {
  content: string;
  onDataChange?: (data: EditorData) => void;
}) {

  const editor = useEditor();

  useEffect(() => {
    editor.applyMarkdown(content);
    onDataChange?.(editor.getData());
  }, [content, editor, onDataChange]);

  return (
    <div className={`relative select-text text-left w-full h-full`}>
      <ErrorBoundary
        fallback={<Alert variant={'destructive'}>
          <AlertDescription>
            Failed to render content
          </AlertDescription>
        </Alert>}
      >
        {content && <Editor readOnly />}

      </ErrorBoundary>
    </div>
  );
}