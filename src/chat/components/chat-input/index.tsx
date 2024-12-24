import { Textarea } from '@/components/ui/textarea';
import IconArrowUp from '@/assets/icons/arrow-up.svg?react';
import IconStop from '@/assets/icons/stop.svg?react';
import IconClip from '@/assets/icons/clip.svg?react';
import { ChangeEvent, FormEvent, forwardRef, KeyboardEvent } from 'react';
import './index.css';
import { FilePreview, ResponseFormatMode, ResponseFormatType } from '@/types';
import FormatBarOptions from '../format-bar-options';
import { useFormatTextButtons } from '@appflowy-chat/utils/formatTextButtons';
import ButtonIcon from '../button-icon';
import { SupportedAttachmentExtensions } from '@appflowy-chat/utils/supportedAttachmentExtensions';
import FilesPreview from '../files-preview';
import { v4 } from 'uuid';
import { useTranslation } from '@/i18n';
import { Button } from '@/components/ui/button';

interface IProps {
  value: string;
  isGenerating: boolean;
  formatMode: ResponseFormatMode;
  formatType: ResponseFormatType;
  attachments: FilePreview[];
  onAttachmentsChange: (newAttach: FilePreview[]) => void;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeFormatMode: (value: ResponseFormatMode) => void;
  onChangeFormatType: (value: ResponseFormatType) => void;
  onSubmit: () => void;
  onStop: () => void;
}

const ChatInput = forwardRef<HTMLTextAreaElement, IProps>(
  (
    {
      onStop,
      value,
      isGenerating,
      formatMode,
      formatType,
      attachments,
      onAttachmentsChange,
      onChange,
      onSubmit,
      onChangeFormatMode,
      onChangeFormatType,
    },
    ref
  ) => {
    const { t } = useTranslation();

    const FormatTextButtons = useFormatTextButtons()
    function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (isGenerating) {
        return;
      }
      onSubmit();
    }
    function handleOnKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key !== 'Enter') {
        return;
      }
      e.stopPropagation();
      e.preventDefault();

      if (isGenerating || value.trim().length < 3) {
        return;
      }

      onSubmit();
    }

    function handleClickFormatModeButton() {
      if (formatMode === 'custom') {
        onChangeFormatMode('auto');
      } else {
        onChangeFormatMode('custom');
      }

      if (typeof ref === 'object' && ref?.current) {
        ref.current?.focus();
      }
    }

    function handleClickFormatTypeOption(value: string) {
      onChangeFormatType(value as ResponseFormatType);
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
      const files = e.target.files;

      if (files) {
        const newFiles: FilePreview[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();

          reader.onload = (e) => {
            const url = e.target?.result as string;
            const ext = file.name.split('.').pop() as FilePreview['ext'];
            let preview: FilePreview['preview'] = 'image';
            if (ext === 'pdf') {
              preview = 'pdf';
            }

            newFiles.push({ file, url, id: v4(), preview, ext });

            onAttachmentsChange([...attachments, ...newFiles]);
          };

          reader.readAsDataURL(file);
        }
      }
    }

    function handleAttachmentRemoveClick(id: string) {
      const updData = attachments.filter((fileItem) => fileItem.id !== id);
      onAttachmentsChange(updData);
    }
    return (
      <form
        className='appflowy-chat-input-wrap border-ch-primary-gray focus-within:border-ch-accent w-full rounded-lg border transition-colors'
        onSubmit={handleOnSubmit}
        data-format-mode={formatMode}
      >
        {formatMode === 'custom' && (
          <div className='p-1'>
            <FormatBarOptions
              activeOption={formatType}
              options={FormatTextButtons}
              onOptionChange={handleClickFormatTypeOption}
            ></FormatBarOptions>
          </div>
        )}

        {attachments.length > 0 && (
          <FilesPreview
            files={attachments}
            onRemoveClick={handleAttachmentRemoveClick}
          />
        )}

        {/* prettier-ignore */}
        <Textarea
        id="appflowy-chat-input"
        placeholder={(formatMode === 'auto'?t('input.placeholder'):t('input.placeholderFormat'))||''}
        className="appflowy-chat-input-root focus-visible:!ring-0 !border-none !outline-none !shadow-transparent"
        value={value}
        onChange={onChange}
        onKeyDown={handleOnKeyDown}
        ref={ref}
        autoFocus
        
      />
        <div className='flex justify-between px-2'>
          <div className='flex items-end py-0.5'>
            <button
              className='text-ch-text-caption hover:bg-ch-fill-hover flex h-fit rounded bg-transparent p-1 text-xs transition-colors'
              type='button'
              onClick={handleClickFormatModeButton}
            >
              {formatMode === 'auto'
                ? t('input.button.format')
                : t('input.button.auto')}
            </button>
          </div>
          <div className='flex items-start gap-2'>
            <ButtonIcon
              className='relative text-ch-icon'
              icon={<IconClip />}
              tooltip={t('input.button.attach')}
              disabled={isGenerating}
            >
              <input
                type='file'
                tabIndex={-1}
                multiple
                accept={SupportedAttachmentExtensions}
                className='absolute inset-0 cursor-pointer bg-red-600 opacity-0 disabled:cursor-default'
                style={{ fontSize: '0' }}
                onChange={handleFileChange}
                disabled={isGenerating}
              />
            </ButtonIcon>
            {isGenerating ? (
              <Button
                startIcon={<IconStop />}
                size={'icon'}
                variant={'ghost'}
                color={'primary'}
                onClick={onStop}
              />
            ) : (
              <Button
                size={'icon'}
                variant={'ghost'}
                disabled={value.trim().length < 3}
                startIcon={<IconArrowUp />}
                type='submit'
                color={'primary'}
              />
            )}
          </div>
        </div>
      </form>
    );
  }
);

export default ChatInput;
