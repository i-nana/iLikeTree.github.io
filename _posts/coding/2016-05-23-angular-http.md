---
layout: post
title: Angular $http
tags: [Angular, JavaScript]
date: 2016-05-23
categories: coding
description: ''
---

# $http

$http服务是一个函数，它接受一个参数（配置对象），用于生成一个HTTP请求、返回一个结果。

``` javascript
// 一般用法
$http({
    method: 'GET',
    url: '/someUrl'
}).then(function successCallback(response){
    // 异步调用
}, function errorCallback(response){
    // 当发生错误或者服务器返回一个error status 该函数将被异步调用
});
```

response对象包含以下属性：
* data - {string|object}
* status - {number}
* headers - {function([headerName])}
* config - {object}
* statusText - {string}

```
{
    "data": "欢迎访问菜鸟教程",
    "status": 200,
    "header": function(c){
        // ... 函数体
    },
    "config": {
        headers: { // Object },
        method: 'GET',
        url: '/someUrl'
        // ... ...
    }
    "statusText": "OK"
}
```

---


---

## 方法

### <em>get(url, [config])</em>

``` javascript
$http.get('/someUrl', config).then(successCallback, errorCallback);
```

### <em>post(url, data, [config])</em>

``` javascript
$http.post('/someUrl', data, config).then(successCallback, errorCallback);
```

### <em>head(url, [config])</em>

HEAD方法跟GET方法相同，只不过服务器响应时不会返回消息体。一个HEAD请求的响应中，HTTP头中包含的元信息应该和一个GET请求的响应消息相同。这种方法可以用来获取请求中隐含的元信息，而不用传输实体本身。也经常用来测试超链接的有效性、可用性和最近的修改。

### <em>jsonp(url, [config])<em>

<b>注：</b> url的返回名应该为字符串 <em>JSON_CALLBACK</em>。 例如“https://request.address.json?callback=JSON_CALLBACK”。

### <em>put(url, data, [config])</em>

### <em>delete(url, [config])</em>

### <em>patch(url, data, [config])</em>


