import { useViewLoader } from '@/chat';
import LoadingDots from '@/components/ui/loading-dots';
import SpaceItem from '@/components/view/space-item';
import { useTranslation } from '@/i18n';
import { hasDatabaseViewChild, searchDatabaseViews } from '@/lib/views';
import { View } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ViewList from './view-list';

export function SpaceList({
  searchValue,
  onSelectDatabaseView: onSelectDatabaseView,
}: {
  searchValue: string;
  onSelectDatabaseView: (viewId: string) => void;
}) {
  const { t } = useTranslation();

  const { fetchViews, viewsLoading } = useViewLoader();

  const [folder, setFolder] = useState<View | null>(null);

  const filterDatabaseViews = useCallback((views: View[]): View[] => {
    return views
      .filter((view) => hasDatabaseViewChild(view))
      .map((view) => ({
        ...view,
        children:
          view.children.length > 0 ? filterDatabaseViews(view.children) : [],
      }));
  }, []);

  useEffect(() => {
    void (async () => {
      const data = await fetchViews((v) => v);
      if (!data) return;
      setFolder(data);
    })();
  }, [fetchViews, filterDatabaseViews]);

  const filteredSpaces = useMemo(() => {
    const spaces = folder?.children.filter((view) => view.extra?.is_space);
    const filteredViews = spaces ? filterDatabaseViews(spaces) : [];
    return searchDatabaseViews(filteredViews || [], searchValue);
  }, [filterDatabaseViews, folder?.children, searchValue]);

  if (viewsLoading) {
    return (
      <div className={'flex w-full h-full  py-10 items-center justify-center'}>
        <LoadingDots />
      </div>
    );
  }

  if (!filteredSpaces || filteredSpaces.length === 0) {
    return (
      <div
        className={
          'flex w-full opacity-60 h-full py-10 items-center justify-center'
        }
      >
        {t('search.noSpacesFound')}
      </div>
    );
  }

  return (
    <div className={'flex flex-col gap-1 w-full h-full'}>
      {filteredSpaces.map((view: View) => {
        return (
          <SpaceItem key={view.view_id} view={view}>
            <ViewList onSelectDatabaseView={onSelectDatabaseView} item={view} />
          </SpaceItem>
        );
      })}
    </div>
  );
}
