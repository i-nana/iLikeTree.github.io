---
layout: post
title:  前端面试题目集锦-HTML篇
date:   2017-01-01
categories: question
tags: HTML
---

### HTML 语义化

语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化），便于开发者阅读和写出更优雅的代码的同时，让浏览器的爬虫和机器很好的解析。

#### 为什么要语义化？

+ 有利于SEO，有助于爬虫抓取更多的有效信息，爬虫是依赖于标签来确定上下文和各个关键字的权重。
+ 语义化的HTML在没有CSS的情况下也能呈现较好的内容结构与代码结构
+ 方便其他设备的解析
+ 便于团队开发和维护

---

### 简述 src 和 href 的区别

`src`是`source`的缩写，表示“源”，引入的资源会嵌入到当前标签所在位置。常用此属性的有`img`、`script`、`iframe`。如果他们不写src，本身是没有内容的。

另外，当浏览器解析到该元素的时候，页面的加载和处理将暂停，直到浏览器加载、编译和执行完该文件。

`href`是`Hypertext Reference`的缩写，表示“超链接”。它是在文档和外部资源之间建立通道。

是否阻塞跟href和src没有关系，浏览器渲染过程：

+ 输入url发送请求
+ 加载html文件
+ 加载完成后解析html，并在解析的过程中创建DOM树。
+ 解析若遇到link、script、img标签时，浏览器会向服务器请求资源。
    - script的加载和执行都会阻塞html解析、其他下载线程以及渲染线程。因为浏览器需要一个稳定的DOM树结构，而JS中很可能有代码直接改变了DOM树的结构。比如`document.write`等，为了防止加载过程中出现JS修改DOM树，需要重新构建DOM树的情况，所以会阻塞其他的进程。
    在没有使用异步加载（async）或者延迟加载（defer）的情况下，只有当一个JS文件加载解析完成后，才能加载后面的JS文件。
    - css加载完成后会被解析成CSSOM（层叠样式表对象模型）。CSS的加载和解析都不会阻塞html的解析，但会阻塞渲染。
    - img的加载不会阻塞html的解析，但img加载后并不渲染，他需要等待Render Tree生成后和Render Tree一起渲染出来。
+ css解析为CSSOM，html解析为DOM后， 两者结合生成Render Tree。
+ Layout： 计算出Render Tree每一个节点的具体位置
+ Painting：通过显卡，通过Layout后的节点内容分别呈现在屏幕上。

---

### 什么是盒子模型

#### 标准盒子模型和IE盒子模型

在一个文档中，每一个元素都可以被表示成一个矩形的盒子。每个盒子都有四部分组成：从content、padding、border、margin。

在IE盒子模型中，content是包含padding和border的。边框border和内边距padding的值是包含在width中的，内容content的实际宽度 = width - padding - border。

![](/images/boxModuleW3C.jpg)
![](/images/boxModuleIE.jpg)

#### box-sizing

使用`box-sizing`属性，我们可以控制元素的尺寸是按标准盒子模型还是IE盒子模型。默认值为`content-box`，即标准盒子模型。

``` css
box-sizing: content-box | border-box ;
```

我们可以将所有元素的box-sizing设置为border-content

``` css
*, *:before, *:after {
  /* Chrome 9-, Safari 5-, iOS 4.2-, Android 3-, Blackberry 7- */
  -webkit-box-sizing: border-box;

  /* Firefox (desktop or Android) 28- */
  -moz-box-sizing: border-box;

  /* Firefox 29+, IE 8+, Chrome 10+, Safari 5.1+, Opera 9.5+, iOS 5+, Opera Mini Anything, Blackberry 10+, Android 4+ */
  box-sizing: border-box;
}
```

---

### 优雅降级和渐进增强

__渐进增强 （Progressive enhancement）__：针对低版本浏览器进行构建页面，保证最基本的功能，然后针对高级浏览器进行效果、交互等改进和追加功能，达到最好的用户体验。

__优雅降级 （Graceful degradation）__：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

---
