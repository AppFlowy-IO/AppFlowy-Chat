import Logo from '@/assets/logo.svg?react';
import { FC, useMemo } from 'react';
import { useTranslation } from '@/i18n';

interface IProps {
  handleOptionClick: (option: string) => void;
}

const ContentEmpty: FC<IProps> = ({ handleOptionClick }) => {
  const { t } = useTranslation();
  const options = useMemo(() => [
    t("prompt.kanban"),
    t("prompt.gtd"),
    t("prompt.rust"),
    t("prompt.recipe"),
  ], [t]);
  return (
    <div className='appflowy-chat-content-wrap flex min-h-min items-center justify-center'>
      <div className='w-full max-w-[28rem] text-sm'>
        <div className='mb-4 flex w-full justify-center'>
          <Logo />
        </div>
        <div className='text-ch-text-title mb-8 text-center'>
          {t('title.greeting')}
        </div>
        <div className='flex flex-col items-center gap-4'>
          {options.map((option) => (
            <button
              className='border-ch-line-border bg-ch-bg-base text-ch-text-caption hover:bg-ch-fill-active w-fit rounded-2xl border px-4 py-2 text-sm shadow-card transition-colors'
              key={option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
          <button></button>
        </div>
      </div>
    </div>
  );
};

export default ContentEmpty;
