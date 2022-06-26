'use strict';
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = require('./paths');
const webpack = require('webpack');

// used in the module rules and in the stats exlude list
const IMAGE_TYPES = /\.(png|jpe?g|gif|svg)$/i;

// To re-use webpack configuration across templates,
// CLI maintains a common webpack configuration file - `webpack.common.js`.
// Whenever user creates an extension, CLI adds `webpack.common.js` file
// in template's `config` folder
const common = {
  output: {
    // the build folder to output bundles and assets in.
    path: PATHS.build,
    // the filename template for entry chunks
    filename: '[name].js',
  },
  stats: {
    all: false,
    errors: true,
    builtAt: true,
    assets: true,
    excludeAssets: [IMAGE_TYPES],
  },
  module: {
    rules: [
      // Check for TypeScript files
      {
        test: /\.(ts)|(tsx)$/,
        use: ['ts-loader'],
      },
      // Help webpack in understanding CSS files imported in .js files
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,
          "style-loader",
          {
            loader: 'css-loader',
            options: {
              modules: true,
              modules : {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              importLoaders: 1}
          }],
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" ,// compiles Less to CSS
          options: {
            implementation: require("less"),
            lessOptions: {
              strictMath: true,
            },
          },
        }]
      },
      // Check for images imported in .js files and
      {
        test: IMAGE_TYPES,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    // Help webpack resolve these extensions in order
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
  plugins: [
    // Copy static assets from `public` folder to `build` folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: 'public',
        },
      ],
    }),
    // Extract CSS into separate files
    // new MiniCssExtractPlugin({
    //   filename: '[name].css',
    // }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};

module.exports = common;
