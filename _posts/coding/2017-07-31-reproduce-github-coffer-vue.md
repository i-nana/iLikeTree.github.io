---
layout: post
title:  VUE ✿ 使用webpack构建多页面应用
date:   2017-07-31
categories: coding
tags: javascript vue
description: 
---

> 转载自[「github-coffer」使用webpack构建多页面应用](https://github.com/Coffcer/Blog/issues/1)

关于webpack的配置和使用，网上已经有许多文章了，大多是在讲单页应用，当我们需要打包多个html时，事情就变得麻烦起来。怎么在webpack-dev-server里使用路由？怎么打包多个html和js并自动更新md5？本文讲的就是如何解决这些问题。

> 这里假设你对Webpack已经有最基础的了解

# 需求

来看下我们的需求:

1.  使用webpack-dev-server做开发时的服务器
2.  在webpack-dev-server里使用路由，访问/a时候显示a.html，/b显示b.html
3.  打包成多个html，给其中引用到资源加md5戳

# 主要目录结构

    ├── src                       
    │   └── views                 # 每一个文件夹对应一个页面
    │       └── a                 
    │           └── index.js
    │       └── b                 
    │           └── index.js
    ├── output                    # 打包输出的目录
    |   └── ...
    └── template.html             # 将根据这个模版，生成各个页面的html
    └── webpack.config.js
    └── dev-server.js             # webpack-dev-server + express       

只列出了主要的目录，这里我们根据一个template.html来生成多个页面的html，他们之间只有引用的资源路径不同。当然，你也可以每个页面单独使用一个html模版。

# Webpack 配置

这里主要解决两个小问题。

**1. 打包多个页面的js文件**

读取src/views下的目录，约定每一个目录当成一个页面，打包成一个js。

**2. 打包多个html**

循环生成多个HtmlWebpackPlugin插件，把每一个插件的chunks各自指向上面打包的js。

``` javascript
// webpack.config.js
var glob = require('glob');

var webpackConfig = {
    /* 一些webpack基础配置 */   
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
     var files = glob.sync(globPath),
       entries = {};

     files.forEach(function(filepath) {
         // 取倒数第二层(view下面的文件夹)做包名
         var split = filepath.split('/');
         var name = split[split.length - 2];

         entries[name] = './' + filepath;
     });

     return entries;
}

var entries = getEntries('src/view/**/index.js');

Object.keys(entries).forEach(function(name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = entries[name];

    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './template.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name]
    });
    webpackConfig.plugins.push(plugin);
})
```

# 路由配置

在多页应用下，我们希望访问的是localhost:8080/a，而不是localhost:8080/a.html。

由于webpack-dev-server只是将文件打包在内存里，所以你没法在express里直接`sendfile('output/views/a.html')`，因为这个文件实际上还不存在。还好webpack提供了一个outputFileStream，用来输出其内存里的文件，我们可以利用它来做路由。

注意，为了自定义路由，你可能需要引进express或koa之类的库，然后将webpack-dev-server作为中间件处理。

``` javascript
// dev-server.js
var express = require('express')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')

var app = express();

// webpack编译器
var compiler = webpack(webpackConfig);

// webpack-dev-server中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
});

app.use(devMiddleware)

// 路由
app.get('/:viewname?', function(req, res, next) {

    var viewname = req.params.viewname 
        ? req.params.viewname + '.html' 
        : 'index.html';

    var filepath = path.join(compiler.outputPath, viewname);

    // 使用webpack提供的outputFileSystem
    compiler.outputFileSystem.readFile(filepath, function(err, result) {
        if (err) {
            // something error
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});

module.exports = app.listen(8080, function(err) {
    if (err) {
        // do something
        return;
    }

    console.log('Listening at http://localhost:' + port + '\n')
})
```

最后，在package.json里定义下启动命令：

``` javascript
// package.json
{
    scripts: {
        "dev": "node ./dev-server.js"   
    }
}
```

运行 `npm run dev`，然后在浏览器访问localhost:8080/各个页面，你应该可以看到想要的结果。