import Link from 'next/link';

export interface NavigationLinkProps {
  href: string;
  label: string;
}

const NavigationLink = ({ href, label }: NavigationLinkProps) => {
  return (
    <Link
      href={href}
      className="flex gap-2 text-foreground text-sm items-center px-3 py-1"
    >
      <span>{label}</span>
    </Link>
  );
};

export default NavigationLink;
