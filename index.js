const loaderUtils = require('loader-utils')

const markdownImageReferencesRE = /(!\[[^\]]*\]\((?!(?:https?:)?\/\/)[^)]+\))/g
const imagePathRE = /^(!\[[^\]]*\]\()((?!(?:https?:)?\/\/)[^)]+)(\))$/

// converts the image path in the markdowned-image syntax into a require statement, or stringify the given content
function requirifyImageReference(markdownImageReference) {
  const [, mdImageStart, mdImagePath, mdImageEnd ] = imagePathRE.exec(markdownImageReference) || []
  if (!mdImagePath) {
    return JSON.stringify(markdownImageReference)
  } else {
    const imageRequest = loaderUtils.stringifyRequest(
      this,
      loaderUtils.urlToRequest(mdImagePath)
    )

    return `${JSON.stringify(mdImageStart)} + require(${imageRequest}) + ${JSON.stringify(mdImageEnd)}`
  }
}

// exports the MarkdownImageLoader loader function
module.exports = function MarkdownImageLoader(markdownContent = '') {
  // the outputs of this loader can be cached
  this.cacheable && this.cacheable()

  return `
module.exports = [
${markdownContent.split(markdownImageReferencesRE).map(requirifyImageReference).join(',\n')}
].join('')`
}

// exports function and regexp helpers for testability purposes
module.exports.helpers = {
  markdownImageReferencesRE,
  imagePathRE,
  requirifyImageReference
}
