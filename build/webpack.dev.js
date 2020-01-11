const webpack = require('webpack')
const merge = require('webpack-merge')

const utils = require('./utils.js')
const configBase = require('./webpack.base.js')

const configDev = {
  mode: 'development',
  output: {
    path: utils.resolve('../dist'),
    // 包名称
    filename: 'js/[name].js'
  },
  devtool: 'cheap-eval-source-map',
  devServer: {
    contentBase: utils.resolve('../src'), // 告诉服务器从哪个目录中提供内容
    publicPath: '/', // 此路径下的打包文件可在浏览器中访问
    port: '8090',
    overlay: true, // 浏览器页面上显示错误
    open: true, // 自动打开浏览器
    // stats: "errors-only", //stats: "errors-only"表示只打印错误：
    historyApiFallback: false, // 404 会被替代为 index.html
    inline: true, // 内联模式，实时刷新
    hot: true, // 开启热更新
    proxy: {
      '/api': {
        target: 'https://example.com/',
        changeOrigin: true,
        pathRewrite: {}
      }
    }
  },
  plugins: [
    //热更新
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: []
  }
}
module.exports = merge(configBase, configDev)
