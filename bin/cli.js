#!/usr/bin/env node
"use strict";
var Request = require("../");
var util = require("util");

var url = process.argv[2];
var method = process.argv[3];

Request(url, { method: method })
	.then(function(res){
		console.log("RESPONSE\n========");
		console.log(util.inspect(res.res, { depth: 0 }));

		console.log("\nDATA\n====");
		console.log(res.data);
	})
	.catch(function(err){
		console.error("ERROR: " + err.message);
	})
	.done();
	