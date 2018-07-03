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
              test: /\.(png|jpe?g|gif|svg)$/,
              use: 'url-loader'
          }
      ],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-electron',
    },
    extensions: ['.electron.js', '.web.js', '.js', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        HOT: true
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
    new webpack.NormalModuleReplacementPlugin(/\.(.*)exports\/NativeModules(.*)/, function(resource) {
        resource.request = resource.request.replace(/\.(.*)exports\/NativeModules(.*)/,
            path.resolve(__dirname, `./desktop/NativeModules`)
        );
    })
  ],
  target: 'electron-renderer',
}
