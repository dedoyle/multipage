const webpack = require('webpack')
const PurgecssPlugin = require('purgecss-webpack-plugin')

const rules = require('./webpack.rules.js')
const utils = require('./utils.js')

module.exports = {
  // 入口
  entry: utils.getEntry('./src/pages/*/index.js'),
  resolve: {
    // import 导入时别名，减少耗时的递归解析操作
    alias: {
      '@': utils.resolve('../src'),
      'assets': utils.resolve('../src/assets')
    },
    extensions: [
      '.js',
      '.json'
    ]
  },
  module: {
    // 忽略大型的 library 可以提高构建性能
    noParse: /jquery|lodash/,
    rules: rules
  },
  externals: {
    // 防止将某些 import 的包 (package) 打包到 bundle 中，
    // 而是在运行时 (runtime) 再去从外部获取这些扩展依赖
    'jquery': 'window.jquery'
  },
  plugins: [
    // 自动加载模块，无需 import 或 require
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new PurgecssPlugin({
      paths: utils.getPurecssPath('../src'),
    }),
    ...utils.htmlPlugins('./src/pages/**/index.html')
  ]
}
