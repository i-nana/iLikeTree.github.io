---
layout: post
title:  几个经典排序算法的JavaScript实现
date:   2017-01-01
categories: coding
tags: [sort,javascript]
description: '几个经典排序算法的JavaScript实现'
---

> http://math.hws.edu/eck/jsdemo/sortlab.html
 
1. __插入排序__：
	+ 直接插入排序
	+ 希尔排序
2. __交换排序__：
	+ 冒泡排序
	+ [快速排序 Quick Sort](#quickSort)
3. __选择排序__
	+ 直接选择排序
	+ 堆排序
4. __归并排序__
5. __分配排序__：
	+ 基数排序

所需辅助空间最多：归并排序;
所需辅助空间最少：堆排序;
平均速度最快：快速排序;
不稳定：快速排序，希尔排序，堆排序。

-----

#### 首先，扩展一个交换数组项的swap方法，有两种方法

``` javascript
if(!Array.prototype.swap) {
	Array.prototype.swap = function(a,b) {
		var temp = this[a];
		this[a] = this[b];
		this[b] = temp;
		return this;
	};
}

if(!Array.prototype.swap) {
	Object.defineProperty(Array.prototype,'swap',{
		value: function(a,b) {
			var temp = this[a];
			this[a] = this[b];
			this[b] = temp;
			return this;
		}
	});
}
```

-----

<h3 id="quickSort">快速排序 Quick Sort</h3>

快速排序不是一种稳定的排序算法，平均运行时间为 θ(nlogn),在最坏状况下则需要 θ(n^2) 次比较。

1. 选择一个“基准”（pivot）
2. 分区（partition）操作：比基准值小的放在前面，比基准值大的放后面
3. 递归（recursive）

``` javascript
var quickSort=function(arr){
	var len=arr.length;
	if(len>1){
		var pivot=arr[0];
		var left=[];
		var right=[];
		for(var i=1;i<len;i++){
			if(arr[i]<pivot){
				left.push(arr[i]);
			}else{
				right.push(arr[i]);
			}
		}
		return quickSort(left).concat(pivot,quickSort(right));
	}else{
		return arr;
	}
};
```

-----

### 冒泡排序 Bubble Sort

空间复杂度O(1) 时间复杂度O(n2) 

1. 假设数组长度为n。比较相邻的两个元素，如果顺序错误则互换。重复两两比较，第一轮比较后，最大值将位于最后一位。
2. 然后将前n-1个元素重复上述操作，n轮后，结束

``` javascript
var bubbleSort=function(arr) {
	var len = arr.length;
	if(len>1){
		for(var i=1;i<length;i++){
			for(var j=i; j>0; j--){
				if(arr[j]<arr[j-1]){
					arr.swap(j,j-1);
				}else{
					break;
				}
			}
		}
	}
	return arr;
};

//冒泡排序的defineProperty形式
Array.prototype.bubbleSort = function () {
    var arr = this,
        len = arr.length;
    if (len > 1) {
        for (var i = 1; i < len; i++) {
            for (var j = i; j > 0; j--) {
                if (arr[j] < arr[j - 1]) {
                    arr.swap(j, j - 1);
                } else {
                    break;
                }
            }
        }
    }
    return arr;
};
```

-----

### 归并排序 Merge Sort

使用递归，mergeSort()函数频繁地自我调用。长度为n的数组最终会调用mergeSort()函数 2n-1 次，这意味着一个长度超过1500的数组会在Firefox上发生栈溢出错误。可以考虑使用迭代来实现同样的功能。

``` javascript
var merge=function(left,right){
	var arr=[];
	while(left.length&&right.length){
		if(left[0]<right[0]){
			arr.push(left.shift());
		}else{
			arr.push(right.shift());
		}
		return arr.concat(left,right);
	}
};
var mergeSort=function(arr){
	var len=arr.length;
	if(len>1){
		var index=Math.floor(len/2);
		var left=arr.slice(0,index);
		var right=arr.slice(index);
		return merge(mergeSort(left),mergeSort(right));
	}else{
		return arr;
	};
}

//归并排序的非递归实现
var mergeSortIteration=function(arr){
	var len=arr.length;
	if(len>1){
		var work=[];
		for(var i=0;i<len;i++){
			work.push([arr[i]]);
		}
		worl.push([]);
		for(var j=len;j>1;j=Math.ceil(j/2)){
			for(var k=0,l=0;l<j;k++,l+=2){
				work[k]=merge(work[l],work[l+1]);
			}
			work[k]=[];
		}
		return work[0]
	}else{
		return arr;
	}
};
```

-----

### 原地快排

``` javascript
var partition=function(arr,start,end){
	var index=start;
	var pivot=arr[start];
	arr.swap(start,end);
	for(var i=start;i<end;i++){
		if(arr[i]<pivot){
			arr.swap(i,index);
			index++
		}
	}
	arr.swap(index,end);
	return index;
};
var sorting=function(arr,start,end){
	if(end-star>1){
		var index=partition(arr,start,end-1);
		sorting(arr,start,index);
		sorting(arr,index+1,end);
	}
	return arr;
};
var quickSortInPlace=function(arr){
	var len=arr.length;
	if(len>1){
		return sorting(arr,0,len);
	}else{
		return arr;
	;}
}
```