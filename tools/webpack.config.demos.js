/**
 * WEBPACK CONFIG FOR PRODUCTION USE
 */

/* eslint-disable no-var */
/* eslint-disable no-process-env */
const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const rules = [
  // Babel enables the use of ES6 today by transpiling your ES6 JavaScript into equivalent ES5 source
  // that is actually delivered to the end user browser.
  {
    test: /\.jsx?$/,
    use: [ 'babel-loader' ],
    include: [ path.join(process.cwd(), 'demos'), path.join(process.cwd(), 'src/') ]
  },
  // ability to load css files into js files
  {
    test: /(\.css)$/,
    use: [ 'style-loader', 'css-loader' ]
  },
  /* BOOTSTRAP CONFIGURATION */
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    use: ['file-loader']
  },
  {
    test: /\.(woff|woff2)$/,
    //'url?prefix=font/&limit=5000'
    use: [{'loader': 'url-loader', 'options': {'prefix': 'font', 'limit': 5000} }]
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    // loader: 'url?limit=10000&mimetype=application/octet-stream'
    use: [{'loader': 'url-loader', 'options': {'limit': 10000, 'mimetype': 'application/octet-stream'}}]
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    // loader: 'url?limit=10000&mimetype=image/svg+xml'
    use: [{'loader': 'url-loader', 'options': {'limit': 10000, 'mimetype': 'image/svg+xml'}}]
  }
];


// production mode
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new UglifyJSPlugin()]
  },
  entry: [
    path.join(process.cwd(), './demos/demo-swipeable-views/index.js')
  ],
  // If you pass an array - the modules are loaded on startup. The last one is exported.
  output: {
    path: path.join(process.cwd(), 'build'),
    filename: 'all.js',
    publicPath: '/demos'
  },
  // Array of file extensions used to resolve modules.
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  module: {
    rules: rules
  }
};

