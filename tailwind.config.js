/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        'bg': {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          hover: 'var(--bg-hover)',
        },
        'text': {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        'border': {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        },
        'accent': {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          success: 'var(--accent-success)',
          warning: 'var(--accent-warning)',
          error: 'var(--accent-error)',
          info: 'var(--accent-info)',
        },
        'money': {
          positive: 'var(--money-positive)',
          negative: 'var(--money-negative)',
        },
      },
      fontFamily: {
        'chalk': ['Kalam', 'cursive'],
        'casual': ['Caveat', 'cursive'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'chalk-write': 'chalk-write 0.5s ease-out',
        'chalk-erase': 'chalk-erase 0.3s ease-in',
        'dust-fall': 'dust-fall 1s ease-out',
        'timeline-grow': 'timeline-grow 1s ease-out'
      },
      keyframes: {
        'chalk-write': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'chalk-erase': {
          '0%': { opacity: '1', filter: 'blur(0px)' },
          '100%': { opacity: '0', filter: 'blur(4px)' }
        },
        'dust-fall': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(20px) rotate(180deg)', opacity: '0' }
        },
        'timeline-grow': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        }
      },
      backgroundImage: {
        'chalk-texture': "url('/textures/chalk-texture.png')",
        'board-texture': "url('/textures/board-texture.jpg')"
      }
    },
  },
  plugins: [],
}