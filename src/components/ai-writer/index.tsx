import { usePromptModal } from '@/chat';
import { ConfirmDiscard } from '@/components/ai-writer/confirm-discard';
import { Error } from '@/components/ai-writer/error';
import { Loading } from '@/components/ai-writer/loading';
import { AskAnything } from '@/components/ai-writer/tools/ask-anything';
import { Explain } from '@/components/ai-writer/tools/explain';
import { FixSpelling } from '@/components/ai-writer/tools/fix-spelling';
import { ImproveWriting } from '@/components/ai-writer/tools/improve-writing';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from '@/i18n';
import { AIAssistantType } from '@/types';
import { useWriterContext } from '@/writer/context';
import { useCallback, useEffect, useMemo, useState } from 'react';

type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent;
}>;
type FocusOutsideEvent = CustomEvent<{
  originalEvent: FocusEvent;
}>;

export function AIAssistant({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const {
    assistantType,
    isFetching,
    exit,
    isApplying,
    error,
    scrollContainer,
    hasAIAnswer,
  } = useWriterContext();
  const open = Boolean(assistantType);
  const [openModal, setOpenModal] = useState(false);
  
  const {
    isOpen
  } = usePromptModal();

  const Tool = useMemo(() => {
    if(error) return <Error />;
    if(isApplying || isFetching) return <Loading />;
    switch(assistantType) {
      case AIAssistantType.AskAIAnything:
        return <AskAnything title={t('writer.askAI')} />;
      case AIAssistantType.ContinueWriting:
        return <AskAnything title={t('writer.continue')} />;

      case AIAssistantType.Explain:
        return <Explain />;

      case AIAssistantType.FixSpelling:
        return <FixSpelling />;

      case AIAssistantType.ImproveWriting:
        return <ImproveWriting title={t('writer.improve')} />;
      case AIAssistantType.MakeLonger:
        return <ImproveWriting title={t('writer.makeLonger')} />;
      case AIAssistantType.MakeShorter:
        return <ImproveWriting title={t('writer.makeShorter')} />;
      default:
        return null;
    }
  }, [error, isApplying, isFetching, assistantType, t]);

  const handleOpenChange = useCallback((status: boolean) => {
    if(!status) {
      exit();
    }
  }, [exit]);

  const [width, setWidth] = useState<number>(600);

  useEffect(() => {
    const container = document.getElementById('appflowy-ai-writer');

    if(container && open) {
      setWidth(container.clientWidth);
    }
    if(scrollContainer) {
      if(open) {
        scrollContainer.style.userSelect = 'none';
      } else {
        scrollContainer.style.userSelect = 'auto';
      }
    }

  }, [open, scrollContainer]);

  const onInteractOutside = useCallback((e: PointerDownOutsideEvent | FocusOutsideEvent) => {
    if(hasAIAnswer()) {
      e.preventDefault();
      e.stopPropagation();
      e.detail.originalEvent.preventDefault();
      setOpenModal(true);
    }
  }, [hasAIAnswer]);

  return <>
    <Popover
      onOpenChange={handleOpenChange}
      open={open}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      {open && <PopoverContent
        onMouseDown={e => {
          e.stopPropagation();
        }}
        onEscapeKeyDown={e => {
          if (isOpen) {
            e.preventDefault();
            return;
          }
          if (openModal) {
            e.preventDefault();
            e.stopPropagation();
            setOpenModal(false);
            return;
          }
          if(hasAIAnswer()) {
            e.preventDefault();
            e.stopPropagation();
            setOpenModal(true);
          }
        }}
        disableOutsidePointerEvents
        onInteractOutside={onInteractOutside}
        container={scrollContainer || document.body}
        forceMount
        id={'ai-assistant'}
        className={'relative !bg-transparent max-w-full'}
        side={'bottom'}
        avoidCollisions={false}
        collisionPadding={0}
        align={'start'}
        style={{
          width,
          borderWidth: 0,
          boxShadow: 'none',
          padding: 0,
          userSelect: 'none',
        }}
      >{Tool}
        <ConfirmDiscard
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
        />
      </PopoverContent>}

    </Popover>

  </>;
}