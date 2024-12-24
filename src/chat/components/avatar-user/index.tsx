import { FC } from "react";

interface IProps {
  url: string;
}

const MessageCardAvatar: FC<IProps> = ({ url }) => {
  return (
    <div className="w-8 h-8 rounded-full border border-ch-line-border overflow-hidden flex-shrink-0">
      <img src={url} className="w-full h-full object-contain" />
    </div>
  );
};

export default MessageCardAvatar;
