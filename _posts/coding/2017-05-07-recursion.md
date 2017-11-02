---
layout: post
title: 递归和尾递归
date:   2017-05-07
categories: coding
tags: [JavaScript]
---

### 递归(Recursion) vs. 尾递归(Tail Recursion)

__递归__ 一个函数可以指向并调用自身(call itself)。有三种方法可以达到这个目的：
+ 函数名
+ arguments.callee
+ 作用域下的一个指向该函数的变量名

__尾递归__ 如果一个函数中所有递归形式的调用都出现在函数的末尾，我们称这个递归函数是尾递归的。当递归调用是整个函数体中最后执行的语句且它的返回值不属于表达式的一部分时，这个递归调用就是尾递归。尾递归函数的特点是在回归过程中不用做任何操作，这个特性很重要，因为大多数现代的编译器会利用这种特点自动生成优化的代码。


> 递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误。

> 递归函数就使用了堆栈：函数堆栈，一般递归需要中栈上维护函数的调用信息，直到函数返回后才释放，容易发生『栈溢出（stack overflow）』错误。但对于尾递归来说，只需要维护一个调用记录。因为进入最后一步后不再需要参考外层函数（caller）的信息，因此没必要保存外层函数的stack，递归需要用的stack只有目前这层函数的，因此避免了栈溢出风险。

``` javascript
// 递归的方式实现阶乘 n！ 最多保存n个调用记录，复杂度 O(n)。
function factorial(n) {
    return (n == 1) ? 1 : n * Rescuvie(n - 1);
}

// 尾递归的方式实现阶乘 n! 只保存1个调用记录，复杂度 O(1)。 
function factorial(n, a) {
    if(n<0){
        return 0; 
    }  else if(n==0)  {
        return 1;
    } else if(n==1) {
        return a;
    } else {
        return factorial(n-1, n* a);
    }
}

// 采用ES6的函数默认值
function factorial(n, a=1) {
    if(n <= 1) return a;
    return factorial(n-1, n*a);
}
```

---

##### 补充： 

> 来源于：__《JavaScript高级程序设计》 第五章 引用类型（P.114）__
> 定义阶乘函数一般都要用到递归算法，如上面的代码所示，在函数有名字，而且名字以后也不会变的情况下，这样定义没有问题。但问题是这个函数的执行和函数名factorial紧紧耦合在了一起。为了消除这种紧密耦合的现象，可以像下面这样使用`arguments.callee`。

``` javascript
function factorial(num) {
  if(num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}
```
> 在这个重写后的`facrorial()`函数的函数体内，没有在引用函数名`factorial`。这样，无论引用函数名时使用的什么名字，都能保证正常完成递归调用。

---

### 尾调用优化

“尾调用优化”（Tail call optimization），即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”的意义。

注意，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。

Fobonacci数列的实现

``` javascript
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};
  return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(10) // 89
Fibonacci(100) // 堆栈溢出

// 尾递归
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
  if( n <= 1 ) {return ac2};
  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}

Fibonacci2(1000) // 7.0330367711422765e+208
Fibonacci2(10000) // Infinity
```

由此可见，“尾调用优化”对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6 是如此，第一次明确规定，所有 ECMAScript 的实现，都必须部署“尾调用优化”。这就是说，ES6 中只要使用尾递归，就不会发生栈溢出，相对节省内存。

---

### 递归函数的改写

尾递归的实现，往往需要改写递归函数，确保最后一步只调用自身。做到这一点的方法，就是把所有用到的内部变量改写成函数的参数。比如上面的例子，阶乘函数 factorial 需要用到一个中间变量total，那就把这个中间变量改写成函数的参数。这样做的缺点就是不太直观，第一眼很难看出来，为什么计算5的阶乘，需要传入两个参数5和1？

#### 1. 在尾递归函数之外，再提供一个正常形式的函数

``` javascript
function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

function factorial(n) {
  return tailFactorial(n, 1);
}

factorial(5) // 120
```

#### 2. 使用 柯里化 Currying，将为递归函数变为只接受一个参数

> 柯里化（Currying），又称部分求值（Partial Evaluation），是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

函数柯里化的作用
+ 参数复用
+ 提前返回
+ 延迟计算/运行

``` javascript
function currying(fn, n) {
  return function (m) {
    return fn.call(this, m, n);
  };
}
function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}
const factorial = currying(tailFactorial, 1);

factorial(5) // 120
```

#### 3. ES6 函数默认值

``` javascript
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120
```

---

1. [MDN-JavaScript指南-函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)
2. [阮一峰-尾调用优化](http://www.ruanyifeng.com/blog/2015/04/tail-call.html)
3. [张鑫旭-JS中的柯里化（currying）](http://www.zhangxinxu.com/wordpress/2013/02/js-currying/)
4. [阮一峰-ES6入门-函数的扩展](http://es6.ruanyifeng.com/#docs/function)