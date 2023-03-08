import { forwardRef, HTMLAttributes } from 'react';

const HeaderLink = (props: HTMLAttributes<HTMLAnchorElement>, ref) => {
  return (
    <a
      ref={ref}
      className="inline-block px-10 py-2 text-foreground hover:bg-secondary rounded-3xl cursor-pointer"
      {...props}
    >{props.children}</a>
  );
};

export default forwardRef(HeaderLink);
