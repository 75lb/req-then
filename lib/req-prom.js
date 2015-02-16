"use strict";
var http = require("http");
var https = require("https");
var urlutil = require("url");
var util = require("util");
var q = require("q");
var EventEmitter = require("events").EventEmitter;

module.exports = RequestPromise;

/**
- resolve(res, data)
- reject({ name: "request-fail" })
@param {string} - target url
@param [options] {object}
@param [options.method] {string} - GET, POST etc. 
@param [options.data] {string} - data to POST
*/
function RequestPromise(url, options) {
	if (!(this instanceof RequestPromise)) return new RequestPromise(url, options);
}
util.inherits(RequestPromise, EventEmitter);

RequestPromise.prototype.connect = function(url, options){
	var self = this;
	options = options || {};
	if (!url) return q.reject(Error("need a URL"));
	
	return q.Promise(function(resolve, reject) {
		var reqOptions = urlutil.parse(url);
		reqOptions.method = options.method || "GET";
		reqOptions.rejectUnauthorized = false;

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
				data = Buffer.concat([ data, chunk ]);
			});
			res.on("end", function(){
				self.emit("end", req);
				resolve({ res: res, data: data.toString() });
			});
		});

		req.on("error", function(err){
			/* failed to connect */
			self.emit("end", req);
			err.name = "request-fail";
			reject(err);
		});

		req.end(options.data);
		
		self.emit("open", req);
	});
}
