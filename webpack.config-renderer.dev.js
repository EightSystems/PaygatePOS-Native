const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge');

const baseConfig = require('./webpack.config-renderer');

module.exports = merge.smart(baseConfig, {
    devtool: 'source-map',
    mode: 'production',
    target: 'electron-renderer',
    plugins: [
      new webpack.EnvironmentPlugin({
          NODE_ENV: 'production',
          HOT: true
      }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
      })
    ],
    node: {
      __filename: true,
      __dirname: true,
    }
});
