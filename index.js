// we know that the behavior of URL will remove the default port for protocol
// https://url.spec.whatwg.org/#url-miscellaneous
const protocools = ['ftp', 21, 'http', 80, 'https', 443, 'ws', 80, 'wss', 443]

// we allow base url and mode for input
function UrlSanitizer (options) {
  if (!(this instanceof UrlSanitizer)) {
    return new UrlSanitizer(options)
  }

  // we keep options as empty object
  options = Object.assign({}, options)
  if (!options.mode) {
    // default use path as it is more secure
    options.mode = 'path'
  }

  if (!options.base) {
    // default use `http://localhost/`
    options.base = 'http://localhost/'
  }

  // invalid mode
  if (options.mode !== 'path' && options.mode !== 'url') {
    throw new Error(
      `options.mode is expected to be either "path" or "url", but recieved "${options.mode}"`
    )
  }

  this.mode = options.mode
  this.base = options.base
  this.keep = checkKeep(this.base)

  // we do not override the base here
  // the main reason is that we hope to keep it's structure when it return
  this.baseUrl = new URL(options.base)
}

UrlSanitizer.prototype.parse = function (url, base) {
  if (this.mode === 'path') {
    return parsePath.call(this, url, base)
  } else {
    return parseUrl.call(this, url, base)
  }
}

// check if we should keep port
function checkKeep (base) {
  for (let i = 0; i < protocools.length; i += 2) {
    if (
      base.startsWith(`${protocools[i]}://`) &&
      base.includes(`:${protocools[i + 1]}`)
    ) {
      return i
    }
  }
  return -1
}

function parsePath (url, base) {
  let keep = this.keep
  if (!base) {
    base = this.baseUrl
  } else {
    keep = checkKeep(base)
    base = new URL(base)
  }

  // 1. double leading slash is not allowed in `path` mode
  if (url[0] === '/' && url[1] === '/') {
    url = url.slice(1)
  }

  const newUrl = new URL(url, base)
  if (newUrl.origin === base.origin && keep > -1) {
    // revert back to the true base when base is not modify
    return `${newUrl.origin}:${protocools[keep + 1]}${newUrl.href.replace(
      newUrl.origin,
      ''
    )}`
  } else {
    return newUrl.href
  }
}

function parseUrl (url, base) {
  let keep = this.keep
  if (!base) {
    base = this.baseUrl
  } else {
    keep = checkKeep(base)
    base = new URL(base)
  }

  const newUrl = new URL(url, base)
  if (newUrl.origin === base.origin && keep > -1) {
    // revert back to the true base when base is not modify
    return `${newUrl.origin}:${protocools[keep + 1]}${newUrl.href.replace(
      newUrl.origin,
      ''
    )}`
  } else {
    return newUrl.href
  }
}

// allow const UrlSanitizer = require('url-sanitizer')
module.exports = UrlSanitizer
// allow import UrlSanitizer from 'url-sanitizer'
module.exports.default = UrlSanitizer
// allow import { UrlSanitizer } from 'url-sanitizer'
module.exports.UrlSanitizer = UrlSanitizer
