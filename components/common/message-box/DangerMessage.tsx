import { ReactNode } from 'react';

import MessageBox from '@/components/common/message-box/MessageBox';

export interface CompactDangerMessageProps {
  children: ReactNode;
}

export interface DangerMessageProps extends CompactDangerMessageProps {
  compact?: boolean;
};

const DangerMessage = ({ compact, children }: DangerMessageProps) => {
  return (
    <MessageBox type="danger" compact={compact}>
      { children }
    </MessageBox>
  );
};

const CompactDangerMessage = ({ children }: CompactDangerMessageProps) => {
  return (
    <DangerMessage compact>
      {children}
    </DangerMessage>
  );
};

export {
  DangerMessage,
  CompactDangerMessage
};
