const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: 'webglcraft.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    stats: 'errors-only',
    host: process.env.HOST, // default: localhost
    port: process.env.PORT, // default: 8080
    open: true, // open page in browser
    overlay: true, // error overlay
  },
  plugins: [
    new HtmlWebpackPlugin({template: './public/index.html'}),
  ],
};
