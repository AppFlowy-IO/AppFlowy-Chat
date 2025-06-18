import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { AiPrompt } from '@/types/prompt';
import { useMemo } from 'react';

export function PromptPreview({
  prompt,
  onUsePrompt,
}: {
  prompt: AiPrompt;
  onUsePrompt: () => void;
}) {
  const { t } = useTranslation();

  const formattedContent = useMemo(() => {
    if (!prompt?.content) return null;

    const parts = prompt.content.split(/(\[.*?\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className='text-text-featured'>
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }, [prompt?.content]);

  return (
    <>
      <div className='flex items-center justify-between gap-1.5'>
        <span className='text-lg'>{prompt?.name}</span>
        <Button onClick={onUsePrompt} className='px-4 py-1.5'>
          {t('customPrompt.usePrompt')}
        </Button>
      </div>
      <div className='flex flex-col gap-4 overflow-y-scroll'>
        <div className='flex flex-col gap-1'>
          <span className=''>{t('customPrompt.prompt')}</span>
          <span className='text-sm p-3 rounded-[8px] bg-surface-container-layer01 whitespace-pre-wrap'>
            {formattedContent}
          </span>
        </div>
        {prompt?.example && (
          <div className='flex flex-col gap-1'>
            <span className=''>{t('customPrompt.promptExample')}</span>
            <span className='text-sm p-3 rounded-[8px] bg-surface-container-layer01 whitespace-pre-wrap'>
              {prompt?.example}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
