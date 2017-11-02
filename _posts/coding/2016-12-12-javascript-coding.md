---
layout: post
title:  "JavaScript 日常记录"
date:   2016-12-12
categories: coding
tags: Javascript
description: ''
---

1 英文首字母大写: 

``` javascript
var newVal = value.charAt(0).toUpperCase() + value.slice(1);
```

2 检测 设备（手机等）

``` javascript
var isMobile=!!(navigator.userAgent.match(/(iPhone)|(iPod)|(iPad)|(android)|(webOS)/i));
// 微信浏览器
var isWeChatBrowser = !!navigator.userAgent.match(/MicroMessenger/ig);
```

3 判断对象是否为空

``` javascript
function isEmptyObject(obj) {
    obj = obj ? obj : {};
    for (var i in obj){
        if(obj.hasOwnProperty(i)){
            return !1;
        }
    }
    return !0;
}
```

4 日期格式化

``` javascript
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};
```