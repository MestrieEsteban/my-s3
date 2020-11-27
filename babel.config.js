module.exports = (api) => {
  api.cache(true)

  const presets = ['@babel/env', '@babel/typescript']
  const plugins = [
    'babel-plugin-transform-typescript-metadata',
    ['@babel/proposal-decorators', { legacy: true }],
    '@babel/proposal-class-properties',
    '@babel/transform-runtime',
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ]

  return {
    presets,
    plugins,
  }
}
