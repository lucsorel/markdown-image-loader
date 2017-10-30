# A markdown-image-loader use case for RevealJS

<div class="logos">
  <span class="md-logo">
    ![](img/markdown-logo.svg)
  </span>
  <span class="webpack-logo">
    ![](img/webpack-logo.svg)
  </span>
</div>

The `markdown-image-loader` loader:

* converts the `*.md` files into webpack resources
* detects references to local images and extracts them as file resources<!-- .element: class="fragment" -->
* leaves aside references to URL-based images<!-- .element: class="fragment" -->

---

# Resources

In your `webpack.config.js` file:

```js
module.exports = {
  module: {
    rules: [
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
}
```

--

Full source code and tutorials on [the github project](https://github.com/lucsorel/markdown-image-loader).
