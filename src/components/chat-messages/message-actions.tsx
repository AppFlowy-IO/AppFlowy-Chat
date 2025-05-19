import CopyIcon from '@/assets/icons/copy.svg?react';

import { useChatContext } from '@/chat/context';
import AddMessageTo from '@/components/chat-messages/add-message-to';
import Regenerations from '@/components/chat-messages/regenerations';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import { convertToAppFlowyFragment } from '@/lib/copy';
import { cn, convertToPageData } from '@/lib/utils';
import { useEditorContext } from '@/provider/editor-provider';
import { useChatMessagesContext } from '@/provider/messages-provider';
import { useCallback, useEffect, useRef, useState } from 'react';

export function MessageActions({
  id,
  isHovered,
}: {
  id: number;
  isHovered: boolean;
}) {
  const {
    toast,
  } = useToast();

  const {
    getMessage,
    messageIds,
  } = useChatMessagesContext();

  const {
    selectionMode,
  } = useChatContext();

  const { getEditor } = useEditorContext();

  const isLast = messageIds.indexOf(id) === 0;
  const [visible, setVisible] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const {
    t,
  } = useTranslation();

  useEffect(() => {
    if(isLast) {
      setVisible(true);
      return;
    }

    setVisible(isHovered);
  }, [isLast, isHovered]);

  const message = getMessage(id);

  const handleCopy = useCallback(async() => {
    const message = getMessage(id);
    if(!message) {
      return;
    }
    const editor = getEditor(id);
    if(!editor) return;
    try {
      const data = editor?.getData();

      const newJson = convertToPageData(data);

      const stringifies = JSON.stringify(newJson, null, 2);

      document.addEventListener('copy', (e: ClipboardEvent) => {
        e.preventDefault();
        e.clipboardData?.setData('text/plain', message.content);
        e.clipboardData?.setData('application/json', stringifies);

        const { key, value } = convertToAppFlowyFragment(data);
        e.clipboardData?.setData(key, value);
      }, { once: true });

      document.execCommand('copy');

      toast({
        variant: 'success',
        description: t('success.copied'),
        duration: 2000,
      });
      // eslint-disable-next-line
    } catch(e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        description: t('errors.copied'),
        duration: 2000,
      });
    }

  }, [getEditor, getMessage, id, t, toast]);

  if(selectionMode) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex max-sm:hidden gap-2 min-w-none w-fit mt-2",
        isLast
          ? `min-h-[28px]`
          : `min-h-[34px] ${isHovered ? 'p-0.5 border border-border rounded-[8px]' : ''}`
      )}
    >
      {visible && message && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onMouseDown={e => {
                  e.preventDefault();
                }}
                variant={'ghost'}
                size={'icon'}
                className={`h-7 !p-0 w-7`}
                onClick={handleCopy}
              >
                <CopyIcon
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
              </Button>
            </TooltipTrigger>

            <TooltipContent
              align={'center'}
              side={'bottom'}
            >
              {t('button.copyClipboard')}
            </TooltipContent>
          </Tooltip>
          <Regenerations id={id} />
          <AddMessageTo id={id} />
        </>
      )}
    </div>

  );
}

