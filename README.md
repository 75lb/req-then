[![view on npm](http://img.shields.io/npm/v/req-then.svg)](https://www.npmjs.org/package/req-then)
[![npm module downloads](http://img.shields.io/npm/dt/req-then.svg)](https://www.npmjs.org/package/req-then)
[![Dependency Status](https://david-dm.org/75lb/req-then.svg)](https://david-dm.org/75lb/req-then)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

<a name="module_req-then"></a>
## req-then
Simple http(s) request function, returning a promise. Built on node's `http` and `https` modules, so works in both node and browser (via browserify).

**Example**  
```js
var request = require("req-then")

request("http://www.bbc.co.uk")
	.then(response => {
		console.log("Response received")
		console.log(response.data)
	})
	.catch(console.error)
```
<a name="exp_module_req-then--request"></a>
### request(url, [options]) ⇒ <code>[Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)</code> ⏏
Returns a promise for the response.

**Kind**: Exported function  
**Resolve**: <code>object</code> - `res` will be the node response object, `data` will be the data  
**Reject**: <code>Error</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | target url |
| [options] | <code>object</code> |  |  |
| [options.method] | <code>string</code> | <code>&quot;GET&quot;</code> | GET, POST etc. |
| [options.data] | <code>string</code> |  | data to POST |
| [options.headers] | <code>object</code> |  | header object |


* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
