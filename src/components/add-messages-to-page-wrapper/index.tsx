import { useChatContext } from '@/chat/context';
import { SpaceList } from '@/components/add-messages-to-page-wrapper/space-list';
import { Label } from '@/components/ui/label';
import { SearchInput } from '@/components/ui/search-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useViewContentInserter } from '@/hooks/use-view-content-inserter';
import { useTranslation } from '@/i18n';
import { useEditorContext } from '@/provider/editor-provider';
import { ChatMessage } from '@/types';
import { useCallback, useState } from 'react';
import { useViewLoader } from '@/chat';

export function AddMessageToPageWrapper({ onFinished, messages, children }: {
  messages: ChatMessage[];
  children?: React.ReactNode;
  onFinished?: () => void;
}) {
  const {
    openingViewId,
    chatId,
  } = useChatContext();
  
  const { getView } = useViewLoader();
  const { getEditor } = useEditorContext();
  const {
    createViewWithContent,
    insertContentToView,
  } = useViewContentInserter();

  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const getData = useCallback(() => {
    return messages.reverse().flatMap(item => {
      const editor = getEditor(item.message_id);
      return editor?.getData() || [];
    });
  }, [messages, getEditor]);

  const handleCreateViewWithContent = useCallback(async(parentViewId: string) => {
    const data = getData();
    const chat = await getView(chatId, false);

    const name = `Messages extracted from "${chat?.name || 'Untitled'}"`;

    try {
      await createViewWithContent(parentViewId, name, data);
      toast({
        variant: 'success',
        description: t('success.addMessageToPage', {
          name,
        }),
      });
      onFinished?.();
      // eslint-disable-next-line
    } catch(e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      });
    }
  }, [getData, getView, chatId, createViewWithContent, t, onFinished]);

  const handleInsertContentToView = useCallback(async(viewId: string) => {
    const data = getData();
    const chat = await getView(chatId, false);

    try {
      await insertContentToView(viewId, data);
      toast({
        variant: 'success',
        description: t('success.addMessageToPage', {
          name: chat?.name || t('view.placeholder'),
        }),
      });
      onFinished?.();
      // eslint-disable-next-line
    } catch(e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      });
    }
  }, [getData, getView, chatId, insertContentToView, t, onFinished]);

  if(openingViewId) {
    return <div
      onClick={async() => {
        await handleInsertContentToView(openingViewId);
      }}
    >{children}</div>;
  }

  return (
    <Popover modal>
      <PopoverTrigger
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <div className={'h-fit py-1 px-1 min-h-[200px] max-h-[360px] w-[300px] flex gap-2 flex-col'}>
          <Label className={'font-normal opacity-60'}>{t('addMessageToPage.placeholder')}</Label>

          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
          />
          <Separator />
          <div className={'overflow-x-hidden overflow-y-auto flex-1  appflowy-scrollbar'}>
            <SpaceList
              onCreateViewWithContent={handleCreateViewWithContent}
              onInsertContentToView={handleInsertContentToView}
              searchValue={searchValue}
            />
          </div>

        </div>
      </PopoverContent>
    </Popover>
  );
}

