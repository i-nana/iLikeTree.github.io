---
layout: post
title:  JavaScript Function
date:   2017-05-15
categories: coding
tags: Javascript
description: ''
---

``` javascript 
// 使用Function构造器
new Function([arg1, arg2, ...], functionBody);

// 函数声明
function funName([arg1, arg2, ... ]) {
    // statements
}

// 函数表达式 【ES5已经不允许在严格模式下使用函数表达式】
var funName = function [funName]([arg1, arg2, ... ]) {
    // statements
}

// 函数生成器声明 (function* 语句) 【ES6】
function* name([param[, param[, ...param]]]) { 
   // statements
}

// 函数生成器表达式 (function* 表达式) 【ES6】
function* [name]([param] [, param] [..., param]) { 
    // statements 
}

// 箭头函数表达式 (=>) 【ES6】
([param] [, param]) => { statements } param => expression

// 生成器函数的构造函数

```

使用Function构造器比使用__函数声明__和__函数表达式__更低效。因为前者生成的function对象实在函数创建时解析的，后两创建的函数是和其他代码一起解析的。

---

### 参数

#### 1. 默认参数 【ES6】

#### 2. 剩余参数 rest 【ES6】

#### 3. arguments 
---

全局的Function对象没有自己的属性和方法，但是他会通过原型链从`Function.prototype`上继承部分属性和方法。

### 原型对象【属性】

在函数内部，有两个特殊的对象：`arguments`和`this`。

#### 1. arguments

arguments是传递给函数的参数组成的一个__类数组__对象， 局部变量。

我们可以将它转化为真正的数组：

``` javascript
var args = Array.prototype.slice.call(arguments);

var args = [].slice.call(arguments);
// 注： 对参数使用slice会阻止某些JavaScript引擎中的优化，比如V8引擎

// ES6 - 扩展运算符
let args = [...arguments];
// ES6 - Array.from()
let args = Array.from(arguments);
```

+ `arguments.callee` 指向当前执行的函数
    警告：在严格模式下，第5版 ECMAScript (ES5) __禁止__使用 arguments.callee()。当一个函数必须调用自身的时候, 避免使用 arguments.callee(), 通过要么给函数表达式一个名字,要么使用一个函数声明.

+ `arguments.length` 参数的长度

#### 2. Function.caller()

#### 3. Function.length 获取参数的长度

#### 4. Function.name （ES6）

#### 5. Function.prototype.constructor

---

### 原型对象【方法】

#### 1. Function.prototype.apply(thisArg [, argsArray])

`apply()`在指定`this`值和参数（参数以数组或类数组的形式存在）的情况下调用某个函数。

__`apply()`的模拟实现__

``` javascript
Function.prototype.apply = function(context, arr){
    context = context || window;
    context.fn = this;      // 使该函数成为指定对象的一个方法

    var result;
    if(!arr){
        // 若没有参数则直接在指定对象上调用该函数，改变this的值为指定对象
        result = context.fn();
    } else {
        var args = [], len = arr.length; 
        for(var i=0; i<len; i++) {
            args.push('args[' + i + ']');
        }
        
        result = eval('context.fn(' + args + ')');
    }
    delete context.fn();
    return result;
}
```

#### 2. Function.prototype.call(thisArg, arg1, arg2, ... )

`call()`方法在指定`this`值和参数值（参数列表）前提下，调用某个函数或者方法。

`thisArg`参数可以传`null`，当为`null`时，指向`window`;

__`call()` 的模拟实现__

``` javascript
Function.prototype.call = function(context) {
    context = context || window;
    context.fn = this;
    
    var args = [], len = arguments.length;
    for(var i =1; i<len; i++){
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args + ')');

    delete context.fn;
    return result;
}

```

#### 3. Function.prototype.bind(thisArg, arg1, arg2, ... )

`bind()`方法会创建一个新函数，作为绑定函数。当调用这个绑定函数时，绑定函数会以创建它时传入`bind()`方法的第一个参数作为`this`，第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

__`bind()`的模式实现__

``` javascript
Function.prototype.bind = function(context){
    if(typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var FNOP = function(){};
    var fbound = function() {
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }

    FNOP.prototype = this.prototype;
    fbound.prototype = new FNOP();

    return fbound;
}
```



#### 4. Function.prototype.isGenerator()

#### 5. Function.prototype.toSource()

#### 6. Function.prototype.toString()
