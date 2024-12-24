import { FC, ReactNode } from 'react';

import { TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import * as React from 'react';

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  icon: ReactNode;
  tooltip: string;
  active?: boolean;
  iconMainWrapClass?: string;
  activeClass?: string;
  colorClass?: string;
  children?: ReactNode;
}

const ButtonBarAI: FC<Props> = ({
  icon,
  tooltip,
  children,
  ...rest
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
      <Button
        variant={'ghost'}
        size={'icon'}
        color={'default'}
        startIcon={icon}
        {...rest}
      >
        {children && children}
      </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export default ButtonBarAI;
