import { useEffect, useState } from 'react';

enum Theme {
  LIGHT = 'theme-light',
  DARK = 'theme-dark'
};

type IThemeHook = [
  currentTheme: Theme,
  toggleTheme: () => void
];

const useTheme = (): IThemeHook => {
  const [ currentTheme, setCurrentTheme ] = useState(Theme.LIGHT);

  useEffect(() => {
    const actualTheme = localStorage.getItem('theme');

    if (actualTheme == Theme.LIGHT || actualTheme == Theme.DARK) {
      setCurrentTheme(actualTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    document.documentElement.classList.replace(currentTheme, newTheme);
    localStorage.setItem('theme', newTheme);
    setCurrentTheme(newTheme);
  };

  return [ currentTheme, toggleTheme ];
};

export {
  Theme,
  useTheme
};
