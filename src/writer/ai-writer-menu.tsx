import { AiWriterMenuContent } from '@/components/ai-writer-menu/ai-writer-menu-content';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChatI18nContext, getI18n, initI18n } from '@/i18n/config';

initI18n();

const i18n = getI18n();

interface AIWriterMenuProps {
  children?: React.ReactNode;
}

export function AIWriterMenu({
  children,
}: AIWriterMenuProps) {
  return <Popover modal>
    <PopoverTrigger asChild={true}>
      {children}
    </PopoverTrigger>
    <PopoverContent>
      <ChatI18nContext.Provider value={i18n}>
        <AiWriterMenuContent />
      </ChatI18nContext.Provider>
    </PopoverContent>
  </Popover>;
}