import ChevronDown from '@/assets/icons/drop_menu_show.svg?react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PageIcon from '@/components/view/page-icon';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { View } from '@/types';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import AddPageIcon from '@/assets/icons/doc-forward.svg?react';

export function ViewItem({ view, children, onCreateViewWithContent, onInsertContentToView }: {
  view: View;
  children?: React.ReactNode;
  onCreateViewWithContent: (parentViewId: string) => void;
  onInsertContentToView: (viewId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const [isHovering, setIsHovering] = useState(false);
  const name = view.name || t('view.placeholder');

  return (
    <div className={'flex flex-col'}>
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setExpanded(!expanded)}
        className={'px-1.5 h-[28px] w-full select-none text-sm cursor-pointer rounded-[8px] flex items-center justify-between gap-2 hover:bg-muted'}
      >
        <div className={'flex items-center gap-2 w-full overflow-hidden'}>
          <div className={'flex items-center gap-0.5'}>
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
        {isHovering && (
          <div
            onClick={e => {
              e.stopPropagation();
            }}
            className={'flex items-center gap-1'}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onInsertContentToView(view.view_id)}
                    variant={'ghost'}
                    className={'!w-5 !h-5 !p-0 rounded-md hover:bg-muted-foreground/10'}
                  >
                    <AddPageIcon
                      className={'w-4 h-4'}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('button.addToPage')}
                </TooltipContent>
              </Tooltip>


              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
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
          </div>
        )}
      </div>
      {expanded && children}
    </div>
  );
}

