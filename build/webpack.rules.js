const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'
const rules = [
  {
    test: /\.js$/,
    use: ['babel-loader'],
    exclude: '/node_modules/' // 不检查 node_modules 下的 js 文件
  },
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
  {
    test: /\.(html|htm)$/,
    loader: 'html-loader'
  },
  {
    test: /\.(png|jpe?g|gif)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 4 * 1024,
          name: 'img/[name].[hash:8].[ext]'
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
  },
  {
    test: /\.(svg)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          name: 'img/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 4 * 1024,
      name: '[name].[hash:8].[ext]',
      outputPath: 'media'
    }
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 4 * 1024,
      name: '[name].[hash:8].[ext]',
      outputPath: 'font'
    }
  }
]

module.exports = rules
