---
layout: post
title: 前端性能优化
tags: [JavaScript, CSS, 前端开发]
date:   2016-03-19
categories: study
---

## 一、浏览器如何渲染页面

1.  使用 HTML 创建**文档对象模型（DOM）**：浏览器开始从上到下读取标记，并且通过将它分解成节点，来创建 DOM 。
2.  使用 CSS 创建 **CSS 对象模型（CSSOM）**：当浏览器发现任何与节点相关的样式时（包括外部样式表、内部样式表或行内样式），会立即停止渲染 DOM ，并用这些节点来创建 CSSOM。 这就是所谓的“CSS 阻塞渲染”。
3.  基于 DOM 和 CSSOM 执行**脚本（Script）**。
4.	当遇到`<script>`标签的时候，会唤醒“JavaScript解析器”。它也是会阻塞渲染的。
5.  合并 DOM 和 CSSOM 形成 **渲染树（Render Tree）**。
5.  使用渲染树 **布局（Layout）** 所有元素的大小和位置。
6.  **绘制（Paint）** 所有元素。

## 二、加载优化

### 1. HTTP请求：减少HTTP请求次数和请求量

* 合并JS、CSS文件
* 使用CSS Sprites (雪碧图/精灵图)
* 图片格式：webp > JPEG, PNG8 > GIF
* JS、CSS代码压缩，启用GZip
* 避免重定向
* 按需加载	（按需加载会导致大量的重绘，影响渲染性能）
    + 预加载
    + 懒加载
    + 通过 Media Query 加载
* 使用CDN等
* 合理利用缓存
    + 使用外联方式引入CSS、JS资源

### 2. 优化加载结构

* 样式放在顶部，脚本放在页面底部
* 减少DOM元素的数量，避免过多的层级嵌套
* CSS
    + 避免CSS表达式
    + 避免过多的层级选择器：CSS选择器是 __自右向左__ 查找的
* JavaScript 优化
    + 减少页面重拍和重绘
    + 使用事件委托


![](/images/h5-performance.png)