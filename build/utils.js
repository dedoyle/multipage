const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob') // 遍历目录
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

function getHtmlPlugins(globPath) {
  var dirname, name
  return glob.sync(globPath).reduce((acc, entry) => {
    dirname = path.dirname(entry)
    name = dirname.slice(dirname.lastIndexOf('/') + 1)
    acc.push(new htmlWebpackPlugin(getHtmlConfig(name, name)))
    return acc
  }, [])
}

function getHtmlConfig(name, chunks) {
  console.log(chunks)
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

module.exports = {
  resolve,
  getEntry,
  getHtmlPlugins
}