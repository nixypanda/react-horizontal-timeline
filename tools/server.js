/* eslint-disable strict, no-console */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  stats: { colors: true },
  historyApiFallback: true
}).listen(5001, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:5001');
});
