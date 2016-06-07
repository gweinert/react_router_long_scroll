module.exports = (() => {

  "use strict";

  const path               = require('path');
  const extractTextPlugin  = require("extract-text-webpack-plugin");
  const webpack            = require('webpack');

  const query = {
    plugins: [
      'transform-class-properties',
      ['transform-es2015-classes', { loose: true }]
    ],
    presets: [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-stage-0'),
      require.resolve('babel-preset-react')
    ]
  };

  return {
    entry: './src/index.js',
    externals: [{
      "react": {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      }
    },{
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      }
    }],
    output: {
      filename: 'single-page-router-scroll-component.js',
      library: 'SinglePageRouterScroll',
      libraryTarget: 'umd',
      path: './dist/',
    },
    module: {
      loaders: [
        { test: /\.json(\?.*)?$/, loader: 'json' },
        { test: /\.jsx?(\?.*)?$/, loaders: [`babel?${ JSON.stringify(query) }`], exclude: /node_modules/ },
        { test: /\.scss(\?.*)?$/, loader: extractTextPlugin.extract('style', 'css!autoprefixer!sass!import-glob-loader') },
        { test: /\.(jpe?g|png|gif)(\?.*)?$/i, loader: 'file?name=[name].[ext]!image-webpack?optimizationLevel=3' },
        { test: /\.svg(\?.*)?$/, loader: 'file?name=[name].[ext]' }
      ]
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin()
    ]
  };

})();