import ChevronDown from '@/assets/icons/drop_menu_show.svg?react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PageIcon from '@/components/view/page-icon';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { View } from '@/types';
import { CheckStatus } from '@/types/checkbox';
import { CheckSquare, Minus, Square } from 'lucide-react';
import { useMemo, useState } from 'react';

export function ViewItem({ view, children, getCheckStatus, onToggle, getInitialExpand }: {
  view: View;
  children?: React.ReactNode;
  getCheckStatus: (view: View) => CheckStatus;
  onToggle: (view: View) => void;
  getInitialExpand: (viewId: string) => boolean;
}) {
  const [expanded, setExpanded] = useState(() => {
    return getInitialExpand(view.view_id);
  });
  const { t } = useTranslation();

  const name = view.name || t('view.placeholder');
  const checkStatus = getCheckStatus(view);
  const CheckboxIcon = useMemo(() => {
    switch(checkStatus) {
      case CheckStatus.Checked:
        return <CheckSquare className="h-4 w-4 text-primary" />;
      case CheckStatus.Indeterminate:
        return <Square className="h-4 w-4  text-primary"><Minus className="h-3 w-3" /></Square>;
      default:
        return <Square className="h-4 w-4" />;
    }
  }, [checkStatus]);

  const ToggleButton = useMemo(() => {
    return view.children.length > 0 ? (
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(prev => !prev);
        }}
        className={'!w-4 !h-4 !min-w-4 !min-h-4 hover:bg-muted-foreground/10'}
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
        onClick={(e) => {
          e.stopPropagation();
          onToggle(view);
        }}
        className={'px-1.5 h-[28px] w-full select-none text-sm cursor-pointer rounded-[8px] flex items-center justify-between gap-2 hover:bg-muted'}
      >
        <div className={'flex items-center gap-2 w-full overflow-hidden'}>
          <div
            className={'flex cursor-pointer items-center gap-0.5'}
          >
            {ToggleButton}
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4 mr-1"
            >
              {CheckboxIcon}
            </Button>
            <PageIcon view={view} />
          </div>
          <TooltipProvider>
            <Tooltip disableHoverableContent={true}>
              <TooltipTrigger asChild>
                <span className={'flex-1 truncate'}>{name}</span>
              </TooltipTrigger>
              <TooltipContent>
                {name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {expanded && children}
    </div>
  );
}

