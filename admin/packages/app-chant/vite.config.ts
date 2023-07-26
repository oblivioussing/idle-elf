import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './index.ts'),
      name: 'chant',
      fileName: (format) => `chant.${format}.js`
    },
    rollupOptions: {
      external: ['element-plus', 'pinia', 'vue', 'vue-i18n'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@chant': path.resolve(__dirname, '/')
    }
  },
  plugins: [vue(), VueSetupExtend()]
})
