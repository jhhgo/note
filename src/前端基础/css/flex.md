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

- 单行单列：`align-items`
- 多行多列：`align-content`

```css
.flex-container {
  /*
    start:
    flex-start: 顺着侧轴方向，排列在flex元素之后
    flex-end: 排列在flex元素之前
   */
  align-items: flex-start;
  align-content: flex-start;
}
```

**单行单列：**

![侧轴富裕空间](C:\Users\姜嘿嘿\Desktop\imgs\侧轴富裕空间1.png)

```css
.flex-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
```

![侧轴富裕空间](C:\Users\姜嘿嘿\Desktop\imgs\侧轴富裕空间2.png)

```css
.flex-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}
```

![侧轴富裕空间](C:\Users\姜嘿嘿\Desktop\imgs\侧轴富裕空间3.png)

```css
.flex-container {
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
}
```

**多行多列：**

![多行多列](C:\Users\姜嘿嘿\Desktop\imgs\多行多列1.png)

```css
.flex-container {
  display: flex;
  flex-direciton: row;
  flex-wrap: wrap;
  align-content: flex-start;
}
```

![多行多列](C:\Users\姜嘿嘿\Desktop\imgs\多行多列2.png)

```css
.flex-container {
  display: flex;
  flex-direciton: row;
  flex-wrap: wrap;
  align-content: flex-end;
}
```

以上两种是`flex-wrap: wrap`的情况，即侧轴方向不变的情况。

`flex-wrap: wrap-reverse`的情况 👇

![多行多列](C:\Users\姜嘿嘿\Desktop\imgs\侧轴方向.png)

```css
.flex-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  align-content: flex-start;
}
```

### 子容器换行方式

flex-wrap 指定当 flex 元素大小超出 flex 容器时候 flex 元素单行显示还是多行显示 。如果允许换行，这个属性允许你控制行的堆叠方向。

```css
.flex-container {
  display: flex;
  /*
    nowrap: 不换行
    wrap:
    wrap-reverse:
   */
  flex-wrap: nowrap;
}
```

### flex-flow

`flex-direction`和`flex-wrap`的简写属性。

```css
.flex-container {
  flex-flow: row wrap-reverse;
}
```

## 项目

### 弹性空间管理

将富裕空间按弹性因子分配给 flex 容器内的 item。

```css
.flex-items {
  /* 默认0，表示不占剩余空间 */
  flex-grow: 1;
}
```

### 项目排列顺序

order 属性规定了弹性容器中的可伸缩项目在布局时的顺序。元素按照 order 属性的值的增序进行布局。拥有相同 order 属性值的元素按照它们在源代码中出现的顺序进行布局。

```css
.flex-item {
  /* 默认值为0，值越大项目越靠后 */
  order: 1;
}
```

### 单独的富裕空间管理

**侧轴：**

利用`align-self`可以单独的对项目侧轴富裕空间进行管理

```css
.flex-item {
  align-self: flex-end;
}
```

**flex-basis**

`flex-basis`指定了 flex 元素在主轴方向上的初始大小。如果不使用 box-sizing 改变盒模型的话，那么这个属性就决定了 flex 元素的内容盒（content-box）的尺寸。

如果同时设置了`flex-basis`和`width`，那么`flex-basis`优先级更高。没有设置`flex-basis`的话，默认取`width`

**flex-shrink**

`flex-shrink`属性指定了 flex 元素的收缩规则。flex 元素仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值。

```css
.flex-item {
  /* 默认值1，自动收缩 */
  flex-shrink: 0.5;
}
```

**flex**

`flex-grow`、`flex-shrink`和`flex-basis`的简写属性

```css
.flex-item {
  flex: 1 0 200px;
}
```
