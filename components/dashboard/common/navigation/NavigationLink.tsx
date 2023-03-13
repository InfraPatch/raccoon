import { ReactElement, cloneElement } from 'react';

import Link from 'next/link';

export interface NavigationLinkProps {
  href: string;
  icon: ReactElement;
  label: string;
  newtab?: boolean;
};

const NavigationLink = ({ href, icon, label, newtab }: NavigationLinkProps) => {
  const classNames = 'flex gap-2 text-foreground text-sm items-center mb-2 px-3 py-2';

  if (newtab) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames}
      >
        {cloneElement(icon, { className: 'w-5 h-5' })}

        <span>{label}</span>
      </a>
    );
  }

  return (
    <Link href={href}>
      <a className={classNames}>
        {cloneElement(icon, { className: 'w-5 h-5' })}

        <span>{label}</span>
      </a>
    </Link>
  );
};

export default NavigationLink;
