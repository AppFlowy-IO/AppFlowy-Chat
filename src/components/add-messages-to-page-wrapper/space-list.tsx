import ViewList from '@/components/add-messages-to-page-wrapper/view-list';
import { Button } from '@/components/ui/button';
import LoadingDots from '@/components/ui/loading-dots';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SpaceItem from '@/components/view/space-item';
import { useTranslation } from '@/i18n';
import { searchViews } from '@/lib/views';
import { View } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useViewLoader } from '@/chat';

export function SpaceList({
  searchValue,
  onCreateViewWithContent,
  onInsertContentToView,
}: {
  searchValue: string;
  onCreateViewWithContent: (parentViewId: string) => void;
  onInsertContentToView: (viewId: string) => void;
}) {
  const { t } = useTranslation();

  const {
    fetchViews,
    viewsLoading,
  } = useViewLoader();

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

  if(viewsLoading) {
    return <div className={'flex w-full h-full  py-10 items-center justify-center'}>
      <LoadingDots />
    </div>;
  }

  if(!filteredSpaces || filteredSpaces.length === 0) {
    return <div className={'flex w-full opacity-60 h-full py-10 items-center justify-center'}>
      {t('search.noSpacesFound')}
    </div>;
  }

  return (
    <div className={'flex flex-col gap-1 w-full h-full'}>
      {filteredSpaces.map((view: View) => {
        return (
          <SpaceItem
            key={view.view_id}
            view={view}
            extraNode={<TooltipProvider><Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    onCreateViewWithContent(view.view_id);
                  }}
                  variant={'ghost'}
                  className={'!w-5 !h-5 !p-0 rounded-md hover:bg-muted-foreground/10'}
                >
                  <PlusIcon
                    className={'w-4 h-4'}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t('addMessageToPage.createNewPage')}
              </TooltipContent>
            </Tooltip>
            </TooltipProvider>
            }
          >
            <ViewList
              onCreateViewWithContent={onCreateViewWithContent}
              onInsertContentToView={onInsertContentToView}
              item={view}
            />
          </SpaceItem>
        );
      })}
    </div>
  );
}

