const path = require("path");
const SRC_DIR = __dirname + "/react-client/src";
const DIST_DIR = __dirname + "/public/js";
const webpack = require('webpack');

module.exports = {
    entry: `${SRC_DIR}/index.jsx`,
    output: {
      path: DIST_DIR,
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.css']
    },
    module : {
      rules : [
        {
          test: /\.css$/,
          loaders: ["style-loader", "css-loader"],
        },
        {
          test: /\.png$/,
          loader: 'url-loader'
        },
        {
          test: /\.jpg/,
          loader: 'file-loader'
        },
        {
          test : /\.jsx?/,
          include : SRC_DIR,
          loader : 'babel-loader',      
          query: {
            presets: ['@babel/react', '@babel/env'],
         }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  };