module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: [
        'Karla',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif'
      ]
    },

    colors: {
      accent: {
        DEFAULT: 'var(--raccoon-accent)',
        hover: 'var(--raccoon-accent-hover)',
        disabled: 'var(--raccoon-accent-disabled)'
      },
      black: '#000',
      foreground: {
        DEFAULT: 'var(--raccoon-foreground)'
      },
      primary: {
        DEFAULT: 'var(--raccoon-background-primary)'
      },
      secondary: {
        DEFAULT: 'var(--raccoon-background-secondary)'
      },
      transparent: 'transparent',
      white: '#fff'
    },

    container: {
      center: true
    },

    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square'
    }
  }
};
