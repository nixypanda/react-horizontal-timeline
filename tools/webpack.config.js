/**
 * WEBPACK CONFIG TO RUN DEMOS
 *
 * 'react-hot'
 * React Hot Loader is a plugin for Webpack that allows instantaneous live refresh without losing
 * state while editing React components.
 */

/* eslint-disable no-var */
var webpack = require('webpack');
var path = require('path');

// entry point of all the deomos
var entry = {
  'demo-swipeable-views': path.join(process.cwd(), './demos/demo-swipeable-views/index.js')
};

// array of all the requisite loaders
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
    include: [ path.join(process.cwd(), 'demos'), path.join(process.cwd(), 'src') ]
  },
  // css etc required to run bootstrap
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader',
    include: [ path.join(process.cwd(), 'demos'), path.join(process.cwd(), 'src') ]
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
  },
  {
    test: /\.html$/,
    loader: 'html'
  }
];

// setting up variables
// setting up the entry point to the demos
entry = Object.keys(entry).reduce(function (result, key) {
  result[key] = [
    'webpack-dev-server/client?http://localhost:5000',
    'webpack/hot/only-dev-server',
    entry[key]
  ];
  return result;
}, {});

module.exports = {
  entry: entry,
   // If you pass an array - the modules are loaded on startup. The last one is exported.
  output: {
    filename: '[name]/all.js',
    publicPath: '/demos/',
    path: path.join(process.cwd(), '/demos/')
  },
  // Array of file extensions used to resolve modules.
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  // http://www.cnblogs.com/Answer1215/p/4312265.html
  // The source map file will only be downloaded if you have source maps enabled and your dev tools
  // open.
  devtool: 'eval-source-map',
  plugins: [
    // Hot Module Replacement (HMR) exchanges, adds or removes modules while an application is
    // running without page reload.
    new webpack.HotModuleReplacementPlugin(),
    // Hot loader is better when used with NoErrorsPlugin and hot/only-dev-server since it eliminates
    // page reloads altogether and recovers after syntax errors.
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: loaders
  },
  noParse: [
    path.join(process.cwd(), 'node_modules')
  ]
};
