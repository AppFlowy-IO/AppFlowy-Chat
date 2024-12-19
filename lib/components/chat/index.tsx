import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ChatInput from '../chat-input/index';
import ContentEmpty from '../content-empty';
import {
  ChatMessageAI,
  FilePreview,
  ResponseFormatMode,
  ResponseFormatType,
} from '@appflowy-chat/types';
import MessageUser from '../message-user';
import MessageLoading from '../message-loading';
import MessageAI from '../message-ai';
import { chatHttpServiceMain } from '@appflowy-chat/services/http_service_impl';
import {
  ChatSettings,
  RepeatedChatMessage,
  ChatMessage as ChatMessage,
  ChatAuthorType,
  ChatMessageType,
  QuestionStreamValue,
  RelatedQuestion,
} from '@appflowy-chat/types/ai';
import { Response } from '@appflowy-chat/types/response';
import { v4 } from 'uuid';
import { ChatError } from '@appflowy-chat/types/error';
import InfiniteScroll from 'react-infinite-scroll-component';
import { wait } from '@appflowy-chat/utils/common';
import RelatedQuestionsBlock from '../related-questions';

interface IProp {
  userAvatar: string | null | undefined;
  workspaceId: string;
  initChatId: string;
}

const Chat: FC<IProp> = ({ userAvatar, initChatId, workspaceId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestion[]>(
    []
  );
  const [chatId, setChatId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ChatSettings>();
  const [inputValue, setInputValue] = useState('');
  const [responseFormatMode, setResponseFormatMode] =
    useState<ResponseFormatMode>('auto');
  const [responseFormatType, setResponseFormatType] =
    useState<ResponseFormatType>('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingBody, setGeneratingBody] = useState('');
  const [attachments, setAttachments] = useState<FilePreview[]>([]);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value);
  }
  function handleEmptyScreenOptionClick(option: string) {
    setInputValue(option);
  }
  async function handleSubmit() {
    if (isInitLoading) {
      return;
    }
    try {
      console.log(settings);
      setGeneratingBody('');
      setIsGenerating(true);
      const inputValueCurrent = inputValue;
      setInputValue('');
      setAttachments([]);
      let chatIdCurrent = chatId;
      if (!chatIdCurrent) {
        chatIdCurrent = v4();

        const chatNameNew = 'Unknown';
        const ragIdsNew: string[] = [];
        const rCreateChat = await chatHttpServiceMain.createChat(workspaceId, {
          chat_id: chatIdCurrent,
          name: chatNameNew,
          rag_ids: ragIdsNew,
        });
        if (rCreateChat.error) {
          throw rCreateChat.error;
        }

        setSettings({ name: chatNameNew, rag_ids: ragIdsNew, metadata: {} });
        setChatId(chatIdCurrent);
      }

      const rSendMessage = await chatHttpServiceMain.sendMessage(
        workspaceId,
        chatIdCurrent,
        { content: inputValueCurrent, message_type: ChatMessageType.User }
      );

      if (rSendMessage.isError()) {
        throw rSendMessage.error;
      }

      const newMessage = rSendMessage.data;

      if (!newMessage) {
        throw new Error('Can not get the new message body');
      }

      setRelatedQuestions([]);

      setMessages((prev) => {
        return [newMessage, ...prev];
      });

      const questionStream = await chatHttpServiceMain.streamMessageResponse(
        workspaceId,
        chatIdCurrent,
        newMessage?.message_id
      );
      if (!questionStream) {
        throw new Error('Error getting the response stream');
      }
      const resultStreamData: QuestionStreamValue[] = [];

      let generetingContent = '';
      let result = await questionStream.data?.next();
      while (result) {
        if (result && !(result instanceof ChatError)) {
          resultStreamData.push(result);
          if (result.type === 'Answer') {
            if (typeof result.value === 'string') {
              const resultStringValue = result.value;
              setGeneratingBody((prevValue) => {
                const newValue = prevValue + resultStringValue;
                generetingContent = newValue;
                return newValue;
              });
              scrollToContainerBottomWithDelay();
            }
          }
        }
        result = await questionStream.data?.next();
      }

      const newMessageResponseId = Date.now();
      const chatMessageAIResponse: ChatMessage = {
        author: { author_id: 1, author_type: ChatAuthorType.AI },
        message_id: newMessageResponseId,
        content: generetingContent,
        created_at: new Date(),
        meta_data: {},
        reply_message_id: newMessage.message_id,
      };

      setMessages((prev) => {
        return [chatMessageAIResponse, ...prev];
      });

      scrollToContainerBottomWithDelay();

      loadRelatedQuestions(chatIdCurrent, newMessageResponseId);

      setIsGenerating(false);
    } catch (e) {
      console.log(e);
      setIsGenerating(false);
    }
  }

  function handleStop() {
    console.log('STOP GENERATE');
  }
  function handleChangeFormatMode(value: ResponseFormatMode) {
    setResponseFormatMode(value);
  }
  function handleChangeFormatType(value: ResponseFormatType) {
    setResponseFormatType(value);
  }

  function handleMessageAIChange(data: {
    updValue: Pick<ChatMessageAI, 'aiModel'>;
    index: number;
  }) {
    setMessages((prevMessages) => {
      const updMessage = prevMessages[data.index];

      prevMessages[data.index] = { ...updMessage, ...data.updValue };
      return [...prevMessages];
    });
  }
  function handleAttachmentsChange(data: FilePreview[]) {
    setAttachments(data);
  }

  function handleClickRelatedQuestion(question: RelatedQuestion) {
    setInputValue(question.content);
  }
  function scrollToContainerBottom() {
    if (!chatContainerRef.current) {
      return;
    }

    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
    });
  }

  const scrollToContainerBottomWithDelay = useCallback(() => {
    setTimeout(() => {
      scrollToContainerBottom();
    }, 10);
  }, []);

  async function loadMoreMessages() {
    if (!chatId) {
      return;
    }
    try {
      await wait(500);

      const { data: getChatMessagesData } =
        await chatHttpServiceMain.getChatMessages(
          workspaceId,
          chatId,
          { type: 'Offset', value: messages.length },
          10
        );
      console.log(getChatMessagesData, 'getChatMessagesData');
      if (getChatMessagesData) {
        setMessages((prev) => [...prev, ...getChatMessagesData.messages]);
        setHasMoreMessages(getChatMessagesData?.has_more);
      } else {
        setHasMoreMessages(false);
      }
    } catch (e) {
      setHasMoreMessages(false);
      console.log(e);
    }
  }

  async function loadRelatedQuestions(chatId: string, messageId: number) {
    if (!chatId) {
      return;
    }
    try {
      const questionsResponse = await chatHttpServiceMain.getRelatedQuestions(
        workspaceId,
        chatId,
        messageId
      );

      setRelatedQuestions(questionsResponse.data || []);
    } catch (e) {
      console.log(e);
      setRelatedQuestions([]);
    }
  }
  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    async function loadChat() {
      if (initChatId) {
        try {
          setIsInitLoading(true);
          const promises = [
            chatHttpServiceMain.getChatSettings(workspaceId, initChatId),
            chatHttpServiceMain.getChatMessages(
              workspaceId,
              initChatId,
              {
                type: 'Offset',
                value: 0,
              },
              10
            ),
          ];

          const responses = await Promise.all(promises);

          const settingsResponse =
            responses[0] as Response<ChatSettings | null>;

          const messagesResponse =
            responses[1] as Response<RepeatedChatMessage | null>;

          if (settingsResponse.error || messagesResponse.error) {
            throw settingsResponse.error || messagesResponse.error;
          }
          if (!settingsResponse.data || !messagesResponse.data) {
            throw new Error(
              'Settings and messages should not be equal to null'
            );
          }

          setChatId(initChatId);
          setSettings(settingsResponse.data);
          setMessages(messagesResponse.data.messages);
          setHasMoreMessages(messagesResponse.data.has_more);

          setIsInitLoading(false);
          scrollToContainerBottomWithDelay();
        } catch (e) {
          console.log(e);

          setIsInitLoading(false);
        }
      } else {
        setIsInitLoading(false);
      }
    }

    loadChat();

    return () => {};
  }, [workspaceId, initChatId, scrollToContainerBottomWithDelay]);

  return (
    <div className='relative flex h-full flex-auto flex-col overflow-auto bg-ch-bg-base'>
      <div className='absolute left-0 top-0 flex h-full max-h-full w-full flex-col'>
        <header className='flex w-full flex-none items-center justify-between px-4 py-3'>
          <div className='text-sm text-ch-text-content'>
            <div>{settings?.name}</div>{' '}
          </div>
          <div>
            <button className='rounded-lg bg-ch-accent px-3 py-1.5 text-sm font-medium text-white'>
              Share
            </button>
          </div>
        </header>

        <div className='relative flex w-full flex-auto overflow-auto text-ch-text-content'>
          {isInitLoading ? (
            <div className='appflowy-chat-content-wrap flex min-h-full items-center justify-center py-4 text-sm text-ch-text-caption'>
              Loading...
            </div>
          ) : (
            <>
              {messages.length > 0 ? (
                <div
                  className='flex h-30 min-h-full w-full flex-col-reverse overflow-auto'
                  id='appflowy-chat-content-container'
                  ref={chatContainerRef}
                >
                  <div className='appflowy-chat-content-wrap'>
                    <InfiniteScroll
                      dataLength={messages.length}
                      next={loadMoreMessages}
                      inverse={true} //
                      hasMore={hasMoreMessages}
                      loader={
                        <div className='w-full text-center text-ch-text-caption'>
                          Loading...
                        </div>
                      }
                      scrollableTarget='appflowy-chat-content-container'
                      className='flex flex-col-reverse gap-4'
                    >
                      {!isGenerating && (
                        <RelatedQuestionsBlock
                          relatedQuestions={relatedQuestions}
                          onQuestionClick={handleClickRelatedQuestion}
                        />
                      )}
                      {isGenerating && <MessageLoading body={generatingBody} />}
                      {messages.map((message, index) => {
                        if (
                          message.author.author_type === ChatAuthorType.Human
                        ) {
                          return (
                            <MessageUser
                              avatar={userAvatar}
                              message={message}
                              key={message.message_id}
                            />
                          );
                        } else if (
                          message.author.author_type === ChatAuthorType.AI
                        ) {
                          return (
                            <MessageAI
                              message={message}
                              key={message.message_id}
                              isLastResponse={index === 0}
                              onAIModelChange={(option) =>
                                handleMessageAIChange({
                                  index,
                                  updValue: { aiModel: option },
                                })
                              }
                            />
                          );
                        } else {
                          return null;
                        }
                      })}
                    </InfiniteScroll>
                  </div>
                </div>
              ) : (
                <ContentEmpty
                  handleOptionClick={handleEmptyScreenOptionClick}
                />
              )}
            </>
          )}
        </div>
        <div className='w-full'>
          <div className='appflowy-chat-content-wrap pb-4 pt-2'>
            <ChatInput
              value={inputValue}
              formatMode={responseFormatMode}
              formatType={responseFormatType}
              isGenerating={isGenerating}
              attachments={attachments}
              onAttachmentsChange={handleAttachmentsChange}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onStop={handleStop}
              onChangeFormatMode={handleChangeFormatMode}
              onChangeFormatType={handleChangeFormatType}
              ref={chatInputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
