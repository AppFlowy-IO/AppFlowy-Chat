import { AiWriterMenuContent } from '@/components/ai-writer/ai-writer-menu-content';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AIAssistantType } from '@/types';
import { useState } from 'react';

interface AIWriterMenuProps {
  children?: React.ReactNode;
  onItemClicked?: (type: AIAssistantType) => void;
  isFilterOut?: (type: AIAssistantType) => boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AIWriterMenu({
  children,
  ...props
}: AIWriterMenuProps) {
  const [open, setOpen] = useState(false);
  return <Popover
    open={open}
    onOpenChange={(status) => {
      setOpen(status);
      props.onOpenChange?.(status);
    }}
    modal
  >
    <PopoverTrigger asChild={true}>
      {children}
    </PopoverTrigger>
    <PopoverContent
      onOpenAutoFocus={e => e.preventDefault()}
      onCloseAutoFocus={e => e.preventDefault()}
    >
      <AiWriterMenuContent
        {...props}
        onClicked={(type) => {
          props.onItemClicked?.(type);
          setOpen(false);
        }}
      />

    </PopoverContent>
  </Popover>;
}