import { ConfirmDiscard } from '@/components/ai-writer/confirm-discard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import { ChatI18nContext, getI18n, initI18n } from '@/i18n/config';
import { WriterRequest } from '@/request';
import {
  AIAssistantType,
  ChatInputMode,
  CompletionResult,
  CompletionRole,
  OutputContent,
  OutputLayout,
  ResponseFormat,
} from '@/types';
import { ApplyingState, WriterContext } from '@/writer/context';
import { EditorData } from '@appflowyinc/editor';
import { findLast } from 'lodash-es';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

initI18n();

const i18n = getI18n();

export const AIAssistantProvider = ({
  isGlobalDocument,
  viewId,
  request,
  children,
  onReplace,
  onInsertBelow,
  onExit,
  scrollContainer,
}: {
  viewId: string,
  children: ReactNode;
  request: WriterRequest;
  onInsertBelow?: (data: EditorData) => void;
  onReplace?: (data: EditorData) => void;
  onExit?: () => void;
  isGlobalDocument?: boolean;
  scrollContainer?: HTMLElement;
}) => {
  const { t } = useTranslation();
  const completionHistoryRef = useRef<CompletionResult[]>([]);
  const [placeholderContent, setPlaceholderContent] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<{
    code: number;
    message: string;
  } | null>(null);
  const [editorData, setEditorData] = useState<EditorData>();
  const [assistantType, setAssistantType] = useState<AIAssistantType | undefined>(undefined);
  const lastAssistantTypeRef = useRef<AIAssistantType | undefined>(undefined);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [responseMode, setResponseMode] = useState<ChatInputMode>(ChatInputMode.Auto);
  const [responseFormat, setResponseFormat] = useState<ResponseFormat>({
    output_layout: OutputLayout.BulletList,
    output_content: OutputContent.TEXT,
  });

  const [openDiscard, setOpenDiscard] = useState<boolean>(false);
  const [ragIds, setRagIds] = useState<string[]>([]);
  const [applyingState, setApplyingState] = useState<ApplyingState>(ApplyingState.idle);
  const isApplying = applyingState === ApplyingState.applying;
  const cancelRef = useRef<(() => void) | undefined>();
  const initialScrollTopRef = useRef<number | null>(null);

  useEffect(() => {
    if(!assistantType) {
      cancelRef.current = undefined;
      completionHistoryRef.current = [];
      setResponseMode(ChatInputMode.Auto);
      setError(null);
      setResponseFormat({
        output_layout: OutputLayout.BulletList,
        output_content: OutputContent.TEXT,
      });
    }
  }, [assistantType]);

  const scrollToView = useCallback(() => {
    if(!initialScrollTopRef.current) {
      return;
    }

    const rect = document.getElementById('appflowy-ai-writer')?.getBoundingClientRect();

    if(rect && rect.top < 100) {
      scrollContainer?.scrollTo({
        top: initialScrollTopRef.current,
      });
    }

    initialScrollTopRef.current = null;
  }, [scrollContainer]);

  const handleMessageChange = useCallback((text: string, comment: string, done?: boolean) => {
    setFetching(false);

    setPlaceholderContent(text);
    setComment(comment);
    setApplyingState(ApplyingState.applying);

    if(initialScrollTopRef.current === null) {
      initialScrollTopRef.current = scrollContainer?.scrollTop || null;
    }
    if(done) {
      cancelRef.current = undefined;
      setApplyingState(ApplyingState.completed);
      completionHistoryRef.current.push({
        role: CompletionRole.AI,
        content: text,
      });
    }

  }, [scrollContainer]);

  const fetchRequest = useCallback(async(assistantType: AIAssistantType, content: string) => {
    // Do not change assistant type if there is already an AI response
    if(!completionHistoryRef.current.some(item => {
      return item.role === CompletionRole.AI;
    })) {
      lastAssistantTypeRef.current = assistantType;
      setAssistantType(assistantType);
    }

    setFetching(true);
    setError(null);
    try {
      setApplyingState(ApplyingState.analyzing);
      const { cancel, streamPromise } = await request.fetchAIAssistant({
        inputText: content,
        assistantType: lastAssistantTypeRef.current || assistantType,
        format: responseMode === ChatInputMode.FormatResponse ? responseFormat : undefined,
        ragIds,
        completionHistory: completionHistoryRef.current,
      }, handleMessageChange);

      completionHistoryRef.current.push({
        role: CompletionRole.Human,
        content,
      });

      cancelRef.current = cancel;
      await streamPromise;
      return cancel;
      // eslint-disable-next-line
    } catch(e: any) {
      setError(e);
      setApplyingState(ApplyingState.failed);
    } finally {
      setFetching(false);
    }

    return () => undefined;

  }, [handleMessageChange, ragIds, request, responseFormat, responseMode]);

  const improveWriting = useCallback(async(content: string) => {
    return fetchRequest(AIAssistantType.ImproveWriting, content);
  }, [fetchRequest]);

  const askAIAnything = useCallback((content: string) => {
    completionHistoryRef.current.push({
      role: CompletionRole.Human,
      content,
    });
    setAssistantType(AIAssistantType.AskAIAnything);
  }, []);

  const askAIAnythingWithRequest = useCallback((content: string) => {
    setApplyingState(ApplyingState.idle);
    setPlaceholderContent('');
    setComment('');
    setEditorData(undefined);
    scrollToView();
    return fetchRequest(AIAssistantType.AskAIAnything, content);
  }, [scrollToView, fetchRequest]);

  const continueWriting = useCallback(async(content: string) => {
    return fetchRequest(AIAssistantType.ContinueWriting, content);
  }, [fetchRequest]);

  const explain = useCallback((content: string) => {
    return fetchRequest(AIAssistantType.Explain, content);
  }, [fetchRequest]);

  const fixSpelling = useCallback((content: string) => {
    return fetchRequest(AIAssistantType.FixSpelling, content);
  }, [fetchRequest]);

  const makeLonger = useCallback((content: string) => {
    return fetchRequest(AIAssistantType.MakeLonger, content);
  }, [fetchRequest]);

  const makeShorter = useCallback((content: string) => {
    return fetchRequest(AIAssistantType.MakeShorter, content);
  }, [fetchRequest]);

  const stop = useCallback(() => {
    cancelRef.current?.();
    setApplyingState(ApplyingState.idle);
  }, []);

  const exit = useCallback((scrollLocked?: boolean) => {
    cancelRef.current?.();
    setApplyingState(ApplyingState.idle);
    cancelRef.current = undefined;
    completionHistoryRef.current = [];

    setTimeout(() => {
      lastAssistantTypeRef.current = undefined;
      setAssistantType(undefined);
      setPlaceholderContent('');
      if(!scrollLocked) {
        scrollToView();
      }
      setComment('');
      setEditorData(undefined);
      onExit?.();
    }, 0);

  }, [onExit, scrollToView]);

  const keep = useCallback(() => {
    if(!editorData) {
      return;
    }
    completionHistoryRef.current = [];

    if(isGlobalDocument) {
      onReplace?.(editorData);
    } else {
      onInsertBelow?.(editorData);
    }
    exit(true);

  }, [editorData, isGlobalDocument, exit, onReplace, onInsertBelow]);

  const accept = useCallback(() => {
    if(!editorData) {
      return;
    }
    completionHistoryRef.current = [];
    onReplace?.(editorData);
    exit(true);

  }, [editorData, onReplace, exit]);

  const rewrite = useCallback(() => {
    if(!assistantType) {
      toast({
        variant: 'destructive',
        description: t('writer.errors.noAssistantType'),
      });
      return;
    }

    setApplyingState(ApplyingState.idle);
    setPlaceholderContent('');
    setComment('');
    setEditorData(undefined);
    scrollToView();
    const content = findLast(completionHistoryRef.current, item => {
      return item.role === CompletionRole.Human;
    })?.content || '';

    switch(assistantType) {
      case AIAssistantType.ImproveWriting:
        return improveWriting(content);
      case AIAssistantType.AskAIAnything:
        return askAIAnythingWithRequest(content);
      case AIAssistantType.ContinueWriting:
        return continueWriting(content);
      case AIAssistantType.Explain:
        return explain(content);
      case AIAssistantType.FixSpelling:
        return fixSpelling(content);
      case AIAssistantType.MakeLonger:
        return makeLonger(content);
      case AIAssistantType.MakeShorter:
        return makeShorter(content);
    }
  }, [scrollToView, assistantType, t, improveWriting, askAIAnythingWithRequest, continueWriting, explain, fixSpelling, makeLonger, makeShorter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.ctrlKey && e.key === 'c') {
        stop();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [exit, stop]);

  const hasAIAnswer = useCallback(() => {
    return completionHistoryRef.current.some((item) => item.role === CompletionRole.AI);
  }, []);

  return (
    <WriterContext.Provider
      value={{
        viewId,
        fetchViews: request.fetchViews,
        placeholderContent,
        comment,
        improveWriting,
        assistantType,
        isFetching,
        isApplying,
        askAIAnything,
        continueWriting,
        explain,
        fixSpelling,
        makeLonger,
        makeShorter,
        askAIAnythingWithRequest,
        setOpenDiscard,
        applyingState,
        setRagIds,
        exit,
        setEditorData,
        keep,
        accept,
        rewrite,
        stop,
        responseMode,
        setResponseMode,
        responseFormat,
        setResponseFormat,
        isGlobalDocument,
        error,
        scrollContainer,
        hasAIAnswer,
      }}
    >

      <ChatI18nContext.Provider value={i18n}>
        <TooltipProvider>
          {children}
          <ConfirmDiscard
            open={openDiscard}
            onClose={() => setOpenDiscard(false)}
          />
        </TooltipProvider>
      </ChatI18nContext.Provider>
    </WriterContext.Provider>
  );
};
