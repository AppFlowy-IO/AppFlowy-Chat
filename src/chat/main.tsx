// Code: Chat main component
import { ChatContext } from '@/chat/context';
import { ChatInput } from '@/components/chat-input';
import { ChatMessages } from '@/components/chat-messages';
import { cn } from '@/lib/utils';
import { MessageAnimationProvider } from '@/provider/message-animation-provider';
import { EditorProvider } from '@/provider/editor-provider';
import { MessagesHandlerProvider } from '@/provider/messages-handler-provider';
import { ChatMessagesProvider } from '@/provider/messages-provider';
import { PromptModalProvider } from '@/provider/prompt-modal-provider';
import { ResponseFormatProvider } from '@/provider/response-format-provider';
import { SelectionModeProvider } from '@/provider/selection-mode-provider';
import { SuggestionsProvider } from '@/provider/suggestions-provider';
import { ChatProps } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ViewLoaderProvider } from '@/provider/view-loader-provider';

function Main(props: ChatProps) {
  const { currentUser, selectionMode } = props;

  return (
    <ChatContext.Provider value={props}>
      <ChatMessagesProvider>
        <MessageAnimationProvider>
          <SuggestionsProvider>
            <EditorProvider>
              <SelectionModeProvider>
                <ResponseFormatProvider>
                  <ViewLoaderProvider
                    getView={(viewId: string, forceRefresh?: boolean) =>
                      props.requestInstance.getView(viewId, forceRefresh)
                    }
                    fetchViews={(forceRefresh?: boolean) =>
                      props.requestInstance.fetchViews(forceRefresh)
                    }
                  >
                    <PromptModalProvider
                      workspaceId={props.workspaceId}
                      loadDatabasePrompts={props.loadDatabasePrompts}
                      testDatabasePromptConfig={props.testDatabasePromptConfig}
                    >
                      <MessagesHandlerProvider>
                        <div className={'w-full relative h-full flex flex-col'}>
                          <ChatMessages currentUser={currentUser} />
                          <motion.div
                            layout
                            className={cn(
                              'w-full relative flex pb-6 justify-center max-sm:hidden',
                            )}
                          >
                            <AnimatePresence mode='wait'>
                              {!selectionMode && <ChatInput />}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      </MessagesHandlerProvider>
                    </PromptModalProvider>
                  </ViewLoaderProvider>
                </ResponseFormatProvider>
              </SelectionModeProvider>
            </EditorProvider>
          </SuggestionsProvider>
        </MessageAnimationProvider>
      </ChatMessagesProvider>
    </ChatContext.Provider>
  );
}

export default Main;
