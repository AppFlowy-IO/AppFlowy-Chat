import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/i18n';
import { cn, getIcon, renderColor, stringToColor } from '@/lib/utils';
import { View } from '@/types';
import ChevronDown from '@/assets/icons/drop_menu_show.svg?react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Button } from '../ui/button';

function SpaceItem({
  view,
  extraNode,
  children,
  getInitialExpand,
}: {
  view: View;
  extraNode?: ReactNode;
  children?: ReactNode;
  getInitialExpand?: (viewId: string) => boolean;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(() => {
    return getInitialExpand?.(view.view_id) || false;
  });

  const [iconSvg, setIconSvg] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    void (async() => {
      const icon = view.extra?.space_icon;

      if(icon) {
        const svg = await getIcon(icon);
        if(svg) {
          setIconSvg(svg);
        }
      }
    })();
  }, [view.extra]);

  const icon = useMemo(() => {

    const cleanSvg = iconSvg ? DOMPurify.sanitize(iconSvg.replace('black', 'white').replace('<svg', '<svg width="100%" height="100%"'), {
      USE_PROFILES: { svg: true, svgFilters: true },
    }) : null;

    return <span
      style={{
        backgroundColor: view.extra?.space_icon_color ? renderColor(view.extra?.space_icon_color) : stringToColor(view.name),
      }}
      className={cn('flex w-[18px] h-[18px] p-1 rounded-md items-center justify-center')}
    >{cleanSvg ? <span
      dangerouslySetInnerHTML={{
        __html: cleanSvg,
      }}
    /> : <span className={'text-primary-foreground'}>{view.name.slice(0, 1)}</span>}</span>;
  }, [iconSvg, view.extra?.space_icon_color, view.name]);

  const ToggleButton = useMemo(() => {
    return view.children.length > 0 ? (
      <Button
        variant={'ghost'}
        size={'icon'}
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

  const name = view.name || t('view.placeholder');
  return (
    <div
      className={'flex flex-col'}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setExpanded(!expanded)}
        className={'px-1.5 h-[28px] select-none text-sm cursor-pointer rounded-[8px] flex items-center justify-between gap-2 hover:bg-muted'}
      >
        <div className={'flex items-center gap-2  w-full overflow-hidden'}>
          <div className={'flex items-center gap-0.5'}>
            {ToggleButton}
            {icon}
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
        {isHovered ? extraNode : null}
      </div>
      {expanded && children}
    </div>
  );
}

export default SpaceItem;