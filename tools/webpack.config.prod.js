/**
 * WEBPACK CONFIG FOR PRODUCTION USE
 */

/* eslint-disable no-var */
// var webpack = require('webpack');
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
    include: path.join(process.cwd(), 'src')
  },
  // css etc required to run bootstrap
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader',
    include: path.join(process.cwd(), 'src/')
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

module.exports = {
  entry: [
    path.join(process.cwd(), './src/Components/HorizontalTimeline.jsx')
  ],
  // If you pass an array - the modules are loaded on startup. The last one is exported.
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: 'react-horizontal-timeline.js',
    libraryTarget: 'commonjs2'
  },
  // Array of file extensions used to resolve modules.
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'react-motion': 'react-motion',
    radium: 'radium',
    jquery: 'jquery'
  },
  plugins: [],
  module: {
    loaders: loaders
  }
};
