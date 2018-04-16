---
layout: post
title:  『深入理解JavaScript系列』笔记
date:   2016-11-19
categories: study
tags: JavaScript
---

本文主要是记录学习[汤姆大叔的博客-深入理解JavaScript系列](http://www.cnblogs.com/TomXu/archive/2011/12/15/2288411.html)的一些笔记。

---

## 一、编写高质量JavaScript代码的基本要点

### 1. 谨慎使用全局变量，避免隐式全局变量。
    
* 使用 var 创建的全局变量，是不能被 delete 删除的
* 无 var 创建的隐式全局变量是能被 delete 删除的

``` javascript
var a = 1;
b = 2;

delete a;   // false
delete b;   // true

a   // 1
b   // Uncaught ReferenceError: b is not defined
```

    
### 2. 变量声明提升，预解析

代码处理分两个阶段，第一阶段是变量，函数声明，以及正常格式的参数创建，这是一个解析和进入上下文 的阶段。第二个阶段是代码执行，函数表达式和不合格的标识符（为声明的变量）被创建。

### 3. 避免隐式类型转化

JavaScript的变量在比较的时候会隐式类型转换，为了避免引起混乱的隐式类型转换，在比较值和表达式类型的时候始终使用`===`和`!==`操作符。

### 4. `for`循环

+ 在用for循环数组的时候，缓存数组的长度。尤其是在循环HTMLCollection对象的时候。每次循环获取长度都要去实时查询DOM，而DOM操作是很昂贵的。
+ 使用while循环

### 5. `for...in`循环
    
* for-in 循环中，属性列表的顺序是不能保证的。最好数组使用 for 循环，对象使用 for-in 循环
* 注意 hasOwnProperty()，遍历对象属性时，过滤原型链上的属性

### 6. 避免`eval()`

> `eval()`函数可计算某个字符串，并执行其中的JavaScript代码。

+ 使用eval()可能会带来安全隐患，被执行的代码可能已经被篡改。
+ `eval()`会干扰作用域链，会污染本地变量。
    - 如果你必须使用eval()，可以考虑使用new Function()代替。因为在Function中，代码是在局部函数作用域中运行的，所以代码中通过var定义的变量是局部变量。
    - 将eval()封装到一个即时函数中，阻止自动全局变量。

``` javascript

var jsStrA = 'var a=1; console.log("a:" + a);';
var jsStrB = 'var b=2; console.log("b:" + b);';

eval(jsStrA);    // a:1
a   // 1，a已经是全局变量


new Function(jsStrB)();    // b:2
b   // Uncaught ReferenceError: b is not defined。 b是局部变量


(function() {
    eval(jsStrB);
}());

// b:2
```

+ eval()可以访问和修改它外部作用域的变量，而Function（new Function)是做不到的。

``` javascript
(function() {
    var local = 1;
    eval('local=3');
    console.log(local);     // 3
})();

(function() {
    var local = 1;
    Function('console.log(typeof local);')();   // undefined
})();
```

### 7. `parseInt()`下的数值转换,总是指定基数

使用parseInt()可以从字符串中获取数值，但是当该字符串是以'0'开头的时候，ESMAScript 3会当做8进制处理。所以为了避免矛盾和意外的结果，使用parseInt()进行字符串数值转换的时候，最好指定基数。


### 8. 命名规范

* 驼峰式命名法(camel case)：对于构造函数，可以使用大驼峰式命名法（upper camel case）；对于函数和放大等，使用小驼峰命名法（lower camel case）。
* 使用“_”做前缀来表示一个私有属性或方法
* 定义常量时采用单词大写，例如`var PI = 3.14`。

---

## 二、揭秘命名函数表达式

### 1. 定义函数的方式

定义一个函数有: 函数声明、函数表达式，以及使用Function构造函数。

Function构造函数可以接受任意数量的参数，但最后一个参数最终被看成是函数体，而前面的参数则枚举了新函数的参数。但是这种方法并不值得推荐，因为这种语法会导致解析两次代码，影响性能：
+ 第一次是解析常规ECMAScript代码
+ 第二次是解析传入构造函数中的字符串

``` javascript
// 函数声明
function sum(num1, num2) {
    return num1 + num2;
}

// 函数表达式
var sum = function (num1, num2) {
    return num1 + num2;
}

// 使用Function构造函数，不推荐！！！
var sum = new Function("num1", "num2", "return num1 + num2");
```

__ 函数名仅仅是指向函数的指针__！


``` javascript
var anotherSum = sum;
sum = null;
// 此时 anotherSum 依旧可以正常使用
anotherSum(1, 2);   // 3
```

### 2. 函数声明和函数表达式

函数声明，有一个重要特征就是__函数声明提升(function declaration hoisting)__。

另外函数声明必须带有标识符（Identity），而函数表达式则可以省略这个标识符。

## 三、全面解析Module模式

Module模式的基本特征：

+ 模块化，可重用
+ 封装了变量和function，和全局的namespace不接触，松耦合
+ 只保留可用的public的方法，其他私有方法全部隐藏


``` javascript
var HI = (function(my) {
    var oldSum = my.sum;
    my.sum = function() {
        switch(arguments.length) {
        case 0:
            return 0;
            break;
        case 1:
            return arguments[0];
            break;
        default:
            console.log(arguments);
        }
    }
    return my;
}(HI || {}));
```
