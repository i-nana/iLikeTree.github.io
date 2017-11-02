---
layout: post
title:  "Hello World"
date:   2016-11-21 15:23:53 +0800
categories: daily
tags: Hello
description: ''
---

{% highlight javascript %}
$(document).ready(function () {
    alert('hello world');
});
{% endhighlight %}

{% highlight css %}
#top-menu ul.nav>li.dropdown ul.menu:before {
    content: '';
    bottom: auto;
    right: auto;
    top: -5px;
    left: 43px;
    position: absolute;
    width: .6em;
    height: .6em;
    transform: rotate(135deg);
    z-index: 2;
    -webkit-transition: background .1s linear;
    -moz-transition: background .1s linear;
    transition: background .1s linear;
    background-color: #FFF;
    border-left: 1px solid #DDD;
    border-bottom: 1px solid #DDD
}

#top-menu ul.nav>li.dropdown ul.menu>li {
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    box-sizing: border-box;
    line-height: 25px
}
{% endhighlight %}


标题1
======

标题2
-----

## 大标题 

### 小标题 

*斜体文本*    _斜体文本_
**粗体文本**    __粗体文本__
***粗斜体文本***    ___粗斜体文本___

__要建立一个行内式的链接，只要在方块括号后面紧接着圆括号并插入网址链接即可，如果你还想要加上链接的 title 文字，只要在网址后面，用双引号把 title 文字包起来即可，例如：__

文字链接 [链接名称](http://链接网址)
网址链接 <http://链接网址>


- 列表文本前使用 [减号+空格]
+ 列表文本前使用 [加号+空格]
* 列表文本前使用 [星号+空格]


1. 列出所有元素：
    - 无序列表元素 A
        1. 元素 A 的有序子列表
    - 前面加四个空格
2. 列表里的多段换行：
    前面必须加四个空格，
    这样换行，整体的格式不会乱
3. 列表里引用：

    > 前面空一行
    > 仍然需要在 >  前面加四个空格

4. 列表里代码段：

    ```
    前面四个空格，之后按代码语法 ``` 书写
    ```

        Coding Pages 目前支持 Jekyll 3.0
        
        
        
> 引用文本前使用 [大于号+空格]
> 折行可以不加，新起一行都要加上哦