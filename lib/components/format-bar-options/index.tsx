import { ActionBarAIButtonDataBtn } from "@appflowy-chat/utils/actionBarAIButtons";
import React, { ComponentProps, FC, ReactElement } from "react";
import ButtonBarAI from "../button-bar-ai";
import clsx from "clsx";

interface IProp extends ComponentProps<"div"> {
  options: ActionBarAIButtonDataBtn[];
  children?: ReactElement;
}

const FormatBarOptions: FC<IProp> = ({
  options,
  children = null,
  className = "",
  ...rest
}) => {
  return (
    <div className={clsx([" flex gap-1", className])} {...rest}>
      {options.map((option, index) => {
        return (
          <React.Fragment key={option.name}>
            {index === 3 && (
              <div className="h-6 flex items-center">
                <div className="h-4 w-[1px] bg-ch-line-divider"></div>
              </div>
            )}
            <ButtonBarAI
              icon={option.icon}
              tooltip={option.tooltip}
              iconMainWrapClass={
                option.name === "image_text"
                  ? "relative w-[1.56rem] h-full [&>svg]:absolute [&>svg]:left-0 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2  [&>svg]:w-[1.56rem] [&>svg]:h-[1.31rem]"
                  : undefined
              }
              // onClick={handleClick}
            />
          </React.Fragment>
        );
      })}

      {children}
    </div>
  );
};

export default FormatBarOptions;
