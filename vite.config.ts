import { defineConfig } from 'vite'

import DefineOptions from 'unplugin-vue-define-options/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
const pathSrc = path.resolve(__dirname, "src");
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import requireTransform from 'vite-plugin-require-transform';
import { Console } from 'console';
// import commonjs from '@rollup/plugin-commonjs'
// import legacyPlugin from '@vitejs/plugin-legacy'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    // legacyPlugin({
    //  targets: ['defaults', 'not IE 11']
    // }),
    // commonjs(),
    vue(),
    DefineOptions(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    createSvgIconsPlugin({
      // 指定要缓存的文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    requireTransform({
      fileRegex: /.js$|.vue$/
    }),



  ],
  // optimizeDeps: {
  //   include: ['path','dayjs'],
  // },
  // build: {
  //   target: 'es2015',
  //   sourcemap: false, // 不生成 source map 
  //   terserOptions: { 
  //     compress: { // 打包时清除 console 和 debug 相关代码
  //       drop_console: true,
  //       drop_debugger: true,
  //     },
  //   },
  //   commonjsOptions: { exclude: ['path','dayjs'], include: [] },
  // },
  resolve: {
    alias: {
      '@': pathSrc, // 如果你的 src 目录不是默认的，需要修改这里的路径
    },
    // 省略文件后缀
    extensions: ['', '.js', '.json', '.vue', '.scss', '.css', '.ts', '.tsx']
  },
  define: {
    'process.env': {}
  },
  server: {
    port: 9527,
    proxy: {
      '/prod-api': {
        target: 'http://192.168.0.155:8080',//朱依程
        // target: 'http://192.168.0.69:8080',//张豪
        // target: `http://192.168.0.70:8080`,// 李永强
        // target: 'http://192.168.0.160:8080',// 高勇
        // target: `http://192.168.0.105:8080`, // 袁仁宝
        // target: `http://192.168.0.215:100/prod-api`, // 线上
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prod-api/, ''),
      },
      //图片地址
      '/imgApi': {
        target: `http://192.168.0.215:9010`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/imgApi/, ''),
      }
    }
  }
})
