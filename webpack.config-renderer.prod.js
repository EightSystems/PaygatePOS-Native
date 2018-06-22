const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge');

const baseConfig = require('./webpack.config-renderer');

module.exports = merge.smart(baseConfig, {
    devtool: 'source-map',
    mode: 'production',
    target: 'electron-renderer',
    output: {
        path: path.resolve(__dirname, 'desktop', 'dist'),
        publicPath: './dist/',
        filename: 'bundle-prod.js',
    },
    plugins: [
      new webpack.EnvironmentPlugin({
          NODE_ENV: 'production',
          HOT: false
      }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(false),
      }),
    ],
    node: {
        __dirname: false,
        __filename: false
    }
});
