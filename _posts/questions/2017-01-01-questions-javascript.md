---
layout: post
title:  前端面试题目集锦-JavaScript篇
date:   2017-01-01
categories: question
tags: JavaScript
---

### 1.创建、添加、删除、移动、复制和查找节点

#### DOM（Document Object Model），文档对象模型，DOM是由节点（node）组成的节点树

+ getElementById(id)
+ getElementsByTagName(tagName)
+ getElementsByClassName(className)

```javascript
兼容老浏览器
function getElementsByClassName(node, classname){
    if(node.getElementsByClassName){
        //使用现有方法
        return node.getElementsByClassName(classname);
    }else{
        var results = new Array();
        var elems = node.getElementsByTagName("*");
        for(var i=0; i<elems.length; i++){
            if(elems[i].className.indexOf(classname) != -1){
                results[results.length] = elems[i];
            }
        }
        return results;
    }
}
```

+ getAttribute(属性名)，setAttribute(属性名,值)
+ childNodes 属性
+ nodeType 属性，共有12个值
    - 1：元素节点
    - 2：属性节点
    - 3：文本节点，可用`nodeValue`获取或者设置节点的值
+ firstChild：等价于 childNodes[0]
+ lastChild：等价于 node.childNodes[node.childNodes.length - 1]

-----

+ document.write() - 将任意字符串插入到文档中
+ document.createElement(tagName) - 创建一个元素节点
+ document.createTextNode() - 创建一个文本节点
+ document.createDocumentFragment() - 创建一个DOM片段

-----

+ 追加：parent.appendChild(child)
+ 插入：parent.insertBefore(child, oldEle)
    - 如果oldEle为null,则插入到子节点的尾部
    - 如果child已经存在DOM树中，则先会从DOM树中删除
+ 替换：parent.replaceChild(child, oldEle)
+ 复制：node.cloneNode([deep])
    - deep: 是否深度克隆，默认为true，如果为true,则该节点的所有后代节点也都会被克隆,如果为false,则只克隆该节点本身。
    - 克隆会拷贝它所有的属性、属性值以及属性上绑定的事件（如onclick），但不会拷贝使用`addEventListener()`等用Javascript __动态绑定的事件__
+ 复制：document.importNode(externalNode[, deep]) 将外部文档的节点克隆到当前文档



### 2. 数组去重

+ __indexOf__

``` javascript
let oldArr = [1, 2, 3, 5, 3, 1];
let newArr = [];
oldArr.forEach(function(item, index){
    if(newArr.indexOf(item) === -1) newArr.push(item);
});
```

+ __Object__: 利用key值筛选

``` javascript
let oldArr = [1, 2, 3, 5, 3, 1];
let newArr = [];
let obj = {};
let i = 0, len = oldArr.length;
for(; i<len; i++){
    let item = oldArr[i];
    if(!obj[item]) {
        obj[item] = 1;
        newArr.push(item);
    }
}
```

+ __ES6: Set__ —— Set对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set中的元素只会出现一次，即 Set 中的元素是唯一的。

``` javascript
let oldArr = [1, 2, 3, 5, 3, 1];
let newArr = [...new Set(arr1)];
```

### 3. 数组排序

几个经典排序算法的JavaScript实现

`sort([sortByFunction])`，按照字符编码的顺序进行排序。在元素上进行排序，不生成副本。

``` javascript
arr.sort(function(x, y){
    return y - x;   // 降序
});
```
此方法同样适用于对象数组，按照某属性的值排序

``` javascript
arr.sort(function(x, y){
    return x.attr - y.attr;   // 升序
});
```

> arr.reverse() 逆序

### 4. 不使用循环的方式实现数组前十项求和。

此题考察的是“__递归__”

``` javascript
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// 方案 一
function add(i){
    if(i > 1) {
        return arr[i-1] + add(i-1);
    } else{
        return arr[0]
    }
}

add(10);    // 55

// 方案 一 优化
function arraySum(arr, len){
    this.arr = arr;
    len = len === undefined || len > arr.length ? arr.length : len;
    this.recursion = function (i) {
        var that = this;
        if (i > 1) {
            return that.arr[i - 1] + that.recursion(i - 1);
        } else {
            return that.arr[0];
        }
    };
    return this.recursion(len);
}

arraySum(arr, 10);  // 55

// 为 Array 新增方法
Array.prototype.sum = function (len) {
    len = len === undefined || len > this.length ? this.length : len;
    this.recursion = function (i) {
        var that = this;
        if (i > 1) {
            return that[i - 1] + that.recursion(i - 1);
        } else {
            return that[0];
        }
    }
    return this.recursion(len); 
}

arr.sum(10);    // 55
```

### 5. 生成长度为100的数组，插入1-100以内的但均不重复的随机数

> 扩展阅读： [5分钟现场撸代码——谈总结会抽奖程序](https://www.h5jun.com/post/luckey-draw-in-5-minutes.html)
>
> 利用 `Array(n).fill().map(...)` 可以方便快速地构造数组：`Array(10).fill().map((_,i) => i+1); // 得到 [1,2,3,4,5,6,7,8,9,10]`

+ 方案一： 生成1-100的数组，然后随机取元素放到新数组中，并将该元素从旧数组中删除，直到旧数组变为空

``` javascript
function shuffle(num){
    var oldArr = [];
    var newArr = [];
    for(var i=0; i<num; i++){
        oldArr[i] = i + 1;
    }
    for(var j=num; j>1; j--){
        var index = parseInt(Math.random() * j);
        newArr.push(arr[index]);
        oldArr.splice(index,1);
    }
    newArr.push(arr[0]);
    return newArr;
}
```

+ 方案二：生成1-100的数组，然后乱序

``` javascript
function shuffle(num){
    var arr = [];
    for(var i=0; i<num; i++){
        arr[i] = i + 1;
    }

    arr.sort(function() {
        return 0.5 - Math.random();
    });
    return arr;
}
```

+ 方案三：生成1-100数组，然后随机取数与数组最后一位替换, 这样不需要两个数组

``` javascript
function shuffle(num){
    var arr = [];
    for(var i=0; i<num; i++){
        arr[i] = i + 1;
    }
    for(var j=0; j<num; j++){
        var index = parseInt(Math.random() * (num -j));
        var item = arr[index];
        arr[index] = arr[num - 1];
        arr[num - 1] = item;
    }
    return arr;
}
```

+ 方案四： 二叉树

``` javascript
function shuffle(start, end){
    var arr = [];
    this.randomCard = function(m, n){
        var c = n - m;
        if(c === 0) {
            arr.push(m);
            if(arr.length === end - start + 1){
                console.log(arr);
            }
        } else {
            var root = Math.round(Math.random() * c + m);
            arr.push(root);
            if(root - m > 0){
                this.randomCard(m, root-1);
            }
            if(n - root > 0 ){
                this.randomCard(root+1, n);
            }
        }
    }
    this.randomCard(start, end);
}
```

### 6. 不借助临时变量，进行两个整数替换
``` javascript
function swap(a, b){
    b = b - a;
    a = a + b;
    b = a - b;
    return [a, b]
}
```
+ 利用ES6的 解构赋值 __Destructuring assignment__：`[a, b] = [b, a]`

### 7. caller，callee，call、apply，以及bind

+ callee

在函数内部，有两个特殊的对象：`arguments`和`this`。`this`引用的是函数所在执行的环境对象。比如在全局作用域中调用函数，则该函数的this对象引用的就是window。`arguments`是一个类数组对象，包含出入函数的所有参数，它有一个名为`callee`的属性，该属性是一个指针，指向拥有这个arguments对象的函数。使用`arguments.callee()`，我们可以调用函数自身，这有利于（匿名函数的）递归或者保证函数的封装性。

比如说定义一个阶乘函数。

``` javascript
function factorial(num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

// 利用 arguments.callee() 重写
function factorial(num) {
    if(num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num - 1);
    }
}
```

利用`arguments.callee()`重写后，消除了函数名`factorial`和函数执行的紧密耦合，无论引用函数时使用的是什么名字，都能保证正常完成递归。

另外，我们还可以利用callee验证形参和实参的长度是否一致。`arguments.length`是实参的长度，`arguments.callee.length`是形参的长度。

__在函数的严格模式下，访问`arguments.callee`会导致错误。__


+ caller

`caller`是一个函数对象的属性，该属性中保存着调用当前函数的函数的引用，如果在全局作用域中调用当前函数，他的值为`null`。

``` javascript
function outer(){
	inner();
}
function inner(){
	console.log(inner.caller);
}
outer();    // 输出outer函数体
inner();    // null
```

+ call 和 apply

`call`和`apply`这两个方法都是在特定的作用域中调用函数，实际上等于设置函数体内的this对象的值。

`call`和`apply`都接收两个参数：第一个是在其中运行函数的作用域，另一个是函数参数，不同的是，`apply`的第二个参数是数组形式，`call`的第二个参数必须是逐个列举出来。

``` javascript
function sum(num1, num2) {
    return num1 + num2;
}

function applySum(num1, num2) {
    return sum.apply(this, arguments);
}

function callSum(num1, num2) {
    return sum.call(this, num1, num2);
}

applySum(1, 2);     // 3
callSum(1, 2);      // 3

```
如果用`call`或者`apply`应用另一个函数（类）后，当前的函数（类）就具备了另一个函数（类）的方法或者属性，也就是所谓的“继承”。所以，利用`call`和`apply`能够动态改变this值的特性，我们可以简单的实现继承。

``` javascript
function Person(name, age){
    console.log(arguments.callee.caller)
    this.name = name;
    this.age = age;
    this.say = function() {
        console.log(this.name + '的年龄：' + this.age);
    }
}

function Student(name, age, sexy) {
    Person.call(this, name, age);
    this.sexy = sexy;
}

var tom = new Student('Tom', 10, 'boy');
// Student构造函数中调用了Person构造函数，所以Person中的console.log会输出Student函数

tom.say();      // Tom的年龄：10
```

+ bind()

`bind()`也可以动态的改变this值，但和`apply()`和`call()`不同，这个方法会创建一个函数实例，这个函数实例的this值会被绑定到传给bind()函数的值。最主要的是，这个实例函数不会立即执行。

``` javascript
var o = { color: 'red' };
function sayColor() {
    console.log(this.color);
}

var iColor = sayColor.bind(o);
sayColor(); // undefined
iColor();   // red
```

### 8. 一次完整的HTTP事务是怎样一个过程？

+ 域名解析
+ 发起TCP的3次握手
+ 建立TCP连接后发起HTTP请求
+ 服务器端相应HTTP请求，浏览器得到HTML代码
+ 浏览器解析HTML代码，并请求HTML中的资源
+ 浏览器将页面渲染，呈现给用户

### 9. 随机生成指定长度的随机字符串

``` javascript
function randomStr(n){
	n = n ? n : 5;
	var chartsStr = '_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var len = chartsStr.length;
    var str = '';
	for(var i=0; i<n; i++){
		str += chartsStr[Math.floor(Math.random() * len)];
	}
	return str;
}
```

### 10. 函数声明 和 函数表达式 的区别

+ 函数声明

``` javascript
function functionName(){  }
```

一个函数可以在代码任意位置声明。

函数的声明的解析是在预执行（pre-execution）阶段，也就是浏览器准备执行代码的时候。因此，通过函数声明来定义函数，可以在定义前或后被调用。

+ 函数表达式

``` javascript
var functionName = function(){  }  
```

函数表达式，如同定义其它基本类型的变量一样，只在执行到某一句时也会对其进行解析。函数表达式会在执行流（ execution flow）执行到它的时候才会创建函数。所以，函数表达式必须被执行了（此时函数才定义了）才能被调用。

当使用函数声明的形式来定义函数时，可将调用语句写在函数声明之前，而后者，这样做的话会报错。

__'function' 关键字什么时候用作“表达式”，什么时候又用作“声明”？__

当js解析器看到 function 出现在main code flow，function被认为是声明。

当 function 作为语句(statement)的一部分出现的，都会是表达式。

我们可以使用函数表达式创建一个函数并马上执行它。

``` javascript
(function(){

}) ()
```

解析器会认为它是语句中的一部分，把它提升为函数表达式。

### 11. 实现一个clone函数，可以将JavaScript中的5中主要的数据类型（包括Number、String、Object、Array、Boolean）进行值复制。

``` javascript
// 递归
function clone(param){
    var o;
    switch (typeof param) {
        case 'undefined':
            break;
        case 'string':
            o = param + "";
            break;
        case 'number':
            o = param - 0;
            break;
        case 'boolean':
            o = param;
            break;
        case 'object':
            if(obj === null) {
                o = null;
            } else {
                // Object.prototype.toString.call(param) : "[object Array]"
                if(Object.prototype.toString.call(param).slice(8, -1) === "Array") {
                    o = [];
                    for(var i = 0; i < param.length; i++) {
                        o.push(param[i]);
                    }
                } else {
                    o = {};
                    for(var k in obj) {
                        o[k] = clone(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj;
    }
    return o;
}

Object.prototype.clone = function(){
    var o = this.constructor === Array ? [] : {};

    for(var e in this){
        o[e] = typeof this[e] === "object" ? this[e].clone() : this[e];
    }
    return o;
}
```

### 12. 代码如下

``` javascript
var s = "test";
s.len = 4;
console.log(s.len);
```

+ __答案__：`undefined`
+ __解析__： 只要引用了字符串属性，JavaScript就会通过调用`new String(s)`来创建一个临时对象，我们使用的`indexOf`方法和`length`属性正是来源于这个临时对象，每次使用都创建一次，然后销毁。这个临时对象就是包装对象，不只是`string`，`number`和`boolean`类型同样有包装对象。
    + 包装对象：存取字符串，数字，布尔值的属性时创建（用String(),Number(),Boolean()构造函数来创建）的临时对象称作包装对象。

``` javascript
var foo = 1;
function bar() {
    foo = 10;
    return;
    function foo() {}
}
bar();
console.log(foo);
```

+ __答案__：1
+ __解析__：函数体内`function foo() {}`变量声明提升，所以`foo=10`的`foo`是函数体内的局部变量，函数执行完毕局部变量`foo`被销毁

### 13. window对象 和 document 对象

+ BOM 的核心对象是 window，它表示浏览器的一个实例。在浏览器中， window 对象有双重角色，它既是通过 JavaScript 访问浏览器窗口的一个接口，又是 ECMAScript 规定的 Global 对象。这意味着在网页中定义的任何一个对象、变量和函数，都以 window 作为其 Global 对象，因此有权访问parseInt()等方法。

+ 

---

### 14. `XML`和`JSON`的区别？

(1).数据体积方面。

JSON相对于XML来讲，数据的体积小，传递的速度更快些。

(2).数据交互方面。

JSON与JavaScript的交互更加方便，更容易解析处理，更好的数据交互。

(3).数据描述方面。

JSON对数据的描述性比XML较差。

(4).传输速度方面。

JSON的速度要远远快于XML。

---

### cookie 和session 的区别：

+ cookie数据存放在客户的浏览器上，session数据放在服务器上。
+ cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗。考虑到安全应当使用session。
+ session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能。考虑到减轻服务器性能方面，应当使用COOKIE。
+ 单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。

---


### 谈谈你对webpack的看法

`WebPack` 是一个模块打包工具，你可以使用`WebPack`管理你的模块依赖，并编绎输出模块们所需的静态文件。它能够很好地管理、打包Web开发中所用到的`HTML、Javascript、CSS`以及各种静态文件（图片、字体等），让开发过程更加高效。对于不同类型的资源，`webpack`有对应的模块加载器。`webpack`模块打包器会分析模块间的依赖关系，最后 生成了优化且合并后的静态资源。

`webpack`的两大特色：

    1.code splitting（可以自动完成）

    2.loader 可以处理各种类型的静态文件，并且支持串联操作

`webpack` 是以` commonJS `的形式来书写脚本滴，但对 `AMD/CMD` 的支持也很全面，方便旧项目进行代码迁移。

`webpack`具有`requireJs`和`browserify`的功能，但仍有很多自己的新特性：

1. 对 CommonJS 、 AMD 、ES6的语法做了兼容
2. 对js、css、图片等资源文件都支持打包
3. 串联式模块加载器以及插件机制，让其具有更好的灵活性和扩展性，例如提供对CoffeeScript、ES6的支持
4. 有独立的配置文件webpack.config.js
5. 可以将代码切割成不同的chunk，实现按需加载，降低了初始化时间
6. 支持 SourceUrls 和 SourceMaps，易于调试
7. 具有强大的Plugin接口，大多是内部插件，使用起来比较灵活
8. webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快