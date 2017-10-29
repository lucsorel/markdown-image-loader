<div align="center">
  <a href="https://en.wikipedia.org/wiki/Markdown" target="_blank">
    <img width="208" height="128" alt="Markdown logo" vspace="36"
      src="https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg" />
  </a>
  <a href="https://github.com/webpack/webpack" target="_blank">
    <img width="200" height="200" alt="Webpack logo"
      src="https://webpack.js.org/assets/icon-square-big.svg" />
  </a>
  <h1>Markdown image loader</h1>
</div>

**Handles image references involved in markdown files during the webpack processing.**

Highly inspired from the [Webpack: A simple loader](https://bocoup.com/blog/webpack-a-simple-loader) article by [Michael "Z" Goddard](http://zfighting.tumblr.com/tagged/I-MADE-DIS), rewritten with some ES6 flavor, use-case documentation and unit testing. Addition: the loader does not impact references to online images (eg: image path starting with `http://`, `https://` or `//`).

# Installation

Install the `markdown-image-loader` along other webpack development dependencies:

```bash
# via yarn
yarn add -D webpack file-loader markdown-image-loader

# via npm
npm i -D webpack file-loader markdown-image-loader
```

# Use cases

This loader was originally designed to display [markdown](https://en.wikipedia.org/wiki/Markdown) content on the browser-side with [Remark](https://remarkjs.com/), a slideshow engine. In the webpack process, this loader converts image references of markdown documents into image file requirements so that the [file-loader](https://github.com/webpack-contrib/file-loader) can process them in your build chain. The `remark` use-case described hereafter was inspired by [Sébastien Castiel](https://github.com/scastiel).

```
dist // contains the result of your build, including the image files processed by webpack
src
┣ remark.js // downloaded from https://remarkjs.com/downloads/remark-latest.min.js if you want to include this vendor file in your build
┣ index.html
┣ app.js
┣ slides.md
┗ img // folder containing the images referenced in slides.md
┃ ┣ ... sample.jpg
webpack.config.js // involves this markdown-image-loader and the file-loader
package.json
```

* `src/index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <!-- the title header can be dynamically set by app.js -->
    <title>My Remark slideshow</title>
  </head>
  <body>
    <!-- invisible textarea wrapping the mardown content to be displayed -->
    <textarea id="markdownSlideshow" style="display: none"></textarea>
    <!-- loads the bundled webapp explicitely, or use the html-webpack-plugin instead -->
    <script src="bundled-app.js"></script>
  </body>
</html>
```

* `src/app.js`:

```js
// creates the `remark` global (yes, this great library could be wrapped in a better way...)
require('./remark.js')
// loads the markdown content (and processes its image references)
const markdownSlideshow = require('./slides.md')

// embeds the markdown content and starts the slideshow
document.getElementById('source').innerHTML = markdownSlideshow
remark.create()
```

* `src/slides.md`:

```
# Slide 1 with a jpg reference

![test1](img/test1.jpg)

---

# Slide 2 with an inline png reference

In line ![test2](img/test2.png) image reference.
```

* `webpack.config.js`. Loaders defined in the `module.rules` section are called  from bottom to top: the `file-loader` must be called after the `markdown-image-loader` produces new file requirements:
:

```js
const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src', 'app.js'),
  output: {
    filename: 'bundled-app.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {} // produces {hash}.[ext] files by default
          }
        ]
      },
      {
        test: /\.(md|markdown)$/,
        use: 'markdown-image-loader'
      }
    ]
  }
}
```

* `package.json`. Use the `scripts.build` to produce your build for production, for which you must include these mandatory dependencies in your project: `webpack`, `file-loader` and `markdown-image-loader`. You can optionally include the `webpack-dev-server` to serve your slideshow with hot reloading with the `scripts.start` command.

```json
{
  "scripts": {
    "build": "rm -rf dist && webpack",
    "start": "webpack-dev-server",
    "lint": "standard"
  },
  "devDependencies": {
    "file-loader": "...",
    "markdown-image-loader": "...",
    "webpack": "...",
    "webpack-dev-server": "..."
  },
}
```

The outputs generated in the `dist` folder will be:

* the `bundled-app.js` file, handling the markdown content as follows:

```js
// ...
/* 0 */
/***/ (function(module, exports, __webpack_require__) {
module.exports = [
"# Slide 1 with a jpg reference\n\n",
"![test1](" + __webpack_require__(1) + ")",
"\n\n---\n\n# Slide 2 with an inline png reference\n\nIn line ",
"![test2](" + __webpack_require__(2) + ")",
" image reference.\n"
]
/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {
module.exports = __webpack_require__.p + "05bf210f71dda8913b3e9ac296da171f.jpg";
/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {
module.exports = __webpack_require__.p + "e3989c3353cceb13f5bb1ecf343f22a6.png";
/***/ })
```

* the images referenced by the markdown content, processed by the `file-loader` plugin:
  * the `dist/05bf210f71dda8913b3e9ac296da171f.jpg` file (referenced in slide 1)
  * the `dist/e3989c3353cceb13f5bb1ecf343f22a6.png` file (referenced in slide 2)

# Unit tests

Unit tests can be run with the `npm test` command.

Despite these efforts, should you find an issue or spot a vital feature, you are welcome to report bugs and submit code requests!

# Change log

* 1.0.**3**: [perf] made the loader outputs cacheable, [doc] added this change log section
* 1.0.**2**: [fix] removed the comma surrounding image requirements in the exported module content
* 1.0.**1**: [fix] the loader should not not require URLed-image references
* **1.0.0**: initial release with unit-tests and documentation

# License

May be freely distributed under the [MIT license](https://github.com/lucsorel/markdown-image-loader/blob/master/LICENSE).

Copyright (c) 2017 Luc Sorel
