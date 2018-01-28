# A markdown-image-loader use case for RemarkJS

.center[
.md-logo[
![alt markdown logo](img/markdown-logo.svg)
]

.webpack-logo[
![](img/webpack-logo.svg "webpack logo title")
]
]

--

The `markdown-image-loader` loader:

* converts the `*.md` files into webpack resources

--

* detects references to local images and extracts them as file resources

--

* leaves aside references to URL-based images

---

# Resources

Full source code and tutorials can be found on [the github project](https://github.com/lucsorel/markdown-image-loader).

In your `webpack.config.js` file:

```js
module.exports = {
  // ...
  module: {
    rules: [
      // requires image as external files
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: 'file-loader?outputPath=img/'
      },
      // packages .md files and extracts required images
      {
*        test: /\.(md|markdown)$/,
*        use: 'markdown-image-loader'
      }
    ]
  },
  // ...
}
```
