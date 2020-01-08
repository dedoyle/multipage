const path = require('path')
const webpack = require('webpack')
const glob = require('glob') // 遍历目录
const rules = require('./webpack.rules.js')

module.exports = {
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
  module: {
    // 忽略大型的 library 可以提高构建性能
    noParse: /jquery|lodash/,
    rules: rules
  },
  externals: {
    // 'jquery': 'window.jquery'
  },
  plugins: []
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
