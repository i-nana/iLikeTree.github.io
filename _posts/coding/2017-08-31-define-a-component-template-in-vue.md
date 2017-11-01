---
layout: post
title:  Vue组件
date:   2017-08-14
categories: coding
tags: Javascript
---

## 什么是组件

组件可以扩展 HTML 元素，封装独立可复用的代码。我们可以将页面划分为一个UI树。

## Vue.js组件的基本步骤

Vue.js组件的使用有三个步骤：

* 调用 `Vue.extend(options)` 方法创建组件构造器
    - `options` 是一个包含组件选项的对象
* 调用 `Vue.component(id, [definition])` 方法注册组件
    - id：组件的标签， String
    - definition: [可选]，组件构造器，Function|Object

``` javascript
// 注册组件，传入一个扩展过的构造器
Vue.component('my-component', Vue.extend({ /* ... */ }))

// 注册组件，传入一个选项对象（自动调用 Vue.extend）
Vue.component('my-component', { /* ... */ })

// 获取注册的组件（始终返回构造器）
var MyComponent = Vue.component('my-component')
```

* 在Vue实例中使用组件