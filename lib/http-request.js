'use strict'
var http = require('http')
var https = require('https')
var urlUtils = require('url')

/**
Simple module exporting a function to make a request via HTTP or HTTPS. There are other request modules; this one just aims to be small, return promises and work with core npm `http` and `https` modules. It also has a command-line client.

@module http-request
@example
var createRequest = require("http-request")
var request = createRequest("http://www.bbc.co.uk")
request.promise
	.then(function(request){
		console.log("Response received")
		console.log(request.in.data)
	})
	.done()
*/
module.exports = createRequest

/**
Returns a {@link module:http-request~Request} object containing details of the request and a promise for the response.
@param {string} - target url
@param [options] {object}
@param [options.method=GET] {string} - GET, POST etc.
@param [options.data] {string} - data to POST
@param [options.headers] {object} - header object
@returns {module:http-request~Request}
@alias module:http-request
*/
function createRequest (url, options) {
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
  if (Promise.defer) {
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
