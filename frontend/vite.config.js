import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawLogDebug = env.LOG_DEBUG ?? env.VITE_LOG_DEBUG ?? 'false';

  return {
    plugins: [react()],
    define: {
      __LOG_DEBUG__: JSON.stringify(rawLogDebug)
    },
    server: {
      port: 5173
    }
  };
});
