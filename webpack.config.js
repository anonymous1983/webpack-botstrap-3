'use strict';

const path = require('path');
const Webpack = require('webpack');
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

require('es6-promise').polyfill();

let config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "./bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        // css-hot-loader automatically refresh stylesheet
        use: ['css-hot-loader'].concat(
          // Extract your scss to css
          ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            // if you dont import bootstrap
            use: [
              /*'css-loader',
              'postcss-loader',
              'sass-loader'*/
              {
                loader: 'css-loader', // translates CSS into CommonJS modules
              }, {
                loader: 'postcss-loader', // Run post css actions
                options: {
                  plugins: function () { // post css plugins, can be exported to postcss.config.js
                    return [
                      require('precss'),
                      require('autoprefixer')
                    ];
                  }
                }
              }, {
                loader: 'sass-loader' // compiles Sass to CSS
              }
            ]
          })
        )
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=100000'
      },
      {
        test: /\.png$/,
        use: 'url-loader?limit=100000'
      },
      {
        test: /\.jpg$/,
        use: 'file-loader'
      },
      {
        test: /\.(woff|woff2) (\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },

  plugins: [
    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    // Specify the resulting CSS filename
    new ExtractTextWebpackPlugin('styles.css'),

    // Stylelint plugin
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      context: '',
      files: '**/*.scss',
      syntax: 'scss',
      failOnError: false,
      quiet: false
    }),
    new DashboardPlugin()

  ],

  stats: {
    // Colored output
    colors: true
  },

  // Create dev server
  devServer: {
    contentBase: path.resolve(__dirname, "./public"),
    historyApiFallback: true,
    inline: true,
    open: true,
    hot: true,
    port: 3033
  },
  // Create Sourcemaps for the bundle
  devtool: "eval-source-map"
};

// For Prod environnement
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // Minify files
    // JavaScript
    new Webpack.optimize.UglifyJsPlugin(),
    // CSS
    new OptimizeCSSAssetsPlugin()
  );
}

// Export Module
module.exports = config;
