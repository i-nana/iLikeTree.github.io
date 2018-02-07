---
layout: post
title: 用JavaScript实现函数重载
date:   2016-01-11
categories: study
tags: JavaScript
---

函数重载其实就是“一物多用”的思想。在相同的声明域中，当函数或者方法名相同，而形参的类型或者个数或者顺序不同的时候，可以通过函数的参数表而唯一识别并且来区分函数。

__而在ECMAScript中没有函数重载的概念。__如果声明了两个同名的函数，则后者会覆盖前者。

那如何用javascript实现重载呢？

### 一、 根据arguments对象的length值进行判断

``` javascript
function overLoading() {
    switch(arguments.length) {
        case 0:
            // 操作
            break;
        case 1:
            // 操作
            break;
        // ...
    }
}
```

### 二、利用闭包的特性

我们现在有这样的一个需求，有一个people对象，里面存着一些人名，如下：

``` javascript
var people = {
    values: ["Dean Edwards", "Sam Stephenson", "Alex Russell", "Dean Tom"]
};
```

我们希望people对象拥有一个find方法，当不传任何参数时，就会把people.values里面的所有元素返回来；当传一个参数时,就把first-name跟这个参数匹配的元素返回来；当传两个参数时，则把first-name和last-name都匹配的才返回来。因为find方法是根据参数的个数不同而执行不同的操作的，所以，我们希望有一个addMethod方法，能够如下的为people添加find的重载：

``` javascript
addMethod(people, "find", function() {}); /*不传参*/
addMethod(people, "find", function(a) {}); /*传一个*/
addMethod(people, "find", function(a, b) {}); /*传两个*/
```

这时候问题来了，这个全局的addMethod方法该怎么实现呢？John Resig的实现方法如下，代码不长，但是非常的巧妙：

``` javascript
function addMethod(object, name, fn) {
　　var old = object[name]; //把前一次添加的方法存在一个临时变量old里面
　　object[name] = function() { // 重写了object[name]的方法
　　　　// 如果调用object[name]方法时，传入的参数个数跟预期的一致，则直接调用
　　　　if(fn.length === arguments.length) {
　　　　　　return fn.apply(this, arguments);
　　　　// 否则，判断old是否是函数，如果是，就调用old
　　　　} else if(typeof old === "function") {
　　　　　　return old.apply(this, arguments);
　　　　}
　　}
}
```

现在，我们一起来分析一个这个addMethod函数，它接收3个参数，第一个为要绑定方法的对象，第二个为绑定的方法名称，第三个为需要绑定的方法（一个匿名函数）。函数体的的分析已经在注释里面了。

OK，现在这个addMethod方法已经实现了，我们接下来就实现people.find的重载啦！全部代码如下：

``` javascript
//addMethod
function addMethod(object, name, fn) {
　　var old = object[name];
　　object[name] = function() {
　　　　if(fn.length === arguments.length) {
　　　　　　return fn.apply(this, arguments);
　　　　} else if(typeof old === "function") {
　　　　　　return old.apply(this, arguments);
　　　　}
　　}
}

var people = {
　　values: ["Dean Edwards", "Alex Russell", "Dean Tom"]
};

/* 下面开始通过addMethod来实现对people.find方法的重载 */

// 不传参数时，返回peopld.values里面的所有元素
addMethod(people, "find", function() {
　　return this.values;
});

// 传一个参数时，按first-name的匹配进行返回
addMethod(people, "find", function(firstName) {
　　var ret = [];
　　for(var i = 0; i < this.values.length; i++) {
　　　　if(this.values[i].indexOf(firstName) === 0) {
　　　　　　ret.push(this.values[i]);
　　　　}
　　}
　　return ret;
});

// 传两个参数时，返回first-name和last-name都匹配的元素
addMethod(people, "find", function(firstName, lastName) {
　　var ret = [];
　　for(var i = 0; i < this.values.length; i++) {
　　　　if(this.values[i] === (firstName + " " + lastName)) {
　　　　　　ret.push(this.values[i]);
　　　　}
　　}
　　return ret;
});

// 测试：
console.log(people.find()); //["Dean Edwards", "Alex Russell", "Dean Tom"]
console.log(people.find("Dean")); //["Dean Edwards", "Dean Tom"]
console.log(people.find("Dean Edwards")); //["Dean Edwards"]
```

### 三、根据参数类型重载

ECMAScript中有7种数据类型：
+ 原始类型（primitive type）：Undefined、null、Boolean、Number、String、Symbol（ES6）。
+ 复杂类型：Object(Object, Array, Function, Date等)

JS中判断数据类型有三种方法：`typeof`、`instanceof`、`constructor`。

1.用 typeof 语句判断变量类型，typeof语句返回类型对应的字符串。
2.用 instanceof 语句判断变量类型，instanceof语句返回true/false。**The `instanceof` operator tests the presence of `constructor.prototype` in object's prototype chain.**
3.用 constructor 属性判断变量类型，这个属性返回用来构造该变量的构造函数引用。

```javascript
// 测试 instanceof
var a=undefined, b = null, c = true, d = 123, e = 'abc', f = Symbol(), g = {name: 'G'}, h = [1,2,3], i = function(){console.log('I')};
var arr = [a, b, c, d, e, f, g, h, i];

arr.forEach((x, i)=>{
    if(x !== null && x !== undefined ) console.log(x, x instanceof Object)
});
// g（Object）, h（Array） , i（Function） 均返回 true，其他为false

arr.forEach((x, i)=>{
    if(x !== null && x !== undefined ) console.log(x, x instanceof Array)
});
// 只有h（Array）返回true

```

|             | undefined |  null    | boolean | Number | String | Symbol | Object  | Array | Function |
| --------    | -----     |  -----   | -----   | -----  | -----  | -----  | -----  | -----  | -----  |
| typeof      | "undefined" |  "object"  | "boolean" | "number" | "string" | "symbol" | "object" | "object" | "function" |
| constructor | 报错       |  报错     | Boolean | Number | String | Symbol | Object | Array | Function |

根据上述表格可以看出 typeof 并不能准确的判断出具体的类型，所以在此我们用constructor进行判断。

``` javascript
function myFunction(param) {
    if(param.constructor === Array) {
        // ...
    } else if (param.constructor === Object) {
        // ...
    }
}
```

---

## 参考

1. [浅谈JavaScript函数重载](https://www.cnblogs.com/yugege/p/5539020.html)

---

``` javascript
function sum() {
    var len = arguments.length;
    var res = 0;
    for(var i=0; i<len; i++) {
        res += arguments[i];
    }
    return res;
}

var newSum = (function(my))
```