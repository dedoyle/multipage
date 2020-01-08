const path = require('path')
const webpack = require('webpack')
const glob = require('glob') // 遍历目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const rules = require('./webpack.rules.js')
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: 'production',
  // 入口
  entry: getEntry('./src/pages/**/index.js'),
  output: {
    path: resolve('../dist'),
    // 包名称
    filename: '[name].[chunkhash:8].js',
    // 块名，公共块名(非入口)
    chunkFilename: '[name].[chunkhash:8].js',
    // 打包生成的 index.html 文件里面引用资源的前缀
    // 也为发布到线上资源的 URL 前缀
    // 使用的是相对路径，默认为 ''
    publicPath: './'
  },
  resolve: {
    // import 导入时别名，减少耗时的递归解析操作
    alias: {
      '@': resolve('../src')
    }
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          ie8: false
        }
      })
    ],
    splitChunks: {
      name: true,
      chunks: 'all',
      minSize: 0
    },
    runtimeChunk: true
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
    // 删除 dist 目录
    new CleanWebpackPlugin({
      // verbose Write logs to console.
      verbose: false, //开启在控制台输出信息
      // dry Use boolean "true" to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[contenthash:5].css',
      chunkFilename: devMode ? '[id].css' : '[id].[contenthash:5].css'
    })
  ]
}

/**
 * 返回文件的绝对路径
 * @param {string} dir 文件路径
 * __dirname 获得当前执行文件所在目录的完整目录名（这里指的是 build 目录）
 */
function resolve(dir) {
  return path.resolve(__dirname, dir)
}

//动态添加入口
function getEntry(globPath) {
  var dirname, name
  return glob.sync(globPath).reduce(function(acc, entry) {
    // name  ./src/pages/index/index.js
    // dirname  ./src/pages/index
    // basename  index.js
    dirname = path.dirname(entry)
    name = dirname.slice(dirname.lastIndexOf('/'))
    acc[name] = entry
    return acc
  }, {})
}
