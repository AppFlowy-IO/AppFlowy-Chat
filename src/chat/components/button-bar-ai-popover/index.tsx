import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
  ComponentProps,
  FC,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import ButtonBarAI from '../button-bar-ai';
import { ActionBarAIButtonName } from '@/types';
import IconCheck from '@/assets/icons/check.svg?react';
import IconRegenerate from '@/assets/icons/regenerate.svg?react';
import './index.css';
import { ActionBarAIButtonDataPopover } from '@appflowy-chat/utils/actionBarAIButtons';
import TooltipDefault from '../tooltip-default';
import { useTranslation } from '@/i18n';
import FormatBarOptions from '../format-bar-options';

interface Props extends ComponentProps<'button'> {
  icon: ReactNode;
  tooltip: string;
  optionsData: ActionBarAIButtonDataPopover['optionsData'];
  activeOption: string;
  btnName: ActionBarAIButtonName;
  onOptionChange: (value: string) => void;
  onPopoverStateChange: (value: boolean) => void;
}

const ButtonBarAIPopover: FC<Props> = ({
  icon,
  tooltip,
  optionsData,
  activeOption,
  onOptionChange,
  onPopoverStateChange,
}) => {
  const [shortOptionName, setShortOptionName] = useState<string>('');

  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  function handleClick(_: MouseEvent<HTMLButtonElement>) {
    handlePopoverStateChange('open');
    setOpen(true);
  }
  function handleClose() {
    setTimeout(() => {
      handlePopoverStateChange('close');
    }, 300);
  }

  function handlePopoverStateChange(action: 'open' | 'close') {
    onPopoverStateChange(action === 'open');
  }

  function handleOptionChange(value: string) {
    if (value === activeOption) {
      return;
    }

    onOptionChange(value);
    handleClose();
  }

  useEffect(() => {
    if (optionsData.type === 'text') {
      const can = optionsData.options.find(
        (option) => option.value === activeOption
      );
      if (!can) {
        setShortOptionName('');
      } else {
        setShortOptionName(can.shortName || '');
      }
    }
  }, [activeOption, optionsData]);


  return (
    <Popover open={open} onOpenChange={setOpen}>
    <div ref={rootRef}>
      <PopoverTrigger asChild>
        <div>
          <ButtonBarAI
            icon={icon}
            aria-describedby={'simple-popover'}
            withDropdownIcon={true}
            tooltip={tooltip}
            btnText={shortOptionName}
            onClick={handleClick}
          />
        </div>

      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}>
        {optionsData.type === 'text' && (
          <div
            id={'simple-popover'}
            className='bar-ai-popover-full'
          >
            <div className='bg-background p-2'>
              {optionsData.options.map((option) => (
                <div
                  className='text-foreground flex w-full min-w-52 cursor-pointer justify-between px-1.5 py-1 text-sm tracking-wide'
                  key={option.value}
                  onClick={() => handleOptionChange(option.value)}
                >
                  <div>{option.name}</div>
                  {activeOption === option.value && (
                    <IconCheck className='text-ch-icon-blue h-4 w-4 flex-shrink-0' />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {optionsData.type === 'btn' && (
          <div
            id={'simple-popover'}
            className='bar-ai-popover-btns'
          >
            <FormatBarOptions
              options={optionsData.options}
              className='px-1 py-0.5'
              activeOption={activeOption}
            >
              <TooltipDefault title={t('tooltip.regenerate')}>
                <button className='ml-1 grid h-6 flex-shrink-0 place-items-center'>
                  <div className='w-4e h-4e bg-ch-accent grid h-2.5 w-2.5 place-items-center rounded-full'>
                    <IconRegenerate className='h-3 w-3 text-white' />
                  </div>
                </button>
              </TooltipDefault>
            </FormatBarOptions>
          </div>
        )}
      </PopoverContent>

    </div>
    </Popover>
  );
};

export default ButtonBarAIPopover;
