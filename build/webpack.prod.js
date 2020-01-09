const webpack = require('webpack')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'
const configBase = require('./webpack.base.js')
const utils = require('./utils.js')

const configProd = {
  mode: 'production',
  devtool: 'none',
  output: {
    path: utils.resolve('../dist'),
    // 包名称
    filename: 'js/[name].[chunkhash:8].js',
    // 块名，公共块名(非入口)
    chunkFilename: 'js/[name].[chunkhash:8].js',
    // 打包生成的 index.html 文件里面引用资源的前缀
    // 也为发布到线上资源的 URL 前缀
    // 使用的是相对路径，默认为 ''
    publicPath: '.'
  },
  optimization: {
    // usedExports: true,
    // runtimeChunk: {
    //     name: 'manifest'
    // },
    // splitChunks: {
    //   cacheGroups: {
    //     chunks: 'initial', // 只对入口文件处理
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendors',
    //       chunks: 'all'
    //     }
    //   }
    // }
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
      filename: 'css/[name].[contenthash:5].css',
      chunkFilename: 'css/[id].[contenthash:5].css'
    }),
    //静态资源输出
    // new CopyPlugin([
    //   {
    //     from: utils.resolve('../src/assets'),
    //     to: 'img',
    //     ignore: ['.*']
    //   }
    // ])
  ]
}
module.exports = merge(configBase, configProd)
