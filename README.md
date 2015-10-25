<a name="module_req-then"></a>
## req-then
Simple module exporting a function to make a request via HTTP or HTTPS. There are other request modules; this one just aims to be small, return promises and work with core npm `http` and `https` modules. It also has a command-line client.

**Example**  
```js
var createRequest = require("req-then");
var request = createRequest("http://www.bbc.co.uk");
request.promise
	.then(function(request){
		console.log("Response received");
		console.log(request.in.data);
	})
	.done();
```

* [req-then](#module_req-then)
  * [createRequest(url, [options])](#exp_module_req-then--createRequest) ⇒ <code>[Request](#module_req-then--createRequest..Request)</code> ⏏
    * [~Request](#module_req-then--createRequest..Request)
      * [.url](#module_req-then--createRequest..Request#url) : <code>string</code>
      * [.promise](#module_req-then--createRequest..Request#promise) : <code>external:Promise</code>
      * [.name](#module_req-then--createRequest..Request#name) : <code>string</code>
      * [.out](#module_req-then--createRequest..Request#out) : <code>object</code>
      * [.in](#module_req-then--createRequest..Request#in) : <code>object</code>

<a name="exp_module_req-then--createRequest"></a>
### createRequest(url, [options]) ⇒ <code>[Request](#module_req-then--createRequest..Request)</code> ⏏
Returns a [Request](#module_req-then--createRequest..Request) object containing details of the request and a promise for the response.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | target url |
| [options] | <code>object</code> |  |
| [options.method] | <code>string</code> | GET, POST etc. |
| [options.data] | <code>string</code> | data to POST |
| [options.name] | <code>string</code> | useful for debugging |

<a name="module_req-then--createRequest..Request"></a>
#### createRequest~Request
Encapsulates details about the request made and response received

**Kind**: inner class of <code>[createRequest](#exp_module_req-then--createRequest)</code>  

* [~Request](#module_req-then--createRequest..Request)
  * [.url](#module_req-then--createRequest..Request#url) : <code>string</code>
  * [.promise](#module_req-then--createRequest..Request#promise) : <code>external:Promise</code>
  * [.name](#module_req-then--createRequest..Request#name) : <code>string</code>
  * [.out](#module_req-then--createRequest..Request#out) : <code>object</code>
  * [.in](#module_req-then--createRequest..Request#in) : <code>object</code>

<a name="module_req-then--createRequest..Request#url"></a>
##### request.url : <code>string</code>
**Kind**: instance property of <code>[Request](#module_req-then--createRequest..Request)</code>  
<a name="module_req-then--createRequest..Request#promise"></a>
##### request.promise : <code>external:Promise</code>
**Kind**: instance property of <code>[Request](#module_req-then--createRequest..Request)</code>  
<a name="module_req-then--createRequest..Request#name"></a>
##### request.name : <code>string</code>
**Kind**: instance property of <code>[Request](#module_req-then--createRequest..Request)</code>  
<a name="module_req-then--createRequest..Request#out"></a>
##### request.out : <code>object</code>
**Kind**: instance namespace of <code>[Request](#module_req-then--createRequest..Request)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| req | <code>Request</code> | outbound node request object |
| data | <code>string</code> | outbound data |

<a name="module_req-then--createRequest..Request#in"></a>
##### request.in : <code>object</code>
**Kind**: instance namespace of <code>[Request](#module_req-then--createRequest..Request)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| req | <code>Request</code> | inbound node request object |
| data | <code>string</code> | inbound data |

