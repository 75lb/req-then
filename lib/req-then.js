'use strict'
var http = require('http')
var https = require('https')
var urlUtils = require('url')
var defer = require('defer-promise')
var t = require('typical')

/**
 * Simple http(s) request function, returning a promise. Built on node's `http` and `https` modules, so works in both node and browser (via browserify).
 *
 * Uses ES6 Promises, if defined. If not, use a 3rd party promise library.
 *
 * @module req-then
 * @example
 * var request = require("req-then")
 *
 * request("http://www.bbc.co.uk")
 * 	.then(response => {
 * 		console.log("Response received", response.data)
 * 		console.log("The nodejs response instance", response.res)
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
  options = options || {}
  options.headers = options.headers || {}

  if (!url) return Promise.reject(Error('need a URL'))

  var deferred = defer()

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

  var reqOptions = urlUtils.parse(url)
  reqOptions.method = options.method || (options.data ? 'POST' : 'GET')
  reqOptions.headers = options.headers || options.header

  /* avoid rejecting https servers that don't have authorised SSL certificates */
  reqOptions.rejectUnauthorized = t.isDefined(options.rejectUnauthorized)
    ? options.rejectUnauthorized
    : false

  /* if this is set some servers will reject our request */
  reqOptions.withCredentials = t.isDefined(options.withCredentials)
    ? options.withCredentials
    : false

  var transport
  if (reqOptions.protocol === 'http:') {
    transport = http
  } else if (reqOptions.protocol === 'https:') {
    transport = https
  } else {
    return Promise.reject(Error('invalid url: ' + url))
  }

  var req = transport.request(reqOptions, function (res) {
    var data = Buffer(0)
    res.on('data', function resOnData (chunk) {
      data = Buffer.concat([ data, Buffer(chunk) ])
    })
    res.on('end', function resOnEnd () {
      /* statusCode will be zero if the request was disconnected, so don't resolve */
      if (res.statusCode !== 0) {
        deferred.resolve({
          data: data.toString(),
          res: res
        })
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

/**
 * @external Promise
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
