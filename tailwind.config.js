/** @type {import('tailwindcss').Config} */
export default {
  content: ['./lib/**/*.{js,ts,jsx,tsx}', './tests/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        '3e': '0.875rem',
        '4e': '1.125rem',
        '5e': '1.375rem',
        '7e': '1.875rem',
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        30: '7.5rem',
      },
      colors: {
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
          DEFAULT: 'var(--content-blue-400)',
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
      },
    },
  },
  plugins: [],
};
