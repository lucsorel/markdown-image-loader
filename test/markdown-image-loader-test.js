const assert = require('assert')
const MarkdownImageLoader = require('../index.js')

describe('markdown-image-loader tests suite', () => {

  describe('# markdownImageReferencesRE regexp helper tests suite', () => {
    let markdownImageReferencesRE
    before(() => {
      markdownImageReferencesRE = MarkdownImageLoader.helpers.markdownImageReferencesRE
    })

    it('should be defined', () => {
      assert.ok(markdownImageReferencesRE)
    })

    it('should detect a single image reference', () => {
      const markdownContent =
`
# title

Inline ![](path/to/image.png) image reference

text
`

      const markdownParts = markdownContent.split(markdownImageReferencesRE)
      assert.strictEqual(markdownParts.length, 3, 'number of markdown content parts after regexp split')
      assert.strictEqual(markdownParts[0], '\n# title\n\nInline ', '1st part without image reference')
      assert.strictEqual(markdownParts[1], '![](path/to/image.png)', '2nd part with the image reference')
      assert.strictEqual(markdownParts[2], ' image reference\n\ntext\n', '3rd part without the image reference')
    })

    it('should detect multiple image references', () => {
      const markdownContent =
`
Here we have ![PNG](path/to/image.png) image ![JPG](path/to/image.jpg) references.

Then a ![SVG](path/to/single-quoted.svf 'single-quoted title')
and a ![TIFF](path/to/image.tiff "double-quoted title") image references.
`

      const markdownParts = markdownContent.split(markdownImageReferencesRE)
      assert.strictEqual(markdownParts.length, 9, 'number of markdown content parts after regexp split')

      assert.strictEqual(markdownParts[0], '\nHere we have ')
      assert.strictEqual(markdownParts[1], '![PNG](path/to/image.png)')
      assert.strictEqual(markdownParts[2], ' image ')
      assert.strictEqual(markdownParts[3], '![JPG](path/to/image.jpg)')
      assert.strictEqual(markdownParts[4], ' references.\n\nThen a ')
      assert.strictEqual(markdownParts[5], "![SVG](path/to/single-quoted.svf 'single-quoted title')")
      assert.strictEqual(markdownParts[6], '\nand a ')
      assert.strictEqual(markdownParts[7], '![TIFF](path/to/image.tiff "double-quoted title")')
      assert.strictEqual(markdownParts[8], ' image references.\n')
    })

    it('should ignore an https-URLed image reference', () => {
      const markdownURLedContent = 'an inline ![SVG](https://cldup.com/xFVFxOioAU.svg) https-URLed image'
      const markdownParts = markdownURLedContent.split(markdownImageReferencesRE)
      assert.strictEqual(markdownParts.length, 1)
      assert.strictEqual(markdownParts[0], markdownURLedContent)
    })

    it('should ignore an http-URLed image reference', () => {
      const markdownURLedContent = 'an inline ![SVG](http://cldup.com/xFVFxOioAU.svg) http-URLed image'
      const markdownParts = markdownURLedContent.split(markdownImageReferencesRE)
      assert.strictEqual(markdownParts.length, 1)
      assert.strictEqual(markdownParts[0], markdownURLedContent)
    })

    it('should ignore an URLed image reference', () => {
      const markdownURLedContent = 'an inline ![SVG](//cldup.com/xFVFxOioAU.svg) URLed image'
      const markdownParts = markdownURLedContent.split(markdownImageReferencesRE)
      assert.strictEqual(markdownParts.length, 1)
      assert.strictEqual(markdownParts[0], markdownURLedContent)
    })

    it('should ignore an URLed image reference with a single-quoted title', () => {
      const markdownURLedContent = "an inline ![SVG](//cldup.com/xFVFxOioAU.svg 'single-quoted title') URLed image"
      const markdownParts = markdownURLedContent.split(markdownImageReferencesRE)
      assert.strictEqual(markdownParts.length, 1)
      assert.strictEqual(markdownParts[0], markdownURLedContent)
    })

    it('should ignore an URLed image reference with a double-quoted title', () => {
      const markdownURLedContent = 'an inline ![SVG](//cldup.com/xFVFxOioAU.svg "double-quoted title") URLed image'
      const markdownParts = markdownURLedContent.split(markdownImageReferencesRE)
      assert.strictEqual(markdownParts.length, 1)
      assert.strictEqual(markdownParts[0], markdownURLedContent)
    })
  })

  describe('# imagePathRE regexp helper tests suite', () => {
    let imagePathRE
    before(() => {
      imagePathRE = MarkdownImageLoader.helpers.imagePathRE
    })

    it('should be defined', () => {
      assert.ok(imagePathRE)
    })

    it('should return null when being executed against a non-image block', () => {
      const markdownNonImageReference = '\n# title\n\nInline '
      const matches = imagePathRE.exec(markdownNonImageReference)
      assert.strictEqual(matches, null, 'null matches should be found')
    })

    it('should match the image path and its wrappers when being executed against an image block', () => {
      const markdownImageReference = '![PNG](path/to/image.png)'
      const matches = imagePathRE.exec(markdownImageReference)
      assert.ok(matches)
      assert.strictEqual(matches.length, 5)
      assert.strictEqual(matches[0], markdownImageReference, 'full pattern match')
      assert.strictEqual(matches[1], '![PNG](')
      assert.strictEqual(matches[2], 'path/to/image.png')
      assert.strictEqual(matches[3], undefined)
      assert.strictEqual(matches[4], ')')
    })

    it('should match the image path and its wrappers when being executed against an image block with a single-quoted title', () => {
      const markdownImageReference = "![PNG](path/to/image.png 'single-quoted title')"
      const matches = imagePathRE.exec(markdownImageReference)
      assert.ok(matches)
      assert.strictEqual(matches.length, 5)
      assert.strictEqual(matches[0], markdownImageReference, 'full pattern match')
      assert.strictEqual(matches[1], '![PNG](')
      assert.strictEqual(matches[2], 'path/to/image.png')
      assert.strictEqual(matches[3], " 'single-quoted title'")
      assert.strictEqual(matches[4], ')')
    })

    it('should match the image path and its wrappers when being executed against an image block with a double-quoted title', () => {
      const markdownImageReference = '![PNG](path/to/image.png "double-quoted title")'
      const matches = imagePathRE.exec(markdownImageReference)
      assert.ok(matches)
      assert.strictEqual(matches.length, 5)
      assert.strictEqual(matches[0], markdownImageReference, 'full pattern match')
      assert.strictEqual(matches[1], '![PNG](')
      assert.strictEqual(matches[2], 'path/to/image.png')
      assert.strictEqual(matches[3], ' "double-quoted title"')
      assert.strictEqual(matches[4], ')')
    })
  })

  describe('# requirifyImageReference() helper tests suite', () => {
    let requirifyImageReference
    before(() => {
      requirifyImageReference = MarkdownImageLoader.helpers.requirifyImageReference
    })

    it('should be defined', () => {
      assert.ok(requirifyImageReference)
    })

    it('should return peculiar results when executed without content', () => {
      assert.strictEqual(requirifyImageReference(), undefined, 'undefined content')
      assert.strictEqual(requirifyImageReference(undefined), undefined, 'explicitely undefined content')
      assert.strictEqual(requirifyImageReference(null), 'null', 'explicitely null content')
    })

    it('should return stringified text when executed agains a non-image markdown sample', () => {
      const markdownContent =
`
This is **bold "quoted text"** and a [link](https://github.com/lucsorel/) which is not 'an image'
`
      assert.strictEqual(
        requirifyImageReference(markdownContent),
        "\"\\nThis is **bold \\\"quoted text\\\"** and a [link](https://github.com/lucsorel/) which is not 'an image'\\n\"",
        'non-image markdown content is stringified to be parsed as a JS string'
      )
    })

    it('should transform a image markdown reference into a requirement', () => {
      const markdownImageReference = '![PNG](path/to/image.png)'
      assert.strictEqual(
        requirifyImageReference(markdownImageReference),
        '"![PNG](" + require("./path/to/image.png") + ")"'
      )
    })

    it('should not transform URL-ed image markdown references into requirements', () => {
      const markdownURLedImageReferences =
`
an https ![SVG](https://cldup.com/xFVFxOioAU.svg) URLed image
an http ![SVG](http://cldup.com/xFVFxOioAU.svg) URLed image
an ![SVG](//cldup.com/xFVFxOioAU.svg) URLed image
`

      assert.strictEqual(
        requirifyImageReference(markdownURLedImageReferences),
        JSON.stringify(markdownURLedImageReferences)
      )
    })
  })

  describe('# MarkdownImageLoader() loader tests suite', () => {
    it('should be defined', () => {
      assert.ok(MarkdownImageLoader)
    })

    it('should convert markdown content into a module export with image requirements', () => {
      const markdownContent =
`
# title

![](path/to/image.bmp)

Here we have ![SVG](path/to/image.svg) image ![JPG](path/to/image.jpg) inline references

Then we have ![PNG](path/to/image.png "double-quoted title") and ![TIFF](path/to/image.tiff 'single-quoted title') inline references

Finally we have: an https ![SVG](https://xFVFxOioAU.svg) URLed image, an http ![SVG](http://xFVFxOioAU.svg) URLed image and an ![SVG](//xFVFxOioAU.svg) URLed image
`

      // note that the backslashes must be escaped in the expected text variable
      const expectedExport =
`
module.exports = [
"\\n# title\\n\\n",
"![](" + require("./path/to/image.bmp") + ")",
"\\n\\nHere we have ",
"![SVG](" + require("./path/to/image.svg") + ")",
" image ",
"![JPG](" + require("./path/to/image.jpg") + ")",
" inline references\\n\\nThen we have ",
"![PNG](" + require("./path/to/image.png") + " \\"double-quoted title\\")",
" and ",
"![TIFF](" + require("./path/to/image.tiff") + " 'single-quoted title')",
" inline references\\n\\nFinally we have: an https ![SVG](https://xFVFxOioAU.svg) URLed image, an http ![SVG](http://xFVFxOioAU.svg) URLed image and an ![SVG](//xFVFxOioAU.svg) URLed image\\n"
].join('')`

      const actualExport = MarkdownImageLoader(markdownContent)
      assert.strictEqual(actualExport, expectedExport)

      // validates the evaluation of the module export
      // (the `module.exports` assignment is removed, the `require` call is replaced for evaluation sake)
      const actualParsing = function() {
        /* eslint-disable no-unused-vars */
        let require = myargs => `'~required:${myargs}~'`
        /* eslint-enable no-unused-vars */
        return eval(actualExport.replace('\nmodule.exports = ', ''))
      }.call()

      const expectedParsing = `
# title

![]('~required:./path/to/image.bmp~')

Here we have ![SVG]('~required:./path/to/image.svg~') image ![JPG]('~required:./path/to/image.jpg~') inline references

Then we have ![PNG]('~required:./path/to/image.png~' "double-quoted title") and ![TIFF]('~required:./path/to/image.tiff~' 'single-quoted title') inline references

Finally we have: an https ![SVG](https://xFVFxOioAU.svg) URLed image, an http ![SVG](http://xFVFxOioAU.svg) URLed image and an ![SVG](//xFVFxOioAU.svg) URLed image
`
      assert.strictEqual(actualParsing, expectedParsing)
    })
  })
})
