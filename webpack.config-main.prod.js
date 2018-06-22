const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge');

const baseConfig = require('./webpack.config-renderer');

module.exports = merge.smart(baseConfig, {
    devtool: 'source-map',
    mode: 'production',
    entry: path.resolve(__dirname, 'desktop', 'main'),
    target: 'electron-main',
    output: {
        path: path.resolve(__dirname, 'desktop', 'dist'),
        filename: 'main-prod.js',
    },
    node: {
        __dirname: false,
        __filename: false
    }
});
