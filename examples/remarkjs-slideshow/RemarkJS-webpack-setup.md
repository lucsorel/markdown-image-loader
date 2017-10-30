# Start the slideshow

* install the dependencies with either `npm i` or `yarn`
* starts the `webpack-dev-server` with `npm start`
* open your browser on [localhost:8080](http://localhost:8080)
* RemarkJS tips:
  * press `c` to open a new browser window to display full screen to your audience
  * press `p` to open the presenter mode on your screen (timer, slide notes, preview of the next slide)

# Build the static files

* install the dependencies with either `npm i` or `yarn`
* launch the build with `npm run build`
* the static files will be generated to the `remarkjs-slideshow/dist` folder

# Technical notes

Using RemarkJS in a webpack project is really straightforward, see [remarkjs-slideshow.js](src/remarkjs-slideshow.js):

* the markdown content is required and injected
* the slideshow is started

The only criticism is that the RemarkJS library for the browser cannot be installed as an NPM package but is downloaded from a CDN. If you want to build a fully independent slideshow:

* remove the `<script src="https://remarkjs.com/downloads/remark-latest.min.js"></script>` line from the `index.html` file
* download it and version it into your project as `src/remark.js`
* require it in your `src/remarkjs-slideshow.js` as such:

```js
// requiring remark.js creates the remark global
/* global remark */
require('./remark.js')
// ...
document.getElementById('source').innerHTML = require('./slideshow.md')
remark.create({ ... })
```
