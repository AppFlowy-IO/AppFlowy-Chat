import Main from '@/chat/main';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ChatI18nContext, getI18n, initI18n } from '@/i18n/config';
import { ChatProps } from '@/types';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/index.scss';

initI18n();
const i18n = getI18n();

export function Chat(props: ChatProps) {
  return (
    <div
      id={'appflowy-chat'}
      className={'w-full h-full overflow-hidden'}
    >
      <ChatI18nContext.Provider value={i18n}>
        <TooltipProvider>
          <Main {...props} />
        </TooltipProvider>
        <Toaster />
      </ChatI18nContext.Provider>
    </div>

  );
}

export default Chat;