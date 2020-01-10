# Webpack4 详细的配置笔记

本文主要是多入口配置，希望能在无框架网页开发时提高开发效率，对代码进行打包优化。
关键词：
1. babel7
2. 多入口
3. sass
4. 图片处理
5. 音视频处理
6. 字体处理

## 模块总览

目录结构大概如下：

```
|-build
  |-create.js
  |-utils.js
  |-webpack.base.js
  |-webpack.dev.js
  |-webpack.prod.js
|-dist
|-src
|-.babelrc
|-.eslintrc.js
|-package.json
```

```js
// webpack.base.js
const webpack = require('webpack')
const path = require('path')

const rules = require('./webpack.rules.js')
const utils = require('./utils.js')

module.exports = {
  entry: {},
  resolve: {},
  module: {},
  externals: {},
  plugins: []
}

// webpack.prod.js
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
  output: {},
  optimization: {},
  plugins: []
}
module.exports = merge(configBase, configProd)

// webpack.dev.js
const webpack = require('webpack')
const merge = require('webpack-merge')

const utils = require('./utils.js')
const configBase = require('./webpack.base.js')

const configDev = {
  mode: 'development'
  output: {},
  devServer: {},
  plugins: [],
  module: {}
}
module.exports = merge(configBase, configDev)

// webpack.rules.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
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
// utils.js
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

function getHtmlPlugins() {}

module.exports = {
  resolve,
  getEntry,
  getHtmlPlugins
}

// webpack.base.js
entry: utils.getEntry('./src/pages/**/index.js'),
```

## 配置 clean-webpack-plugin

在配置 output 之前配置这个插件是为，每次打包前可以删除 dist 目录，保证没有冗余文件。

```js
// webpack.prod.js
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

```js
// webpack.dev.js
output: {
  path: utils.resolve('../dist'),
  // 包名称
  filename: 'js/[name].js'
},

// webpack.prod.js
output: {
  path: utils.resolve('../dist'),
  // 包名称
  filename: 'js/[name].[chunkhash:8].js',
  // 块名，公共块名（非入口）
  chunkFilename: 'js/[name].[chunkhash:8].js',
  // 打包生成的 index.html 文件里面引用资源的前缀
  // 也为发布到线上资源的 URL 前缀
  // 使用的是相对路径，默认为 ''
  publicPath: '.'
},
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

## 配置模式 mode

none、development、production，默认为 production

```js
// webpack.prod.js
mode: 'production'

// webpack.dev.js
mode: 'development'
```

webpack4 针对不同模式，调用内置的优化策略，可以减少很多配置。参考 [webpack 模式](https://webpack.docschina.org/concepts/mode/)

## 配置解析策略 resolve

```js
// webpack.base.js
resolve: {
  // import 导入时别名，减少耗时的递归解析操作
  alias: {
    '@': resolve('../src'),
    'assets': utils.resolve('../src/assets')
  }
}
```

## 配置解析和转换文件的规则 module

给项目中不同的文件类型，配置相应的规则

```js
// webpack.base.js
module: {
  // 忽略大型的 library 可以提高构建性能
  noParse: /jquery|lodash/,
  rules: []
}
```

1. js 解析规则

```js
// webpack.rules.js
rules: [
  {
    test: /\.js$/,
    use: ['babel-loader'],
    // 不检查 node_modules 下的 js 文件
    exclude: '/node_modules/'
  }
]

// .babelrc
{
	"presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
        "modules": false
      }
    ]
  ]
}

// pages/index/index.js
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

根据官网 Usage Guide 配置如上，这里采用的是 core-js@3 来实现 polyfill。因为 babel7 已经废弃 @babel/polyfill 和 core-js@2，不再更新。新的特性只会添加到 core-js@3，为了避免后续再改动，直接用 3。只是打出来的包大了点，这个自己平衡，如果觉得不爽，就还是用 @babel/polyfill。

关于这个 core-js@3 [有篇文章](https://www.cnblogs.com/sefaultment/p/11631314.html) 讲的挺清晰，可以参考。

2. sass 解析规则

```js
// webpack.rules.js
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
  },
]

// webpack.prod.js
plugins: [
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:5].css',
    chunkFilename: 'css/[id].[contenthash:5].css'
  }),
]
```

3. html

```js
// webpack.base.js
plugins: [
  ...utils.getHtmlPlugins('./src/pages/**/index.html')
]

// utils.js
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
```

4. 图片

```js
// webpack.rules.js
rules: [
  {
    test: /\.(html|htm)$/,
    loader: 'html-loader'
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          esModule: false, // 处理 html 图片
          limit: 5 * 1024,
          name: '[name].[hash:8].[ext]',
          outputPath: 'img'
        }
      },
      {
        loader: 'img-loader',
        options: {
          plugins: [
            require('imagemin-pngquant')({
              speed: 2 // 1-11
            }),
            require('imagemin-mozjpeg')({
              quality: 80 // 1-100
            }),
            require('imagemin-gifsicle')({
              optimizationLevel: 1 // 1,2,3
            })
          ]
        }
      }
    ]
  }
]
```

用法：

```css
background: url(~assets/index/icons/ic-star-16px.png);
```

```js
import wukong from 'assets/index/wukong.jpg'
```

```html
<img src="~assets/index/wukong.jpg" alt="wukong">
```

这里有有几个点要注意：

- url-loader 和 file-loader
  如果配置了 limit，那么小于这个 limit 值的图片会被 url-loader 转换成 base64，超过的图片直接用 file-loader 处理。所以虽然规则里没出现 file-loader，但还是要安装。
- html-loader
  用于处理 html 文件，这里主要是处理 html 文件里的图片。图片会通过 url-loader 处理，处理完再给图片 src 设置正确的路径或 base64。而 html 中要使用 webpack 的 alias 配置，需要在前面加上 ~，然后 url-loader 要配置 `esModule: false` 才不会出错。

5. 音视频和字体

```js
// webpack.rules.js
rules: [
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: '[name].[hash:8].[ext]',
      outputPath: 'media'
    }
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: '[name].[hash:8].[ext]',
      outputPath: 'font'
    }
  }
]
```

## devserver

```js
// webpack.dev.js
devServer: {
  contentBase: utils.resolve('../src'), // 告诉服务器从哪个目录中提供内容
  publicPath: '/', // 此路径下的打包文件可在浏览器中访问
  port: '8090',
  overlay: true, // 浏览器页面上显示错误
  open: true, // 自动打开浏览器
  // stats: "errors-only", //stats: "errors-only"表示只打印错误：
  historyApiFallback: true, // 404 会被替代为 index.html
  inline: true, // 内联模式，实时刷新
  hot: true, // 开启热更新
  proxy: {
    '/api': {
      target: 'https://platform.dev.dtedu.com/',
      changeOrigin: true,
      pathRewrite: {}
    }
  }
},
plugins: [
  //热更新
  new webpack.HotModuleReplacementPlugin()
],
```

1. 打包后文件的内存路径 = devServer.contentBase + output.publicPath + output.filename，只能通过浏览器来访问这个路由来访问内存中的 bundle
2. 对于 publicPath，有两个用处：
- 像以上的被 webpack-dev-server 作为在内存中的输出目录。
- 被其他的 loader 插件所读取，修改 url 地址等。

## devtool

```js
// webpack.dev.js
devtool: 'cheap-eval-source-map',

// webpack.prod.js
devtool: 'none',
```

此选项控制是否生成，以及如何生成 source map。不同选项之间，[官网](https://webpack.docschina.org/configuration/devtool/) 有更详细解释和对比。

## optimization

```js
// webpack.prod.js
optimization: {
  runtimeChunk: {
    name: 'manifest'
  },
  splitChunks: {
    cacheGroups: {
      chunks: 'initial', // 只对入口文件处理
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }
},
```

runtimeChunk 和 splitChunks 主要优化的点在于浏览器缓存，如果不考虑，也可以不加这个配置。
