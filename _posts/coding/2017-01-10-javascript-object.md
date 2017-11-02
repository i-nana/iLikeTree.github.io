---
layout: post
title:  "JavaScript 对象属性遍历"
date:   2017-01-10
categories: coding
tags: [Javascript]
description: ''
---

> 在JavaScript中,遍历一个对象的属性往往没有在其他语言中遍历一个哈希(有些语言称为字典)的键那么简单.
    - JavaScript中的对象通常都处在某个原型链中,它会从一个或多个的上层原型上继承一些属性
    - JavaScript中的属性不光有值,它还有一些除了值以外的其他特性,其中一个影响属性遍历的特性就是`[[Enumerable]]`,如果该值为true,则称这个属性是可枚举的,否则反之.

### for...in

``` javascript
for (variable in object) {...}
```

`for...in`只遍历可枚举属性。

+ `for...in` 循环将迭代对象的所有可枚举属性和从它的构造函数的`prototype`继承而来的（包括被覆盖的内建属性）。像`Array`和`Object`使用内置构造函数所创建的对象都会继承自`Object.prototype`和 `String.prototype` 的不可枚举属性，例如 String 的 indexOf()  方法或者 Object 的 toString 方法。
+ __`for...in` 并不能够保证返回的是按一定顺序的索引，但是它会返回所有可枚举属性，包括非整数名称的和继承的。__
+ 如果你只要考虑对象本身的属性，而不是它的原型，那么使用 `getOwnPropertyNames()` 或执行  `hasOwnProperty()` 来确定某属性是否是对象本身的属性 (也能使用`propertyIsEnumerable`)。
    - `Object.getOwnPropertyNames(obj)` 返回一个数组，该数组对元素是 `obj` 自身拥有的枚举或不可枚举属性名称字符串。 __(ES5)__
    - `obj.propertyIsEnumerable(prop)` 方法返回一个布尔值，表明指定的属性名是否是当前对象可枚举的自身属性。
+ `for...in` 每次迭代操作会同时搜索实例或者原型属性，性能差，应该尽量避免使用该循环。

``` javascript
for (var prop in obj) {
  if( obj.hasOwnProperty( prop ) ) {
    console.log(prop +": " + obj[prop]);
  } 
}
```

``` javascript
var Test = function(){
    this.name = "Test";
}
Test.prototype.console = function(){
    console.log(this);
}
var newTest = new Test();

/*
newTest

Test
    name: "Test"
    __proto__: Object
        console: ()
            arguments: null
            caller: null
            length: 0
            name: ""
            prototype: Object
            __proto__:
                ()[[FunctionLocation]]: VM520:4
                [[Scopes]]: Scopes[1]
        constructor: ()
        __proto__: Object
*/

for(var item in newTest) {
    console.log(item + ': ' + newTest[item]);
}
/*
name: Test
console: function (){
    console.log(this);
}
*/

for(var item in newTest) {
    if( newTest.hasOwnProperty( item ) ) 
        console.log(item + ': ' + newTest[item]);
}
// name: Test

Object.getOwnPropertyNames(newTest);    // ["name"]
```

-------

### Object.keys(obj) `ES5`

`Object.keys(obj)`返回给定对象obj的所有__可枚举的自身属性__的属性名组成的数据，顺序和`for...in`循环遍历返回的顺序一致。

在ES5中，如果参数不是一个对象（原始的），会造成TypeError；在ES6中，会强制转换为一个对象。

``` javascript
Object.keys("Hello");
// ES5 - TypeError: "Hello" is not a object
// ES6 - ["0", "1", "2", "3", "4"]
```

兼容旧环境：
``` javascript
if(!Object.keys) {
    Object.keys = function(o){
        if(o !== Object(o))
        	throw new TypeError('Object.keys called on a noo-object');
        var k = [], p;
        for(p in o) {
        	if(Object.prototype.hasOwnProperty.call(o, p))
        		k.push(p);
        }
        return k;
    };
}
```
