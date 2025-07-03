import { useChatContext } from '@/chat/context';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/i18n';
import { ChatMessageMetadata, View } from '@/types';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import DocumentIcon from '@/assets/icons/doc.svg?react';
import { useViewLoader } from '@/chat';

function MessageSources({
  sources,
}: {
  sources: ChatMessageMetadata[]
}) {
  const {
    getView,
  } = useViewLoader();
  const {
    onOpenView,
  } = useChatContext();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);

  const [views, setViews] = useState<View[]>([]);

  useEffect(() => {
    void (async() => {
      const views = [];
      for(const source of sources) {
        const view = await getView(source.id, false);
        if(!view) {
          continue;
        }
        views.push({
          ...view,
          name: view.name || t('view.placeholder'),
        });
      }
      setViews(views);
    })();
  }, [getView, sources, t]);

  return (
    <div className={'flex flex-col pb-2 max-sm:hidden'}>
      <Button
        onClick={() => setExpanded(!expanded)}
        variant={'link'}
        className={'w-full opacity-60 !no-underline hover:text-primary text-foreground justify-start'}
      >
        <span>{t('sources.label', {
          sourceCount: sources.length,
        })}</span>

        <ChevronDown className={`w-4 h-4 ml-1 ${expanded ? 'transform rotate-180' : ''}`} />
      </Button>
      {
        expanded && (
          <div className={'flex items-start flex-wrap gap-2'}>
            {views.map((source, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={
                      () => onOpenView?.(source.view_id)
                    }
                    variant={'ghost'}
                    className={'overflow-hidden max-w-[160px]'}
                    startIcon={
                      <DocumentIcon />
                    }
                  >
                    <span className={'text-foreground truncate'}>{source.name}</span>

                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {source.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )
      }
    </div>
  );
}

export default MessageSources;