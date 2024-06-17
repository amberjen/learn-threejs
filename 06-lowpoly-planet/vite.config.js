export default {
  root: 'src/',
  publicDir: '../static',
  server: {
    host: true
  },
  build: {
    outDir: '../dist', 
    emptyOutDir: true, 
    sourcemap: true
  },
};