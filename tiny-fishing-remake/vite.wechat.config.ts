import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist-wechat',
    emptyOutDir: true,
    target: 'es2018',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'main.js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name][extname]',
        inlineDynamicImports: true
      }
    }
  },
  plugins: [
    replace({
      'typeof CANVAS_RENDERER': "'true'",
      'typeof WEBGL_RENDERER': "'true'",
      'typeof EXPERIMENTAL': "'false'",
      'typeof PLUGIN_CAMERA3D': "'false'",
      'typeof PLUGIN_FBINSTANT': "'false'",
      preventAssignment: true
    })
  ]
});
