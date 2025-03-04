import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import removeConsole from 'vite-plugin-remove-console';

import { copyFileSync, mkdirSync, existsSync, readdir } from 'fs';

function copyLocalesPlugin() {
  return {
    name: 'copy-locales',
    closeBundle() {
      const srcDir = resolve(__dirname, 'src/locales');
      const destDir = resolve(__dirname, 'dist/locales');

      if(!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }

      readdir(srcDir, (err, files) => {
        if(err) {
          console.error(err);
          return;
        }
        files.forEach((file) => {
          if(file.endsWith('.json')) {
            copyFileSync(resolve(srcDir, file), resolve(destDir, file));
          }
        });
      });
    },
  };
}

export default defineConfig(({ command }) => {
  const isServe = command === 'serve';
  return {
    root: isServe ? 'src/dev' : undefined,
    plugins: [
      react(),
      svgr(),
      !isServe &&
      dts({
        insertTypesEntry: true,
        include: ['src'],
      }),
      copyLocalesPlugin(),
      process.env.ANALYZE_MODE
        ? visualizer({
          emitFile: true,
        })
        : undefined,

      removeConsole(),
    ],
    build: isServe
      ? undefined
      : {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'Chat',
          formats: ['es', 'cjs'],
          fileName: (format: string) =>
            `index.${format === 'es' ? 'mjs' : 'js'}`,
        },
        cssCodeSplit: true,
        rollupOptions: {
          external: [
            'react',
            'react-dom',
            'i18next',
            'react-i18next',
            'i18next-resources-to-backend',
            '@appflowyinc/editor',
            'axios',
            'dompurify',
          ],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              i18next: 'i18next',
              'react-i18next': 'reactI18next',
              '@appflowyinc/editor': 'Editor',
            },
          },
        },
        sourcemap: false,
        minify: false,
      },
    server: {
      port: 3001,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
  };
});
