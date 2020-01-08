# Webpack4 详细的配置笔记

本文主要是多入口配置，希望能在无框架网页开发时提高开发效率，对代码进行打包优化。

## 模块总览

目录结构大概如下：

```
|-build
|-dist
|-src
|-.babelrc
|-.eslintrc.js
|-package.json
```

build/webpack.base.js

```js
const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const rules = require('./webpack.rules.js')

module.exports = {
  let config = {
    mode: '',
    entry: {},
    module: {},
    resolve: {},
    externals: {},
    plugins: []
  }
  return config
}

/**
 * 返回文件的绝对路径
 * @param {string} dir 文件路径
 * __dirname 获得当前执行文件所在目录的完整目录名（这里指的是 build 目录）
 */
function resolve(dir) {
  return path.resolve(__dirname, dir)
}
```

build/webpack.prod.js

```js
const webpack = require('webpack')
const merge = require('webpack-merge')

const devMode = process.env.NODE_ENV !== 'production'
const configBase = require('./webpack.base.js')

const configProd = {
  mode: 'production',
  devtool: 'none',
  optimization: {},
  plugins: []
}
module.exports = merge(configBase, configProd)

```

build/webpack.dev.js

```js
const webpack = require('webpack')
const merge = require('webpack-merge')
const devMode = process.env.NODE_ENV !== 'production'
const configBase = require('./webpack.base.js')

const configDev = {
  mode: 'development'
  plugins: []
}
module.exports = merge(configBase, configProd)
```

build/webpack.rules.js

```js
const devMode = process.env.NODE_ENV !== 'production'
const rules = []
module.exports = rules
```

后文省略 `module.exports` 等代码，不再赘述。

## 配置入口 entry

入口告诉 webapck 从哪个模块开始，根据依赖关系打包

1. 单入口

```js
entry: './src/index.js'
```

2. 多入口

```js
entry: {
  index: './src/index/index.js'
}
```

对于多入口配置，可以用 glob 库来动态获取入口文件，如下：

```js
function getEntry(globPath) {
  let dirname, name
  return glob.sync(globPath).reduce(function(acc, entry) {
    // name  ./src/pages/index/index.js
    // dirname  ./src/pages/index
    // basename  index.js
    dirname = path.dirname(entry)
    name = dirname.slice(dirname.lastIndexOf('/') + 1)
    acc[name] = entry
    return acc
  }, {})
}

entry: getEntry('./src/pages/**/index.js'),
```

## 配置 clean-webpack-plugin

在配置 output 之前配置这个插件是为，每次打包前可以删除 dist 目录，保证没有冗余文件。

build/webpack.prod.js

```js
const cleanWebpackPlugin = require('clean-webpack-plugin')

plugins: [
  // 删除 dist 目录
  new cleanWebpackPlugin({
    // verbose Write logs to console.
    verbose: false, //开启在控制台输出信息
    // dry Use boolean "true" to test/emulate delete. (will not remove files).
    // Default: false - remove files
    dry: false
  })
]
```

## 配置出口 output

自定义输出文件的位置和名称

build/webpack.base.js

```js
output: {
  path: resolve('../dist'),
  // 包名称
  filename: '[name].[chunkhash:8].js',
  // 或使用函数返回名（不常用）
  // filename: (chunkData) => {
  //   return chunkData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
  // },
  // 块名，公共块名（非入口）
  chunkFilename: '[name].[chunkhash:8].js',
  // 打包生成的 index.html 文件里面引用资源的前缀
  // 也为发布到线上资源的 URL 前缀
  // 使用的是相对路径，默认为 ''
  publicPath: './'
}
```

### hash

文件名加入 hash，是为了更好的利用浏览器对静态文件的缓存。

1. hash

即使文件内容没有改变，每次构建都产生一个新的哈希值，这显然不是我们想看到的。可以用在开发环境，但不建议用于生产环境。

2. chunkhash

每个入口都有对应的哈希值，当入口依赖关系中有文件内容发生变化，该入口的哈希值才会发生变化。适用于生产环境。

3. contenthash

根据包内容计算出哈希值，只要包内容不变，哈希值不变。适用于生产环境。

关于这三者的区别，网上也有相关文章，例如我查到的一篇 [《webpack 中的 hash、chunkhash、contenthash 区别》](https://juejin.im/post/5a4502be6fb9a0450d1162ed) 可以参考。

### 打包成库

构建一个可以被其它模块引用的库，如下：

build/webpack.base.js

```js
output: {
  // path 必须为绝对路径
  // 输出文件路径
  path: path.resolve(__dirname, '../../dist/build'),
  // 包名称
  filename: '[name].[chunkhash:8].js',
  // 块名，公共块名（非入口）
  chunkFilename: '[name].[chunkhash:8].js',
  // 打包生成的 index.html 文件里面引用资源的前缀
  // 也为发布到线上资源的 URL 前缀
  // 使用的是相对路径，默认为 ''
  publicPath: '/',
  // 一旦设置后该 bundle 将被处理为 library
  library: 'libraryName',
  // export 的 library 的规范，有支持 var, this, commonjs,commonjs2,amd,umd
  libraryTarget: 'umd',
}
```

## 配置模式 mode

build/webpack.prod.js

```js
// none、development、production
// 默认为 production
mode: 'production'
```

build/webpack.dev.js

```js
mode: 'development'
```

webpack4 针对不同模式，调用内置的优化策略，可以减少很多配置。参考 [webpack 模式](https://webpack.docschina.org/concepts/mode/)

## 配置解析策略 resolve

build/webpack.base.js

```js
resolve: {
  // import 导入时别名，减少耗时的递归解析操作
  alias: {
    '@': resolve('../src')
  }
}
```

## 配置解析和转换文件的规则 module

给项目中不同的文件类型，配置相应的规则

build/webpack.base.js

```js
module: {
  // 忽略大型的 library 可以提高构建性能
  noParse: /jquery|lodash/,
  rules: []
}
```

js 解析规则

build/webpack.rules.js

```js
rules: [
  {
    test: /\.js$/,
    use: ['babel-loader'],
    // 不检查 node_modules 下的 js 文件
    exclude: '/node_modules/'
  }
]
```

.babelrc

```js
{
	"presets": [
    // 根、子目录的公共预设
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry",
        "corejs": 3,
        "modules": false
      }
    ]
  ],
  "plugins": [
    // 根、子目录的公共插件
    [
      "@babel/transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}
```

1. 最新的建议直接使用 core-js 3，不再使用 @babel/polyfill 和 core-js 2。
2. babelrc 的 plugins @babel/transform-runtime

sass 解析规则

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
rules: [
  {
    test: /\.s[ac]ss$/i,
    use: [
      devMode
        ? 'style-loader'
        : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
      'css-loader',
      'postcss-loader',
      'sass-loader'
    ]
  }
]
```
