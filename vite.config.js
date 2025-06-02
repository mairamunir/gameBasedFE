// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path';
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'), // Define alias '@' to point to the src folder
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // “@” → src folder
    },
  },
  // server: {
  //   // Proxy any request starting with /api to http://localhost:5000
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''), 
  //       // e.g. /api/auth/login → http://localhost:5000/auth/login
  //     },
  //   },
  // },
})
