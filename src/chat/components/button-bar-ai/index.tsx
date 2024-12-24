import { ComponentProps, FC, ReactNode } from 'react';
import IconChevron from '@/assets/icons/chevron.svg?react';
import ButtonIcon from '../button-icon';

interface Props extends ComponentProps<'button'> {
  icon: ReactNode;
  tooltip: string;
  active?: boolean;
  withDropdownIcon?: boolean;
  btnText?: string;
  iconMainWrapClass?: string;
}

const ButtonBarAI: FC<Props> = ({
  icon,
  withDropdownIcon,
  className = '',
  iconMainWrapClass,
  active = false,
  tooltip,
  btnText,
  ...rest
}) => {
  return (
    <>
      <ButtonIcon
        icon={icon}
        tooltip={tooltip}
        className={className}
        iconMainWrapClass={iconMainWrapClass}
        active={active}
        {...rest}
      >
        <>
          {btnText && <div className='text-nowrap text-xs'>{btnText}</div>}
          {withDropdownIcon && (
            <div className='text-ch-icon-secondary flex h-full flex-shrink-0 items-center justify-center [&>svg]:h-2.5 [&>svg]:w-2.5'>
              <IconChevron className='h-2.5 w-2.5' />
            </div>
          )}
        </>
      </ButtonIcon>
    </>
  );
};

export default ButtonBarAI;
