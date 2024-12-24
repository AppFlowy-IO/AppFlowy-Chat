import { FC } from 'react';
import LoaderDots from '../loader-dots';
import MessageResponseContent from '../message-response-content';
import AvatarAI from '../avatar-ai';
import { useTranslation } from '@/i18n';

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
            <div className='text-ch-primary-gray2 flex items-center gap-2 text-sm'>
              <div>{t('loading.generate')}</div>
              <LoaderDots />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageLoading;
