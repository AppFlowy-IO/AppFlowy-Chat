import { SearchInput } from '@/components/ui/search-input';
import { Spaces } from '@/components/chat-input/related-views/spaces';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DocIcon from '@/assets/icons/doc.svg?react';
import { Separator } from '@/components/ui/separator';
import { useChatSettingsLoader } from '@/hooks/use-chat-settings-loader';
import { useCheckboxTree } from '@/hooks/use-checkbox-tree';
import { View } from '@/types';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash-es/debounce';

export function RelatedViews() {

  const [searchValue, setSearchValue] = useState('');

  const {
    chatSettings,
    fetchChatSettings,
    updateChatSettings,
  } = useChatSettingsLoader();

  const viewIds = useMemo(() => {
    return chatSettings?.rag_ids || [];
  }, [chatSettings]);

  useEffect(() => {
    void fetchChatSettings();
  }, [fetchChatSettings]);

  const {
    getSelected,
    getCheckStatus,
    toggleNode,
  } = useCheckboxTree(viewIds);

  const length = getSelected().length;

  const handleToggle = useMemo(() => {
    return debounce(async(ids: string[]) => {
      await updateChatSettings({
        rag_ids: ids,
      });
    }, 500);
  }, [updateChatSettings]);

  return (
    <Popover modal>
      <PopoverTrigger asChild={true}>
        <Button
          className={'text-sm'}
          startIcon={
            <span className={'text-foreground'}><DocIcon /></span>
          }
          variant={'ghost'}
        >
          {length}
          <ChevronDown className={'w-3 h-3'} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className={'h-fit py-1 px-1 min-h-[200px] max-h-[360px] w-[300px] flex gap-2 flex-col'}>
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
          />
          <Separator />
          <div className={'overflow-x-hidden overflow-y-auto flex-1 appflowy-scrollbar'}>
            <Spaces
              searchValue={searchValue}
              getCheckStatus={getCheckStatus}
              onToggle={
                (view: View) => {
                  const ids = toggleNode(view);
                  handleToggle(Array.from(ids));
                }
              }
            />
          </div>

        </div>
      </PopoverContent>
    </Popover>
  );
}

