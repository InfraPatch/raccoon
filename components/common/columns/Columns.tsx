import { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

import clsx from 'clsx';

export interface ColumnsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
};

const Columns = ({ children, ...rest }: ColumnsProps) => {
  const classNames = clsx('flex', 'gap-6', rest.className);

  return (
    <section {...rest} className={classNames}>
      {children}
    </section>
  );
};

export default Columns;
