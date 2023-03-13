import { ReactNode } from 'react';

export interface BoxProps {
  title?: string;
  children: ReactNode;
};

const Box = ({ title, children }: BoxProps) => {
  return (
    <section className="px-8 py-6 rounded-md bg-secondary shadow-md mb-6">
      {title && <h1 className="text-2xl font-normal">{title}</h1>}
      {children}
    </section>
  );
};

export default Box;
