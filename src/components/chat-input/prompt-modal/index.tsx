import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from '@/i18n';
import { usePromptModal } from '@/provider/prompt-modal-provider';
import { AiPrompt, AiPromptCategory } from '@/types/prompt';
import { SearchIcon } from 'lucide-react';
import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { PromptCard } from './prompt-card';
import { PromptPreview } from './prompt-preview';
import CloseCircle from '@/assets/icons/close_circle.svg?react';
import { PromptCategory } from './prompt-category';
import { SearchInput } from '@/components/ui/search-input';

export const PromptModal = forwardRef<
  HTMLDivElement,
  {
    onUsePrompt: (prompt: AiPrompt) => void;
    returnFocus: () => void;
  }
>(({ onUsePrompt, returnFocus }, ref) => {
  const { isOpen, closeModal, prompts } = usePromptModal();

  const { t } = useTranslation();

  const [isFeaturedSelected, setIsFeaturedSelected] = useState(true);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [selectedCatecory, setSelectedCategory] =
    useState<AiPromptCategory | null>(null);
  const [selectedPreviewPromptId, setSelectedPreviewPromptId] = useState<
    string | null
  >(null);
  const [filter, setFilter] = useState('');

  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

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

  const handleHoverPromptCard = useCallback(
    (id: string) => {
      if (isScrollingRef.current) return;

      setSelectedPreviewPromptId(id);
    },
    [setSelectedPreviewPromptId],
  );

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    isScrollingRef.current = true;

    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 100);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setFilter('');
          if (visiblePrompts.length > 0) {
            setSelectedPreviewPromptId(visiblePrompts[0].id);
          }
          returnFocus();
          closeModal();
        }
      }}
    >
      <DialogContent
        className='max-h-[800px] w-[1200px] flex flex-col gap-3 min-h-0 sm:max-w-[calc(100%-2rem)]'
        ref={ref}
        onEscapeKeyDown={(_e) => {
          setFilter('');
          closeModal();
        }}
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
          <div
            onScroll={handleScroll}
            className='w-[33%] flex flex-col gap-3 overflow-y-auto min-h-0 px-3 pb-3'
          >
            <div className='bg-background-primary sticky top-0 z-10'>
              <SearchInput
                value={filter}
                onChange={(value) => setFilter(value)}
                className='h-10 py-[10px] px-2 rounded-[10px]'
              >
                {filter && (
                  <CloseCircle
                    className={'w-5 h-5 cursor-pointer text-icon-tertiary'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setFilter('')}
                  />
                )}
              </SearchInput>
            </div>
            {visiblePrompts.length > 0 ? (
              visiblePrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isSelected={selectedPreviewPromptId === prompt.id}
                  onPreview={() => {
                    handleHoverPromptCard(prompt.id);
                  }}
                  onUsePrompt={() => {
                    onUsePrompt(prompt);
                    setFilter('');
                    returnFocus();
                    closeModal();
                  }}
                />
              ))
            ) : (
              <div className='flex-1 flex flex-col items-center justify-center min-h-0'>
                <SearchIcon size={24} className={'text-icon-secondary'} />
                <span className='text-text-secondary text-sm'>
                  {t('customPrompt.noResults')}
                </span>
              </div>
            )}
          </div>

          <div className='w-[50%] flex flex-col px-3 overflow-y-auto'>
            {selectedPrompt && (
              <PromptPreview
                prompt={selectedPrompt}
                onUsePrompt={() => {
                  onUsePrompt(selectedPrompt);
                  setFilter('');
                  returnFocus();
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
