const path = require('path')
const glob = require('glob') // 遍历目录
const htmlWebpackPlugin = require('html-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'

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
  return glob.sync(globPath).reduce((acc, entry) => {
    // name  ./src/pages/index/index.js
    // dirname  ./src/pages/index
    // basename  index.js
    dirname = path.dirname(entry)
    name = dirname.slice(dirname.lastIndexOf('/') + 1)
    acc[name] = entry
    return acc
  }, {})
}

function htmlPlugins(globPath) {
  var dirname, name
  return glob.sync(globPath).reduce((acc, entry) => {
    dirname = path.dirname(entry)
    name = dirname.slice(dirname.lastIndexOf('/') + 1)
    acc.push(new htmlWebpackPlugin(htmlConfig(name, name)))
    return acc
  }, [])
}

function htmlConfig(name, chunks) {
  return {
    template: `./src/pages/${name}/index.html`,
    filename: `${name}.html`,
    // favicon: './favicon.ico',
    // title: title,
    inject: true,
    chunks: [chunks],
    minify:
      devMode
        ? false
        : {
            removeComments: true,
            collapseWhitespace: true
          }
  }
}

function getPurecssPath(globPath) {
  return glob.sync(`${resolve(globPath)}/**/*`,  { nodir: true })
}

module.exports = {
  resolve,
  getEntry,
  htmlPlugins,
  getPurecssPath
}