export interface NavigationTitleProps {
  title: string;
};

const NavigationTitle = ({ title }: NavigationTitleProps) => {
  const classNames = 'text-accent text-2xl text-center mb-5';

  return <div className={classNames}>{title}</div>;
};

export default NavigationTitle;
