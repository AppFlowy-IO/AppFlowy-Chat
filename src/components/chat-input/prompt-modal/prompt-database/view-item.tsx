import ChevronDown from '@/assets/icons/drop_menu_show.svg?react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import PageIcon from '@/components/view/page-icon';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { View } from '@/types';
import { useMemo, useState } from 'react';

export function ViewItem({
  view,
  children,
  onSelectDatabaseView,
}: {
  view: View;
  children?: React.ReactNode;
  onSelectDatabaseView: (viewId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const name = view.name || t('view.placeholder');

  const ToggleButton = useMemo(() => {
    return view.children.length > 0 ? (
      <Button
        variant={'ghost'}
        size={'icon'}
        className={'!w-4 !h-4 !min-w-4 !min-h-4 hover:bg-muted-foreground/10'}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        <ChevronDown
          className={cn(
            'transform transition-transform',
            expanded ? 'rotate-0' : '-rotate-90',
          )}
        />
      </Button>
    ) : (
      <div style={{ width: 16, height: 16 }}></div>
    );
  }, [expanded, view.children.length]);

  return (
    <div className={'flex flex-col'}>
      <div
        onClick={() => onSelectDatabaseView(view.view_id)}
        className={
          'px-1.5 h-[28px] w-full select-none text-sm cursor-pointer rounded-[8px] flex items-center justify-between gap-2 hover:bg-muted'
        }
      >
        <div className={'flex items-center gap-2 w-full overflow-hidden'}>
          <div className={'flex items-center gap-0.5'}>
            {ToggleButton}
            <PageIcon view={view} />
          </div>
          <TooltipProvider>
            <Tooltip disableHoverableContent={true}>
              <TooltipTrigger asChild>
                <span className={'flex-1 truncate'}>{name}</span>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {expanded && children}
    </div>
  );
}
