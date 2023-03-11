import { ToastLevel } from '@/lib/toaster';
import clsx from 'clsx';

import { AlertTriangle, CheckCircle, Info, XCircle } from 'react-feather';

export interface ToastProps {
  idx: number;
  level: ToastLevel;
  title?: string;
  message: string;
  dismissable?: boolean;
  dead?: boolean;
  onClick(): void;
};

const Toast = ({ idx, level, title, message, dismissable = true, dead, onClick }: ToastProps) => {
  const classNames = clsx('right-0', 'left-0', 'mx-auto', 'py-4', 'px-6', 'flex', 'items-center', 'justify-between', {
    'bg-info': level === 'info',
    'bg-success': level === 'success',
    'bg-warning': level === 'warning',
    'bg-danger': level === 'danger',
    'opacity-0': dead
  });

  const styles = {
    left: 0,
    right: 0,
    bottom: `${idx * 80}px`
  };

  return (
    <div className="fixed text-white pb-5 z-50" role="alert" style={styles}>
      <div className={classNames} style={{ maxWidth: '400px' }}>
        <div className="flex justify-between items-start">
          <div className="mr-2">
            {level === 'success' && <CheckCircle />}
            {level === 'warning' && <AlertTriangle />}
            {level === 'danger' && <XCircle />}
            {level === 'info' && <Info />}
          </div>

          <div>
            {title && <strong>{title}<br /></strong>}
            <span>{message}</span>
          </div>
        </div>

        {dismissable && <div>
          <div
            className="inline-block border-2 py-1 px-2 cursor-pointer border-white rounded hover:bg-white hover:text-black"
            onClick={onClick}
          >OK</div>
        </div>}
      </div>
    </div>
  );
};

export default Toast;
