### 在HTML文件中嵌入SVG

1. 如果html是XHTML并且声明类型为`application/xhtml+xml`，则可以直接吧SVG嵌入到XML源码中。
2. 在HTML5中可以直接嵌入SVG。
3. 使用`<object>`元素引入SVG文件

``` html
<object data="image.svg" type="image/svg+xml" />
```

4. 使用`<iframe>`元素引入svg文件

``` html
<iframe src="image.svg"></iframe>
```

5. `<img>`元素