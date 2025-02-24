import { useChatContext } from '@/chat/context';
import { useToast } from '@/hooks/use-toast';
import { ERROR_CODE_NO_LIMIT } from '@/lib/const';
import { useMessageAnimation } from '@/provider/message-animation-provider';
import { useChatMessagesContext } from '@/provider/messages-provider';
import { useSuggestionsContext } from '@/provider/suggestions-provider';
import {
  AuthorType,
  ChatMessageMetadata,
  GetChatMessagesPayload,
  MessageType,
  OutputContent,
  OutputLayout, RepeatedChatMessage,
  ResponseFormat,
} from '@/types';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface MessagesHandlerContextTypes {
  fetchMessages: (payload?: GetChatMessagesPayload) => Promise<RepeatedChatMessage>;
  submitQuestion: (message: string) => Promise<void>;
  regenerateAnswer: (questionId: number, format?: ResponseFormat) => Promise<void>;
  fetchAnswerStream: (questionId: number, format?: ResponseFormat, onMessage?: (text: string, done?: boolean) => void) => Promise<void>;
  cancelAnswerStream: () => void;
  questionSending: boolean;
  answerApplying: boolean;
}

export const MessagesHandlerContext = createContext<MessagesHandlerContextTypes | undefined>(undefined);

function useMessagesHandler() {
  const {
    chatId,
    requestInstance,
    currentUser,
  } = useChatContext();

  const {
    messageIds,
    addMessages,
    insertMessage,
    removeMessages,
    saveMessageContent,
    getMessage,
  } = useChatMessagesContext();

  const {
    toast,
  } = useToast();
  const { registerAnimation } = useMessageAnimation();
  const { registerFetchSuggestions, startFetchSuggestions } = useSuggestionsContext();
  const tempResponseFormat = useRef<ResponseFormat>();
  const [questionSending, setQuestionSending] = useState(false);
  const [answerApplying, setAnswerApplying] = useState(false);
  const cancelStreamRef = useRef<() => void>();

  useEffect(() => {
    return () => {
      setQuestionSending(false);
      setAnswerApplying(false);
      tempResponseFormat.current = undefined;
      cancelStreamRef.current = undefined;
    };
  }, [chatId]);

  const fetchMessages = useCallback(async(payload?: GetChatMessagesPayload) => {
    try {
      const data = await requestInstance.getChatMessages(payload);
      const messages = data.messages;
      addMessages(messages);

      return data;
      // eslint-disable-next-line
    } catch(e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      });
      return Promise.reject(e);
    }
  }, [requestInstance, toast, addMessages]);

  const createAssistantMessage = useCallback((answerId: number, index: number) => {

    registerAnimation(answerId);

    insertMessage({
      message_id: answerId,
      content: '',
      author: {
        author_uuid: 'assistant',
        author_type: AuthorType.Assistant,
      },
    }, index);

  }, [insertMessage, registerAnimation]);

  const regenerateAnswer = useCallback(async(questionId: number, format?: ResponseFormat) => {
    const question = getMessage(questionId);
    const answerId = question?.reply_message_id || questionId + 1;

    tempResponseFormat.current = format;

    const newMessages = removeMessages([answerId]);

    setTimeout(() => {
      const index = newMessages.map((message) => message.message_id).indexOf(questionId);
      createAssistantMessage(answerId, index);
    }, 200);

  }, [createAssistantMessage, getMessage, removeMessages]);

  const submitQuestion = useCallback(async(message: string) => {
    try {
      setQuestionSending(true);

      // insert fake message to show user message
      const fakeMessageId = Date.now();
      insertMessage({
        message_id: fakeMessageId,
        content: message,
        author: {
          author_uuid: currentUser?.uuid || '',
          author_type: AuthorType.Human,
        },
      }, 0);
      registerAnimation(fakeMessageId);

      const question = await requestInstance.submitQuestion({
        content: message,
        message_type: MessageType.User,
      });

      const answerId = question.reply_message_id || (question.message_id + 1);

      // remove fake message
      removeMessages([fakeMessageId]);

      insertMessage(question, 0);

      // clear suggestions and set placeholder for this question
      registerFetchSuggestions(question.message_id);

      // create assistant message after user message
      setTimeout(() => {
        createAssistantMessage(answerId, 0);
      }, 200);

      void (async() => {
        try {
          const view = await requestInstance.getCurrentView();
          if((!messageIds || messageIds.length === 0) && view) {
            await requestInstance.updateViewName(view, message);
          }
          // eslint-disable-next-line
        } catch(e: any) {
          toast({
            variant: 'destructive',
            description: e.message,
          });
        }
      })();

      // eslint-disable-next-line
    } catch(e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      });

      return Promise.reject(e);
    } finally {
      setQuestionSending(false);
    }
  }, [insertMessage, currentUser?.uuid, registerAnimation, requestInstance, removeMessages, registerFetchSuggestions, createAssistantMessage, messageIds, toast]);

  const saveAnswer = useCallback(
    async(
      questionId: number,
      content: string,
      metadata: ChatMessageMetadata[]
    ) => {
      try {
        const answer = await requestInstance.saveAnswer({
          question_message_id: questionId,
          content,
          ...(metadata.length !== 0 && { meta_data : metadata }),
        });

        saveMessageContent(answer.message_id, content, metadata);
        // eslint-disable-next-line
      } catch(e: any) {
        toast({
          variant: 'destructive',
          description: e.message,
        });
      }
    },
    [requestInstance, saveMessageContent, toast]
  );

  const removeAssistantMessage = useCallback((messageId: number) => {
    removeMessages([messageId]);
  }, [removeMessages]);

  const fetchAnswerStream = useCallback(async(questionId: number, format?: ResponseFormat, onMessage?: (text: string, done?: boolean) => void) => {
    const currentFormat = tempResponseFormat.current || format;
    tempResponseFormat.current = undefined;

    const question = getMessage(questionId);
    let answerId = question?.reply_message_id;
    if(!answerId) {
      answerId = questionId + 1;
    }

    const handleMessageProgress = (
      message: string,
      metadata: ChatMessageMetadata[],
      done?: boolean
    ) => {
      onMessage?.(message, done);

      if(done) {
        if(message) {
          void (async() => {
            await saveAnswer(questionId, message, metadata);
            setAnswerApplying(false);
            await startFetchSuggestions();
          })();
        } else {
          if(answerId) {
            removeAssistantMessage(answerId);
          }
          setAnswerApplying(false);
        }
        return;
      }

    };

    try {
      setAnswerApplying(true);
      const { cancel, streamPromise } = await requestInstance.fetchAnswerStream({
        question_id: questionId,
        format: currentFormat || {
          output_layout: OutputLayout.Paragraph,
          output_content: OutputContent.TEXT,
        },
      }, handleMessageProgress);
      cancelStreamRef.current = cancel;
      await streamPromise;
      // eslint-disable-next-line
    } catch(e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      });
      setAnswerApplying(false);
      const code = e.code;
      if(code !== ERROR_CODE_NO_LIMIT) {
        // remove assistant message if error is not no limit
        if(answerId) {
          removeAssistantMessage(answerId);
        }
        return;
      }

      // if error is no limit, show assistant message with error
      return Promise.reject(e);

    }
  }, [getMessage, saveAnswer, startFetchSuggestions, removeAssistantMessage, requestInstance, toast]);

  const cancelAnswerStream = useCallback(() => {
    if(cancelStreamRef.current) {
      cancelStreamRef.current();
    }
  }, []);

  return {
    fetchMessages,
    submitQuestion,
    regenerateAnswer,
    fetchAnswerStream,
    cancelAnswerStream,
    questionSending,
    answerApplying,
  };
}

export function MessagesHandlerProvider({ children }: { children: ReactNode }) {
  const value = useMessagesHandler();

  return (
    <MessagesHandlerContext.Provider value={value}>
      {children}
    </MessagesHandlerContext.Provider>
  );
}

export function useMessagesHandlerContext() {
  const context = useContext(MessagesHandlerContext);

  if(!context) {
    throw new Error('useMessagesHandlerContext must be used within a MessagesHandlerProvider');
  }

  return context;
}