import Logo from '@appflowy-chat/assets/logo.svg?react';
import { ContentEmptyOptions } from '@appflowy-chat/utils/contentEmptyOptions';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  handleOptionClick: (option: string) => void;
}

const ContentEmpty: FC<IProps> = ({ handleOptionClick }) => {
  const { t } = useTranslation();
  return (
    <div className='appflowy-chat-content-wrap flex min-h-min items-center justify-center'>
      <div className='w-full max-w-[28rem] text-sm'>
        <div className='mb-4 flex w-full justify-center'>
          <Logo />
        </div>
        <div className='mb-8 text-center text-ch-text-title'>
          {t('chat.title.greeting')}
        </div>
        <div className='flex flex-col items-center gap-4'>
          {ContentEmptyOptions.map((option) => (
            <button
              className='w-fit rounded-2xl border border-ch-line-border bg-ch-bg-base px-4 py-2 text-sm text-ch-text-caption shadow-card transition-colors hover:bg-ch-fill-active'
              key={option}
              onClick={() => handleOptionClick(t(option))}
            >
              {t(option)}
            </button>
          ))}
          <button></button>
        </div>
      </div>
    </div>
  );
};

export default ContentEmpty;
