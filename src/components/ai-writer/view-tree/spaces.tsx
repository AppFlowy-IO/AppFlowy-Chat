import ViewChildren from '@/components/chat-input/related-views/view-children';
import SpaceItem from '@/components/view/space-item';
import LoadingDots from '@/components/ui/loading-dots';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import { searchViews } from '@/lib/views';
import { View } from '@/types';
import { CheckStatus } from '@/types/checkbox';
import { useWriterContext } from '@/writer/context';
import { useEffect, useMemo, useState } from 'react';

interface SpacesProps {
  searchValue: string;
  getCheckStatus: (view: View) => CheckStatus;
  onToggle: (view: View) => void;
}

export function Spaces({
  searchValue,
  getCheckStatus,
  onToggle,
}: SpacesProps) {
  const { t } = useTranslation();

  const { fetchViews } = useWriterContext();
  const [viewsLoading, setViewsLoading] = useState(true);
  const [folder, setFolder] = useState<View | null>(null);

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

  const filteredSpaces = useMemo(() => {
    const spaces = folder?.children.filter(view => view.extra?.is_space);
    return searchViews(spaces || [], searchValue);
  }, [folder, searchValue]);

  if(viewsLoading) {
    return <div className={'flex w-full h-full items-center py-10 justify-center'}>
      <LoadingDots />
    </div>;
  }

  if(!filteredSpaces || filteredSpaces.length === 0) {
    return <div className={'flex w-full opacity-60 h-full py-10 items-center justify-center'}>
      {t('search.noSpacesFound')}
    </div>;
  }

  return (
    <div className={'flex flex-col gap-1 h-full w-full'}>
      {filteredSpaces.map((view: View) => {
        return (
          <SpaceItem
            key={view.view_id}
            view={view}
          >
            <ViewChildren
              item={view}
              onToggle={onToggle}
              getCheckStatus={getCheckStatus}
            />
          </SpaceItem>
        );
      })}
    </div>
  );
}

