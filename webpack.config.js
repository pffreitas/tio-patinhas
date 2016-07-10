var webpack = require('webpack');
var path = require('path');

var ENV = process.env.NODE_ENV || 'development';

console.log('|*********************************** NODE_ENV: ' + ENV.toUpperCase() + ' ***********************************|');

var _plugins = [
  new webpack.NoErrorsPlugin()
];

if(ENV !== 'development' && ENV !== 'aceite'){
  _plugins.push(new webpack.optimize.UglifyJsPlugin({
    mangle: {
      except: ['exports', 'require'],
    },
  }));
}

module.exports = {
  entry: {
    application: './js/main.js'
  },
  output: {
    path: './dist',
    filename: '[name].web.js',
  },
  // devtool: '#cheap-eval-source-map',
  resolve: {
    alias: {
      config: path.join(__dirname, 'js/config', ENV),
    },
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  plugins: _plugins,
};
