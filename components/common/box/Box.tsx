import { ReactNode } from 'react';

export interface BoxProps {
  children: ReactNode;
};

const Box = ({ children }: BoxProps) => {
  return (
    <section className="px-8 py-6 rounded-md bg-secondary shadow-md mb-6">
      {children}
    </section>
  );
};

export default Box;
