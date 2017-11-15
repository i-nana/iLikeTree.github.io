---
layout: post
title:  前端面试题目集锦-HTML&CSS
date:   2017-01-01
categories: daily
tags: interview
description: '面试集锦'
---

### 盒子模型 和 弹性盒子模型（Flex Box）

#### 盒子模型

在网页中，一个元素占用空间的大小由 <b>元素的内容content，内边距padding、边框border、外边距margin</b> 
四部分组成，这四部分构成和css中元素的盒子模型。

![盒子模型](../images/hzmx.jpg)

#### 弹性盒子模型

-----

### 行内元素和块级元素，空元素

空元素：没有内容的HTML元素，例如`br`、`hr`、`link`、`img` 

-----

### 实现水平居中

* 行内元素：`text-align:center;`
* 块级元素：
    1. `margin-left: auto; margin-right: auto;`
    2. `display: inline-block;`父容器设置 `text-align: center;`

-----

### 实现垂直居中

* 行内元素：`text-align:center;`
* 块级元素：`margin-left: auto; margin-right: auto;`
* 块级元素不定宽：
    1. table布局
    2. `display: inline/inline-block; text-align: center;`
    3. 父元素相对定位 position: relative，子元素绝对定位 position: absolute; left: 
    50%; margin-left: 子元素宽度的一半
    4. 
  
#### * 已知元素高度
``` css
.father {
    position: relative;
    height: 1000px;
}
.content{
    position: absolute;
    top: 50%;
    margin-top: -100px;
    height: 200px;
    width: 200px;
}
```

-----


### 什么是css hack?

通过在CSS样式中加入一些特殊的符号，让不同的浏览器识别不同的元素，已达到应用不同的CSS样式的目的。

IE浏览器Hack一般分为三种：条件hack（if ie)、属性级hack(color)、选择符hack(* + html)。

#### 1. 条件Hack (if ie)

``` html
<!-- [if IE]>
<style>
...
</style>
<! [endif] -->
```

-----

### px、em、rem单位

+ px，绝对尺寸单位，值是固定的
+ em，字体相对尺寸单位，值不固定，会继承父级元素字体的大小
+ rem，字体相对尺寸单位，值不固定，相对于HTML根元素确定

-----

### 优雅降级和渐进增强

__渐进增强 （Progressive enhancement）__：针对低版本浏览器进行构建页面，保证最基本的功能，然后针对高级浏览器进行效果、交互等改进和追加功能，达到最好的用户体验。

__优雅降级 （Graceful degradation）__：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

-----

### 说说对BFC的理解

BFC，块级格式化上下文，一个创建了新的BFC的盒子是独立布局的，盒子里面的子元素的样式不会影响到外面的元素。在同一个BFC中的两个毗邻的块级盒在垂直方向（和布局方向有关系）中的margin会发生折叠。W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行布局，以及和其他元素的关系和相互作用。

-----

### 请简述 __link__ 和 __@important__ 的区别.

+ link 是XHTML标签，除了加载CSS外，还可以定义RSS（真正简易联合，被设计用来展示选定的数据）等其他事务；@important 属于CSS范畴，只能加载CSS
+ link 引用CSS时，在页面加载时同时加载；@important 需要页面网页完全载入以后加载
+ link 是XHTML标签，无兼容问题；@important 是在CSS 2.1 提出的，低版本的浏览器不支持
+ link 支持使用JavaScript控制DOM去改变样式；@important 不支持

-----

### 同步和异步的区别

同步是阻塞模式，异步是非阻塞模式。

同步 指同一个进程在执行某个请求的时候，若该请求需要一段时间才能返回信息，那么这个进程将会一直等待，知道收到返回信息才能继续执行下去；

异步 指进程不需要一直等下去，而是据需执行下面的操作，不管其他进程的状态，当有消息返回时，系统会通知进程进行处理，这样可以提高执行的效率。

-----

### position的值， relative和absolute分别是相对于谁进行定位的？

+ absolute :生成绝对定位的元素， 相对于最近一级的 定位不是 static 的父元素来进行定位。
+ fixed （老IE不支持）生成绝对定位的元素，通常相对于浏览器窗口或 frame 进行定位。
+ relative 生成相对定位的元素，相对于其在普通流中的位置进行定位。
+ static 默认值。没有定位，元素出现在正常的流中
+ __sticky 生成粘性定位的元素，容器的位置根据正常文档流计算得出__