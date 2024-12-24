export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', 'class'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        '4e': '1.125rem',
        '5e': '1.375rem',
        '7e': '1.875rem',
        13: '3.25rem',
        30: '7.5rem',
      },

      colors: {
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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        tooltip: {
          DEFAULT: 'hsl(var(--tooltip))',
          foreground: 'hsl(var(--tooltip-foreground))',
        },
        'ch-bg': {
          base: 'var(--chat-bg-base)',
        },

        'ch-text': {
          title: 'var(--chat-text-title)',
          caption: 'var(--chat-text-caption)',
          content: 'var(--chat-text-content)',
          secondary: 'var(--chat-text-secondary)',
          placeholder: 'var(--chat-text-placeholder)',
          disabled: 'var(--chat-text-disabled)',
        },
        'ch-accent': {
          DEFAULT: 'var(--chat-accent)',
        },
        'ch-primary': {
          dark2: 'var(--chat-primary-dark2)',
          gray: 'var(--chat-primary-gray)',
          gray2: 'var(--chat-primary-gray2)',
        },
        'ch-line': {
          border: 'var(--chat-line-border)',
          divider: 'var(--chat-line-divider)',
        },
        'ch-icon': {
          DEFAULT: 'var(--chat-icon)',
          n2: 'var(--chat-icon-n2)',
          secondary: 'var(--chat-icon-secondary)',
          blue: 'var(--chat-icon-blue)',
        },
        'ch-fill': {
          active: 'var(--fill-list-active)',
          hover: 'var(--fill-list-hover)',
          'card-user': 'var(--chat-card-user)',
          tooltip: 'var(--chat-tooltip)',
        },
        'ch-purple': {
          100: 'var(--chat-purple-100)',
        },
      },
      boxShadow: {
        card: 'var(--chat-shadow-card)',
        1: '0px 4px 8px -8px rgba(31, 35, 41, 0.06), 0px 6px 12px 0px rgba(31, 35, 41, 0.04), 0px 8px 24px 8px rgba(31, 35, 41, 0.04)',
        'light-menu':
          '0px 4px 8px 0px rgba(31, 35, 41, 0.03), 0px 3px 6px -6px rgba(31, 35, 41, 0.05), 0px 6px 18px 6px rgba(31, 35, 41, 0.03)',
      }
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
};
