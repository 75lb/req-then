#!/usr/bin/env node
"use strict";
var Request = require("../");
var util = require("util");

var url = process.argv[2];
var method = process.argv[3];
var data = process.argv[4];

Request()
	.on("open", function(){ console.log("OPEN\n===="); })
	.on("end", function(){ console.log("ENDED\n====="); })
	.connect(url, { method: method, data: data })
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
	