import ViewChildren from '@/components/view/view-children';
import SpaceItem from '@/components/view/space-item';
import LoadingDots from '@/components/ui/loading-dots';
import { useTranslation } from '@/i18n';
import { View } from '@/types';
import { CheckStatus } from '@/types/checkbox';

interface SpacesProps {
  getCheckStatus: (view: View) => CheckStatus;
  getInitialExpand: (viewId: string) => boolean;
  onToggle: (view: View) => void;
  spaces: View[];
  viewsLoading: boolean;
}

export function Spaces({
  getCheckStatus,
  onToggle,
  spaces,
  viewsLoading,
  getInitialExpand,
}: SpacesProps) {
  const { t } = useTranslation();

  if(viewsLoading) {
    return <div className={'flex w-full h-full items-center py-10 justify-center'}>
      <LoadingDots />
    </div>;
  }

  if(!spaces || spaces.length === 0) {
    return <div className={'flex w-full opacity-60 h-full py-10 items-center justify-center'}>
      {t('search.noSpacesFound')}
    </div>;
  }

  return (
    <div className={'flex flex-col gap-1 h-full w-full'}>
      {spaces.map((view: View) => {
        return (
          <SpaceItem
            key={view.view_id}
            view={view}
            getInitialExpand={getInitialExpand}
          >
            <ViewChildren
              item={view}
              onToggle={onToggle}
              getCheckStatus={getCheckStatus}
              getInitialExpand={getInitialExpand}
            />
          </SpaceItem>
        );
      })}
    </div>
  );
}

