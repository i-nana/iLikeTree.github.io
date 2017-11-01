---
layout: post
title: 浅析js实现网页截图的两种方式
date: 2017-08-03
categories: code
tags: [JavaScript, SVG]
---

> 原文：[罗辑思维前端团队:浅析js实现网页截图的两种方式](http://f2e.luojilab.org/qian-xi-jsshi-xian-wang-ye-jie-tu-de-liang-chong-fang-shi/)

Web端的截图(生成图片)并不算是个高频的需求，资料自然也不算多，查来查去，也不过Canvas 和 SVG两种实现方案，原理大概相似，都非真正义上的截图而是把DOM转为图片，然而实现方式却截然不同。

### Canvas 实现

如何将dom转换成canvas图片？自然是要一点点画到canvas里，想想都是件麻烦事。通过分析github的知名截图库[ niklasvh/html2canvas](https://github.com/niklasvh/html2canvas) (7k+ star)的源码，梳理了其大致的思路：

*   递归取出目标模版的所有DOM节点，填充到一个`rederList`，并附加是否为顶层元素/包含内容的容器 等信息

*   通过`z-index` `postion` `float`等css属性和元素的层级信息将`rederList`排序，计算出一个canvas的renderQueue

*   遍历renderQueue，将css样式转为`setFillStyle`可识别的参数，依据nodeType调用相对应canvas方法，如文本则调用`fillText`，图片`drawImage`，设置背景色的div调用`fillRect`等
*   将画好的canvas填充进页面

无论是排序优先级的计算还是从css到canvas的转换，毫无疑问都是些巨麻烦的事，尤其是放在真实的业务场景里，DOM模版中往往会包含复杂的样式与排版，html2canvas 足足用了20多个js来实现这层转换，复杂成度可见一斑。索性，我们不需要再重新造一遍轮子。

使用canvas转化的话灵活性较高，环境依赖上也只需要确保浏览器支持canvas就可以了，但它有个显著的缺点：慢。原因自然是因为大量的计算与递归调用，这是无可避免的。不过html2canvas代码中大量使用了Promise，所以html2canvas 支持异步操作。

限制：

*   无法跨域跨域资源

*   无法渲染iframe，flash等内容，但目前支持svg

值得一提的是，尽管`html2canvas`主页表示它还处于实验室环境，但自14年起便已经被Twitter 等用在了生产环境，所以虽然有诸多限制，稳定性应该还是保障的。

canvas如此复杂，那么有没有一种更简单的方法呢？

自然是有的，那便是SVG

### SVG实现

首先，svg本来就是矢量图形；其次，svg是可以用xml描述的；再其次，用来描述svg的标签里有个 `foreignObject`标签，这个标签可以加载其它命名空间的xml(xhtml)文档。也就是说，如果使用svg的话，我们不再需要一点点的遍历，转换节点；不用再计算复杂的元素优先级，只需要一股脑的将要渲染的DOM扔进`&lt;foreignObject&gt;&lt;/foreignObject&gt;`就好了，剩下的就交给浏览器去渲染。

让我们理一理思路：

* 首先，我们要声明一个基础的svg模版，这个模版需要一些基础的描述信息，最重要的，它要有<foreignObject></foreignObject>这对标签

* 将要渲染的DOM模版模版嵌入foreignObject

* 利用Blob构建svg图像

* 取出URL，赋值给

``` html
<div id='text'>
    <h1 style="background-color: #ccc;width: 200px;height: 200px;" >Hello World</h1>
</div>
```

``` javascript
//此代码仅在chrome测试下通过
function html2Svg(domStr) {
    //创建模版字符串
    var svgXML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                <foreignObject width="100%" height="100%">${generateXML(html)}</foreignObject>
             </svg>`
    //利用Blob创建svg
    var svg = new Blob([svgXML], { type: 'image/svg+xml' })
    //利用DOMURL.createObjectURL取出对象
    var url = window.URL.createObjectURL(svg);
    var img = new Image()
    img.src = url
    return img
}

// 由于`foreignObject`只能引用XML文档，
// 所以我们需要对DOM进行格式化
function generateXML(domStr) {
    var doc = document.implementation.createHTMLDocument('');
    doc.write(html);
    doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);
    doc = parseStyle(doc)
    console.log(doc)
    html = (new XMLSerializer).serializeToString(doc).replace('<!DOCTYPE html>', '');
    return html
}
```

可以看到按这个思路来实现非常简单，并且没有了复杂的计算和递归，渲染速度自然要优于前者。然而使用svg，需要考虑诸多的限制问题。一个最为严肃的问题在于：**SVG无法加载外部资源**,也就是说，在svg里面，无论是![]()还是<link href="">或者css中的背景图,这些资源都是无法加载的。在使用canvas实现时，因为我们是一个node一个node去画，所以不存在资源引用的问题。**但使用svg实现，相当于我们把文档交给SVG再来来渲染一遍，这对于我们来说是其实是无法控制的黑盒操作，是受SVG限制的**

万幸，一个昵称为Christoph Burgmer的小哥写了一个名为 [rasterizeHTML.js](https://github.com/cburgmer/rasterizeHTML.js) 的库，通过一系列的hack技巧替我们绕过了许多限制。我知道你很好奇他是怎么做到的。
简单来讲，`rasterizeHTML.js`在我们的基础实现上做了这些hack：

*   将`<img/>`的url 转为 dataURI

*   将background-color从style中取出，修改url后重新插入样式表

*   将link的的样式通过ajax down下来然后注入`<style></sytle>`

*   详见源码...

当然， rasterizeHTML.js能帮我们做的也不过是处理资源引用问题和浏览器兼容问题，更多的SVG的限制是无法绕过的，该库的文档正式列出了足足一整页的限制，让人读完后心中一凉。比如：

* 跨域资源无法加载

* 如lazyload等通过js加载的资源无法加载

* 内联或js操作background-image无法加载

* [详见文档](https://github.com/cburgmer/rasterizeHTML.js/wiki/Limitations)

思考下rasterizeHTML.js的原理便可理解这些限制无法避免的原因： rasterizeHTML.js只能对已经存在的静态资源进行处理，而对js动态生成并不能实时处理。

目前rasterizeHTML.js已经被用于知乎-意见反馈功能。


参考
源码 https://developer.mozilla.org/en-US/docs/Web/API/CanvasAPI/DrawingDOMobjectsintoacanvas
