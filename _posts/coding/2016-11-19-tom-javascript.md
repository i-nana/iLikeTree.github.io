---
layout: post
title:  Tom JavaScript
date:   2016-11-19
categories: coding
tags: Javascript
description: 迪士尼给我们营造的乌托邦就是这样，永远善良勇敢，永远出乎意料。
---

* 驼峰式命名法(camel case)
* 使用“_”做前缀来表示一个私有属性或方法

-----

1. 全局变量
    
    * 使用 var 创建的全局变量，是不能被 delete 删除的
    * 无 var 创建的隐式全局变量是能被 delete 删除的
    
    * 变量声明提升，预解析
    
    使用命名空间Namespace, 本质是对象，不安全
    
    匿名闭包：IIFE模式  (下面的 “Module 模式” 详解)

``` javascript
var Module = (function(){
    var _private = 'safe now';
    var foo = function(){
        console.log(_private);
    };
    return {
        foo: foo
    };
})();

Module.foo();   // 'safe now'
Module._private;    // undefined
```
    
2. 单线程，DOM顺序即执行顺序

3. for 循环

    * 把变量从循环中提出来
    * 使用 while(){}
    
4. for .. in 循环

    * for-in 循环中，属性列表的顺序是不能保证的。最好数组使用 for 循环，对象使用 for-in 循环
    * 注意 hasOwnProperty()，遍历对象属性时，过滤原型链上的属性
    
5. 避免使用 eval()

    * eval() 接受任意字符串，并将其当做js代码处理
    * 安全隐患
    * 干扰作用域链， eval() 可以访问和修改它外部的作用域中的变量，使用 Function 更安全
    
-----

## Module 模式

* 模块化，可重用
* 封装了变量和方法，和全局的namespace不接触，松耦合
* 只暴露可用的public方法，其他私有方法全部隐藏

1. 匿名闭包

2. 引用全局变量

``` javascript
(function(){
    // 代码
})(变量1, 变量2, ...)
```


``` javascript
var md = (function(){ 
    function foo(){ 
        console.log('a');
    }
    return foo; 
})();
```

