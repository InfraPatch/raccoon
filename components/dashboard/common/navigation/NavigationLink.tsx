import { ReactElement, cloneElement } from 'react';

import Link from 'next/link';

export interface NavigationLinkProps {
  href: string;
  icon: ReactElement;
  label: string;
};

const NavigationLink = ({ href, icon, label }: NavigationLinkProps) => {
  return (
    <Link href={href}>
      <a className="flex gap-2 text-foreground text-sm items-center mb-2 px-3 py-2">
        {cloneElement(icon, { className: 'w-5 h-5' })}

        <span>{label}</span>
      </a>
    </Link>
  );
};

export default NavigationLink;
