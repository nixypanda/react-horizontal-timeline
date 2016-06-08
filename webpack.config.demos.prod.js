/**
 * WEBPACK CONFIG FOR PRODUCTION USE
 */

/* eslint-disable no-var */
/* eslint-disable no-process-env */
var webpack = require('webpack');
var path = require('path');

var loaders = [
  // **IMPORTANT** This is needed so that each bootstrap js file required by
  // bootstrap-webpack has access to the jQuery object
  {
    test: /bootstrap\/js\//,
    loader: 'imports?jQuery=jquery'
  },
  // Babel enables the use of ES6 today by transpiling your ES6 JavaScript into equivalent ES5 source
  // that is actually delivered to the end user browser.
  {
    test: /\.jsx?$/,
    loaders: [ 'babel' ],
    include: [ path.join(__dirname, 'demos'), path.join(__dirname, 'src/') ]
  },
  // css etc required to run bootstrap
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader',
    include: [ path.join(__dirname, 'demos'), path.join(__dirname, 'src/') ]
  },
  {
    test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=10000&mimetype=application/octet-stream'
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file'
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=10000&mimetype=image/svg+xml'
  }
];

// production mode
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = {
  entry: [
    './demos/demo-swipeable-views/index.js'
  ],
  // If you pass an array - the modules are loaded on startup. The last one is exported.
  output: {
    path: (__dirname, 'dist'),
    filename: '[name]/all.js',
    publicPath: '/demos'
  },
  // Array of file extensions used to resolve modules.
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ],
  module: {
    loaders: loaders
  },
  noParse: [
    path.join(__dirname, 'node_modules')
  ]
};
