import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

module.exports = defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, 'env')
  return {
    base: '/',
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    publicDir: './public',
    resolve: {},
    plugins: [
      vue(),
      VueSetupExtend(),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: false })]
      })
    ],
    envDir: './env',
    server: {
      port: 4000,
      proxy: {
        '/proxy': {
          target: VITE_API_URL,
          rewrite: (path) => path.replace(/proxy/, ''),
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
