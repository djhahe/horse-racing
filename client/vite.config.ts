import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    // global: {},
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'index',
      fileName: 'index',
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: ['react'],
      output: {
        format: 'esm',
      },
    },
  },
  resolve: {
    // alias: {
    //   '@': path.resolve(__dirname, './src'),
    // },
  },
});
