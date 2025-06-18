import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { AiPrompt } from '@/types/prompt';
import { useRef, useState } from 'react';

export function PromptCard({
  prompt,
  isSelected,
  onPreview,
  onUsePrompt,
}: {
  prompt: AiPrompt;
  isSelected: boolean;
  onPreview: () => void;
  onUsePrompt: () => void;
}) {
  const { t } = useTranslation();

  const timerRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = window.setTimeout(() => {
      onPreview();
      timerRef.current = null;
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onPreview();
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isUsePromptHovered, setIsUsePromptHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        handleMouseEnter();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      className={cn(
        'relative rounded-[8px] border',
        isSelected
          ? isHovered
            ? 'border-border-theme-thick-hover'
            : 'border-border-theme-thick'
          : isHovered
            ? 'border-border-primary-hover'
            : 'border-border-primary',
      )}
    >
      <div
        className='flex flex-col p-2 cursor-default'
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleClick}
      >
        <span className='truncate text-sm'>{prompt.name}</span>
        <span className='text-xs text-gray-500 line-clamp-2'>
          {prompt.content}
        </span>
      </div>
      {isHovered && (
        <div
          className={cn(
            'absolute right-1.5 top-1.5 shadow-md rounded-[8px] border border-border-primary px-2 py-1.5 cursor-pointer text-sm',
            isUsePromptHovered
              ? 'bg-surface-primary-hover'
              : 'bg-surface-primary',
          )}
          onMouseEnter={() => setIsUsePromptHovered(true)}
          onMouseLeave={() => setIsUsePromptHovered(false)}
          onClick={onUsePrompt}
        >
          {t('customPrompt.usePrompt')}
        </div>
      )}
    </div>
  );
}
