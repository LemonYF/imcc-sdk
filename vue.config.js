const port = 9528 // dev port
module.exports = {
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {
    //   // change xxx-api/login => mock/login
    //   // detail: https://cli.vuejs.org/config/#devserver-proxy
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: `http://localhost:${port}/mock`,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // },
    // after: require('./mock/mock-server.js')
  },
  css: { extract: false },
  chainWebpack(config) {
    config.optimization.splitChunks({
      chunks: 'all',
      minChunks: 2,
      maxInitialRequests: 5,
      minSize: 0,
      // minSize: 100000
      // maxSize: 100000
    })
    config.module
      .rule('images')
      // .test(/\.(png|jpg|gif)$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        // 修改它的选项...
        options.limit = 100000
        return options
      })
  }
}
