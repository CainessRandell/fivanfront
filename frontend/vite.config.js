import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const parseTrustedDomains = (raw) =>
  (raw || '')
    .split(',')
    .map((domain) => domain.trim())
    .filter(Boolean);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawLogDebug = env.LOG_DEBUG ?? env.VITE_LOG_DEBUG ?? 'false';
  const trustedDomains = parseTrustedDomains(env.VITE_TRUSTED_DOMAINS);
  const proxyTarget = trustedDomains[0] || null;

  return {
    plugins: [react()],
    define: {
      __LOG_DEBUG__: JSON.stringify(rawLogDebug)
    },
    server: {
      port: 5173,
      proxy: proxyTarget
        ? {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              secure: true,
              rewrite: (path) => path.replace(/^\/api/, '')
            }
          }
        : undefined
    }
  };
});