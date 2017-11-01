---
layout: post
title:  Vue插件
date:   2017-08-14
categories: coding
tags: Javascript
---

## 在Vue.prototype上添加VUE实例方法

``` javascript
export default {
    install(vue, options) {
        Vue.prototype.$myMethod = function () {
            // ...
        }
    }
}
```

## 添加全局方法或者属性，比如 vue-element

``` javascript
export default {
    install(vue, options) {
        Vue.myGlobalMethod = function() {
            // ...
        }
    }
}
```

## 添加全局资源：指令/过滤器/过渡等，比如 vue-touch

``` javascript
export default {
    install(vue, options) {
        Vue.diretive('my-directive', {
            bind(el, binding, vnode, oldVnode) {
                // ...
            }
        })
    }
}
```

## 通过全局 mixin 方法添加一些组件选项，如 vuex

``` javascript
export default {
    install(vue, options) {
        Vue.mixin({
            created: function () {
                // ...
            }
        })
    }
}
```

## 封装组件为插件

插件可以封装组件，组件可以暴露数据给插件。在组件的基础上编写插件，我们会用到[Vue.extent(component)](https://cn.vuejs.org/v2/api/#Vue-extend-options)。

`Vue.extend(options)` 是Vue构造器的扩展，可以调用该方法创建一个组件构造器。`exentd` 是全局API，只能在Vue上调用。参数 `options` 是一个包含组件选项的对象。

``` javascript
// 创建构造器
var Hello = Vue.extend({
    template: '<p>Hello,{{ name }}</p>',
    data: function () {
        return {
            name: 'world'
        }
    }
})

// 创建Hello实例，并挂载到一个元素上
new Hello().$mount('#hello');
```

``` javascript
// loading.js  封装loading组件为插件
import LoadingComponent from '../components/loading.vue'

let $vm

export default {
    install(Vue, options) {
        if (!$vm) {
            const LoadingPlugin = Vue.extend(LoadingComponent);

            $vm = new LoadingPlugin({
                el: document.createElement('div')
            });

            document.body.appendChild($vm.$el);
        }

        $vm.show = false;

        let loading = {
            show(text) {
                $vm.show = true;

                $vm.text = text;
            },
            hide() {
                $vm.show = false;
            }
        };

        if (!Vue.$loading) {
            Vue.$loading = loading;
        }

        // Vue.prototype.$loading = Vue.$loading;

        Vue.mixin({
            created() {
                this.$loading = Vue.$loading;
            }
        })
    }
}
```

以上我们新建一个loading.js文件，引入我们的loading.vue组件，然后通过Vue.extend()方法创建了一个构造器LoadingPlugin，其次我们再通过new LoadingPlugin()创建了$vm实例，并挂载到一个div元素上。最后我们需要通过document.body.appendChild($vm.$el)将其插入到DOM节点中。

当我们创建了$vm实例后，我们可以访问该实例的属性和方法，比如通过$vm.show就可以改变loading组件的show值来控制其显示隐藏。

最终我们通过Vue.mixin或者Vue.prototype.$loading来全局添加了$loading事件，其又包含了show和hide两个方法。我们可以直接在页面中使用this.$loading.show()来显示加载，使用this.$loading.hide()来关闭加载。
