// https://github.com/firebase/firebase-js-sdk/issues/6253
// https://github.com/facebook/metro/pull/770

const { getDefaultConfig } = require('@expo/metro-config')

const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.resolver.assetExts.push('cjs')

module.exports = defaultConfig
