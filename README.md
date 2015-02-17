<a name="module_req-prom"></a>
## req-prom

* [req-prom](#module_req-prom)
  * [class: RequestPromise](#exp_module_req-prom--RequestPromise) ⏏
    * _instance_
      * [.connect(url, [options])](#module_req-prom--RequestPromise#connect)

<a name="exp_module_req-prom--RequestPromise"></a>
### class: RequestPromise ⏏
Returns a promise for a request

<a name="module_req-prom--RequestPromise#connect"></a>
#### request.connect(url, [options])
- resolve(res, data)
- reject({ name: "request-fail" })


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | target url |
| [options] | <code>object</code> |  |
| [options.method] | <code>string</code> | GET, POST etc. |
| [options.data] | <code>string</code> | data to POST |

