const webpack = require('webpack')
const merge = require('webpack-merge')
const configBase = require('./webpack.base.js')
const configDev = {
  mode: 'development'
}
module.exports = merge(configBase, configDev)