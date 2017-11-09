---
layout: post
title:  Canvas 跨域图片加载
date:   2016-12-14
categories: study
tags: [JavaScript, canvas]
---

今天利用 ECharts 做加图片水印的时候，遇到一些问题，故作此记录。

-----

ECharts的 v3.3.2 中新增了 <b>开放图形元素设置：graphic </b>，官方也提供了 [Demo](http://echarts.baidu.com/gallery/editor.html?c=line-y-category)。以下均在此案例为基础。

Ⅰ. 修改其 option 如下：

``` javascript
option = {
    legend: {
        data:['高度(km)与气温(°C)变化关系']
    },
    tooltip: {
        trigger: 'axis',
        formatter: "Temperature : <br/>{b}km : {c}°C"
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} °C'
        }
    },
    yAxis: {
        type: 'category',
        axisLine: {onZero: false},
        axisLabel: {
            formatter: '{value} km'
        },
        boundaryGap: false,
        data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
    },
    graphic: [
        {
            type: 'image',
            id: 'logo',
            right: '10%',
            bottom: '10%',
            z: -10,
            bounding: 'raw',
            style: {
                image: 'http://echarts.baidu.com/images/favicon.png',
                width: 250,
                height: 250,
                opacity: 0.4
            }
        }
    ],
    series: [
        {
            name: '高度(km)与气温(°C)变化关系',
            type: 'line',
            smooth: true,
            lineStyle: {
                normal: {
                    width: 3,
                    shadowColor: 'rgba(0,0,0,0.4)',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                }
            },
            data:[15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
        }
    ]
};
```

此时，点击右上角的下载按钮，可以正常下载生成的ECharts图到本地。

Ⅱ. 修改 水印图片 “http://echarts.baidu.com/images/favicon.png” 为 “http://www.baidu.com/img/bd_logo1.png”。再点击下载会报错

> Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.

-----

在Canvas中，尽管不通过CORS图片也能在画布中正常绘制，但是无法读取其数据，例如，调用 `toBlod()`、`toDataURL()`、`getImageData()`等方法，会抛出安全错误。

> 这种机制可以便面未经许可拉去远程网站信息而导致用户隐私泄露。

> __What is a "tainted" canvas?__
> Although you can use images without CORS approval in your canvas, doing so taints the canvas. Once a canvas has been tainted, you can no longer pull data back out of the canvas. For example, you can no longer use the canvas toBlob(), toDataURL(), or getImageData() methods; doing so will throw a security error.

#### 1. 服务器实现对图片的正确响应头 Access-Control-Allow-Origin

#### 2. 设置图片`crossOrigin`属性为`anonymous` 【HTML5】

`img: crossorigin`这个枚举属性表明是否必须使用 CORS 完成相关图像的抓取

- `anonymous`: 执行一个跨域的请求（比如，有 Origin: HTTP header）。但是没有发送证书（比如，没有 cookie，没有 X.509 证书，没有 HTTP 基本的授权认证）。如果服务器没有给源站证书（没有设置 Access-Control-Allow-Origin: HTTP头），图像会被污染而且它的使用会被限制。
- `use-credentials`: 一个有证书的跨域请求（比如，有 Origin: HTTP header）被发送 （比如，a cookie, a certificate, and HTTP Basic authentication is performed）。如果服务器没有给源站发送证书（通过 Access-Control-Allow-Credentials: HTTP header），图像将会被污染，且它的使用会受限制。

> [引用详细> <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-crossorigin">&lt;img&gt; - HTML | MDN</a>]

``` javascript
var img = new Image();
img.setAttribute('crossOrigin', 'anonymous');
img.src = imageUrl;
img.onload = function() {
    var myCanvas = document.getElementsByTagName("canvas")[0]; // 已经绘制好柱状图的Canvas
    var ctx = myCanvas.getContext("2d");
    ctx.drawImage(this, 0, 0);  // 在图上绘制水印
    var dataURL = myCanvas.toDataURL("image/png");
    console.log(dataURL); // 成功获取地址
};
```