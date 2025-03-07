import { createContext, ReactNode, useContext, useState } from 'react';

interface WriterContextTypes {
  // generate a new answer markdown string
  placeholderContent?: string;

  setPlaceholderContent: (content: string) => void;
}

const WriterContext = createContext<WriterContextTypes | undefined>(undefined);

export function useWriterContext() {
  const context = useContext(WriterContext);

  if(!context) {
    throw new Error('useWriterContext must be used within a WriterProvider');
  }

  return context;
}

export const WriterProvider = ({ children }: { children: ReactNode }) => {
  const [placeholderContent, setPlaceholderContent] = useState<string>('');

  return (
    <WriterContext.Provider
      value={{
        placeholderContent,
        setPlaceholderContent,
      }}
    >
      {children}
    </WriterContext.Provider>
  );
};
