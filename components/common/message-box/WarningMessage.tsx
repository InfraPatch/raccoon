import { ReactNode } from 'react';

import MessageBox from '@/components/common/message-box/MessageBox';

export interface CompactWarningMessageProps {
  children: ReactNode;
}

export interface WarningMessageProps extends CompactWarningMessageProps {
  compact?: boolean;
};

const WarningMessage = ({ compact, children }: WarningMessageProps) => {
  return (
    <MessageBox type="warning" compact={compact}>
      { children }
    </MessageBox>
  );
};

const CompactWarningMessage = ({ children }: CompactWarningMessageProps) => {
  return (
    <WarningMessage compact>
      {children}
    </WarningMessage>
  );
};

export {
  WarningMessage,
  CompactWarningMessage
};
