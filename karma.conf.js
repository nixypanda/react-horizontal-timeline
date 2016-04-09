// Karma configuration
// Generated on Sun Jan 31 2016 06:13:26 GMT+0530 (IST)

/* eslint-disable no-var */
var webpack = require('karma-webpack');
var path = require('path');

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'jasmine' ],


    // list of files / patterns to load in the browser
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'spec/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    plugins: [
      'karma-coverage',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
      webpack
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec/**/*.spec.js': [ 'webpack', 'sourcemap' ],
      'src/**/*.js': [ 'webpack', 'coverage', 'sourcemap' ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [ 'dots', 'coverage', 'progress' ],

    coverageReporter: {
      dir: 'build/reports/coverage',
      reporters: [
        // { type: 'text' },
        // { type: 'cobertura', subdir: '.', file: 'cobertura.txt' }
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'html', subdir: 'report-html' }
      ]
    },

    webpack: {
       // just do inline source maps instead of the default
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /\.jsx?$/,
            exclude: [ /node_modules/, /\.spec\.js/ ],
            loader: 'isparta-instrumenter-loader'
          }
        ],
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          // css etc required to run bootstrap
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
            include: [ path.join(__dirname, 'demos'), path.join(__dirname, 'src') ]
          }
        ]
      }
    },
    webpackMiddleware: {
      // please don't spam the console when running in karma!
      noInfo: true
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [ 'PhantomJS' ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
