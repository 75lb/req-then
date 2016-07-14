[![view on npm](http://img.shields.io/npm/v/req-then.svg)](https://www.npmjs.org/package/req-then)
[![npm module downloads](http://img.shields.io/npm/dt/req-then.svg)](https://www.npmjs.org/package/req-then)
[![Dependency Status](https://david-dm.org/75lb/req-then.svg)](https://david-dm.org/75lb/req-then)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

<a name="module_req-then"></a>

## req-then
Wraps the built-in node `request` function with a few extras:

- Returns a promise, resolving to an object containing the data, node response and original request.
- If data was supplied, sets a `content-length` header if not already present
- Automatically selects `http` or `https` transport depending on the input URL

**Example**  
```js
const request = require('req-then')

request('http://www.bbc.co.uk')
	.then(response => {
		console.log('Response received', response.data)
		console.log('The nodejs response instance', response.res)
	})
	.catch(console.error)
```
<a name="exp_module_req-then--request"></a>

### request(reqOptions, [data]) ⇒ <code>external:Promise</code> ⏏
Returns a promise for the response.

**Kind**: Exported function  
**Resolve**: <code>object</code> - `res` will be the node response object, `data` will be the data, `req` the original request.  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| reqOptions | <code>string</code> &#124; <code>object</code> | Target url string or a standard node.js http request options object. |
| [data] | <code>\*</code> | Data to send with the request. |


* * *

&copy; 2015-16 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
