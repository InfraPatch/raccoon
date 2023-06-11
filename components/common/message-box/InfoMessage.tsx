import { ReactNode } from 'react';

import MessageBox from '@/components/common/message-box/MessageBox';

export interface CompactInfoMessageProps {
  children: ReactNode;
}

export interface InfoMessageProps extends CompactInfoMessageProps {
  compact?: boolean;
}

const InfoMessage = ({ compact, children }: InfoMessageProps) => {
  return (
    <MessageBox type="info" compact={compact}>
      {children}
    </MessageBox>
  );
};

const CompactInfoMessage = ({ children }: CompactInfoMessageProps) => {
  return <InfoMessage compact>{children}</InfoMessage>;
};

export { InfoMessage, CompactInfoMessage };
