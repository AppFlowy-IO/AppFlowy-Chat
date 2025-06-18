import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AiPromptCategory } from '@/types/prompt';
import { Separator } from '@/components/ui/separator';
import { useMemo } from 'react';
import { useTranslation } from '@/i18n';

export function PromptCategory({
  isFeaturedSelected,
  isCustomSelected,
  selectedCatecory,
  setIsFeaturedSelected,
  setIsCustomSelected,
  setSelectedCategory,
}: {
  isFeaturedSelected: boolean;
  isCustomSelected: boolean;
  selectedCatecory: AiPromptCategory | null;
  setIsFeaturedSelected: (value: boolean) => void;
  setIsCustomSelected: (value: boolean) => void;
  setSelectedCategory: (category: AiPromptCategory | null) => void;
}) {
  const { t } = useTranslation();

  const isAllSelected = useMemo(() => {
    return !isCustomSelected && !isFeaturedSelected && !selectedCatecory;
  }, [isCustomSelected, isFeaturedSelected, selectedCatecory]);

  const categoryList = useMemo(() => {
    const categories = Object.values(AiPromptCategory);

    const withoutOthers = categories.filter(
      (category) => category !== 'others',
    );

    const sorted = withoutOthers
      .slice()
      .sort((a, b) =>
        t(`customPrompt.${a}`).localeCompare(t(`customPrompt.${b}`)),
      );

    return [...sorted, 'others'];
  }, [t]);

  return (
    <>
      <div className='flex flex-col pr-3'>
        <Button
          variant={'ghost'}
          onClick={() => {
            setIsFeaturedSelected(true);
            setIsCustomSelected(false);
            setSelectedCategory(null);
          }}
          className={cn(
            'flex justify-start !text-text-primary',
            isFeaturedSelected ? 'bg-fill-theme-select' : '',
          )}
        >
          {t('customPrompt.featured')}
        </Button>
        {/* <Button
          variant={'ghost'}
          onClick={() => {
            setIsCustomSelected(true);
            setIsFeaturedSelected(false);
            setSelectedCategory(null);
          }}
          className={cn(
            'flex justify-start !text-text-primary',
            isCustomSelected ? 'bg-fill-theme-select' : '',
          )}
        >
          {t('customPrompt.custom')}
        </Button> */}
        <Separator className='mt-2' />
      </div>
      <div className='flex flex-1 flex-col overflow-auto pt-2 justify-between pr-3'>
        <Button
          variant={'ghost'}
          onClick={() => {
            setSelectedCategory(null);
            setIsCustomSelected(false);
            setIsFeaturedSelected(false);
          }}
          className={cn(
            'flex flex-shrink-0 justify-start !text-text-primary',
            isAllSelected && 'bg-fill-theme-select',
          )}
        >
          {t('customPrompt.all')}
        </Button>
        {categoryList.map((category) => (
          <Button
            key={category ?? 'all'}
            variant={'ghost'}
            onClick={() => {
              setSelectedCategory(category as AiPromptCategory | null);
              setIsFeaturedSelected(false);
              setIsCustomSelected(false);
            }}
            className={cn(
              'flex flex-shrink-0 justify-start !text-text-primary',
              selectedCatecory === category ? 'bg-fill-theme-select' : '',
            )}
          >
            {t(`customPrompt.${category}`, category)}
          </Button>
        ))}
      </div>
    </>
  );
}
