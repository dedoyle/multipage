const webpack = require('webpack')
const path = require('path')

const rules = require('./webpack.rules.js')
const utils = require('./utils.js')

module.exports = {
  // 入口
  entry: utils.getEntry('./src/pages/*/index.js'),
  resolve: {
    // import 导入时别名，减少耗时的递归解析操作
    alias: {
      '@': utils.resolve('../src')
    }
  },
  module: {
    // 忽略大型的 library 可以提高构建性能
    noParse: /jquery|lodash/,
    rules: rules
  },
  externals: {
    // 'jquery': 'window.jquery'
  },
  plugins: [
    // 全局暴露统一入口
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery'
    // }),
    ...utils.getHtmlPlugins('./src/pages/**/index.html')
  ]
}
