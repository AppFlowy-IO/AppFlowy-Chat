import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FC, ReactElement } from "react";
import "./index.css";

interface IProp {
  children: ReactElement;
  title: string;
}

const TooltipDefault: FC<IProp> = ({ children, title }) => {
  return (
    <Tooltip>
      <TooltipContent>{title}</TooltipContent>
      <TooltipTrigger asChild>
        <div>
          {children}
        </div>

      </TooltipTrigger>
    </Tooltip>
  );
};

export default TooltipDefault;
