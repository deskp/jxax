const webpack = require('webpack');
const path = require('path');
const getAlias = require('./scripts/get-webpack-alias-from-jsconfig');

function isDev(env) {
  return env && env.dev;
}

module.exports = (env) => ({
  mode: isDev(env) ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src', 'bin', 'index.js'),
  output: {
    filename: 'jxax.js',
  },
  resolve: {
    alias: getAlias(path.resolve(__dirname, 'jsconfig.json')),
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  plugins: [
    // Register OSA run handler.
    new webpack.BannerPlugin({
      banner: [
        'const scpt=this;',
        'this.run=function(args){};',
        'this.runCommand=function(command, args){};',
        'function run(args){return this.run(args);}',
        'function runCommand(command, args){return this.runCommand(command, args);}',
      ].join(''),
      raw: true,
    }),
    // Add shebang.
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env osascript -l JavaScript', raw: true }),
  ],
  performance: {
    hints: false,
  },
});
