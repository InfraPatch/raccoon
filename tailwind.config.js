module.exports = {
  mode: 'jit',

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

      foreground: {
        DEFAULT: 'var(--raccoon-foreground)'
      },
      primary: {
        DEFAULT: 'var(--raccoon-background-primary)'
      },
      secondary: {
        DEFAULT: 'var(--raccoon-background-secondary)'
      },

      danger: 'var(--raccoon-danger)',
      info: 'var(--raccoon-info)',
      success: 'var(--raccoon-success)',
      warning: 'var(--raccoon-warning)',

      transparent: 'transparent',
      black: '#000',
      white: '#fff',

      facebook: {
        DEFAULT: 'var(--facebook)',
        hover: 'var(--facebook-hover)'
      },
      twitter: {
        DEFAULT: 'var(--twitter)',
        hover: 'var(--twitter-hover)'
      },
      google: {
        DEFAULT: 'var(--google)',
        hover: 'var(--google-hover)'
      }
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
