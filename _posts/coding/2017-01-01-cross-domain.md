---
layout: post
title:  跨域的几种解决方式
date:   2017-01-01
categories: coding
tags: [JavaScript]
---

> __同源策略（Same origin policy）__ 是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，则浏览器的正常功能可能都会受到影响。可以说Web是构建在同源策略基础之上的，浏览器只是针对同源策略的一种实现。

+ 所谓“同源”指的是三个相同：协议相同、域名相同、端口相同。
+ 如果非同源共有三种行为收到限制：
    - Cookie、LocalStorage 和 IndexDB 无法获取
    - DOM 无法获取
    - Ajax 请求无法发送

-----

### SONP

动态插入`script`标签，通过`script`标签引入一个`js`文件，这个js文件载入成功后会执行我们在url参数中指定的函数，并且会把我们需要的`json`数据作为参数传入。

由于同源策略的限制，`XmlHttpRequest`只允许请求当前源（域名、协议、端口）的资源，为了实现跨域请求，可以通过`script`标签实现跨域请求，然后在服务端输出JSON数据并执行回调函数，从而解决了跨域的数据请求。

优点是兼容性好，简单易用，支持浏览器与服务器双向通信。缺点是只支持GET请求。

-----

### JSONP：json+padding（内填充），顾名思义，就是把JSON填充到一个盒子里

``` javascript
function createJs(sUrl){
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = sUrl;
    document.getElementsByTagName('head')[0].appendChild(oScript);
}
createJs('jsonp.js');
box({
    'name': 'test'
});
function box(json){
    alert(json.name);
}
```

-----

### WebSocket 

`WebSocket`是一种通信协议，使用`ws://`（非加密）和`wss://`（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

-----

### CORS

CORS是跨源资源分享（Cross-Origin Resource Sharing）的缩写。它是W3C标准，是跨源AJAX请求的根本解决方法。相比JSONP只能发GET请求，CORS允许任何类型的请求。

服务器端对于`CORS`的支持，主要就是通过设置`Access-Control-Allow-Origin`来进行的。如果浏览器检测到相应的设置，就可以允许`Ajax`进行跨域的访问。

[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

-----

### 通过修改`document.domain`来跨子域

将子域和主域的`document.domain`设为同一个主域。

前提条件：这两个域名必须属于同一个基础域名！而且所用的协议，端口都要一致，否则无法利用`document.domain`进行跨域。

服务器也可以在设置`cookie`的时候，指定`Cookie`的所属域名为一级域名。这样，二级和三级域名不用做任何设置，都可以读取这个Cookie。

``` http
Set-cookie: key=value; domain=.example.con; path=/
```

__注__：这种方法只适合`Cookie`和`iframe`窗口！ 

-----

### 使用`window.name`来进行跨域

`window`对象有个`name`属性，该属性有个特征：即在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个`window.name`的，每个页面对`window.name`都有读写的权限，`window.name`是持久存在一个窗口载入过的所有页面中的。

+ __优点__：`window.name`的容量很大，可以放置非常长的字符串
+ __缺点__：必须监听`window.name`属性的变化影响页面性能

-----

### 使用`HTML5`中新引进的`window.postMessage`方法来跨域传送数据

HTML5为解决跨域问题，引入了一个全新的API：__跨文档通信 API（Cross-document messaging）__。这个API为`window`对象新增了一个`window.postMessgae`方法，允许跨窗口通信，不论这两个窗口是否同源。

`window.postMessage()`方法被调用时，会在所有页面脚本执行完毕之后（e.g., 在该方法之后设置的事件、之前设置的timeout 事件,etc.）向目标窗口派发一个`MessageEvent`消息。 该`MessageEvent`消息有四个属性需要注意：

- `message` 属性表示该message 的类型； 
- `data` 属性为 `window.postMessage`的第一个参数；
- `origin`属性表示调用`window.postMessage()`方法时调用页面的当前状态；
- `source`属性记录调用`window.postMessage()`方法的窗口信息。

``` javascript
otherWindow.postMessage(message, targetOrigin, [transfer]);

/*
otherWindow：其他窗口的一个引用，比如iframe的contentWindow属性、执行window.open返回的窗口对象、或者是命名过或数值索引的window.frames。

message：将要发送到其他window的数据。

targetOrigin：通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。（接收消息的窗口的源（origin），即"协议 + 域名 + 端口"。也可以设为*，表示不限制域名，向所有窗口发送。）

transfer：是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。
*/
```

其他窗口，可以监听`message`，`message`事件的事件对象event，提供以下三个属性。

+ event.source：发送消息的窗口
+ event.origin: 消息发向的网址
+ event.data: 消息内容

``` javascript
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event)
{
  // For Chrome, the origin property is in the event.originalEvent
  // object.
  var origin = event.origin || event.originalEvent.origin; 
  if (origin !== "http://example.org:8080")
    return;

  // ...
}
```


-----

还有flash、在服务器上设置代理页面等跨域方式。个人认为`window.name`的方法既不复杂，也能兼容到几乎所有浏览器，这真是极好的一种跨域方法。

-----

1. [浏览器同源政策及其规避方法-阮一峰](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)