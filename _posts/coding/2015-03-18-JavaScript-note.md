---
layout: post
title:  笔记
date:   2015-03-18
categories: coding
tags: Javascript
description: ''
---

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

---

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