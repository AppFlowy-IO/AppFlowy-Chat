import { AddMessageToPageWrapper } from '@/components/add-messages-to-page-wrapper';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AddPageIcon from '@/assets/icons/doc-forward.svg?react';
import { useTranslation } from '@/i18n';
import { useChatMessagesContext } from '@/provider/messages-provider';

export function AddMessageTo({ id }: {
  id: number
}) {
  const {
    getMessage,
  } = useChatMessagesContext();

  const message = getMessage(id);
  const {
    t,
  } = useTranslation();

  if(!message) return null;

  return (
    <Tooltip>
      <AddMessageToPageWrapper messages={[message]}>
        <TooltipTrigger asChild>
          <Button
            onMouseDown={e => {
              e.preventDefault();
            }}
            variant={'ghost'}
            size={'icon'}
            className={`h-7 !p-0 w-7`}
          >
            <AddPageIcon
              style={{
                width: 16,
                height: 16,
              }}
            />
          </Button>
        </TooltipTrigger>

      </AddMessageToPageWrapper>

      <TooltipContent
        align={'center'}
        side={'bottom'}
      >
        {t('button.addToPage')}
      </TooltipContent>
    </Tooltip>
  );
}

export default AddMessageTo;