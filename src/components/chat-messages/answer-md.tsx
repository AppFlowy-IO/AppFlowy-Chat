import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEditorContext } from '@/provider/editor-provider';
import { Editor, useEditor } from '@appflowyinc/editor';
import { useEffect } from 'react';
import '@appflowyinc/editor/style';

import { ErrorBoundary } from 'react-error-boundary';

export function AnswerMd({
  mdContent,
  id,
}: {
  mdContent: string;
  id: number;
}) {
  const editor = useEditor();
  const {
    setEditor: setMessageEditor,
  } = useEditorContext();

  useEffect(() => {
    setMessageEditor(id, editor);
  }, [editor, id, setMessageEditor]);

  useEffect(() => {

    if(!mdContent) return;

    try {
      editor.applyMarkdown(mdContent);
    } catch(error) {
      console.error('Failed to apply markdown', error);
    }
  }, [editor, mdContent]);

  return (
    <ErrorBoundary
      fallback={<Alert variant={'destructive'}>
        <AlertDescription>
          Failed to render content
        </AlertDescription>
      </Alert>}
    >
      <Editor
        readOnly
      />
    </ErrorBoundary>
  );
}

