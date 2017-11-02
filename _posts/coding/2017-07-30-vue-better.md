---
layout: post
title:  VUE ✿ 实践以及性能优化
date:   2017-07-30
categories: coding
tags: javascript vue
description: 
---

## 一、v-for & key [类似Vue 1.x的track-by]

vue实现了自动绑定，省去了操作dom的麻烦。主要是利用`Object.defineProtype`给object添加`get`、`set`访问器来实现对值的变化的兼容。

但是由于ES5的显示，有很多监听不到变化的盲点

- 数组的操作
    + push() - 追加元素，返回数组长度
    + pop()  - 删除最后一个元素，并返回该元素的值
    + shift() - 删除第一个元素，并返回该元素的值
    + unshift() - 将一个或多个元素添加到数组的开头，并返回新数组的长度
    + splice() - 删除现有元素和添加新元素来更改一个数组的内容，返回删除的元素
    + sort() - 排序，返回排序后的数组
    + reverse() - 反序，返回反序后的数组

Vue为[数组更新检测](https://cn.vuejs.org/v2/guide/list.html#数组更新检测)提供了一组观察数组的变异方法，所以以上方法也会触发视图更新。
    
- 纯数组，比如`[1,2,3,4,5]`
- 数组长度的修改
- 对象动态添加的属性等

### 列表渲染

当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用 “就地复用” 策略。如果数据项的顺序被改变，Vue将不是移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。这个类似 Vue 1.x 的 track-by="$index" 。（不能每一次list更改就要全量的创建dom更新视图）

---

## 利用`Object.freeze()`提升性能

> Object.freeze(obj) : 冻结对象，返回被冻结的对象。冻结对象的所有自身属性都不可能以任何方式被修改。任何尝试修改该对象的操作都会失败，可能是静默失败，也可能会抛出异常（严格模式中）。
>**如果一个属性的值是个对象，则这个对象中的属性是可以修改的，除非它也是个冻结对象。**

vue 1.0.18+对其提供了支持，对于data或vuex里使用freeze冻结了的对象，vue不会做getter和setter的转换。对于纯展示的大数据，都可以使用Object.freeze提升性能。

---

## 初始化性能（首屏加载）

要初始化根标签<app>，就需要从底层开始冒泡，将页面所有组件都初始化完。所以我们的页面会在所有组件都初始化完才开始显示。这个结果显然不是我们要的，更好的结果是页面可以从上到下按顺序流式渲染，这样可能总体时间增长了，但首屏时间缩减，在用户看来，页面打开速度就更快了。

要实现这种渲染模式，我总结了下有3种方式实现。第3种方式是我认为最合适的，也是我在项目中实际使用的优化方法。

### 1. 不适用根组件

``` html
<body>
    <A></A>
    <B></B>
    <C></C>
</body>
```

由于根组件在SPA里是非常必要的，所以这种方式只适合小型页面。



### 2. 异步组件

> [**Vue.js 官方文档：异步组件**](https://cn.vuejs.org/v2/guide/components.html#异步组件)
> 在大型应用中，我们可能需要将应用拆分为多个小模块，按需从服务器下载。为了让事情更简单，Vue.js 允许将组件定义为一个工厂函数，动态地解析组件的定义。Vue.js 只在组件需要渲染时触发工厂函数，并且把结果缓存起来，用于后面的再次渲染。例如：

``` html
<app>
    <A></A>
    <B></B>
</app>
```

``` javascript
new Vue({
    components: {
        A: { /* component-config */},
        B (resolve) {
            setTimeout( () => {
                resolve({ /*component-config*/ })
            }, 0)
        }
    }
})
```

这里<B>组件是一个异步组件，会等到手动调用resolve函数时才开始初始化，而父组件<app>也不必等待<B>先初始化完。

我们利用setTimeout(fn, 0)将<B>的初始化放在队列最后，结果就是页面会在<A>初始化完后立刻显示，然后再显示<B>。如果你的页面有几十个组件，那么把非首屏的组件全设成异步组件，页面显示速度会有明显的提升。

你可以封装一个简单的函数来简化这个过程：

``` javascript
function deferLoad (component, time = 0) {
    return (resolve) => {
        window.setTimeout(() => resolve(component), time)
    };
}

new Vue({
    components: {
        B: deferLoad( /*component-config*/ ),
        // 100ms后渲染
        C: deferLoad( /*component-config*/, 100 )
    }
})
```

这种实现方式需要考虑渲染顺序。

### 3. 给需要延迟渲染的组件加上`v-if`

> `v-if`: 根据表达式的值的真假条件渲染元素。在切换时元素及它的数据绑定 / 组件被销毁并重建。如果元素是 <template> ，将提出它的内容作为条件块。

因为`v-if`是惰性的，只有当第一次值为true时才会开始初始化。

** 方法一：默认不显示，在created()钩子函数中将对应的组件设置为显示 **

``` javascript
new Vue({
    data: {
        showB: false,
        showC: false
    },
    created () {
        // 显示B
        setTimeout(() => {
            this.showB = true;
        }, 0);
        // 显示C
        setTimeout(() => {
            this.showC = true;
        }, 0);
    }
});
```

** 方法二: terminal 指令 **

在vue里，类似v-if和v-for这种是terminal指令，会在指令内部编译组件。如果你想要自己实现一个terminal指令，需要加上terminal: true，例如：

``` html
// v-lazy 指定在多少秒后开始渲染
<app>
    <A></A>
    <B v-lazy="0"></B>
    <C v-lazy="100"></C>
</app>
```

``` javascript
Vue.directive('lazy', {
    terminal: true,
    bind () {},
    update () {},
    unbind () {}
});
```

具体代码详见[Github: yeyuqiudeng/vue-lazy-render](https://github.com/yeyuqiudeng/vue-lazy-render)
---

## 参考

+ [Github: vue 性能优化](https://github.com/Coffcer/Blog/issues/3)

