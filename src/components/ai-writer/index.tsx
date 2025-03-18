import { Error } from '@/components/ai-writer/error';
import { Loading } from '@/components/ai-writer/loading';
import { AskAnything } from '@/components/ai-writer/tools/ask-anything';
import { Explain } from '@/components/ai-writer/tools/explain';
import { FixSpelling } from '@/components/ai-writer/tools/fix-spelling';
import { ImproveWriting } from '@/components/ai-writer/tools/improve-writing';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AIAssistantType } from '@/types';
import { useWriterContext } from '@/writer/context';
import { useCallback, useMemo } from 'react';

export function AIAssistant({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { assistantType, isFetching, exit, isApplying, error } = useWriterContext();
  const open = Boolean(assistantType);

  const Tool = useMemo(() => {
    if(error) return <Error />;
    if(isApplying || isFetching) return <Loading />;
    switch(assistantType) {
      case AIAssistantType.AskAIAnything:
      case AIAssistantType.ContinueWriting:
        return <AskAnything />;

      case AIAssistantType.Explain:
        return <Explain />;

      case AIAssistantType.FixSpelling:
        return <FixSpelling />;

      case AIAssistantType.ImproveWriting:
      case AIAssistantType.MakeLonger:
      case AIAssistantType.MakeShorter:
        return <ImproveWriting />;
      default:
        return null;
    }
  }, [error, isApplying, isFetching, assistantType]);

  const handleOpenChange = useCallback((status: boolean) => {
    if(!status) {
      exit();
    }
  }, [exit]);

  return <Popover
    onOpenChange={handleOpenChange}
    open={open}
  >
    <PopoverTrigger>{children}</PopoverTrigger>
    <PopoverContent
      id={'ai-assistant'}
      className={'w-[600px] !bg-transparent max-w-full'}
      side={'bottom'}
      avoidCollisions={false}
      collisionPadding={0}
      align={'start'}
      style={{
        borderWidth: 0,
        boxShadow: 'none',
        padding: 0,
      }}
    >{Tool}
    </PopoverContent>
  </Popover>;
}