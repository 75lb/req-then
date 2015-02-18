"use strict";
var http = require("http");
var https = require("https");
var urlutil = require("url");
var util = require("util");
var q = require("q");
var EventEmitter = require("events").EventEmitter;

/**
@module
*/
module.exports = RequestPromise;

/**
@class
@classdesc Returns a promise for a request
@alias module:req-prom
@typicalname request
*/
function RequestPromise() {
	if (!(this instanceof RequestPromise)) return new RequestPromise();
}
util.inherits(RequestPromise, EventEmitter);

/**
- resolve(res, data)
- reject({ name: "request-fail" })
@param {string} - target url
@param [options] {object}
@param [options.method] {string} - GET, POST etc. 
@param [options.data] {string} - data to POST
*/
RequestPromise.prototype.connect = function(url, options){
	var self = this;
	options = options || {};
	if (!url) return q.reject(Error("need a URL"));
	
	return q.Promise(function(resolve, reject) {
		var reqOptions = urlutil.parse(url);
		reqOptions.method = options.method || "GET";
		reqOptions.rejectUnauthorized = false;
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
			var data = Buffer(0);
			res.on("data", function(chunk){
				data = Buffer.concat([ data, Buffer(chunk) ]);
			});
			res.on("end", function(){
				resolve({ res: res, data: data.toString() });
			});
		});

		req.on("error", function(err){
			/* failed to connect */
			console.log("request failed", url, options);
			err.name = "request-fail";
			reject(err);
		});

		req.end(options.data);
	});
}
