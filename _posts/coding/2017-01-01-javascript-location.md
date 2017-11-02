---
layout: post
title:  获取页面URL参数和JavaScript location 常用总结
date:   2017-01-01
categories: coding
tags: javascript
---

### 获取页面URL参数

#### 方法一： 使用Array split

``` javascript
function getQueryStringArgs(){
	var qs = (location.search.length > 0 ? location.search.substring(1) : ''),
		args = {},		//保存数据的对象
		items  = qs.length ? qs.split('&') : [],		//取得每一项
		item = null,
		name = null,
		value = null,
		i = 0;
	for(i=0; i<items.length; i++) {
		item = items[i].split('=');
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);

		if(name.length){
			args[name] = value;
		}
	}
	return args;
}

/** 
 * 获取当前URL参数值 
 * @param name  参数名称 
 * @return  参数值 
 */  
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	var r = window.location.search.substr(1).match(reg);
	return r ? decodeURIComponent(r[2]) : null;
}



//window.resizeTo 在chrome和opera 下无效，新弹出窗口例外 

location.assign('https://www.baidu.com');
location.href = 'https://www.baidu.com';

//通过指定URL替换当前缓存在历史里（客户端）的项目，因此当使用replace方法之后，你不能通过“前进”和“后退”来访问已经被替换的URL。
location.replace('https://www.baidu.com');

//参数可略，强行刷新当前页面
location.reload(); //重新加载（有可能从缓存中加载）
location.reload(true); //重新加载（从服务器重新加载）

//每次修改location属性（hash 除外），页面都会以新的url重新加载
location.hash = '#section1';
location.search = '?q=1';
location.hostname = 'www.baidu.com';
location.pathname = 'kongjian';
location.port = '8080';

//history
history.go(-1); //接受一个参数，向前或者向后跳转
history.go('baidu.com'); //跳转到包含此字符串的最近的历史记录
history.back(); //后退
history.forward(); //前进
history.length

```
