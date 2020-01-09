const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'
const rules = [
  {
    test: /\.js$/,
    use: ['babel-loader'],
    // 不检查node_modules下的js文件
    exclude: '/node_modules/'
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
    loader: 'html-loader',
    options: {
      attrs: [':data-src']
    }
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 5 * 1024,
          name: '[name].[hash:7].[ext]',
          outputPath: 'home/img'
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
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: '[name].[hash:7].[ext]',
      outputPath: 'media'
    }
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: '[name].[hash:7].[ext]',
      outputPath: 'font'
    }
  }
]

module.exports = rules
