# flex

## 容器

### 容器布局方向

指定了项目如何在容器中布局。定义了主轴，即项目是垂直布局还是水平布局

```css
.flex-container {
  display: flex;
  /*
    row: 水平从左到右（默认值）
    row-reverse: 水平从右到左
    column: 垂直从上到下
    column-reverse: 垂直从下到上
   */
  flex-direction: row;
}
```

### 富裕空间管理

**主轴：**

justify-content 属性定义了浏览器之间，如何分配顺着弹性容器主轴(或者网格行轴) 的元素之间及其周围的空间。

```css
.flex-container {
  display: flex;
  /*
    start:
    flex-start: 把富裕空间想象成容器内的最后一个元素，排列方向与flex-direction定义的相同。
    flex-end: 想象成第一个元素
    center: 富裕空间在第一个元素和最后一个元素的两边
    space-between: 在元素之间
    space-around: 在元素两边
    ...
   */
  justify-content: flex-start;
}
```

**侧轴：**

```js
.flex-container {
  display: flex;
  /*
    start:
    flex-start: 把富裕空间想象成容器内的最后一个元素，排列方向与flex-direction定义的相同。
    flex-end: 想象成第一个元素
    center: 富裕空间在第一个元素和最后一个元素的两边
    space-between: 在元素之间
    space-around: 在元素两边
    ...
   */
   align-items: flex-start;
}
```


## 项目
