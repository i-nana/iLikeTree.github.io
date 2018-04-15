---
layout: post
title:  译文 ♡ Callback Hell - Promise
date:   2017-05-20
categories: study
tags: [JavaScript]
description: ''
---

> ♡ 〖原文〗[JavaScript异步编程指南：http://callbackhell.com/](http://callbackhell.com/)
> ♡ [值得多聊聊的 Promise 模式，以及它能解决什么问题](https://swiftcafe.io/2017/05/24/promise-q/?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

---

## Callback Hell 回调地狱

* 异步 JavaScript 编程指南*

---

### 一、 什么是 "callback hell"？

使用异步JavaScript或JavaScript回调会造成代码很不易阅读。很多代码最后看起来会像这样：

``` javascript
fs.readdir(source, function (err, files) {
    if (err) {
        console.log('Error finding files: ' + err)
    } else {
            files.forEach(function (filename, fileIndex) {
            console.log(filename)
            gm(source + filename).size(function (err, values) {
                if (err) {
                    console.log('Error identifying file size: ' + err)
                } else {
                    console.log(filename + ' : ' + values)
                    aspect = (values.width / values.height)
                    widths.forEach(function (width, widthIndex) {
                        height = Math.round(width / aspect)
                        console.log('resizing ' + filename + 'to ' + height + 'x' + height)
                        this.resize(width, height).write(dest + 'w' + width + '_' + filename, function(err) {
                            if (err) console.log('Error writing file: ' + err)
                        })
                    }.bind(this))
                }
            })
        })
    }
})
```

看到这金字塔一样的结构和在代码结尾所有的`})`了吗？呀！这就是所谓的“__callback hell__”。

当人们试图以从上到下的执行方式编辑代码的时候就很容易造成“callback hell”。很多人都犯这个错误！其他语言（比如C、ruby或Python）都是当第一行代码执行完毕以后，第二行代码才开始执行，以此类推。所以，我们应该了解到JavaScript是不同的。

---

### 二、什么是回调 ？

回调只是JavaScript约定的名称，这是一个惯例。相比于大多数函数立即返回一些结果，回调需要花费一些时间去得到结果。“`asynchronous`”，也就是“`async`”异步，意味着“需要一些时间”或者“将来发生，不是现在”。通常只有在执行`I/O`时会使用回调。例如：下载、读取文件、从数据库获取数据等。

当调用普通函数时，你可以使用回调获取返回值：

``` javascript
var result = multiplyTwoNumbers(5, 10)
console.log(result) // 50
```

然而，异步或者回调函数并不会立刻返回结果。

``` javascript
var photo = downloadPhoto('http://coolcats.com/cat.gif')
// photo is 'undefined'!
```

在这种情况下，gif图片的下载可能需要花费很长的是时间，同时，你又不希望程序暂停（阻止）直到下载完成。

如果你把需要在下载完成后执行的代码存储在一个函数中，这就是回调。你可以将它赋值给`downloafPhoto`函数，当下载完成后将运行你的回调，并传递下载的图片（如果出现问题， 将返回一个错误）。

``` javascript
downloadPhoto('http://coolcats.com/cat.gif', handlePhoto)

function handlePhoto (error, photo) {
    if (error) console.error('Download error!', error)
    else console.log('Download finished', photo)
}

console.log('Download started')
```

理解回调的最大难点是理解程序的执行顺序。在这个例子里，主要发生了三件事：① 声明`handlePhoto`函数；② 调用 `downloadPhoto`函数，并将`handleOPhoto`作为其回调；③ 打印“`Download started`”。

请注意，`handlePhoto`并没有被调用，只是创建并作为`downloadPhoto`的回调，直到`downloadPhoto`完成任务后，才会被执行，这可能需要很长的时间（取决于网速）。

这个例子说明了两个重要的概念：

+ `handlePhoto`回调仅仅是储存在稍后需要执行的任务
+ 任务执行的顺序并不是从上到下的，它取决于事件是否完成

---

### 三、如何解决`callback hell`?

“callback hell”是由于不良的编码实践造成的。幸运的是，编写更好的代码并不是很难，你只需要遵循 __三个规则__：

#### 1. 代码简洁

Here is some messy browser JavaScript that uses [browser-request](https://github.com/iriscouch/browser-request) to make an AJAX request to a server:

这里有一些使用[`browser-request`](https://github.com/iriscouch/browser-request)向服务器发送`Ajax`请求的JavaScript代码：

``` javascript    
var form = document.querySelector('form')
form.onsubmit = function (submitEvent) {
    var name = document.querySelector('input').value
    request({
        uri: "http://example.com/upload",
        body: name,
        method: "POST"
    }, function (err, response, body) {
        var statusMessage = document.querySelector('.status')
        if (err) return statusMessage.value = err
        statusMessage.value = body
    })
}
```

这段代码有两个匿名函数，让我们给他们命名：

``` javascript
var form = document.querySelector('form')
form.onsubmit = function formSubmit (submitEvent) {
    var name = document.querySelector('input').value
    request({
        uri: "http://example.com/upload",
        body: name,
        method: "POST"
    }, function postResponse (err, response, body) {
        var statusMessage = document.querySelector('.status')
        if (err) return statusMessage.value = err
        statusMessage.value = body
    })
}
```

命名函数很容易，并且有以下几点好处：

+ 描述性的函数名增强了代码的可读性
+ 发生异常时，你可以获取实际的函数名堆栈跟踪，而不是“anonymous”
+ 可以通过函数名移除或者调用函数

现在，我们将函数移到项目的顶层：

``` javascript
document.querySelector('form').onsubmit = formSubmit

function formSubmit (submitEvent) {
    var name = document.querySelector('input').value
    request({
        uri: "http://example.com/upload",
        body: name,
        method: "POST"
    }, postResponse)
}

function postResponse (err, response, body) {
    var statusMessage = document.querySelector('.status')
    if (err) return statusMessage.value = err
    statusMessage.value = body
}
```
注意，`function`声明在文件的底部，这应该是感谢[函数提升](https://gist.github.com/maxogden/4bed247d9852de93c94c)。

#### 2. 模块化

这是一个最重要的部分：__Anyone is capabale of creating modules (aka libraries)__。

> Write small modules that each do one thing, and assemble them into other modules that do a bigger thing. You can't get into callback hell if you don't go there.
> 引用自 [Isaac Schlueter](http://twitter.com/izs) （的node.js项目）

我们从上面的代码中提取样板代码，并将其分成几个文件，组成一个模块。我将得到一个能在浏览器或服务器端（或两者）工作的模块模式：`formuploader.js`，它包含了之前的两个函数。

``` javascript
module.exports.submit = formSubmit

function formSubmit (submitEvent) {
    var name = document.querySelector('input').value
    request({
        uri: "http://example.com/upload",
        body: name,
        method: "POST"
    }, postResponse)
}

function postResponse (err, response, body) {
    var statusMessage = document.querySelector('.status')
    if (err) return statusMessage.value = err
    statusMessage.value = body
}
```

`module.exports`是node.js模块系统中的一个例子，需要在node环境下使用。Electron和浏览器中使用[browserfy](https://github.com/substack/node-browserify)。我特别喜欢这种模块方式，因为它可以在任何环境运行，非常容易理解，并且不需要复杂的配置文件或者脚本。

现在我们已经有了`formuploader.js`（在被编译后，它已经作为脚本加载在页面中），我们只需要请求和使用它。以下是我们的程序特定的代码：

``` javascript
var formUploader = require('formuploader')
document.querySelector('form').onsubmit = formUploader.submit
```
现在我们的程序只有两行代码，它的优点如下：

+ 新的开发人员理解起来更加容易：他们不会因为需要读取所有`formuploader`方法函数而陷入困扰 
+ `formuloader` 不需要拷贝其代码，就能够运行在其他地方，也更利于github或者npm分享

#### 3. 处理单一的错误
                    
这里有不同的错误类型： `syntax errors`（通常，当你第一次运行程序的时候会被捕获）；运行错误（代码运行时因为bug造成一些东西混乱）；由于无效文件权限、硬盘驱动故障、没有网络连接等造成的平台错误。本章节仅旨在解决最后一类错误。

前面两个规则主要是关于代码可读性的，这一规则将致力于代码的稳定性。在处理回调时，你将根据定义处理被派遣的任务，在后台执行某些操作，然后成功完成或者由于错误而终止。经验丰富的开发人员将告诉你，你不能预测这些错误什么时候发生，所以你必须计划他们总是发生。

Node.js处理错误的方式是回调最流行的错误处理方式：将error作为回调的第一个参数。

``` javascript
var fs = require('fs')
    
fs.readFile('/Does/not/exist', handleFile)
    
function handleFile (error, file) {
    if (error) return console.error('Uhoh, there was an error', error)
    // otherwise, continue on and use `file` in your code
}
```

约定将`error`作为第一个参数可以提醒你处理错误情况、如果将其作为第二个参数，你很可能写成这样`function hangleFile(file){ }`，非常容易忽略错误。

你可以配置代码linters去提醒你处理回调错误。最简单的方式是使用[standard](http://standardjs.com/)。你只需要在你的代码文件夹下运行`$ standard`，它将显示代码中所有没有处理错误的回调。

---

### 总结

1. 不要嵌套函数。给函数命名并且将他们放在项目顶端
2. 使用[function hoisting 函数提升](https://gist.github.com/maxogden/4bed247d9852de93c94c)帮助你把函数折叠
3. 每一个回调中都要处理每一个单独的错误。Linter，比如[standard](http://standardjs.com/)，可以帮助到你
4. 创建可复用函数，并将他们放在一个模块中，以减轻理解代码的负担。分割代码也可以帮助你处理错误，编写测试，为你的代码创建稳定并且记录公共API的文档，这也有助于重构。


The most important aspect of avoiding callback hell is **moving functions out of the way** so that the programs flow can be more easily understood without newcomers having to wade through all the detail of the functions to get to the meat of what the program is trying to do.

You can start by moving the functions to the bottom of the file, then graduate to moving them into another file that you load in using a relative require like `require('./photo-helpers.js')` and then finally move them into a standalone module like `require('image-resize')`.

##### Here are some rules of thumb when creating a module:

- Start by moving repeatedly used code into a function
- When your function (or a group of functions related to the same theme) get big enough, move them into another file and expose them using `module.exports`. You can load this using a relative require
- If you have some code that can be used across multiple projects give it it's own readme, tests and `package.json` and publish it to github and npm. There are too many awesome benefits to this specific approach to list here!
- A good module is small and focuses on one problem
- Individual files in a module should not be longer than around 150 lines of JavaScript
- A module shouldn't have more than one level of nested folders full of JavaScript files. If it does, it is probably doing too many things
- Ask more experienced coders you know to show you examples of good modules until you have a good idea of what they look like. If it takes more than a few minutes to understand what is happening, it probably isn't a very good module.

---

### 更多

Try reading my [longer introduction to callbacks](https://github.com/maxogden/art-of-node#callbacks), or try out some of the [nodeschool](http://nodeschool.io/) tutorials.

Also check out the [browserify-handbook](https://github.com/substack/browserify-handbook) for examples of writing modular code.

### What about promises/generators/ES6 etc?

Before looking at more advanced solutions, remember that callbacks are a fundamental part of JavaScript (since they are just functions) and you should learn how to read and write them before moving on to more advanced language features, since they all depend on an understanding of callbacks. If you can't yet write maintainable callback code, keep working at it!

If you *really* want your async code to read top-to-bottom, there are some fancy things you can try. Note that **these may introduce performance and/or cross platform runtime compatibility issues**, so make sure to do your research.

**Promises** are a way to write async code that still appears as though it is executing in a top-down way, and handles more types of errors due to encouraged use of `try/catch` style error handling.

**Generators** let you 'pause' individual functions without pausing the state of the whole program, which at the cost of slightly more complex to understand code lets your async code appear to execute in a top-down fashion. Check out [watt](https://github.com/mappum/watt) for an example of this approach.

**Async functions** are a proposed ES7 feature that will further wrap generators and promises in a higher level syntax. Check them out if that sounds interesting to you.

Personally I use callbacks for 90% of the async code I write and when things get complicated I bring in something like [run-parallel](https://github.com/feross/run-parallel) or [run-series](https://github.com/feross/run-series). I don't think callbacks vs promises vs whatever else really make a difference for me, the biggest impact comes from keeping code simple, not nested and split up into small modules.

Regardless of the method you choose, always **handle every error** and **keep your code simple**.

#### Remember, only *you* can prevent callback hell and forest fires

You can find the source for this [on github](http://github.com/maxogden/callback-hell).

--- 

+ http://www.infoq.com/cn/articles/nodejs-callback-hell/