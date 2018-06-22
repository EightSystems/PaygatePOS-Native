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
    node: {
        __dirname: false,
        __filename: false
    }
});
