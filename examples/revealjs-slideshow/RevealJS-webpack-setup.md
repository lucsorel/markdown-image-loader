# Start the slideshow

* install the dependencies with either `npm i` or `yarn`
* starts the `webpack-dev-server` with `npm start`
* open your browser on [localhost:8080](http://localhost:8080)

# Build the static files

* install the dependencies with either `npm i` or `yarn`
* launch the build with `npm run build`
* the static files will be generated to the `remarkjs-slideshow/dist` folder

# Technical notes

Using RevealJS in a webpack project requires some setup:

* in the [revealjs-slideshow.js](src/revealjs-slideshow.js) file:
  * the `headjs` package is used by RevealJS to download the markdown and code-highlighting plugins
  * the plugins are required using the `file-loader`, which outputs them in the `/plugin` subfolder where RevealJS expects them to be
  * the `Reveal` global must be set in the `window` scope for the markdown plugins to work
  * various `reveal.js/css/*.css` files must be required explicitely for the framework and the highlighting plugins to render properly

* in the [index.html](src/index.html) file:
  * I defined the "---" and the "--" as the vertical and horizontal slide markers, but you can customize this according to your needs and taste

```html
<body>
  <div class="reveal">
    <div class="slides">
      <section data-markdown data-separator="^---" data-separator-vertical="^--">
        <textarea id="source" data-template></textarea>
      </section>
    </div>
  </div>
</body>

```
