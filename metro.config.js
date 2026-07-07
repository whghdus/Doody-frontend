// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
    resolveRequest: (context, moduleName, platform) => {
      if (platform === 'web' && moduleName === 'react-native-maps') {
        return {
          type: 'sourceFile',
          filePath: require.resolve('./mock-maps.js'),
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  };

  return config;
})();