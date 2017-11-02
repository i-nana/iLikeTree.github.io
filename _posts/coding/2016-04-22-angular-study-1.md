---
layout: post
title: Angular
tags: [Angular, JavaScript]
date:   2016-04-22
categories: code
---

- 目录
{:toc}

### AngularJS 简介

AngularJS 是一个JavaScript框架，最为核心的是：MVVM、模块化、自动化双向数据绑定、语义化标签、依赖注入等。它通过使用<b>指令（directive）</b>扩展了HTML，并通过表达式绑定数据到HTML。


### AngularJS 表达式

AngularJS 表达式写在双大括号内： `\{\{\}\}`，与 ng-bind 指令的作用相同。
`\{\{\}\}` 内可以包含文字、运算符和变量。

<b>AngularJS 表达式 和 JavaScript表达式 的异同</b>：两者均可以包含字母、操作符和变量，但是AngularJS表达式可以写在HTML中，它虽然不支持条件判断、循环和异常，但是它支持过滤器。

### AngularJS 通过 <b>ng-directives</b> 扩展了HTML

- <em>ng-app</em> 定义一个AngularJS应用程序的根元素。

    一个网页中可以包含多个运行在不同元素中的AngularJS应用程序。<b>ng-app</b>在网页加载完毕时会自动初始化应用程序。
    
- <em>ng-controller</em> 定义了应用程序控制器。控制器是 JavaScript 对象，由标准的 JavaScript 对象的构造函数创建，他可以有自己的属性和方法。<b>AngularJS使用$cope对象来调用控制器</b>
   
- <em>ng-model</em> 把元素值绑定到应用程序，数据绑定，除此之外，还可以：
    + 类型验证 (number、email、required)
    + 提供状态 (invalid、dirty、touched、error)
    + 为HTML元素提供CSS类
    + 绑定HTML元素到HTML表单
    
- <em>ng-bind</em> 把应用程序数据绑定到HTML视图（不是很常见）
- <em>ng-init</em> 初始化 AngularJS 应用程序变量，通常使用一个控制器或者模块替代它。
- <em>ng-repeat</em> 重复一个HTML元素，可以用来循环数组（包括对象数组）
- <em>自定义指令</em> 使用<b>.directive</b> 函数创建自定义指令;调用时需要在HTML元素上添加自定义指令名。
    
    调用指令可以通过：<b>元素名、属性、类名和注释</b>。
    
    注：必须设置 restrict 的值为 "C" 才能通过类名来调用指令；必须设置 restrict 的值为 "M" 并且添加 “replace: true”才能通过注释来调用指令。
        
        <body ng-app="myApp">
            <runoob-directive></runoob-directive>
            <div runoob-directive></div>
            <div class="runoob-directive"></div>
            <!-- directive：runoob-directive -->
            
            <script>
                var app = angular.module("myApp", []);
                app.directive("runoobDirective", function() {
                    return {
                        // 限制使用，A-只限属性使用，C-类名使用，E-元素名使用，M-注释使用
                        restrict: 'M',     
                        replace: true,      // 通过注释调用指令时
                        template : "<h1>自定义指令!</h1>"
                    };
                });
            </script>
        </body>
  
    
> AngularJS完美支持数据库的CRUD（增读改删）


---

## AngularJS 应用

### 模板（Templates）

模板指的是HTML和CSS文件，应用的视图。

### 应用程序逻辑（Logic）和行为（Behavior）

应用程序逻辑和行为指的是用JS定义的控制器。在AngularJS中已经内置了侦听器和DOM控制器，这使得应用程序的逻辑更容易编写、测试、维护和理解。

### 模型数据（Data）
模型是从AngularJS作用域对象的属性引申的。AngularJS通过作用域来保持数据模型和师徒界面UI的双向同步。（数据的双向绑定）

---

## AngularJS <em>ng-model</em>指令

<em>ng-model</em>: 将输入域(input, select, textarea)的值与AngularJS创建的变量绑定。

### 1. 双向绑定

修改输入域的值的时候，AngularJS属性的值也会相应改变。

``` html
<div ng-app="myApp" ng-controller="myCtrl">
    Your Name: <input type="text" ng-model="name" placeholder="world">
    Hello { { yourname || 'World' }}!
</div>
<script>
    var app = angular.module("myApp", []);
    app.controller('myCtrl', function($scope){
        $scope.name = "Rabbit";
    })
</script>
```

### 2. 验证用户输入

### 3. 应用状态

ng-model 指令可以为应用数据提供状态值(invalid, dirty, touched, error)。

``` html
<form ng-app="" name="myForm" ng-init="myText = 'test@qq.com'">
    Email: <input type="email" name="myAddress" ng-model="myText" required>
    <p ng-show="myForm.myAddress.$error.email">这不是一个合法的邮箱地址</p>
    <h1>状态</h1>
    <p>Valid: { { myForm.myAddress.$valid }} (如果输入的值是合法的则为 true)。</p>
    <p>Dirty: { { myForm.myAddress.$dirty }} (如果值改变则为 true)。</p>
    <p>Touched: { { myForm.myAddress.$touched }} (如果通过触屏点击则为 true)。</p>
</form>
```

### 4. CSS类

<em>ng-model</em> 可以根据表单域的状态 添加/移除 以下类：<em>ng-empty</em>、<em>ng-not-empty</em>、<em>ng-touched</em>、<em>ng-untouched</em>、<em>ng-valid</em>、<em>ng-invalid</em>、<em>ng-dirty</em>、<em>ng-pending</em>、<em>ng-pristine</em>

---

## AngularJs Scope 作用域

Scope(作用域) 是视图和控制器之间的纽带，它是一个对象，带有属性和方法，这些属性和方法可以在视图和控制器中使用。所有的应用都有一个 <em>$rootScope</em>(根作用域)。

<b>AngularJS 使用$scope 对象来调用控制器</b>

``` javascript
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $rootScope) {
    $scope.names = ["Emil", "Tobias", "Linus"];
    $rootScope.lastname = "Refsnes";
});
```
---

## 过滤器

过滤器可以使用一个<em>管道字符（|）</em>添加到表达式和指令中。

+ <em>currency</em> - 格式化数字为货币格式
+ <em>filter</em> - 从数组项中选择一个子集
+ <em>orserBy</em> - 根据某个表达式排列数组
+ <em>lowercase</em> - 格式化字符串为小写
+ <em>uppercase</em> - 格式化字符串为大写

``` html
<div ng-app="myApp" ng-controller="namesCtrl">
<p><input type="text" ng-model="test"></p>
<ul>
  <li ng-repeat="x in names | filter:test | orderBy:'country'">
    { { (x.name | uppercase) + ', ' + x.country }}
  </li>
</ul>
</div>
```

---

## AngularJs 服务

在AngularJS中，服务是一个函数或者对象。

### <b>$location</b>

<img src="{{site.baseUrl}}/assets/images/angular/hashbang_vs_regular_url.jpg">

方法：

* <em>absUrl()</em> 只读，返回 “ http://foo.com/bar?baz=23#baz ”
* <em>protocol()</em> 只读，返回“http”
* <em>host()</em> 只读，返回当前URL的host: “ foo.com ”
* <em>port()</em> 只读，返回当前URL的port(Number类型): 80
* <em>url([url])</em> 不传参的时候，返回 “ /bar?baz=23#baz ”; 传参<b>/path?a=b#hash</b>的时候修改URL，返回 $location(完整路径)
* <em>hash([hash])</em> 不传参的时候返回hash：“ #baz ”
* <em>path([path])</em> 修改路径，返回新path值
* <em>search(search, [paramValue])</em> 
    + 不传参返回search对象：{'bar':'23'}; 
    + 传参的时候，
        1. $location.search('baz'); // {'baz', true}; 
        2. $location.search('baz', null) // search中删除bar
        3. $location.search('baz', 'abc'); 或者  $location.search({'baz':'abc'}); // {'baz', 'abc'}; 
        4. $location.search('name', false) // {'baz':'abc', 'name':false} （url：/bar?baz=abc&name=false#baz）
        5. $location.search('name', true) // {'baz':'abc', 'name':true} （url：/bar?baz=abc&name#baz）
        6. $location.search( 数字或者字符串 )  // {数字或者字符串： true}，url的search将会被传的参数替代
* <em>replace()</em> If called, all changes to $location during current $digest will be replacing current history record, instead of adding new one.
* <em>state([state]</em>

事件

* <em>locationChangeStart</em>
* <em>locationChangeSuccess</em>
