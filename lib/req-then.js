'use strict'
var http = require('http')
var https = require('https')
var urlUtils = require('url')

/**
 * Simple http(s) request function, returning a promise. Built on node's `http` and `https` modules, so works in both node and browser (via browserify).
 *
 * @module req-then
 * @example
 * var request = require("req-then")
 *
 * request("http://www.bbc.co.uk")
 * 	.then(response => {
 * 		console.log("Response received")
 * 		console.log(response.data)
 * 	})
 * 	.catch(console.error)
 */
module.exports = request

/**
Returns a promise for the response.
@param {string} - target url
@param [options] {object}
@param [options.method=GET] {string} - GET, POST etc.
@param [options.data] {string} - data to POST
@param [options.headers] {object} - header object
@returns {external:Promise}
@resolve {object} - `res` will be the node response object, `data` will be the data
@reject {Error}
@alias module:req-then
*/
function request (url, options) {
  options = options || {}
  if (!url) return Promise.reject(Error('need a URL'))

  var deferred = defer()

  var reqOptions = urlUtils.parse(url)
  reqOptions.method = options.method || 'GET'
  reqOptions.headers = options.headers

  /* avoid rejecting https servers that don't have authorised SSL certificates */
  reqOptions.rejectUnauthorized = false

  /* if this is set some servers will reject our request */
  reqOptions.withCredentials = false

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

function defer () {
  if (typeof Promise !== 'undefined' && Promise.defer) {
    return Promise.defer()
  } else {
    let deferred = {}
    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve
      deferred.reject = reject
    })
    return deferred
  }
}

/**
 * @external Promise
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
