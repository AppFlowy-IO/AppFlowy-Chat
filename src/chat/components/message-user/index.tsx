import { FC } from "react";
import AvatarUser from "../avatar-user";
import { ChatMessage } from "@/types/ai";

interface IProp {
  message: ChatMessage;
  avatar: string | null | undefined;
}

const MessageUser: FC<IProp> = ({ message, avatar }) => {
  return (
    <div className="flex w-full justify-end">
      <div className="flex max-w-[25rem] gap-3">
        <div className="rounded-2xl bg-secondary px-4 py-2 text-sm">
          {message.content}
        </div>

        <AvatarUser url={avatar || ""} />
      </div>
    </div>
  );
};

export default MessageUser;
