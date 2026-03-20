import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devPort = Number(env.VITE_DEV_SERVER_PORT || 5173)

  const backend = env.VITE_BACKEND_URL || ''
  let proxyTarget =
    env.VITE_DEV_PROXY_TARGET ||
    (backend.startsWith('http://') || backend.startsWith('https://')
      ? backend.replace(/\/?api\/?$/i, '')
      : 'http://localhost:8000')
  proxyTarget = proxyTarget.replace(/\/$/, '')

  const htmlTitle =
    env.VITE_HTML_TITLE || 'Andrzej Ludkiewicz — AI Engineer'
  const fontsCss =
    env.VITE_GOOGLE_FONTS_CSS ||
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'

  return {
    plugins: [
      react(),
      {
        name: 'inject-html-env',
        transformIndexHtml(html) {
          return html
            .replaceAll('__HTML_TITLE__', htmlTitle)
            .replaceAll('__GOOGLE_FONTS_CSS__', fontsCss)
        },
      },
    ],
    server: {
      port: devPort,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
