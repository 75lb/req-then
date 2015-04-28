"use strict";
var http = require("http");
var https = require("https");
var urlUtils = require("url");
var q = require("q");
var fs = require("fs");
var util = require("util");
var View = require("dom-view");

/**
Simple module exporting a function to make a request via HTTP or HTTPS. There are other request modules; this one just aims to be small, return promises and work with core npm `http` and `https` modules. It also has a command-line client.

@module http-request
@example
var createRequest = require("http-request");
var request = createRequest("http://www.bbc.co.uk");
request.promise
	.then(function(request){
		console.log("Response received");
		console.log(request.in.data);
	})
	.done();
*/
module.exports = createRequest;

/**
Returns a {@link module:http-request~Request} object containing details of the request and a promise for the response.
@param {string} - target url
@param [options] {object}
@param [options.method] {string} - GET, POST etc.
@param [options.data] {string} - data to POST
@param [options.name] {string} - useful for debugging
@returns {module:http-request~Request}
@alias module:http-request
*/
function createRequest(url, options){
	// var self = this;
	options = options || {};
	if (!url) return { promise: q.reject(Error("need a URL")) };

	var deferred = q.defer();
	var request = new Request(url, options.data, deferred.promise, options.name);

	var reqOptions = urlUtils.parse(url);
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
		request.in.res = res;

		var data = Buffer(0);
		res.on("data", function resOnData(chunk){
			data = Buffer.concat([ data, Buffer(chunk) ]);
		});
		res.on("end", function resOnEnd(){
			/* statusCode will be zero if the request was disconnected, so don't resolve */
			if (res.statusCode !== 0){
				request.in.data = data.toString();
				deferred.resolve(request);

				if (createRequest._view){
					clearInterval(request.view()._interval);
					request.view().remove();
					createRequest._view.completed++;
				}
            }
		});
	});
	request.out.req = req;

	req.on("error", function reqOnError(err){
		/* failed to connect */
        err.name = "request-fail";
        err.request = request;
		deferred.reject(err);

		if (createRequest._view){
			clearInterval(request.view()._interval);
			request.view().remove();
			createRequest._view.failed++;
		}
	});

	req.end(options.data);

	if (createRequest._view){
		createRequest._view.count++;
		request.view().appendTo(createRequest._view.containerEl.querySelector("ul"));
	}
	return request;
}

/**
@class
@classdesc Encapsulates details about the request made and response received
*/
function Request(url, data, promise, name){
	/**
	@type {string}
	*/
	this.url = url;
	/**
	@namespace
	@property req {Request} - outbound node request object
	@property data {string} - outbound data
	*/
	this.out = {
		req: null,
		data: data
	};
	/**
	@namespace
	@property req {Request} - inbound node request object
	@property data {string} - inbound data
	*/
	this.in = {
		res: null,
		data: null
	};
	/**
	@type {external:Promise}
	*/
	this.promise = promise;
	/**
	@type {string}
	*/
	this.name = name;
}

Request.prototype.view = function(){
	var self = this;
	if (this._view){
		return this._view;
	} else {
		var view = new View({
			html: fs.readFileSync(__dirname + "/../view/request.html", "utf8"),
			viewModel: {
				waiting: 0,
				name: this.name
			}
		});
		view._interval = setInterval(function(){
			view.waiting++;
		}, 1000);
		return this._view = view;
	}
};

createRequest.view = function(){
	var self = this;
	if (this._view){
		return this._view;
	} else {
		var view = new View({
			html: fs.readFileSync(__dirname + "/../view/requests.html", "utf8"),
			viewModel: {
				completed: 0,
				failed: 0
			}
		});
		return this._view = view;
	}
};
