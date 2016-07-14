'use strict'
const http = require('http')
const https = require('https')
const urlUtils = require('url')
const defer = require('defer-promise')
const t = require('typical')
const pick = require('lodash.pick')

/**
 * Wraps the built-in node `request` function with a few extras:
 *
 * - Returns a promise, resolving to an object containing the data, node response and original request.
 * - If data was supplied, sets a `content-length` header if not already present
 * - Automatically selects `http` or `https` transport depending on the input URL
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
* @param {string|object} - Target url string or a standard node.js http request options object.
* @param [data] {*} - Data to send with the request.
* @returns {external:Promise}
* @resolve {object} - `res` will be the node response object, `data` will be the data, `req` the original request.
* @reject {Error}
* @alias module:req-then
*/
function request (reqOptions, data) {
  if (!reqOptions) return Promise.reject(Error('need a URL or request options object'))
  if (t.isString(reqOptions)) {
    reqOptions = urlUtils.parse(reqOptions)
  } else {
    reqOptions = Object.assign({ headers: {} }, reqOptions)
  }

  if (data && !reqOptions.headers['content-length']) {
    reqOptions.headers['content-length'] = data.length
  }

  const deferred = defer()

  let transport
  const protocol = reqOptions.protocol || 'http:'
  if (protocol === 'http:') {
    transport = http
  } else if (protocol === 'https:') {
    transport = https
  } else {
    return Promise.reject(Error('Protocol missing from request: ' + JSON.stringify(reqOptions, null, '  ')))
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
          data: data,
          res: pick(res, [ 'headers', 'method', 'statusCode', 'statusMessage', 'url' ]),
          req: reqOptions
        }
        deferred.resolve(result)
      }
    })
  })

  req.on('error', function reqOnError (err) {
    /* failed to connect */
    err.name = 'request-fail'
    err.request = req
    deferred.reject(err)
  })

  req.end(data)

  return deferred.promise
}
