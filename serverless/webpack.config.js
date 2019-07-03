const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: 'eval',
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.ts'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin([{ from: 'tmp', to: 'tmp' }]),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: require('os').cpus().length - 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            }
          }
        ]
      }
    ],
  },
};

