---
layout: post
title:  从JavaScript属性描述器剖析Vue.js响应式视图
date:   2017-06-12
categories: coding
tags: [JavaScript, vue]
description: ''
---

> (从JavaScript属性描述器剖析Vue.js响应式视图)[http://blog.codingplayboy.com/2017/06/09/js_reactive_dom/]
> 作者：熊建刚 2017-06-09

### 定义对象属性

#### Object.defineProperty(obj, prop, descriptor)

`Object.defineProperty()`方法可以在对象上定义一个新的属性或者修改已经存在的属性，返回该对象。

参数`descriptor`是一个属性描述对象，它的属性值如下：
- `configurable`: 默认 false __Both__
- `enumerable`: 默认 false __Both__
- `writable`: 默认 false __A data descriptor__
- `value`: 默认 undefined __A data descriptor__
- 存取器函数(getter/setter) __An accessor descriptor__
    + `get`: 给属性提供`getter`方法，默认 undefined
    + `set`: 给属性提供`setter`方法，默认 undefined

__注：当设置了存取器描述时，不能设置value和writable描述。__

> Uncaught TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, `#<Object>`


``` javascript
let alice = { name: 'Alice'}

Object.defineProperty(alice, 'age', {
    value: 10,
    enumerable : true,
    configurable : true,
    writable: true
});     // 返回 Object {name: "Alice", age: 10}
```

``` javascript
let bob = {};
Object.defineProperty(bob, 'age', {
    get: function(){
        return this.age + '岁';
    },
    set: function(num){
        return num;
    }
});
bob.age = 12;   // 12
bob.age;  // 会报错，执行栈溢出。 如下
/* Uncaught RangeError: Maximum call stack size exceeded
    at Object.get (<anonymous>:4:20)
    at Object.get (<anonymous>:4:20)
    at Object.get (<anonymous>:4:20)
    at Object.get (<anonymous>:4:20)
    at Object.get (<anonymous>:4:20)
    at Object.get (<anonymous>:4:20)
    at Object.get (<anonymous>:4:20)
    at Object.get (<anonymous>:4:20)
    at Object.get (<anonymous>:4:20)
    at Object.get (<anonymous>:4:20)
*/
```

在上述代码中，获取age的属性值时，会在该方法内再次获取`this.age`。事实上，在使用defineProperty()方法设置属性时，通常需要在对象内部维护一个新内部变量（以下划线_开头，表示不希望被外部访问），作为存取器函数的中介。

``` javascript
Object.defineProperty(bob, 'age', {
    set: function(num) {
        this._age = num;
    },
    get: function() {
        return this._age;
    }
});
```

`obj.propertyIsEnumerable(prop)`：可获取属性是否可枚举

--- 

#### Object.defineProperties(obj, props)

`Object.defineProperties(obj, props)` 批量修改属性

### 属性描述与视图模型绑定

#### 数据视图单向绑定

现有如下代码：

``` javascript
var data = {};
var contentEl = document.querySelector('.content');

Object.defineProperty(data, 'text', {
    writable: true,
    configurable: true,
    enumerable: true,
    get: function() {
        return contentEl.innerHTML;
    },
    set: function(val) {
        contentEl.innerHTML = val;
    }
});
```

很容易看出，当我们设置data对象的`text`属性时，会将该值设置为视图DOM元素的内容，而访问该属性值时，返回的是视图DOM元素的内容，这就简单的实现了数据到视图的单向绑定，即数据变更，视图也会更新。

以上仅是针对一个元素的数据视图绑定，但稍微有经验的开发者便可以根据以上思路，进行封装，很容易的实现一个简易的数据到视图单向绑定的工具类。

#### 抽象封装

接下来对以上实例进行简单抽象封装，首先声明数据结构：

``` javascript
window.data = {
    title: '数据视图单向绑定',
    content: '使用属性描述器实现数据视图绑定',
    count: 0
};
var attr = 'data-on'; // 约定好的语法，声明DOM绑定对象属性
```

然后封装函数批量处理对象，遍历对象属性，设置描述对象同时为属性注册变更时的回调：

``` javascript
// 为对象中每一个属性设置描述对象，尤其是存取器函数
function defineDescriptors(obj) {
    for (var key in obj) {
        // 遍历属性
        defineDescriptor(obj, key, obj[key]);
    }

    // 为特定属性设置描述对象
    function defineDescriptor(obj, key, val) {
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                    var value = val;
                    return value;
            },
            set: function(newVal) {
                    if (newVal !== val) {
                        // 值发生变更才执行
                        val = newVal;
                        Observer.emit(key, newVal); // 触发更新DOM
                    }
            }
        });
        Observer.subscribe(key); // 为该属性注册回调
    }
}
```

#### 管理事件

以发布订阅模式管理属性变更事件及回调：

``` javascript
// 使用发布/订阅模式，集中管理监控和触发回调事件
var Observer = {
    watchers: {},
    subscribe: function(key) {
        var el = document.querySelector('[' + attr + '="'+ key + '"]');

        // demo
        var cb = function react(val) {
            el.innerHTML = val;
        }

        if (this.watchers[key]) {
            this.watchers[key].push(cb);
        } else {
            this.watchers[key] = [].concat(cb);
        }
    },
    emit: function(key, val) {
        var len = this.watchers[key] && this.watchers[key].length;

        if (len && len > 0) {
            for(var i = 0; i < len; i++) {
                this.watchers[key][i](val);
            }
        }
    }
};  
```

#### 初始化实例

最后初始化实例：

``` javascript
// 初始化demo
function init() {
    defineDescriptors(data); // 处理数据对象
    var eles = document.querySelectorAll('[' + attr + ']');

    // 初始遍历DOM展示数据
    // 其实可以将该操作放到属性描述对象的get方法内，则在初始化时只需要对属性遍历访问即可
    for (var i = 0, len = eles.length; i < len; i++) {
        eles[i].innerHTML = data[eles[i].getAttribute(attr)];
    }

    // 辅助测试实例
    document.querySelector('.add').addEventListener('click', function(e) {
        data.count += 1;
    });

}
init(); 
```

html代码参考如下：

``` html
<h2 class="title" data-on="title"></h2>
<div class="content" data-on="content"></div>
<div class="count" data-on="count"></div>
<div>
    请输入内容：
    <input type="text" class="content-input" placeholder="请输入内容">
</div>
<button class="add" onclick="">加1</button>
```

### Vue.js的响应式原理

上一节实现了一个简单的数据视图单向绑定实例，现在对Vue.js的响应式单向绑定进行简要分析，主要需要理解其如何追踪数据变更。

#### 依赖追踪

Vue.js支持我们通过`data`参数传递一个JavaScript对象做为组件数据，然后Vue.js将遍历此对象属性，使用`Object.defineProperty`方法设置描述对象，通过存取器函数可以追踪该属性的变更，本质原理和上一节实例差不多，但是不同的是，Vue.js创建了一层`Watcher`层，在组件渲染的过程中把属性记录为依赖，之后当依赖项的`setter`被调用时，会通知`Watcher`重新计算，从而使它关联的组件得以更新,如下图：

![Vue.js响应式原理图](http://blog.codingplayboy.com/wp-content/uploads/2017/06/vue-reactive.png)

组件挂载时，实例化`watcher`实例，并把该实例传递给依赖管理类，组件渲染时，使用对象观察接口遍历传入的data对象，为每个属性创建一个依赖管理实例并设置属性描述对象，在存取器函数get函数中，依赖管理实例添加（记录）该属性为一个依赖，然后当该依赖变更时，触发set函数，在该函数内通知依赖管理实例，依赖管理实例分发该变更给其内存储的所有`watcher`实例，`watcher`实例重新计算，更新组件。

> 因此可以总结说Vue.js的响应式原理是**依赖追踪**，通过一个观察对象，为每个属性，设置存取器函数并注册一个依赖管理实例`dep`，`dep`内为每个组件实例维护一个`watcher`实例，在属性变更时，通过setter通知`dep`实例,`dep`实例分发该变更给每一个`watcher`实例，`watcher`实例各自计算更新组件实例，即`watcher`追踪`dep`添加的依赖，`Object.defineProperty()`方法提供这种追踪的技术支持，`dep`实例维护这种追踪关系。

#### 源码简单分析

接下来对Vue.js源码进行简单分析，从对JavaScript对象和属性的处理开始：

##### 观察对象（Observer）

首先，Vue.js也提供了一个抽象接口观察对象，为对象属性设置存储器函数，收集属性依赖然后分发依赖更新：

``` javascript
var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep(); // 管理对象依赖
    this.vmCount = 0;
    def(value, '__ob__', this); // 缓存处理的对象，标记该对象已处理
    if (Array.isArray(value)) {
        var augment = hasProto
        ? protoAugment
        : copyAugment;
        augment(value, arrayMethods, arrayKeys);
        this.observeArray(value);
    } else {
        this.walk(value);
    }
};
```

上面代码关注两个节点，`this.observeArray(value)`和`this.walk(value);`：

1.  若为对象，则调用`walk()`方法，遍历该对象属性，将属性转换为响应式：

``` javascript
Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        defineReactive$1(obj, keys[i], obj[keys[i]]);
    }
};
```

可以看到，最终设置属性描述对象是通过调用`defineReactive$1()`方法。

2.  若value为对象数组，则需要额外处理，调用`observeArray()`方法对每一个对象均产生一个`Observer`实例，遍历监听该对象属性：

``` javascript
Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
        observe(items[i]);
    }
};
```

核心是为每个数组项调用`observe`函数：

``` javascript
function observe(value, asRootData) {
    if (!isObject(value)) {
        return // 只需要处理对象
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__; // 处理过的则直接读取缓存
    } else if (
        observerState.shouldConvert &&
        !isServerRendering() &&
        (Array.isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value._isVue) {
        ob = new Observer(value); // 处理该对象
    }
    if (asRootData && ob) {
        ob.vmCount++;
    }
    return ob
}
```

调用`ob = new Observer(value);`后就回到第一种情况的结果：调用`defineReactive$1()`方法生成响应式属性。

##### 生成响应式属性

源码如下：

``` javascript
function defineReactive$1 (obj,key,val,customSetter) {
    var dep = new Dep(); // 管理属性依赖

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return
    }

    // 之前已经设置了的get/set需要合并调用
    var getter = property && property.get; 
    var setter = property && property.set;

    var childOb = observe(val); // 属性值也可能是对象，需要递归观察处理
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
            var value = getter ? getter.call(obj) : val;
            if (Dep.target) { // 管理依赖对象存在指向的watcher实例
                dep.depend(); // 添加依赖（记录）
                if (childOb) { // 属性值为对象
                    childOb.dep.depend(); // 属性值对象也需要添加依赖
                }
                if (Array.isArray(value)) {
                    dependArray(value); // 处理数组
                }
            }
            return value
        },
        set: function reactiveSetter (newVal) {
            var value = getter ? getter.call(obj) : val;
            /* eslint-disable no-self-compare */
            if (newVal === value || (newVal !== newVal && value !== value)) {
            return // 未发生变更不需要往后执行
            }
            /* eslint-enable no-self-compare */
            if ("development" !== 'production' && customSetter) {
                customSetter();
            }
            if (setter) {
                setter.call(obj, newVal); // 更新属性值
            } else {
                val = newVal; // 更新属性值
            }
            childOb = observe(newVal); // 每次值变更时需要重新观察，因为可能值为对象
            dep.notify(); // 发布更新事件
        }
    });
}
```

该方法使用`Object.defineProperty()`方法设置属性描述对象，逻辑集中在属性存取器函数内：

1.  get: 返回属性值，如果`watcher`存在，则递归记录依赖；
2.  set: 属性值发生变更时，更新属性值，并调用`dep.notify()`方法发布更新事件；

##### 管理依赖

Vue.js需要管理对象的依赖，在属性更新时通知`watcher`更新组件，进而更新视图，Vue.js管理依赖接口采用发布订阅模式实现，源码如下：

``` javascript
var uid$1 = 0;
var Dep = function Dep () {
    this.id = uid$1++; // 依赖管理实例id
    this.subs = []; // 订阅该依赖管理实例的watcher实例数组
};
Dep.prototype.depend = function depend () { // 添加依赖
    if (Dep.target) {
        Dep.target.addDep(this); // 调用watcher实例方法订阅此依赖管理实例
    }
};
Dep.target = null; // watcher实例
var targetStack = []; // 维护watcher实例栈

function pushTarget (_target) {
    if (Dep.target) { targetStack.push(Dep.target); }
    Dep.target = _target; // 初始化Dep指向的watcher实例
}

function popTarget () {
    Dep.target = targetStack.pop();
}
```

##### 订阅

如之前，生成响应式属性为属性设置存取器函数时，get函数内调用`dep.depend()`方法添加依赖，该方法内调用`Dep.target.addDep(this);`，即调用指向的`watcher`实例的`addDep`方法，订阅此依赖管理实例：

``` javascript
Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) { // 是否已订阅
        this.newDepIds.add(id); // watcher实例维护的依赖管理实例id集合
        this.newDeps.push(dep); // watcher实例维护的依赖管理实例数组
        if (!this.depIds.has(id)) { // watcher实例维护的依赖管理实例id集合
            // 调用传递过来的依赖管理实例方法，添加此watcher实例为订阅者
            dep.addSub(this); 
        }
    }
};
```

`watcher`实例可能同时追踪多个属性（即订阅多个依赖管理实例），所以需要维护一个数组，存储多个订阅的依赖管理实例，同时记录每一个实例的id，便于判断是否已订阅，而后调用依赖管理实例的`addSub`方法：

``` javascript
Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub); // 实现watcher到依赖管理实例的订阅关系
};
```

该方法只是简单的在订阅数组内添加一个订阅该依赖管理实例的`watcher`实例。

##### 发布

属性变更时，在属性的存取器set函数内调用了`dep.notify()`方法，发布此属性变更：

``` javascript
Dep.prototype.notify = function notify () {
    // 复制订阅者数组
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update(); // 分发变更
    }
};
```

##### 触发更新

前面提到，Vue.js中由`watcher`层追踪依赖变更，发生变更时，通知组件更新：

``` javascript
Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
        this.dirty = true;
    } else if (this.sync) { // 同步
        this.run();
    } else { // 异步
        queueWatcher(this); // 最后也是调用run()方法
    }
};
```

调用`run`方法，通知组件更新：

``` javascript
Watcher.prototype.run = function run () {
    if (this.active) {
        var value = this.get(); // 获取新属性值
        if (value !== this.value || // 若值
            isObject(value) || this.deep) {
            var oldValue = this.value; // 缓存旧值
            this.value = value; // 设置新值
            if (this.user) {
                try {
                    this.cb.call(this.vm, value, oldValue);
                } catch (e) {
                    handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
                }
            } else {
                this.cb.call(this.vm, value, oldValue);
            }
        }
    }
};
```

调用`this.get()`方法，实际上，后面会看到在该方法内处理了属性值的更新与组件的更新，这里判断当属性变更时调用初始化时传给实例的`cb`回调函数，并且回调函数接受属性新旧值两个参数，此回调通常是对于`watch`声明的监听属性才会存在，否则默认为空函数。

##### 追踪依赖接口实例化

每一个响应式属性都是由一个`Watcher`实例追踪其变更，而针对不同属性（data, computed, watch），Vue.js进行了一些差异处理，如下是接口主要逻辑：

``` javascript
var Watcher = function Watcher (vm,expOrFn,cb,options) {
    this.cb = cb;
    ...
    // parse expression for getter
    if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
    } else {
        this.getter = parsePath(expOrFn);
    }
    this.value = this.lazy
        ? undefined
        : this.get();
};
```

在初始化`Watcher`实例时，会解析`expOrFn`参数（表达式或者函数）成拓展getter`this.getter`，然后调用`this.get（）`方法，返回值作为`this.value`值：
 
``` javascript
Watcher.prototype.get = function get () {
    pushTarget(this); // 入栈watcher实例
    var value;
    var vm = this.vm;
    if (this.user) {
        try {
            value = this.getter.call(vm, vm); // 通过this.getter获取新值
        } catch (e) {
            handleError(e, vm, ("getter for watcher \"" +
(this.expression) + "\""));
        }
    } else {
        value = this.getter.call(vm, vm); // 通过this.getter获取新值
    }

    if (this.deep) { // 深度递归遍历对象追踪依赖
        traverse(value);
    }
    popTarget(); // 出栈watcher实例
    this.cleanupDeps(); // 清空缓存依赖
    return value // 返回新值
};
```

这里需要注意的是对于`data`属性，而非`computed`属性或`watch`属性，而言，其`watcher`实例的`this.getter`通常就是`updateComponent`函数，即渲染更新组件，`get`方法返回undefined，而对于`computed`计算属性而言，会传入对应指定函数给`this.getter`，其返回值就是此`get`方法返回值。

##### data普通属性

Vue.js data属性是一个对象，需要调用对象观察接口`new Observer(value)`：

``` javascript
function observe (value, asRootData) {
    if (!isObject(value)) {
        return
    }
    var ob;
    ob = new Observer(value); // 对象观察实例
    return ob;
}

// 初始处理data属性
function initData (vm) {
    // 调用observe函数
    observe(data, true /* asRootData */);
}
```

##### 计算属性

Vue.js对计算属性处理是有差异的，它是一个变量，可以直接调用`Watcher`接口，把其属性指定的计算规则传递为，属性的拓展`getter`，即：

``` javascript
// 初始处理computed计算属性
function initComputed (vm, computed) {
    for (var key in computed) {
        var userDef = computed[key]; // 对应的计算规则
        // 传递给watcher实例的this.getter -- 拓展getter
        var getter = typeof userDef === 'function' ? 
            userDef : userDef.get; 
        watchers[key] = new Watcher(vm, 
            getter, noop, computedWatcherOptions);
    }
}
```

##### <span id="watch">watch属性</span>

而对于watch属性又有不同，该属性是变量或表达式，而且与计算属性不同的是，它需要指定一个变更事件发生后的回调函数：

``` javascript
function initWatch (vm, watch) {
    for (var key in watch) {
        var handler = watch[key];
        createWatcher(vm, key, handler[i]); // 传递回调
    }
}
function createWatcher (vm, key, handler) {
    vm.$watch(key, handler, options); // 回调
}
Vue.prototype.$watch = function (expOrFn, cb, options) {
    // 实例化watcher，并传递回调
    var watcher = new Watcher(vm, expOrFn, cb, options);
}
```

##### 初始化Watcher与依赖管理接口的连接

无论哪种属性最后都是由`watcher`接口实现追踪依赖，而且组件在挂载时，即会初始化一次`Watcher`实例，绑定到`Dep.target`，也就是将`Watcher`和`Dep`建立连接，如此在组件渲染时才能对属性依赖进行追踪：

``` javascript
function mountComponent (vm, el, hydrating) {
    ...
    updateComponent = function () {
        vm._update(vm._render(), hydrating);
        ...
    };
    ...
    vm._watcher = new Watcher(vm, updateComponent, noop);
    ...
}

```

如上，传递`updateComponent`方法给`watcher`实例，该方法内触发组件实例的`vm._render()`渲染方法，触发组件更新，此`mountComponent()`方法会在`$mount()`挂载组件公开方法中调用：

``` javascript
// public mount method
Vue$3.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
};

```
---

### 总结

到此为止，对于JavaScript属性描述器接口的介绍及其应用，还有其在Vue.js中的响应式实践原理基本阐述完了，这次总结从原理到应用，再到实践剖析，花费比较多精力，但是收获是成正比的，不仅对JavaScript基础有更深的理解，还更熟悉了Vue.js响应式的设计原理，对其源码熟悉度也有较大提升，之后在工作和学习过程中，会进行更多的总结分享。

### 参考

1.  [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
2.  [Vue.js Reactivity in Depth](https://vuejs.org/v2/guide/reactivity.html)
3.  [Object Initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
