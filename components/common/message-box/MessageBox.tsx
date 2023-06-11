import { ReactNode } from 'react';
import clsx from 'clsx';

export interface MessageBoxProps {
  type: 'danger' | 'warning' | 'success' | 'info';
  compact?: boolean;
  children: ReactNode;
}

const MessageBox = ({ type, compact, children }: MessageBoxProps) => {
  const classNames = compact
    ? clsx('py-1', {
        'text-danger': type === 'danger',
        'text-warning': type === 'warning',
        'text-success': type === 'success',
        'text-info': type === 'info',
      })
    : clsx('text-white', 'py-4', 'px-6', 'my-2', {
        'bg-danger': type === 'danger',
        'bg-warning': type === 'warning',
        'bg-success': type === 'success',
        'bg-info': type === 'info',
      });

  return (
    <div className={classNames} role="alert">
      {children}
    </div>
  );
};

export default MessageBox;
