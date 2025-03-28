import LoadingDots from '@/components/ui/loading-dots';
import { SearchInput } from '@/components/ui/search-input';
import { Spaces } from '@/components/chat-input/related-views/spaces';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DocIcon from '@/assets/icons/doc.svg?react';
import { Separator } from '@/components/ui/separator';
import { useChatSettingsLoader } from '@/hooks/use-chat-settings-loader';
import { useCheckboxTree } from '@/hooks/use-checkbox-tree';
import { useViewsLoader } from '@/hooks/use-views-loader';
import { searchViews } from '@/lib/views';
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
    fetchViews,
    viewsLoading,
  } = useViewsLoader();

  const [folder, setFolder] = useState<View | null>(null);

  useEffect(() => {
    void (async() => {
      const data = await fetchViews();
      if(!data) return;
      setFolder(data);
    })();
  }, [fetchViews]);

  const filteredSpaces = useMemo(() => {
    const spaces = folder?.children.filter(view => view.extra?.is_space);
    return searchViews(spaces || [], searchValue);
  }, [folder, searchValue]);

  const views = useMemo(() => {
    return folder?.children || [];
  }, [folder]);

  const {
    getSelected,
    getCheckStatus,
    toggleNode,
    getInitialExpand,
  } = useCheckboxTree(viewIds, views);

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
          disabled={viewsLoading}
          className={'text-sm h-7 p-1.5'}
          startIcon={
            <span className={'text-foreground'}><DocIcon /></span>
          }
          variant={'ghost'}
        >
          {length}
          {viewsLoading ? <LoadingDots size={12} /> : <ChevronDown className={'!w-2 !h-2'} />}

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
              getInitialExpand={getInitialExpand}
              spaces={filteredSpaces}
              viewsLoading={viewsLoading}
              getCheckStatus={getCheckStatus}
              onToggle={
                (view: View) => {
                  const ids = toggleNode(view);
                  void handleToggle(Array.from(ids));
                }
              }
            />
          </div>

        </div>
      </PopoverContent>
    </Popover>
  );
}

