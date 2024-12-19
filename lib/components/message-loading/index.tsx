import { FC } from 'react';
import LoaderDots from '../loader-dots';
import MessageResponseContent from '../message-response-content';
import AvatarAI from '../avatar-ai';
import { useTranslation } from 'react-i18next';

interface IProp {
  body: string;
}

const MessageLoading: FC<IProp> = ({ body }) => {
  const { t } = useTranslation();
  return (
    <div className='mb-2 flex w-full'>
      <div className='flex gap-3'>
        <AvatarAI />

        <div className='pt-2'>
          {body ? (
            <MessageResponseContent body={body} />
          ) : (
            <div className='flex items-center gap-2 text-sm text-ch-primary-gray2'>
              <div>{t('chat.loading.generate')}</div>
              <LoaderDots />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageLoading;
