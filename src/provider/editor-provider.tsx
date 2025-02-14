import { AppFlowyEditor } from '@appflowyinc/editor';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef } from 'react';
import { useChatContext } from '@/chat/context';

interface EditorContextTypes {
  getEditor: (messageId: number) => AppFlowyEditor | undefined;
  setEditor: (messageId: number, editor: AppFlowyEditor) => void;
}

const EditorContext = createContext<EditorContextTypes | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const {
    chatId,
  } = useChatContext();
  const editorsRef = useRef<Map<number, AppFlowyEditor>>(new Map());

  useEffect(() => {
    return () => {
      editorsRef.current.clear();
    };
  }, [chatId]);

  const getEditor = useCallback((messageId: number) => {
    return editorsRef.current.get(messageId);
  }, [editorsRef]);

  const setEditor = useCallback((messageId: number, editor: AppFlowyEditor) => {
    editorsRef.current.set(messageId, editor);
  }, [editorsRef]);

  return (
    <EditorContext.Provider
      value={{
        getEditor,
        setEditor,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export function useEditorContext() {
  const context = useContext(EditorContext);

  if(!context) {
    throw new Error('useEditorContext must be used within a EditorProvider');
  }

  return context;
}