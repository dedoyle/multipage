const webpack = require('webpack')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devMode = process.env.NODE_ENV !== 'production'
const configBase = require('./webpack.base.js')

const configProd = {
  mode: 'production',
  devtool: 'none',
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      name: true,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors'
        }
      }
    }
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
module.exports = merge(configBase, configProd)
