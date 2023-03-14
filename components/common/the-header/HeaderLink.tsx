import { forwardRef, HTMLAttributes } from 'react';

const HeaderLink = (props: HTMLAttributes<HTMLAnchorElement>, ref) => {
  return (
    <a
      ref={ref}
      className="block md:inline-block px-4 lg:px-10 py-2 text-foreground hover:bg-secondary rounded-3xl cursor-pointer mb-2 md:mb-0"
      {...props}
    >{props.children}</a>
  );
};

export default forwardRef(HeaderLink);
