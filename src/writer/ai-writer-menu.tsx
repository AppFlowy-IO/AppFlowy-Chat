import { AiWriterMenuContent } from '@/components/ai-writer/ai-writer-menu-content';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AIAssistantType } from '@/types';

interface AIWriterMenuProps {
  children?: React.ReactNode;
  onItemClicked?: (type: AIAssistantType) => void;
  isFilterOut?: (type: AIAssistantType) => boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  input: string;
}

export function AIWriterMenu({
  children,
  open,
  onOpenChange,
  ...props
}: AIWriterMenuProps) {
  return <Popover
    open={open}
    modal
    onOpenChange={onOpenChange}
  >
    <PopoverTrigger
      asChild={true}
    >
      {children}
    </PopoverTrigger>
    <PopoverContent
      onOpenAutoFocus={e => e.preventDefault()}
      onCloseAutoFocus={e => e.preventDefault()}
      className={'min-w-[240px] !p-2'}
    >
      <AiWriterMenuContent
        {...props}
        onClicked={(type) => {
          props.onItemClicked?.(type);
          onOpenChange?.(false);
        }}
      />

    </PopoverContent>
  </Popover>;
}