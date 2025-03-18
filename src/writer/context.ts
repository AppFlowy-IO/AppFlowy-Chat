import { AIAssistantType, ChatInputMode, ResponseFormat, View } from '@/types';
import { EditorData } from '@appflowyinc/editor';
import { createContext, useContext } from 'react';

export enum ApplyingState {
  idle = 'idle',
  applying = 'applying',
  completed = 'completed',
  failed = 'failed',
}

export interface WriterContextTypes {
  // generate a new answer markdown string
  placeholderContent?: string;
  setPlaceholderContent: (content: string) => void;
  // generating a new answer
  isFetching: boolean;
  isApplying: boolean;
  assistantType?: AIAssistantType;
  improveWriting: (content?: string) => Promise<() => void>;
  askAIAnything: (content?: string) => void;
  continueWriting: (content?: string) => Promise<() => void>;
  explain: (content?: string) => Promise<() => void>;
  fixSpelling: (content?: string) => Promise<() => void>;
  makeLonger: (content?: string) => Promise<() => void>;
  makeShorter: (content?: string) => Promise<() => void>;
  askAIAnythingWithRequest: (content?: string) => Promise<() => void>;
  inputContext: string;
  setInputContext: (context: string) => void;
  setOpenDiscard: (open: boolean) => void;
  applyingState: ApplyingState;
  viewId: string;
  setRagIds: (ragIds: string[]) => void;
  fetchViews: () => Promise<View>;
  exit: () => void;
  setEditorData: (data: EditorData) => void;
  keep: () => void;
  accept: () => void;
  rewrite: (content?: string) => void;
  stop: () => void;
  responseMode: ChatInputMode;
  setResponseMode: (mode: ChatInputMode) => void;
  responseFormat: ResponseFormat;
  setResponseFormat: (format: ResponseFormat) => void;
  isGlobalDocument?: boolean;
  error: {
    code: number;
    message: string;
  } | null;
}

export const WriterContext = createContext<WriterContextTypes | undefined>(undefined);

export function useWriterContext() {
  const context = useContext(WriterContext);

  if(!context) {
    throw new Error('useWriterContext must be used within a WriterProvider');
  }

  return context;
}