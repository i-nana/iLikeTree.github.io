---
layout: post
title:  JavaScript碎片笔记
date:   2016-01-01
categories: study
tags: Javascript
description: ''
---

- 目录
{:toc}

### 1. JavaScript 获取伪类元素（pseudo-element）属性

```javascript
// 获取伪类元素的所有样式
var style = window.getComputedStyle('元素', '伪类');

// 获取特定属性
var marginR = style.getPropertyValue('margin-right');       // 10px
```
如果不是伪类元素，第二个参数可以省略。例如：

```javascript
var dom = document.getElementById('test'),
    style = window.getComputedStyle(dom, ':before');
```

getComputedStyle：只读，返回所有属性值

style：可读可写，只返回css中的属性值


### 2. 添加、删除类

```javascript
// classList API 兼容IE10及以上的浏览器
iDiv.className;  // 返回字符串
iDiv.classList;  // 返回数组   
iDiv.classList.add('newClassName');  // 添加类
iDiv.classList.remove('className');  // 删除类
iDiv.classList.toggle('className');  // 反转类
```

---

### 3. 屏幕旋转的事件和样式

``` javascript
function orientInit(){
    var orientChk = document.documentElement.clientWidth > document.documentElement.clientHeight ? 'landscape' : 'portrait';
    if(orientChk === 'landscape') {
        // 横屏
    } else {
        // 竖屏
    }
}
orientInit();
window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function(){
    setTimeout(orientInit, 100)
});
```

``` css
/* 竖屏 */
@media all and (orientation: landscape) { }
/* 横屏 */
@media all and (orientation: portrait) { }
```

### 4. 英文首字母大写

``` javascript
var newVal = value.chartAt(0).toUppercase() + value.slice(1);
```

### 5. 设备检测

``` javascript
// 手否是手机
var isMobile = !!(navigator.userAgent.match(/(iPhone)|(iPod)|(iPad)|(android)|(webOS)/i));

// 微信浏览器
var isWeChatBrowser = !!navigator.userAgent.match(/MicroMessenger/ig);
```

### 6.判断对象是否为空

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

### 7. 日期格式化

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
