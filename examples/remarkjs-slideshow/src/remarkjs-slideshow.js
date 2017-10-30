// the remark global is created by the index.html.head.script remark.js reference
/* global remark document */

require('./slides.css')

// loads the markdown content and starts the slideshow
document.getElementById('source').innerHTML = require('./slideshow.md')
remark.create({
  // see https://github.com/gnab/remark/wiki/Configuration
  highlightLines: true
})
