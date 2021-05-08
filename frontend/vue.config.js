module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/read2be': {
        target: 'http://localhost:8080',
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/read2be': ''
        }
      },
    }
  }
}
