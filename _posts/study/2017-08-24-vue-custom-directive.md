---
layout: post
title:  Vue 自定义指令以及懒加载v-lazyload的实现
date:   2017-08-14
categories: study
tags: [Javascript, Vue]
---

- 目录
{:toc}

### 一、Vue的指令

#### 指令的钩子函数

指令定义函数提供了几个钩子函数（可选）：

+ `bind`: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
+ `inserted`: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
+ `update`: 所在组件的 VNode 更新时调用，但是可能发生在其孩子的 VNode 更新之前。指令的值可能发生了改变也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
+ `componentUpdated`: 所在组件的 VNode 及其孩子的 VNode 全部更新时调用。
+ `unbind`: 只调用一次， 指令与元素解绑时调用。

#### 参数

钩子函数被赋予了以下参数：

+ `el`: 指令所绑定的元素，可以用来直接操作 DOM 。
+ `binding`: 一个对象，包含以下属性：
    - `name`: 指令名，不包括 v- 前缀。
    - `value`: 指令的绑定值， 例如： v-my-directive="1 + 1", value 的值是 2。
    - `oldValue`: 指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
    - `expression`: 绑定值的字符串形式。 例如 v-my-directive="1 + 1" ， expression 的值是 "1 + 1"。
    - `arg`: 传给指令的参数。例如 v-my-directive:foo， arg 的值是 "foo"。
    - `modifiers`: 一个包含修饰符的对象。 例如： v-my-directive.foo.bar, 修饰符对象 modifiers 的值是 { foo: true, bar: true }。
+ `vnode`: Vue 编译生成的虚拟节点，查阅 VNode API 了解更多详情。
+ `oldVnode`: 上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

> 除了 el 之外，其它参数都应该是 __只读__ 的，尽量不要修改他们。如果需要在钩子之间共享数据，建议通过元素的 `dataset` (data-*) 来进行。

### 二、VUE实现图片懒加载自定义指令v-lazyload

#### 大致思路如下：

1. 创建 imgsList 数组，用于存放需要懒加载的图片
2. 在钩子函数`inserted`中，将当前的图片容器追加到 imgsList 中
3. 监听 scroll 事件，判断图片容器是否在可视区域内。若在可是区域内，为了避免迅速滑屏过程中的图片加载，设置定时器，在100ms后判断图片容器是否依旧在可视区域内。若依旧在可视区域内，则把相应的图片添加到图片容器中，并将其从imgsList中移除。

#### 实现过程

1) 由于信息流中的图片均是以`background-image`的形式加载的，所以判断图片是否已经添加到图片容器上的`isLoaded()`方法如下：

``` javascript
const isLoaded = (el) => {
    return !!el.style.backgroundImage;
}
```

2) 判断图片容器是否在可视区域内

``` javascript
const isViewed = (el) => {
    let elHeight = el.offsetHeight;
    let top = el.getBoundingClientRect().top;   // 获取元素距离可视区域顶部的距离

    return top + 10 <== windowHeight && top + elHeight > 0;
}
```

3) 判断图片是否需要加载

``` javascript
const isCanLoad = (item) => {
    let el = item.el;
    if(isViewed(el) && !isLoaded(el)) {
        setTimeout(function () {
            if(isViewed(el) && !isLoaded(el)) {
                el.style.backgroundImage = 'url(' + item.imgSrc + ')';
                let index = imgsList.indexOf(item);
                if (index > -1) {
                    imgsList.splice(index, 1);
                }
            }
        }, 100)
    }
}
```


4) 自定义指令v-lazyload, 监听scroll

``` javascript
Vue.directive('lazyload', {
    inserted: (el, bind) => {
        let imgSrc = bind.value;
        if(!imgSrc) return;
        let item = {
            imgSrc: imgSrc,
            el: el
        }
        imgsList.push(item);
        isCanLoad(item);

        window.addEventListener('scroll', function(){
            imgsList.forEach(function(item){
                isCanLoad(item);
            });
        }, false);
    }
})
```

至此，`v-lazyload`已实现。

### 三、滚动优化

在上面的实现中，我们对window对象的scroll事件进行了监听，当页面发生滚动的时候，该事件会连续触发，这样引起大量的DOM操作、位置计算，这是十分影响页面性能的。为了避免高频率地操作引起浏览器崩溃，我们需要使用 __函数节流__ 。


类似地，以下场景都会引起事件的高频触发：

+ window对象的scroll、resize事件
+ touch/拖拽时的mousemove事件
+ 射击游戏中的mousedown、keydown事件
+ 文字输入、自动完成的keyup事件

#### 函数节流

> 函数节流背后的基本思想是指，某些代码不可以在没有间断的情况连续重复执行。第一次调用函数，创建一个定时器，在指定的时间间隔之后运行代码。当第二次调用该函数时，它会清除前一次的定时器并设置另一个。如果前一个定时器已经执行过了，这个操作就没有任何意义。然而，如果前一个定时器尚未执行，其实就是将其替换为一个新的定时器。目的是只有在执行函数的请求停止了一段时间之后才执行。(《JavaScript高级程序设计》 P.614)

``` javascript
function throttle(method, context) {
     clearTimeout(methor.tId);
     method.tId = setTimeout(function(){
         method.call(context);
     }, 100);
 }
```

---

> 滚动优化
> 1. [浅谈javascript的函数节流](http://www.alloyteam.com/2012/11/javascript-throttle/)
> 2. [【前端性能】高性能滚动 scroll 及页面渲染优化](http://www.cnblogs.com/coco1s/p/5499469.html)