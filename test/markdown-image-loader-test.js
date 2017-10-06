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
      assert.equal(markdownParts.length, 3, 'number of markdown content parts after regexp split')
      assert.equal(markdownParts[0], '\n# title\n\nInline ', '1st part without image reference')
      assert.equal(markdownParts[1], '![](path/to/image.png)', '2nd part with the image reference')
      assert.equal(markdownParts[2], ' image reference\n\ntext\n', '3rd part without the image reference')
    })

    it('should detect multiple image references', () => {
      const markdownContent =
`
Here we have ![PNG](path/to/image.png) image ![JPG](path/to/image.jpg) references
`

      const markdownParts = markdownContent.split(markdownImageReferencesRE)
      assert.equal(markdownParts.length, 5, 'number of markdown content parts after regexp split')
      assert.equal(markdownParts[0], '\nHere we have ')
      assert.equal(markdownParts[1], '![PNG](path/to/image.png)')
      assert.equal(markdownParts[2], ' image ')
      assert.equal(markdownParts[3], '![JPG](path/to/image.jpg)')
      assert.equal(markdownParts[4], ' references\n')
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
      assert.strictEqual(matches.length, 4)
      assert.equal(matches[0], markdownImageReference, 'full pattern match')
      assert.equal(matches[1], '![PNG](')
      assert.equal(matches[2], 'path/to/image.png')
      assert.equal(matches[3], ')')
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
      assert.equal(
        requirifyImageReference(markdownContent),
        "\"\\nThis is **bold \\\"quoted text\\\"** and a [link](https://github.com/lucsorel/) which is not 'an image'\\n\"",
        'non-image markdown content is stringified to be parsed as a JS string'
      )
    })

    it('should transform a image markdown reference into a requirement', () => {
      const markdownImageReference = '![PNG](path/to/image.png)'
      assert.equal(
        requirifyImageReference(markdownImageReference),
        '"![PNG](" + require("./path/to/image.png") + ")"'
      )
    })

    it('should transform an image markdown URL reference into an erroneous requirement', () => {
      const markdownImageReference = '![SVG](https://cldup.com/xFVFxOioAU.svg)'
      assert.equal(
        requirifyImageReference(markdownImageReference),
        '"![SVG](" + require("./https://cldup.com/xFVFxOioAU.svg") + ")"'
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

![](path/to/image.png)

Here we have ![SVG](path/to/image.svg) image ![JPG](path/to/image.jpg) inline references
`

      // note that the backslashes of the newline characters must be escaped in the expected text variable
      const expectedExport =
`
module.exports = [
"\\n# title\\n\\n",
"![](" + require("./path/to/image.png") + ")",
"\\n\\nHere we have ",
"![SVG](" + require("./path/to/image.svg") + ")",
" image ",
"![JPG](" + require("./path/to/image.jpg") + ")",
" inline references\\n"
]`

      assert.equal(MarkdownImageLoader(markdownContent), expectedExport)
    })
  })
})
