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
  }
]

module.exports = rules
