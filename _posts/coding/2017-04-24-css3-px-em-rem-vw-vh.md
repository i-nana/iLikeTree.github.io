---
layout: post
title: CSS3中的单位px, em, rem, vw, vh
date:   2017-04-24
categories: coding
tags: [CSS3]
---

### 1. px

__px__: 绝对单位，页面按精准像素展示

### 2. em

__em__: 字体相对尺寸单位，值不固定，会继承父级元素字体的大小

### 3. rem

__rem__：字体相对尺寸单位，值不固定，相对于HTML根元素确定。（浏览器默认的字体大小为16px）

``` javascript
// 页面基准320px（20px），html根元素font-size的计算
var ele = document.getElementsByTagName('html')[0],
    size = document.body.clientWidth / 320 * 20;
ele.style.fontSize = size + 'px';
```

### 4.vw、vh、vmin、vmax

__vw__：viewpoint width，可视区域宽度`window.innerWidth`，1vw = 视窗宽度 / 100

__vh__：viewpoint height，可视区域高度`window.innerHeight`，1vh = 视窗高度 / 100

__vmin__：vw 和 vh 中较小的那个

__vmax__：vw 和 vh 中较大的那个

vw、vh、vmin、vmax的兼容性：IE9+部分支持，ios Safari 8+ ， Android browser 4.4+，chrome for android 39+


----- 

+ [张鑫旭：视区相关单位vw, vh..简介以及可实际应用场景](http://www.zhangxinxu.com/wordpress/2012/09/new-viewport-relative-units-vw-vh-vm-vmin/)


> 响应式的字体大小的计算公式。下图是屏幕宽度在400像素~800像素时的字体大小，最小16px，最大24px，其他范围以此类推。
> `font-size: calc(16px + (24 - 16) * (100vw - 400px) / (800 - 400) );`