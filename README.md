<a name="module_http-request"></a>
## http-request
Simple module exporting a function to make a request via HTTP or HTTPS. There are other request modules; this one just aims to be small, return promises and work with core npm `http` and `https` modules. It also has a command-line client.

**Example**  
```js
var createRequest = require("http-request");
var request = createRequest("http://www.bbc.co.uk");
request.promise
	.then(function(request){
		console.log("Response received");
		console.log(request.in.data);
	})
	.done();
```

* [http-request](#module_http-request)
  * [createRequest(url, [options])](#exp_module_http-request--createRequest) ⇒ <code>[Request](#module_http-request--createRequest..Request)</code> ⏏
    * [~Request](#module_http-request--createRequest..Request)
      * [.url](#module_http-request--createRequest..Request#url) : <code>string</code>
      * [.promise](#module_http-request--createRequest..Request#promise) : <code>external:Promise</code>
      * [.name](#module_http-request--createRequest..Request#name) : <code>string</code>
      * [.out](#module_http-request--createRequest..Request#out) : <code>object</code>
      * [.in](#module_http-request--createRequest..Request#in) : <code>object</code>

<a name="exp_module_http-request--createRequest"></a>
### createRequest(url, [options]) ⇒ <code>[Request](#module_http-request--createRequest..Request)</code> ⏏
Returns a [Request](#module_http-request--createRequest..Request) object containing details of the request and a promise for the response.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | target url |
| [options] | <code>object</code> |  |
| [options.method] | <code>string</code> | GET, POST etc. |
| [options.data] | <code>string</code> | data to POST |
| [options.name] | <code>string</code> | useful for debugging |

<a name="module_http-request--createRequest..Request"></a>
#### createRequest~Request
Encapsulates details about the request made and response received

**Kind**: inner class of <code>[createRequest](#exp_module_http-request--createRequest)</code>  

* [~Request](#module_http-request--createRequest..Request)
  * [.url](#module_http-request--createRequest..Request#url) : <code>string</code>
  * [.promise](#module_http-request--createRequest..Request#promise) : <code>external:Promise</code>
  * [.name](#module_http-request--createRequest..Request#name) : <code>string</code>
  * [.out](#module_http-request--createRequest..Request#out) : <code>object</code>
  * [.in](#module_http-request--createRequest..Request#in) : <code>object</code>

<a name="module_http-request--createRequest..Request#url"></a>
##### request.url : <code>string</code>
**Kind**: instance property of <code>[Request](#module_http-request--createRequest..Request)</code>  
<a name="module_http-request--createRequest..Request#promise"></a>
##### request.promise : <code>external:Promise</code>
**Kind**: instance property of <code>[Request](#module_http-request--createRequest..Request)</code>  
<a name="module_http-request--createRequest..Request#name"></a>
##### request.name : <code>string</code>
**Kind**: instance property of <code>[Request](#module_http-request--createRequest..Request)</code>  
<a name="module_http-request--createRequest..Request#out"></a>
##### request.out : <code>object</code>
**Kind**: instance namespace of <code>[Request](#module_http-request--createRequest..Request)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| req | <code>Request</code> | outbound node request object |
| data | <code>string</code> | outbound data |

<a name="module_http-request--createRequest..Request#in"></a>
##### request.in : <code>object</code>
**Kind**: instance namespace of <code>[Request](#module_http-request--createRequest..Request)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| req | <code>Request</code> | inbound node request object |
| data | <code>string</code> | inbound data |

