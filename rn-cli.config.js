const blacklist = require('metro').createBlacklist

const libsNative = Object.assign(require('node-libs-react-native'), {
    net: require.resolve('node-libs-react-native/mock/net'),
    fs: require.resolve('react-native-fs'),
    child_process:  require.resolve('./components/DumbModules/child_process')
});

module.exports = {
  getBlacklistRE: function() {
    return blacklist([/ios\/.*/]);
  },
  extraNodeModules: libsNative
};
