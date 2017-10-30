const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'src', 'remarkjs-slideshow.js'),
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
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      // requires fonts as external files
      {
        test: /\.(otf|ttf|woff)$/,
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
    new ExtractTextPlugin('slides.css'),
  ]
}
