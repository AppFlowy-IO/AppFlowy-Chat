import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SearchInput } from '@/components/ui/search-input';
import { Separator } from '@/components/ui/separator';
import { ReactNode, useState } from 'react';
import { SpaceList } from './space-list';

export function PromptDatabaseViews({
  onSelectView,
  children,
}: {
  onSelectView: (viewId: string) => void;
  children: ReactNode;
}) {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDatabaseView = (viewId: string) => {
    if (!viewId) return;
    onSelectView(viewId);
    setIsOpen(false);
  };

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <div className='h-fit py-1 px-1 min-h-[200px] max-h-[360px] w-[300px] flex gap-2 flex-col'>
          <SearchInput value={searchValue} onChange={setSearchValue} />
          <Separator />
          <div className='overflow-x-hidden overflow-y-auto flex-1 appflowy-scrollbar'>
            <SpaceList
              searchValue={searchValue}
              onSelectDatabaseView={handleSelectDatabaseView}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
