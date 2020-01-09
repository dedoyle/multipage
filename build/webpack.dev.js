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
  // devtool: 'cheap-eval-source-map',
  devServer: {
    contentBase: utils.resolve('../src'),
    publicPath: '/',
    port: '8090',
    overlay: true, // 浏览器页面上显示错误
    open: true, // 开启浏览器
    // stats: "errors-only", //stats: "errors-only"表示只打印错误：
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    hot: true, // 开启热更新
    proxy: {
      '/api': {
        target: 'https://platform.dev.dtedu.com/',
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
