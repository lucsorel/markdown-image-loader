const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'revealjs-slideshow.js'),
  output: {
    filename: 'bundled-app.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      // requires css files as external text files
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // only if you want a separate css file
          { loader: 'css-loader' } // add css or sass loaders if necessary
        ]
      },
      // requires fonts as external files
      {
        test: /\.(otf|ttf|woff|eot)$/,
        use: 'file-loader?name=[name].[ext]?outputPath=fonts/'
      },
      // requires image as external files
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: 'file-loader?outputPath=img/'
      },
      // packages .md files and extracts required images
      {
        test: /\.(md|markdown)$/,
        use: 'markdown-image-loader'
      }
    ]
  },
  plugins: [
    // inserts the packaged webapp at the bottom of the html body
    new HtmlWebpackPlugin({
      template: path.join('src', 'index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
