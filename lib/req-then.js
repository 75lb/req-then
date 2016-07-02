'use strict'
const http = require('http')
const https = require('https')
const urlUtils = require('url')
const defer = require('defer-promise')
const t = require('typical')
const os = require('os')
const path = require('path')
const arrayify = require('array-back')
const fs = require('then-fs')
const pick = require('lodash.pick')

class Cache {
  constructor (options) {
    options = Object.assign({}, options)
    this.cacheDir = options.cacheDir
    try {
      fs.mkdirSync(this.cacheDir)
    } catch (err) {
      // exists
    }
  }
  retrieve (keys) {
    const blobPath = path.resolve(this.cacheDir, this.getChecksum(keys))
    return fs.readFile(blobPath).then(JSON.parse)
  }
  add (keys, content) {
    const blobPath = path.resolve(this.cacheDir, this.getChecksum(keys))
    return fs.writeFile(blobPath, JSON.stringify(content))
  }
  getChecksum (keys) {
    const crypto = require('crypto')
    const hash = crypto.createHash('sha1')
    arrayify(keys).forEach(key => hash.update(JSON.stringify(key)))
    return hash.digest('hex')
  }
}

const cache = new Cache({ cacheDir: path.resolve(os.homedir(), '.http-req-cache') })

/**
 * Simple http(s) request function, returning a promise. Built on node's `http` and `https` modules, so works in both node and browser (via browserify).
 *
 * Uses ES6 Promises, if defined. If not, use a 3rd party promise library.
 *
 * @module req-then
 * @example
 * const request = require('req-then')
 *
 * request('http://www.bbc.co.uk')
 * 	.then(response => {
 * 		console.log('Response received', response.data)
 * 		console.log('The nodejs response instance', response.res)
 * 	})
 * 	.catch(console.error)
 */
module.exports = request

/**
* Returns a promise for the response.
* @param {string} - target url
* @param [options] {object}
* @param [options.method=GET] {string} - GET, POST etc.
* @param [options.data] {string|object} - data to POST. Objects will be JSON stringified.
* @param [options.headers] {object} - header object
* @param [options.rejectUnauthorized] {boolean}
* @param [options.withCredentials] {boolean}
* @returns {external:Promise}
* @resolve {object} - `res` will be the node response object, `data` will be the data
* @reject {Error}
* @alias module:req-then
*/
function request (url, options) {
  options = Object.assign({ headers: {} }, options)

  if (!url) return Promise.reject(Error('need a URL'))

  /* determine the content-type if not supplied */
  if (options.data && !options.headers['content-type']) {
    if (t.isString(options.data)) {
      options.headers['content-type'] = 'application/x-www-form-urlencoded'
    } else {
      options.data = JSON.stringify(options.data)
      options.headers['content-type'] = 'application/json'
    }
    options.headers['content-length'] = options.data.length
  }

  const reqOptions = urlUtils.parse(url)
  reqOptions.method = options.method || (options.data ? 'POST' : 'GET')
  reqOptions.headers = options.headers
  const keys = Object.assign({}, reqOptions)

  function makeRequest () {
    const deferred = defer()

    /* avoid rejecting https servers that don't have authorised SSL certificates */
    if (t.isDefined(options.rejectUnauthorized)) reqOptions.rejectUnauthorized = options.rejectUnauthorized

    /* if this is set some servers will reject our request */
    if (t.isDefined(options.withCredentials)) reqOptions.withCredentials = options.withCredentials

    let transport
    if (reqOptions.protocol === 'http:') {
      transport = http
    } else if (reqOptions.protocol === 'https:') {
      transport = https
    } else {
      return Promise.reject(Error('invalid url: ' + url))
    }

    const req = transport.request(reqOptions, function (res) {
      let data = Buffer(0)
      res.on('data', function resOnData (chunk) {
        data = Buffer.concat([ data, Buffer(chunk) ])
      })
      res.on('end', function resOnEnd () {
        /* statusCode will be zero if the request was disconnected, so don't resolve */
        if (res.statusCode !== 0) {
          const result = {
            data: data.toString('utf8'),
            res: pick(res, [ 'headers', 'method', 'statusCode', 'statusMessage', 'url' ]),
            req: reqOptions
          }
          cache.add(keys, result)
          deferred.resolve(result)
        }
      })
    })

    req.on('error', function reqOnError (err) {
      /* failed to connect */
      err.name = 'request-fail'
      err.request = request
      deferred.reject(err)
    })

    req.end(options.data)

    return deferred.promise
  }

  const cached = cache.retrieve(keys)
  return cached
    .catch(makeRequest)
}

/**
 * @external Promise
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
