const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    app: ['babel-regenerator-runtime', './index.web.js'],
  },
  output: {
    path: path.resolve(__dirname, 'desktop', 'dist'),
    filename: 'bundle.js',
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              loader: 'babel-loader',
          },
          {
              test: /\.(ttf)$/,
              loader: 'url-loader'
          },
          {
              test: /\.(png|jpe?g|gif)$/,
              use: 'url-loader'
          }
      ],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-electron',
    },
    extensions: ['.web.js', '.js', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
        NODE_ENV: 'production'
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
  ],
  target: 'electron-renderer',
}
