const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const pages = ['index.html'];
const multipleHtmlPlugins = pages
  .map((templateName) => new HtmlWebpackPlugin({
    filename: path.resolve(__dirname, `dist/${templateName}`),
    template: `src/${templateName}`,
  }));

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/js/index.js'),
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist/'),
  },
  devServer: {
    contentBase: '../dist',
    watchContentBase: true,
  },
  stats: {
    children: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      { test: /\.(html)$/, use: ['html-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.s[ac]ss$/i, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        parser: { dataUrlCondition: { maxSize: 8192 } },
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(ttf|eot)(\?[\s\S]+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(svg|jpeg|jpg|png|webp|gif)(\?[\s\S]+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[ext]/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    ...multipleHtmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'css/bundle.css',
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, 'src/images/icons/favicon.svg'),
      prefix: '',
      publicPath: 'images/favicons',
      outputPath: path.resolve(__dirname, 'dist/images/favicons'),
      inject: (htmlPlugin) => pages.includes(path.basename(htmlPlugin.options.filename)),
      favicons: {
        appName: 'lucky-day',
        developerName: 'jPee',
      },
    }),
  ],
};
