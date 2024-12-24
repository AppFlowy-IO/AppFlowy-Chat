import { ComponentProps, FC } from 'react';

interface IProp extends ComponentProps<'svg'> {
  id?: string;
}

const IconCloseFilled: FC<IProp> = ({ id = '3701_30575', ...rest }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 16 16'
      fill='none'
      {...rest}
    >
      <g clipPath={`url(#clip0_${id})`}>
        <rect width='16' height='16' rx='8' fill='white' />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M15.3504 7.99999C15.3504 12.0592 12.0596 15.35 8.00039 15.35C3.94108 15.35 0.650391 12.0592 0.650391 7.99999C0.650391 3.94068 3.94108 0.649994 8.00039 0.649994C12.0596 0.649994 15.3504 3.94068 15.3504 7.99999ZM5.77308 5.77268C5.98833 5.55743 6.33739 5.55743 6.55264 5.77268L8.00039 7.22037L9.44808 5.77268C9.66333 5.55743 10.0124 5.55743 10.2276 5.77268C10.443 5.98799 10.443 6.33699 10.2276 6.55224L8.77995 7.99999L10.2276 9.44768C10.443 9.66293 10.443 10.012 10.2276 10.2272C10.0124 10.4426 9.66333 10.4426 9.44808 10.2272L8.00039 8.77962L6.55264 10.2272C6.33739 10.4426 5.98833 10.4426 5.77308 10.2272C5.55783 10.012 5.55783 9.66293 5.77308 9.44774L7.22077 7.99999L5.77308 6.55224C5.55777 6.33699 5.55777 5.98793 5.77308 5.77268Z'
          fill='currentColor'
        />
      </g>
      <defs>
        <clipPath id={`clip0_${id}`}>
          <rect width='16' height='16' rx='8' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconCloseFilled;
