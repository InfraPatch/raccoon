import { ReactNode } from 'react';
import { User } from '@/db/models/auth/User';

import DashboardSidebar from '@/components/dashboard/sidebar/DashboardSidebar';

export interface DashboardLayoutProps {
  user: User;
  children: ReactNode;
};

const DashboardLayout = ({ user, children }: DashboardLayoutProps) => {
  return (
    <section className="flex h-screen">
      <DashboardSidebar user={user} />

      <div className="flex-1 overflow-y-auto py-10 px-14">
        {children}
      </div>
    </section>
  );
};

export default DashboardLayout;
