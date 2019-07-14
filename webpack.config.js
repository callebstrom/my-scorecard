var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './build');
var APP_DIR = path.resolve(__dirname, './src/client');

const config = {
  mode: 'development',
  entry: {
    main: APP_DIR + '/index.js'
  },
  output: {
    filename: 'bundle.js',
    path: BUILD_DIR,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/react', '@babel/env']
          }
        }
      },
      {
        test: /(\.css|.scss)$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      },
    ]
  }
};

module.exports = config;