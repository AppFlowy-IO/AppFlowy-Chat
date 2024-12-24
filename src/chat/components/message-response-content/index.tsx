import { EditorProvider } from '@appflowyinc/editor';
import { FC } from 'react';
import EditorWrapper from '../editor-wrapper';

interface IProps {
  body: string;
}

const MessageResponseContent: FC<IProps> = ({ body }) => {
  return (
    <div className='text-sm'>
      <EditorProvider>
        <EditorWrapper body={body} />
      </EditorProvider>
    </div>
  );
};

export default MessageResponseContent;
