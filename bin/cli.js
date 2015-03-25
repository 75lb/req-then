#!/usr/bin/env node
"use strict";
var createRequest = require("../");
var util = require("util");

var url = process.argv[2];
var method = process.argv[3];
var data = process.argv[4];

createRequest(url, { method: method, data: data }).promise
	.then(function(request){
		console.log("RESPONSE\n========");
		console.log(util.inspect(request.in.res, { depth: 0 }));

		console.log("\nDATA\n====");
		console.log(request.in.data);
	})
	.catch(function(err){
		console.error("ERROR: " + err.message);
	})
	.done();
