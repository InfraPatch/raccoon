import { ReactNode } from 'react';

import MessageBox from '@/components/common/message-box/MessageBox';

export interface CompactSuccessMessageProps {
  children: ReactNode;
}

export interface SuccessMessageProps extends CompactSuccessMessageProps {
  compact?: boolean;
};

const SuccessMessage = ({ compact, children }: SuccessMessageProps) => {
  return (
    <MessageBox type="success" compact={compact}>
      { children }
    </MessageBox>
  );
};

const CompactSuccessMessage = ({ children }: CompactSuccessMessageProps) => {
  return (
    <SuccessMessage compact>
      {children}
    </SuccessMessage>
  );
};

export {
  SuccessMessage,
  CompactSuccessMessage
};
