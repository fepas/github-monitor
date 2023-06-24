/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: './assets/js/index',
  output: {
    path: path.resolve('./assets/bundles/'),
    filename: '[name]-[hash].js',
  },

  plugins: [
    new BundleTracker({ path: __dirname, filename: 'webpack-stats.json' }),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'assets/js'),
    ],
    extensions: ['.js', '.jsx'],
  },
};
