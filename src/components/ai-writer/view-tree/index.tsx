import { useTranslation } from '@/i18n';
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
import { useMemo, useState } from 'react';

export function ViewTree() {
  const [searchValue, setSearchValue] = useState('');
  const {
    viewId,
    setRagIds,
  } = useWriterContext();

  const viewIds = useMemo(() => [viewId], [viewId]);
  const {
    getSelected,
    getCheckStatus,
    toggleNode,
  } = useCheckboxTree(viewIds);
  const { t } = useTranslation();

  const length = getSelected().length;

  return <Popover modal>
    <PopoverTrigger asChild>
      <Button
        className={'text-xs !text-icon h-[28px]'}
        startIcon={
          <DocIcon />
        }
        size={'sm'}
        variant={'ghost'}
      >
        {length > 1 ? length : t('writer.current-page')}
        <ChevronDown className={'!w-3 !h-3'} />
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
            searchValue={searchValue}
            getCheckStatus={getCheckStatus}
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