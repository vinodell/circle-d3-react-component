require('dotenv').config()

const webpack = require('webpack')
const { resolve } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESlintPlugin = require('eslint-webpack-plugin')

const { PORT, SOCKETS_IO_STATUS } = process.env
// const socketStatus = process.env.SOCKETS_IO_STATUS === 'true' ? true : false

const config = {
  entry: './client/main.js',
  mode: 'development',
  output: {
    filename: 'js/[name].bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/'
    //  publicPath пустая переменная
  },
  devServer: {
    hot: true,
    open: true,
    contentBase: resolve(__dirname, 'dist'),
    port: 8081, // client port
    host: 'localhost',
    index: 'index.html',
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      context: ['/api', '/ws'],
      target: `http://localhost:${PORT || 8080}`, // server port
      ws: !!SOCKETS_IO_STATUS
    },
    publicPath: '/',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        use: 'babel-loader',
        exclude: /node_modules/
        // описания правил работы с jsx для JavaScript, к которому применим babel
      },
      {
        test: /\.(scss|css)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // выводит css файлы в отдельный файл (3)
            options: {
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, // собирает все эти файлы в единые куски (2)
          'postcss-loader',
          'sass-loader' // sass преобразует это в css (1) *!webpack считывает код снизу вверх!
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ESlintPlugin({
      extensions: ['js', 'jsx']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${__dirname}/client/index.html`,
          to: 'index.html'
          // to: относительно path: resolve(__dirname, 'dist'), то есть папки /dist
        }
      ]
    }),
    new webpack.DefinePlugin({
      SOCKETS_IO_STATUS
    })
  ]
}

module.exports = config
