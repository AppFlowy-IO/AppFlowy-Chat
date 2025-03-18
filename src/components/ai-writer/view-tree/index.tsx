import LoadingDots from '@/components/ui/loading-dots';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import { searchViews } from '@/lib/views';
import { Spaces } from './spaces';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SearchInput } from '@/components/ui/search-input';
import { Separator } from '@/components/ui/separator';
import { useCheckboxTree } from '@/hooks/use-checkbox-tree';
import { View } from '@/types';
import { useWriterContext } from '@/writer/context';
import { ChevronDown } from 'lucide-react';
import DocIcon from '@/assets/icons/doc.svg?react';
import { useEffect, useMemo, useState } from 'react';

export function ViewTree() {
  const [searchValue, setSearchValue] = useState('');
  const {
    viewId,
    setRagIds,
  } = useWriterContext();
  const { fetchViews } = useWriterContext();
  const [viewsLoading, setViewsLoading] = useState(true);
  const [folder, setFolder] = useState<View | null>(null);
  const viewIds = useMemo(() => [viewId], [viewId]);

  const { t } = useTranslation();

  useEffect(() => {
    void (async() => {
      setViewsLoading(true);
      try {
        const data = await fetchViews();
        if(!data) return;
        setFolder(data);
        // eslint-disable-next-line
      } catch(e: any) {
        toast({
          variant: 'destructive',
          description: e.message,
        });
      } finally {
        setViewsLoading(false);
      }
    })();
  }, [fetchViews]);

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

  const spaces = useMemo(() => {
    const spaces = folder?.children.filter(view => view.extra?.is_space);
    return searchViews(spaces || [], searchValue);
  }, [folder, searchValue]);

  return <Popover modal={false}>
    <PopoverTrigger asChild>
      <Button
        className={'text-xs !gap-1 !text-secondary-foreground h-[28px]'}
        startIcon={
          <DocIcon />
        }
        size={'sm'}
        variant={'ghost'}
        disabled={viewsLoading}
      >
        <div className={'flex gap-0.5 items-center flex-1'}>
          {length > 1 ? length : t('writer.current-page')}
          {viewsLoading ? <LoadingDots size={12} /> : <ChevronDown className={'!w-2 !h-2'} />}

        </div>

      </Button>
    </PopoverTrigger>
    <PopoverContent side={'top'}>
      <div className={'h-fit py-1 px-1 min-h-[200px] max-h-[360px] w-[300px] flex gap-2 flex-col'}>
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
        />
        <Separator />
        <div className={'overflow-x-hidden overflow-y-auto flex-1 appflowy-scrollbar'}>
          <Spaces
            viewsLoading={viewsLoading}
            spaces={spaces}
            getCheckStatus={getCheckStatus}
            getInitialExpand={getInitialExpand}
            onToggle={
              (view: View) => {
                if(view.view_id === viewId) return;
                const ids = toggleNode(view);
                setRagIds(Array.from(ids));
              }
            }
          />
        </div>

      </div>
    </PopoverContent>
  </Popover>;
}