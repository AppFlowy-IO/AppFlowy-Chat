import newColors from './tailwind/new-colors.cjs';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  implements: '#appflowy-chat',
  darkMode: ['class'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      colors: {
        ...newColors,
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          background: 'var(--secondary-background)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        button: {
          disabled: 'hsl(var(--button-disabled))',
        },
        placeholder: {
          DEFAULT: 'hsl(var(--placeholder))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
        },
        icon: 'hsl(var(--icon))',
        border: {
          DEFAULT: 'hsl(var(--border))',
          ...newColors['border'],
        },
        input: {
          DEFAULT: 'hsl(var(--input))',
          background: 'var(--input-background)',
        },
        ring: 'hsl(var(--ring))',
        tooltip: {
          DEFAULT: 'hsl(var(--tooltip))',
          foreground: 'hsl(var(--tooltip-foreground))',
        },
      },
      boxShadow: {
        DEFAULT: 'var(--shadows-sm)',
        menu: 'var(--shadows-sm)',
        toast: 'var(--shadows-md)',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
};
