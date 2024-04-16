// vite.config.js
const { defineConfig } = require('vite')

module.exports = defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true,
  },
})