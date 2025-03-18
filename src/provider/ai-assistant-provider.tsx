import { ConfirmDiscard } from '@/components/ai-writer/confirm-discard';
import { usePromptGenerator } from '@/components/ai-writer/use-prompt-generator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import { ChatI18nContext, getI18n, initI18n } from '@/i18n/config';
import { WriterRequest } from '@/request';
import { ChatInputMode, OutputContent, OutputLayout, ResponseFormat } from '@/types';
import { AIAssistantType } from '@/types/writer';
import { ApplyingState, WriterContext } from '@/writer/context';
import { EditorData } from '@appflowyinc/editor';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

initI18n();

const i18n = getI18n();

export const AIAssistantProvider = ({ isGlobalDocument, viewId, request, children, onReplace, onInsertBelow, onExit }: {
  viewId: string,
  children: ReactNode;
  request: WriterRequest;
  onInsertBelow?: (data: EditorData) => void;
  onReplace?: (data: EditorData) => void;
  onExit?: () => void;
  isGlobalDocument?: boolean;
}) => {
  const { t } = useTranslation();
  const [inputContext, setInputContext] = useState<string>('');
  const allResponse = useRef<string>('');
  const [placeholderContent, setPlaceholderContent] = useState<string>('');
  const [error, setError] = useState<{
    code: number;
    message: string;
  } | null>(null);
  const previousAskInput = useRef<string>('');
  const [editorData, setEditorData] = useState<EditorData>();
  const [assistantType, setAssistantType] = useState<AIAssistantType | undefined>(undefined);
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
  const { generatePrompt } = usePromptGenerator();

  useEffect(() => {
    if(!assistantType) {
      cancelRef.current = undefined;
      allResponse.current = '';
      previousAskInput.current = '';
    }
  }, [assistantType]);

  const handleMessageChange = useCallback((text: string, done?: boolean) => {
    setFetching(false);

    setPlaceholderContent(text);

    allResponse.current += '\n' + text;

    if(done) {
      cancelRef.current = undefined;
      setApplyingState(ApplyingState.completed);
    }

  }, []);

  const fetchRequest = useCallback(async(assistantType: AIAssistantType, content: string) => {
    setAssistantType(assistantType);
    setFetching(true);
    setError(null);
    try {
      const { cancel } = await request.fetchAIAssistant({
        inputText: content,
        assistantType: AIAssistantType.ImproveWriting,
        format: responseMode === ChatInputMode.FormatResponse ? responseFormat : undefined,
        ragIds,
      }, handleMessageChange);
      setApplyingState(ApplyingState.applying);

      cancelRef.current = cancel;
      return cancel;
      // eslint-disable-next-line
    } catch(e: any) {
      setError(e);
      setApplyingState(ApplyingState.failed);
      toast({
        variant: 'destructive',
        description: e.message,
      });
    } finally {
      setFetching(false);
    }

    return () => undefined;

  }, [handleMessageChange, ragIds, request, responseFormat, responseMode]);

  const improveWriting = useCallback(async(content?: string) => {
    const prompt = generatePrompt({
      originalText: inputContext,
      userInput: content,
      instructionType: 'improve_writing',
      previousResponse: allResponse.current,
    });

    return fetchRequest(AIAssistantType.ImproveWriting, prompt);
  }, [fetchRequest, generatePrompt, inputContext]);

  const askAIAnything = useCallback((content?: string) => {
    if(content) {
      setInputContext(content);
    }
    setAssistantType(AIAssistantType.AskAIAnything);
  }, []);

  const askAIAnythingWithRequest = useCallback((content?: string) => {
    previousAskInput.current = content || '';
    const prompt = generatePrompt({
      originalText: inputContext,
      userInput: content,
      instructionType: 'rewrite',
      previousResponse: allResponse.current,
    });

    return fetchRequest(AIAssistantType.AskAIAnything, prompt);
  }, [fetchRequest, generatePrompt, inputContext]);

  const continueWriting = useCallback(async(content?: string) => {
    const prompt = generatePrompt({
      originalText: inputContext,
      userInput: content,
      instructionType: 'continue_writing',
      previousResponse: allResponse.current,
    });
    return fetchRequest(AIAssistantType.ContinueWriting, prompt);
  }, [fetchRequest, generatePrompt, inputContext]);

  const explain = useCallback((content?: string) => {
    const prompt = generatePrompt({
      originalText: inputContext,
      userInput: content,
      instructionType: 'explain',
    });
    return fetchRequest(AIAssistantType.Explain, prompt);
  }, [fetchRequest, generatePrompt, inputContext]);

  const fixSpelling = useCallback((content?: string) => {
    const prompt = generatePrompt({
      originalText: inputContext,
      userInput: content,
      instructionType: 'fix_spelling_grammar',
    });
    return fetchRequest(AIAssistantType.FixSpelling, prompt);
  }, [fetchRequest, generatePrompt, inputContext]);

  const makeLonger = useCallback((content?: string) => {
    const prompt = generatePrompt({
      originalText: inputContext,
      userInput: content,
      instructionType: 'make_longer',
      previousResponse: allResponse.current,
    });
    return fetchRequest(AIAssistantType.MakeLonger, prompt);
  }, [fetchRequest, generatePrompt, inputContext]);

  const makeShorter = useCallback((content?: string) => {
    const prompt = generatePrompt({
      originalText: inputContext,
      userInput: content,
      instructionType: 'make_shorter',
      previousResponse: allResponse.current,
    });
    return fetchRequest(AIAssistantType.MakeShorter, prompt);
  }, [fetchRequest, generatePrompt, inputContext]);

  const stop = useCallback(() => {
    cancelRef.current?.();
    setApplyingState(ApplyingState.idle);
  }, []);

  const exit = useCallback(() => {
    cancelRef.current?.();
    setApplyingState(ApplyingState.idle);
    cancelRef.current = undefined;
    setTimeout(() => {
      setAssistantType(undefined);
      setPlaceholderContent('');
      setEditorData(undefined);
      setInputContext('');
      onExit?.();
    }, 0);

  }, [onExit]);

  const keep = useCallback(() => {
    if(!editorData) {
      return;
    }
    onInsertBelow?.(editorData);
    exit();
  }, [exit, editorData, onInsertBelow]);

  const accept = useCallback(() => {
    if(!editorData) {
      return;
    }
    onReplace?.(editorData);
    exit();
  }, [exit, editorData, onReplace]);

  const rewrite = useCallback((content?: string) => {
    if(!assistantType) {
      toast({
        variant: 'destructive',
        description: t('writer.errors.noAssistantType'),
      });
      return;
    }

    setApplyingState(ApplyingState.idle);
    setPlaceholderContent('');
    setEditorData(undefined);
    switch(assistantType) {
      case AIAssistantType.ImproveWriting:
        return improveWriting(content);
      case AIAssistantType.AskAIAnything:
        return askAIAnythingWithRequest(previousAskInput.current);
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
  }, [assistantType, t, improveWriting, askAIAnythingWithRequest, continueWriting, explain, fixSpelling, makeLonger, makeShorter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.key === 'Escape') {
        exit();
        // ctrl + c to stop
      } else if(e.ctrlKey && e.key === 'c') {
        stop();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [exit, stop]);

  return (
    <WriterContext.Provider
      value={{
        viewId,
        fetchViews: request.fetchViews,
        placeholderContent,
        setPlaceholderContent,
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
        inputContext,
        setInputContext,
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
