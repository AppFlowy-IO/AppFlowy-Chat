import { useChatContext } from '@/chat/context';
import { SpaceList } from '@/components/add-messages-to-page-wrapper/space-list';
import { Label } from '@/components/ui/label';
import { SearchInput } from '@/components/ui/search-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useViewsLoader } from '@/hooks/use-views-loader';
import { useTranslation } from '@/i18n';
import { useEditorContext } from '@/provider/editor-provider';
import { useChatMessagesContext } from '@/provider/messages-provider';
import { ChatMessage } from '@/types';
import { useCallback, useState } from 'react';

export function AddMessageToPageWrapper({ onFinished, messages, children }: {
  messages: ChatMessage[];
  children?: React.ReactNode;
  onFinished?: () => void;
}) {

  const {
    getMessage,
    messageIds,
  } = useChatMessagesContext();

  const {
    openingViewId,
  } = useChatContext();

  const {
    getEditor,
  } = useEditorContext();
  const {
    getView,
    createViewWithContent,
    insertContentToView,
  } = useViewsLoader();

  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const getData = useCallback(() => {
    return messages.flatMap(item => {
      const editor = getEditor(item.message_id);
      return editor?.getData() || [];
    });
  }, [messages, getEditor]);

  const handleCreateViewWithContent = useCallback(async(parentViewId: string) => {
    const data = getData();
    const index = messageIds.indexOf(messages[0].message_id) - 1;
    const questionId = messageIds[index];
    const question = questionId ? getMessage(questionId) : undefined;
    const name = `Messages extracted from "${question?.content}"`;

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
  }, [onFinished, createViewWithContent, getData, getMessage, messageIds, messages, t]);

  const handleInsertContentToView = useCallback(async(viewId: string) => {
    const data = getData();
    const view = await getView(viewId, false);

    try {
      await insertContentToView(viewId, data);
      toast({
        variant: 'success',
        description: t('success.addMessageToPage', {
          name: view?.name || t('view.placeholder'),
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
  }, [onFinished, getData, getView, insertContentToView, t]);

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

