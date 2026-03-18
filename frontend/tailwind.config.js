/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.35s ease-out forwards',
        'blink': 'blink 1s step-end infinite',
        'typing-dot': 'typingDot 1.4s ease-in-out infinite',
        'scan': 'scanLine 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        typingDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.3' },
          '30%': { transform: 'translateY(-5px)', opacity: '1' },
        },
        scanLine: {
          '0%': { top: '-2px', opacity: '0' },
          '5%': { opacity: '1' },
          '95%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(6,182,212,0.4), 0 0 25px rgba(6,182,212,0.1)',
          },
          '50%': {
            boxShadow: '0 0 15px rgba(6,182,212,0.7), 0 0 50px rgba(6,182,212,0.25)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
