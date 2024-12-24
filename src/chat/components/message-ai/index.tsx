import { AIModelName } from "@/types";
import { FC, useState } from "react";
import MessageResponseContent from "../message-response-content";
import AvatarAI from "../avatar-ai";
import ActionBarAI from "../action-bar-ai";
import {
  useActionBarAIButtonsLastRes,
  useActionBarAIButtonsHoverRes,
} from "@appflowy-chat/utils/actionBarAIButtons";
import { ChatMessage } from "@/types/ai";
import "./index.css";

interface IProp {
  message: ChatMessage;
  isGenerating?: boolean;
  isLastResponse: boolean;
  onAIModelChange: (option: AIModelName) => void;
}

const MessageAI: FC<IProp> = ({ message, isLastResponse, onAIModelChange }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const ActionBarAIButtonsLastRes = useActionBarAIButtonsLastRes();
  const ActionBarAIButtonsHoverRes = useActionBarAIButtonsHoverRes();

  function handleOnAIModelChange(option: AIModelName) {
    console.log(option, "option");
    onAIModelChange(option);
  }

  function handleOnPopoverStateChange(isOpen: boolean) {
    setIsPopoverOpen(isOpen);
  }

  return (
    <div
      className="message-ai group flex w-full"
      data-popover-open={isPopoverOpen}
    >
      <div className="flex gap-3">
        <AvatarAI />

        <div className="flex flex-col">
          <div className="pt-2">
            <MessageResponseContent body={message.content} />
          </div>
          {isLastResponse ? (
            <ActionBarAI
              rootClasses="pt-4 pb-8"
              buttons={ActionBarAIButtonsLastRes}
              message={message}
              onAIModelChange={handleOnAIModelChange}
              onPopoverStateChange={handleOnPopoverStateChange}
            />
          ) : (
            <div className="message-ai-bar-wrap invisible relative opacity-0 transition-opacity hover:visible hover:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="absolute left-0 top-0 h-2 w-full"></div>
              <ActionBarAI
                rootClasses="absolute top-2 left-0 p-0.5 rounded-lg border border-ch-line-border shadow-light-menu"
                buttons={ActionBarAIButtonsHoverRes}
                message={message}
                onAIModelChange={handleOnAIModelChange}
                onPopoverStateChange={handleOnPopoverStateChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageAI;
