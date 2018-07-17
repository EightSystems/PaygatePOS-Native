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
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
      ],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-electron',
      'react-native-svg': 'react-native-svg-web'
    },
    extensions: ['.electron.js', '.web.js', '.js', '.json'],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.(.*)exports\/NativeModules(.*)/, function(resource) {
        resource.request = resource.request.replace(/\.(.*)exports\/NativeModules(.*)/,
            path.resolve(__dirname, `./desktop/NativeModules`)
        );
    }),
    new webpack.NormalModuleReplacementPlugin(/(.*)react-native\/Libraries(.*)/, function(resource) {
        if ( resource.request.indexOf('Components/View') ) {
            resource.request = path.resolve(__dirname, `./node_modules/react-native-web/src/exports/View/ViewStylePropTypes`);
        }
        else {
            resource.request = path.resolve(__dirname, `./node_modules/react-native-web/src/exports/${resource.request.replace('react-native/Libraries/', '')}`);
        }
    }),
    new webpack.NormalModuleReplacementPlugin(/\.(.*)exports\/Modal(.*)/, function(resource) {
        resource.request = resource.request.replace(/\.(.*)exports\/Modal(.*)/,
            path.resolve(__dirname, `./components/Utils/ExtComponents/Modal.web`)
        );
    })
  ],
  target: 'electron-renderer',
  externals: {
      serialport: "serialport",
      usb: "usb",
      printer: "printer",
      fsevents: "fsevents",
      "graphicsmagick-static": "graphicsmagick-static",
      "fontkit": "fontkit"
  }
}
