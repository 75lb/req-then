"use strict";
var http = require("http");
var https = require("https");
var urlutil = require("url");
var q = require("q");

/**
Exports a function returning a Request object containing details about the request made, a promise for the result
@module
*/
module.exports = requestPromise;

/**
- resolve({Request})
- reject(Error{ name: "request-fail" })
@param {string} - target url
@param [options] {object}
@param [options.method] {string} - GET, POST etc. 
@param [options.data] {string} - data to POST
@returns {Request}
*/
function requestPromise(url, options){
	// var self = this;
	options = options || {};
	if (!url) return { promise: q.reject(Error("need a URL")) };
	
	var deferred = q.defer();
	var request = new Request(url, options.data, deferred.promise);
	
	var reqOptions = urlutil.parse(url);
	reqOptions.method = options.method || "GET";

	/* avoid rejecting https servers that don't have authorised SSL certificates */
	reqOptions.rejectUnauthorized = false;
	
	/* if this is set some servers will reject our request */
	reqOptions.withCredentials = false;

	var transport;
	if (reqOptions.protocol === "http:"){
		transport = http;
	} else if (reqOptions.protocol === "https:") {
		transport = https;
	} else {
		throw Error("invalid url: " + url);
	}

	var req = transport.request(reqOptions, function(res){
		request.out.req = req;
		request.in.res = res;
		
		var data = Buffer(0);
		res.on("data", function(chunk){
			data = Buffer.concat([ data, Buffer(chunk) ]);
		});
		res.on("end", function(){
			/* statusCode will be zero if the request was disconnected, so don't resolve */
			if (res.statusCode !== 0){
				request.in.data = data.toString();
				deferred.resolve(request);
			} else {
				// console.log("STATUS CODE ZERO")
			}
		});
	});

	req.on("error", function(err){
		/* failed to connect */
		err.name = "request-fail";
		err.request = request;
		deferred.reject(err);
	});

	req.end(options.data);
	return request;
}

/**
@class
@classdesc details the request made and the response received
*/
function Request(url, data, promise){
	this.url = url;
	this.out = {
		req: null,
		data: data
	};
	this.in = {
		res: null,
		data: null
	};
	this.promise = promise;
}
