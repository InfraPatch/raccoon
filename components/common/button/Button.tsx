import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

export enum ButtonSize {
  SMALL,
  MEDIUM,
  LARGE
};

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  size: ButtonSize;
};

const Button = ({ size, ...props }: ButtonProps, ref) => {
  const buttonClasses = clsx(
    'bg-accent',
    'hover:bg-accent-hover',
    'disabled:bg-accent-disabled',
    'text-white',
    'font-bold',
    'cursor-pointer',
    'rounded-3xl',

    {
      'px-6 py-2': size === ButtonSize.SMALL,
      'text-sm': size === ButtonSize.SMALL,

      'px-8 py-3': size === ButtonSize.MEDIUM,
      'text-base': size === ButtonSize.MEDIUM,

      'px-10 py-5': size === ButtonSize.LARGE,
      'text-lg': size === ButtonSize.LARGE
    },

    props.className
  );

  return (
    <button ref={ref} {...props} className={buttonClasses}>
      { props.children }
    </button>
  );
};

export default forwardRef(Button);
