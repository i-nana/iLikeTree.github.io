---
layout: post
title:  函数式编程
date:   2017-06-01
categories: coding
tags: [JavaScript]
description: ''
---

1. 什么是函数式编程

函数式编程不是用函数来编程！！！

维基百科定义：

函数式编程[Functional Programming]是一种编程模型，他将计算机运算看做是数学中函数的计算，并且避免了状态以及变量的概念。
1.1 是一种编程模型

在过去的近十年的时间里，面向对象编程大行其道。以至于在大学的教育里，老师也只会教给我们两种编程模型，即面向过程和面向对象。

孰不知，在面向对象产生之前，在面向对象思想产生之前，函数式编程已经有了数十年的历史。

说到函数式编程，人们的第一印象往往是其学院派，晦涩难懂，大概只有那些蓬头散发，不修边幅，甚至有些神经质的大学教授们才会用的编程方式。这可能在历史上的某个阶段的确如此，但是近来函数式编程已经在实际应用中发挥着巨大作用了，而更有越来越多的语言不断的加入。（Java 8必将掀起Java函数式编程热潮 ）（JAVA8 十大新特性详解）

Q1：编程模型与编程语言之间的关系？

1.2 进一步探究

数学中的函数 
初中课本中的定义：

在某一个过程中有两个变量x,y，当x在某一个范围内取一个值时，y都有唯一的值和他对应，这时，我们说x是自变量，y是x的函数（或因变量）。
一次函数： 例:     
复合函数：         
高阶函数：

在数学和计算机科学中，高阶函数是至少满足下列一个条件的函数: 
接受一个或多个函数作为输入 
输出一个函数
常见的高阶函数： 
函数复合:  
求导：  例：  
用程序来模拟求导操作：

``` javascript
var f = function(fun){  //参数fun为要求导的函数 
    var newFun = deal fun;//对传入的函数进行求导处理
    return newFun;
};
```

从数学函数得到的启发

把运算过程尽量写成一系列嵌套的函数调用

举个栗子，现在有这样一个数学表达式：(1 + 2) * 3 - 4

传统的过程式编程，可能这样写：

``` javascript
var a = 1 + 2;
var b = a * 3;
var c = b - 4;
```
使用函数式编程，我们可以把运算过程定义为不同的函数，然后写成下面这样：

var result = subtract(multiply(add(1,2), 3), 4);
再举个栗子：

//判断参数是否为偶数
var even = function(x){
    return x%2 === 0;
};
现在，想获得一个判断参数是否为奇数的函数

var not = function(fun){//将函数作为参数
    var temp = function(){//定义一个函数
        var result = fun.apply(this,arguments);//执行传入的函数
        return !result;//对结果求反
    };
    return temp;//将函数作为返回值
};
var odd = not(even);//传入一个函数 -> 加工 -> 产出新函数
高阶函数

2. 函数式编程让JavaScript更优美

2.1 函数是"第一等公民"

在 面向对象编程语言（Java，C#，C++等)中，方法(函数)只能依附于对象而存在，不是独立的，属于二等公民。而在 JavaScript 中，函数也是一种对象，并非其他任何对象的一部分。

所谓"第一等公民"（first class），指的是在JavaScript中函数与其他数据类型一样，处于平等地位。。
var sum = function(x,y){
    return x + y;
};
//检测下js中函数的类型
alert(typeof sum);
alert(sum instanceof Object);
猜测：Object具备的特性或使用的场合，函数是否也可以？

（1）都可以有构造函数

var sum = new Function('x','y','return x + y');//不推荐
alert(sum(1,2));
（2）可以进行赋值，复制操作

//先定义，后赋值
var fun = undefined; //定义
fun = function(x,y){//赋值
    alert(x + y);
};
var sum = fun;//赋值
fun = null;
sum(1,2);
fun = null;
fun(1,2);//?
sum(1,2);//?
//和普通js对象的复制相同，请自行搜索
（3）可以有自己的属性

length prototype

var sum = function(x,y,z,k){
    return x + y;
};
alert(sum.length);//期望传入的参数个数,区分于arguments.length
js内置对象arguments

var sum = function(x,y){
    console.log(arguments);
    console.log('arguments.length=' + arguments.length);
    return x + y;
};
sum(1,2);
sum(1,2,3,4);
console.log(sum.length);
T:arguments是类数组对象，保存着传入函数的所有参数
  函数自身的属性length，等于函数定义时的参数个数
//一个应用,不定参数
var sum = function(){
    var i = 0,
        len = arguments.length,
        total = 0;
    for(;i<len;i++){
        total += arguments[i]; //像数组一样取用传入的参数
    }
    return total;
}
alert(sum(1,2));
alert(sum(1,2,3));
函数的另一个属性

console.log(sum.prototype);//原型对象
（4）不具备重载 
重载的条件：参数个数不同||参数类型不同

  function f(x,y){
    alert(2);
  };
 function f(x,y,x){
   alert(3);
  };
  f(1,2);
  f(1,2,3)
模拟重载

//jQuery中的模拟重载
$obj.val();
$obj.val('sss');
//如果不传参数，就返回当前月份；
//传参，则但会参数日期的月份
function getMonth(){
   var len = arguments.length;
   if(len===0)
        return new Date().getMonth() + 1;
    else 
        return new Date(arguments[0]).getMonth() + 1;
};
getMonth();
getMonth('2014-09-11');
（5）可以有自己的方法 
函数拥有的方法：call() apply() bind() toString()

call( ) 和 apply( ) 作用： 
都是在特定作用域内调用函数，实际上等于设定函数体内this的值：
apply方法接收两个参数：一个是在其中运行的作用域,另一个是参数对象（数组或arguments）

传递参数

var add = function(x,y){
    return x + y;
}; 
var mul = function(x,y){
    return x * y;
};
//基本运算的通用方法
//fun 传入的函数，指明进行的运算
//x,y要进行运算的数字
var cal = function(fun,x,y){
    return fun.apply(this,[x,y]);
    //return fun.apply(this,arguments);也可以
};
alert(cal(add,1,2));
alert(cal(mul,1,2));
扩充函数赖以运行的作用域

var say = function(){
    alert(this.name);
};
var name = 'ha,我是window对象！'; //js的全局变量是window对象的属性
var obj = {name: 'hi，我是object!'};
say();
say.apply(window);
say.apply(obj);
bind方法

回想下jQuery中的bind用法

js函数的bind方法

var sayObj = say.bind(obj);
sayObj();
（4）作为参数

（5）作为返回值

2.2 使用高阶函数

至少满足下列一个条件:
接受一个或多个函数作为输入
输出一个函数
2.3 闭包

闭包是函数式编程的挚友。

闭包是指有权访问另一个函数作用域中的变量的函数。
var sum = function(){
    var x = 1;
    alert('我来自sum,x = ' + x);
    var add = function(){
        x = x + 1;//x属于sum作用域内的变量
        alert('我来自add,x = ' + x);
    };
    return add;
};
var f = sum();
f();
sum();
f();
f();
闭包的另一个作用就是让父函数变量的值始终保持在内存中。

如果内部函数引用了位于外部函数的变量,当外部函数调用完毕后,这些变量在内存不会被 释放,因为闭包需要它们.

简单的说，闭包就是内部函数一直拥有父函数作用域的访问权限，即使父函数已经返回。

进一步理解闭包 
闭包内的微观世界

2.2 匿名函数

在函数式编程语言中，函数是可以没有名字的，匿名函数通常表示：“可以完成某件事的一块代码”。这种表达在很多场合是有用的，因为我们有时需要用函数完成某件事，但是这个函数可能只是临时性的，那就没有理由专门为其生成一个顶层的函数对象。

$('#btn').click(functin(){
    //所做处理
});
//使用匿名函数防止造成全局变量的污染
(function(){
    //要写的代码
})();
(alert)(11111);//函数表达式可以编写并放在括号中
2.5 函数柯里化

柯里化是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

function adder(num,x){
    return num + x;
}
//-------------------------
function adder(num){ 
  return function (x){ 
     return num + x; 
    } 
} 
var add5 = adder(5); 
var add6 = adder(6); 
print(add5(1)); 
print(add6(1));
进一步学习理解：JS中的柯里化(currying)

2.6 不完全函数

一种函数变幻技巧，即把一次完整的函数调用拆分为多次函数调用，每次传入的实参都是完整实参的一部分，每个拆分开的函数叫做不完全函数，每次函数调用叫做不完全调用。特点：每次函数调用都返回一个函数，直到得到最终运行结果为止。
例如：
f(1,2,3,4,5,6)的调用修改为等价的f(1,2)(3,4)(5,6)
2.7 记忆函数

将上次计算的结果缓存起来，是函数式编程中的一种缓存技巧。

var f = function (n) { 
    return n < 2 ? n : f(n - 1) + f(n - 2); 
};
恐怕数字一大浏览器就会崩掉了，因为运算过程中函数会有大量重复的计算。但 JavaScript 强大的数组和函数闭包可以轻松实现对已计算的结果记忆。运算速度会有指数级的提高。

2.8 函数式编程让JavaScript更优美

浅谈面向对象编程与函数式编程 
面向对象编程的思想是把所有的事物都当做对象来看待，任何事物皆对象。

对于大多数的自然界事物，都是可以抽象出来一个具体的对象，在具体化对象的属性和行为。这种编程思想和人类的认知具体事物的方式非常接近，所以面向对象的方法一直流行了20几年。

但并不是世界上所有的事物都适合用对象来表示，最常见的就是数学中的科学计算和逻辑运算。

函数式和面向对象的本质都是“道法自然”。如果说，面向对象是一种真实世界的模拟的话，那么函数式就是数学世界的模拟，从某种意义上说，它的抽象程度比面向对象更高，因为数学系统本来就具有自然界所无法比拟的抽象性。
让js更优美

布兰登·艾奇（Brendan Eich）当初设计js的思路：

（1）借鉴C语言的基本语法； 
（2）借鉴Java语言的数据类型和内存管理； 
（3）借鉴Scheme语言，将函数提升到"第一等公民"（first class）的地位； 
（4）借鉴Self语言，使用基于原型（prototype）的继承机制。
所以，Javascript语言实际上是两种语言风格的混合产物----（简化的）函数式编程+（简化的）面向对象编程。

面向对象和函数式编程结合起来，我们在编程中可以灵活选择合适的模型，有利于易于扩展的和可读的代码。