import { Editor, useEditor } from '@appflowyinc/editor';
import { FC, useEffect } from 'react';

interface Props {
  body: string;
}

const EditorWrapper: FC<Props> = ({ body }) => {
  const editor = useEditor();

  useEffect(() => {
    editor.applyMarkdown(body);
  }, [body, editor]);

  return <Editor readOnly />;
};

export default EditorWrapper;
