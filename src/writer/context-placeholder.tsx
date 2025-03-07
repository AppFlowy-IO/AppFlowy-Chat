import { TooltipProvider } from '@/components/ui/tooltip';
import { ChatI18nContext, getI18n, initI18n } from '@/i18n/config';
import { Toaster } from '@/components/ui/toaster';
import { Main } from '@/writer/main';
import { EditorProvider } from '@appflowyinc/editor';

initI18n();

const i18n = getI18n();

export function ContextPlaceholder() {

  return <div
    id={'appflowy-ai-writer'}
    className={'w-full h-full overflow-hidden'}
  >
    <ChatI18nContext.Provider value={i18n}>
      <TooltipProvider>
        <EditorProvider>
          <Main />
        </EditorProvider>
      </TooltipProvider>
      <Toaster />
    </ChatI18nContext.Provider>
  </div>;
}