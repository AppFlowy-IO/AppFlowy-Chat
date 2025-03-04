// Code: Chat main component
import { ChatContext } from '@/chat/context';
import { ChatInput } from '@/components/chat-input';
import { ChatMessages } from '@/components/chat-messages';
import { cn } from '@/lib/utils';
import { MessageAnimationProvider } from '@/provider/message-animation-provider';
import { EditorProvider } from '@/provider/editor-provider';
import { MessagesHandlerProvider } from '@/provider/messages-handler-provider';
import { ChatMessagesProvider } from '@/provider/messages-provider';
import { ResponseFormatProvider } from '@/provider/response-format-provider';
import { SelectionModeProvider } from '@/provider/selection-mode-provider';
import { SuggestionsProvider } from '@/provider/suggestions-provider';
import { ChatProps } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';

function Main(props: ChatProps) {
  const {
    currentUser,
    selectionMode,
  } = props;

  return (
    <ChatContext.Provider
      value={props}
    >
      <ChatMessagesProvider>
        <MessageAnimationProvider>
          <SuggestionsProvider>
            <EditorProvider>
              <SelectionModeProvider>
                <ResponseFormatProvider>
                  <MessagesHandlerProvider>
                    <div className={'w-full relative h-full flex flex-col'}>
                      <ChatMessages currentUser={currentUser} />
                      <motion.div
                        layout
                        className={cn('w-full relative flex py-6 justify-center max-sm:hidden')}
                      >
                        <AnimatePresence mode="wait">
                          {!selectionMode && <ChatInput />}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </MessagesHandlerProvider>
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