import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { usePromptModal } from '@/provider/prompt-modal-provider';
import { AiPrompt, AiPromptCategory } from '@/types/prompt';
import { SearchIcon } from 'lucide-react';
import { forwardRef, useMemo, useState } from 'react';
import { PromptCard } from './prompt-card';
import { PromptPreview } from './prompt-preview';
import CloseCircle from '@/assets/icons/close_circle.svg?react';
import { PromptCategory } from './prompt-category';

export const PromptModal = forwardRef<
  HTMLDivElement,
  {
    onUsePrompt: (prompt: AiPrompt) => void;
  }
>(({ onUsePrompt }, ref) => {
  const { isOpen, closeModal, prompts } = usePromptModal();

  const { t } = useTranslation();

  const [isFeaturedSelected, setIsFeaturedSelected] = useState(true);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [selectedCatecory, setSelectedCategory] =
    useState<AiPromptCategory | null>(null);
  const [selectedPreviewPromptId, setSelectedPreviewPromptId] = useState<
    string | null
  >(null);
  const [focused, setFocused] = useState(false);
  const [filter, setFilter] = useState('');

  const visiblePrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesCategory =
        (isFeaturedSelected && prompt.isFeatured) ||
        (isCustomSelected && prompt.isCustom) ||
        (!isFeaturedSelected &&
          !isCustomSelected &&
          selectedCatecory === null) ||
        selectedCatecory === prompt.category;

      if (!matchesCategory) return false;

      if (filter) {
        return (
          prompt.name.toLowerCase().includes(filter.toLowerCase()) ||
          prompt.content.toLowerCase().includes(filter.toLowerCase())
        );
      }

      return true;
    });
  }, [filter, isCustomSelected, isFeaturedSelected, prompts, selectedCatecory]);

  const selectedPrompt = useMemo(() => {
    const foundVisiblePrompt = visiblePrompts.find(
      (prompt) => prompt.id === selectedPreviewPromptId,
    );
    if (foundVisiblePrompt) {
      return foundVisiblePrompt;
    }

    if (visiblePrompts.length > 0) {
      setSelectedPreviewPromptId(visiblePrompts[0].id);
      return visiblePrompts[0];
    }
  }, [selectedPreviewPromptId, visiblePrompts]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setFilter('');
          closeModal();
        }
      }}
    >
      <DialogContent
        className='max-h-[800px] w-[1200px] flex flex-col gap-3 min-h-0 sm:max-w-[calc(100%-2rem)]'
        ref={ref}
      >
        <DialogTitle className='text-md text-text-primary font-bold'>
          {t('customPrompt.browsePrompts')}
        </DialogTitle>
        <div className='flex-1 flex min-h-0 w-full'>
          <div className='w-[17%] flex flex-col min-h-0'>
            <PromptCategory
              isFeaturedSelected={isFeaturedSelected}
              setIsFeaturedSelected={setIsFeaturedSelected}
              isCustomSelected={isCustomSelected}
              setIsCustomSelected={setIsCustomSelected}
              selectedCatecory={selectedCatecory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          <div className='w-[33%] flex flex-col'>
            <div className='px-3'>
              <div
                className={cn(
                  'flex gap-2 items-center',
                  `border border-border py-[10px] px-2 rounded-[10px]`,
                  focused ? 'ring-ring ring-1 border-primary' : '',
                )}
              >
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  autoFocus
                  type='text'
                  placeholder={t('search.label')}
                  className={'!p-0 !h-6 !ring-0 !border-none !shadow-none'}
                />
                <CloseCircle
                  className={'w-5 h-5 cursor-pointer text-icon-tertiary'}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setFilter('')}
                />
              </div>
            </div>
            {visiblePrompts.length > 0 ? (
              <div className='flex-1 flex flex-col gap-3 overflow-y-scroll min-h-0 p-3'>
                {visiblePrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isSelected={selectedPreviewPromptId === prompt.id}
                    onPreview={() => {
                      setSelectedPreviewPromptId(prompt.id);
                    }}
                    onUsePrompt={() => {
                      onUsePrompt(prompt);
                      setFilter('');
                      closeModal();
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className='flex-1 flex flex-col items-center justify-center min-h-0'>
                <SearchIcon size={24} className={'text-icon-secondary'} />
                <span className='text-text-secondary text-sm'>
                  {t('customPrompt.noResults')}
                </span>
              </div>
            )}
          </div>

          <div className='w-[50%] flex flex-col gap-1 px-3'>
            {selectedPrompt && (
              <PromptPreview
                prompt={selectedPrompt}
                onUsePrompt={() => {
                  onUsePrompt(selectedPrompt);
                  setFilter('');
                  closeModal();
                }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
