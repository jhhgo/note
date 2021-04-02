# css 基础

## 1. 选择器

1. 通配符选择器 `*`
2. id 选择器 `#`
3. class 选择器 `.`
4. 元素选择器 `div`
5. 后代选择器 ` ` (如`div p`，可以是爷爷孙子关系)
6. 子元素选择器 `>` （如 `div > p`，只能是父子关系）
7. 相邻兄弟选择器 `+` (如`div + p`，选择紧邻着 div 后的 p)
8. 通用兄弟选择器`~` (如`div ~ p`，选择 div 后的所有兄弟 p)
9. 属性选择器 `[]`
10. 伪类选择器

    - 链接伪类
      1. `:link` 未访问过的链接（如`a:link`）
      2. `:visited` 已访问过的链接（如`a:visited`）
      3. `:target`
    - 动态伪类
      1. `:hover` 悬浮在元素上
      2. `:active` 点击按住
    - 表单伪类
      1. `:enabled` 可编辑的表单
      2. `:disable` 被禁用的表单
      3. `:checked` 被选中的表单
      4. `:focus` 获得焦点的表单
    - 结构性伪类

      1. `:nth-child(index)` （如：`p:nth-child(1)`，只有当第一个 p 是其父元素的子元素时，才匹配）
      2. `:nth-of-type(index)` (如：`p:nth-of-type(1)`，选择父元素的第一个 p 元素)

         ```html
         <style>
           p:first-child {
             color: pink;
           }
         </style>
         <div>
           <p>111</p>
           <!-- 匹配 -->
           <span>111</span>
         </div>
         <div>
           <span>111</span>
           <p>111</p>
           <!-- 不匹配 -->
         </div>

         <style>
           p:first-of-type {
             color: pink;
           }
         </style>
         <div>
           <span>111</span>
           <p>111</p>
           <!-- 匹配 -->
           <span>111</span>
         </div>
         ```

11. 伪元素选择器
    - `::before`
    - `::after`

### 1.1 css 样式（选择器）的优先级

#### 1.1.1 选择器的权重

1. 内联样式 1,0,0,0

2. id 选择器 0,1,0,0 

3. 类、属性、伪类选择器 0,0,1,0
4. 元素、伪元素选择器 0,0,0,1 
5. 通配符选择器 0,0,0,0 
6. 继承样式没有权重

#### 1.1.2 !important

规则：重要声明和重要声明比，重要声明总是大于非重要声明

#### 1.1.3 属性权重

!important > 内联样式 > id > 类、属性、伪类 > 元素、伪元素 > 通配符(\*) > 浏览器默认样式 > 继承样式

## 2. 继承属性

### 2.1 常见的继承属性

1. `font`系列： `font-weight`，`font-style`，`font-size`，`font-family`
2. 文本系列：`text-indent`，`text-align`，`line-height`，`word-spacing`，`letter-spacing`，`text-transform`，`color`
3. `visibility`

### 2.2 不可继承属性

1. 背景系列：`background`，`background-color`...
2. 盒模型系列：`width`，`height`，`margin`...
3. 定位系列：`float`，`position`，`top`
4. `opacity`

## 3. 盒模型

盒模型包含了元素内容(content)、内边距(padding)、外边框(border)、外边距(margin)

### 3.1 标准盒模型

`box-sizing: content-box`
当我们设置`width`时，实际设置的是`content`的长度，此时盒子的实际长度=`content(width)+padding+border`

### 3.2 怪异盒模型(ie 盒模型)

`box-sizing: border-box`
此时`width`等于`content+padding+border`

### js获取\设置 盒模型宽高的api

- `dom.style.width/height`: 只能取到行内样式的宽和高，style标签中和link外链的样式取不到。

- `dom.currentStyle.width/height`: 取到的是最终渲染后的宽和高，只有IE支持此属性。

- `window.getComputedStyle(dom).width/height`: 同2，但支持大多数浏览器,ie8及以下不支持

- `dom.getBoundingClientRect().width/height`: 也是得到渲染后的宽和高，大多浏览器支持。IE9以上支持，除此外还可以取到相对于视窗的上下左右的距离

# 布局

## 1. 水平垂直居中

### 1.1 宽高确定

1. 绝对定位 + margin-top: -height/2

```css
outer {
  position: relative;
}

inner {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-right: -100px;
}
```

2. 绝对定位 + calc

```css
outer {
  position: relative;
}

inner {
  position: absolute;
  width: 200px;
  height: 200px;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}
```

### 1.2 宽高不确定

1. 绝对定位 + transform

```css
outer {
  position: relative;
}

inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

2. flex + margin: auto

```css
outer {
  display: flex;
}

inner {
  margin: auto;
}
```

3. flex

```css
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

4. flex + margin

```css
.flex-container {
  display: flex;
}
.flex-item {
  margin: auto;
}
```

## 2. 三列布局 （两边定宽，中间自适应）

### 2.1 圣杯布局

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
    <style>
      /* 基本样式 */
      * {
        margin: 0;
        padding: 0;
      }

      body {
        min-width: 600px;
      }

      .left,
      .right {
        width: 200px;
        background-color: pink;
      }
      .main {
        width: 100%;
        background-color: deeppink;
      }

      /* 关键代码 */
      .left,
      .right,
      .main {
        float: left;
        position: relative;
      }

      .left {
        margin-left: -100%;
        left: -200px;
      }

      .right {
        margin-left: -200px;
        left: 200px;
      }

      #wrap {
        padding: 0 200px;
      }
    </style>
  </head>

  <body>
    <div id="wrap">
      <div class="main">main</div>
      <div class="left">left</div>
      <div class="right">right</div>
    </div>
  </body>
</html>
```

### 2.2 双飞翼布局

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
    <style>
      /* 基本样式 */
      * {
        margin: 0;
        padding: 0;
      }

      body {
        min-width: 600px;
      }

      .left,
      .right {
        width: 200px;
        background-color: pink;
      }
      .main {
        width: 100%;
        background-color: deeppink;
      }

      .main-inner {
        margin-left: 200px;
        margin-right: 200px;
      }
      /* 关键代码 */
      .left,
      .right,
      .main {
        float: left;
      }

      .left {
        margin-left: -100%;
      }

      .right {
        margin-left: -200px;
      }
    </style>
  </head>

  <body>
    <div id="wrap">
      <div class="main">
        <div class="main-inner">main</div>
      </div>
      <div class="left">left</div>
      <div class="right">right</div>
    </div>
  </body>
</html>
```

### 2.3 flex

```html
<style>
  body {
    display: flex;
  }
  .left,
  .right {
    width: 25vw;
    height: 100vh;
  }
  .main {
    flex: 1;
    height: 100vh;
  }
</style>
<html>
  <div class="left"></div>
  <div class="main"></div>
  <div class="right"></div>
</html>
```

## 3.两栏布局 （一边定宽，一边自适应）

**float+margin 或 float+overflow: auto**

```html
<style>
  .aside {
    width: 30vw;
    height: 100vh;
    float: left;
  }
  .main {
    height: 100vh;
    margin-left: 30vw;
    /* 或者overflow:auto;使其成为bfc */
  }
</style>
<body>
  <div class="aside"></div>
  <div class="main">
    <div class="content"></div>
  </div>
</body>
```

**flex**

```html
<style>
  body {
    display: flex;
  }
  .aside {
    flex: 0 0 30vw;
    /* or width: 30vw; */
  }
  .main {
    flex: 1;
    /* 相当于flex-grow: 1; */
  }
</style>
<body>
  <div class="aside"></div>
  <div class="main">
    <div class="content"></div>
  </div>
</body>
```

## 4.等高布局

**伪等高**

1. 负 margin

原理：元素的背景是在元素的 padding(以及 content)区域绘制，设置一个大数值的 padding-bottom，再设置相同数值的负 margin-bottom，使背景铺满元素区域，又符合元素的盒模型的计算公式，实现视觉上的等高效果

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .wrap {
    overflow: hidden;
  }
  .left,
  .right {
    float: flet;
    padding-bottom: 10000px;
    margin-bottom: -10000px;
  }
</style>
<body>
  <div class="wrap">
    <div class="left">
      left <br />
      left <br />
    </div>
    <div class="right">right <br /></div>
  </div>
</body>
```

**真等高**

1. flex

# BFC

## 常见的定位方案

- 普通流(normal flow)

> 在普通流中，元素按照其在 HTML 中的先后位置至上而下布局，在这个过程中，行内元素水平排列，直到当行被占满然后换行，块级元素则会被渲染为完整的一个新行，除非另外指定，否则所有元素默认都是普通流定位，也可以说，普通流中元素的位置由该元素在 HTML 文档中的位置决定。

- 浮动(float)

> 在浮动布局中，元素首先按照普通流的位置出现，然后根据浮动的方向尽可能的向左边或右边偏移。

- 绝对定位(absolute positioning)

> 在绝对定位布局中，元素会整体脱离普通流，因此绝对定位元素不会对其兄弟元素造成影响，而元素具体的位置由绝对定位的坐标决定。

## 1. 什么是 BFC

Block Formatting Context 块级格式化上下文
它是指一个独立的块级渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。

## 2. 何时触发 BFC

1. 根元素 `<html>`
2. `float`值不为`none`
3. `position` 值不为`relative`，`fixed`
4. `display`值为`table-cell`，`table-caption`，`inline-block`中的任何一个
5. `overflow`的值为`auto`，`scroll`，`hidden`

## 3. BFC 布局规则

1. 属于同一个 BFC 的两个相邻的 box 的垂直 margin 会发生重叠
2. 浮动元素可以撑开 BFC 的高度
3. BFC 可以阻止元素被浮动元素覆盖

## 4. BFC 应用场景

### 4.1 清除浮动

```html
<style>
  // 利用overflow: auto 使outer成为BFC
  .outer {
    overflow: auto;
  }

  .inner {
    width: 200px;
    height: 200px;
    float: left;
  }
</style>

<body>
  <div class="outer">
    <div class="inner"></div>
  </div>
</body>
```

### 4.2 防止外边距重叠

```html
<style>
  #box1 {
    width: 200px;
    height: 200px;
    background-color: pink;
    margin-bottom: 100px;
  }

  #box2 {
    width: 200px;
    height: 200px;
    background-color: deeppink;
    margin-top: 100px;
  }

  #bfc {
    overflow: auto;
  }
</style>

<body>
  <div id="box1"></div>
  <div id="bfc">
    <div id="box2"></div>
  </div>
</body>
```

### 4.3 阻止元素被浮动元素覆盖

```html
<style>
  #box1 {
    width: 200px;
    height: 200px;
    background-color: green;
    float: left;
  }

  #box2 {
    width: 200px;
    height: 200px;
    background-color: deeppink;
    overflow: auto;
  }
</style>

<body>
  <div id="box1"></div>
  <div id="box2"></div>
</body>
```

# CSS模块化

# 层叠上下文和层叠顺序

## 层叠上下文

层叠上下文，英文称作”stacking context”。 是HTML中的一个三维的概念。如果一个元素含有层叠上下文，我们可以理解为这个元素在z轴上就“高人一等”。

页面中的元素有了层叠上下文后，相当于网页中的元素等级更高了，离用户更近了。

**层叠上下文元素的特性**

1. 层叠上下文的层叠水平要比普通元素高
2. 每个层叠上下文是自成体系的，当元素发生层叠的时候，整个元素被认为是在父层叠上下文的层叠顺序中即子元素的层叠由父层叠上下文决定。
3. 每个层叠上下文和兄弟元素独立，也就是当进行层叠变化或渲染的时候，只需要考虑其后代元素。

**如何创建层叠上下文**

1. 根层叠上下文：指页面根元素即`<html>`元素。这就是为什么，绝对定位元素在`left/top`等值定位的时候，如果没有其他定位元素限制，会相对浏览器窗口定位的原因。

2. 定位元素与传统层叠上下文：对于包含有`position:relative/position:absolute`的定位元素，以及FireFox/IE浏览器（不包括Chrome等webkit内核浏览器）（目前，也就是2016年初是这样）下含有`position:fixed`声明的定位元素，当其`z-index`值不是`auto`的时候，会创建层叠上下文。

例子说明👇

```html
<div style="position:relative; z-index:auto;">
    <img src="cdn.jpg" style="position:absolute; z-index:2;">
</div>
<div style="position:relative; z-index:auto;">
    <img src="link.jpg" style="position:relative; z-index:1;">
</div>
```

效果👇

![层叠上下文](C:\Users\姜嘿嘿\Desktop\imgs\层叠上下文1.png)

原因：`z-index: auto`所在的`<div>`元素是一个普通的元素，于是里面的两个`<img>`的层叠比较就不受父级的影响。两个`<img>`有明显不一的`z-index`值，因此遵循`谁大谁上`原则

当我们修改父`div`的`z-index`为`0`时

```html
<div style="position:relative; z-index:0;">
    <img src="cdn.jpg" style="position:absolute; z-index:2;">
</div>
<div style="position:relative; z-index:0;">
    <img src="link.jpg" style="position:relative; z-index:1;">
</div>
```

效果👇

![层叠上下文](C:\Users\姜嘿嘿\Desktop\imgs\层叠上下文2.png)

`z-index:0`所在的`<div>`元素是层叠上下文元素。此时两个`img`的比较变成了优先比较其父级层叠上下文，父级的`z-index`都是`0`。此时，遵循后来居上

3. css3新层叠上下文

- z-index值不为auto的flex项(父元素display:flex|inline-flex).
- 元素的opacity值不是1.
- 元素的transform值不是none.
- 元素mix-blend-mode值不是normal.
- 元素的filter值不是none.
- 元素的isolation值是isolate.
- will-change指定的属性值为上面任意一个。
- 元素的-webkit-overflow-scrolling设为touch.

**display: flex与层叠上下文**

两个条件形成层叠上下文

1. 父级`display: flex | inline-flex`

2. 子元素的`z-index`必须是数值

```js
.box {  }
.box > div { background-color: blue; z-index: 1; }    /* 此时该div是普通元素，z-index无效 */
.box > div > img { 
  position: relative; z-index: -1; right: -150px;     /* 注意这里是负值z-index */
}


<div class="box">
  <div>
    <img src="mm1.jpg">
  </div>
</div>
```

效果👇

![层叠上下文](C:\Users\姜嘿嘿\Desktop\imgs\层叠上下文3.png)

为什么图片在`div`之后？根据层叠顺序图可得`z-index:负数`排在`block块状水平盒子后`

现在微调css，增加`display: flex`

```html
.box { display: flex; }
```

此时效果👇

![层叠上下文](C:\Users\姜嘿嘿\Desktop\imgs\层叠上下文4.png)

原因：此时满足了形成层叠上下文的两个条件，`div`变成了层叠上下文元素。根据层叠顺序图，负`z-index`层叠顺序在层叠上下文元素的`background`之上。

## 层叠水平

“层叠水平”英文称作”stacking level”，决定了同一个层叠上下文中元素在z轴上的显示顺序。

## 层叠顺序

如图👇

![层叠水平](C:\Users\姜嘿嘿\Desktop\imgs\层叠水平.png)

关于以上图片的一些说明：

1. 位于最低水平的`border/background`指的是层叠上下文元素的边框和背景色。每一个层叠顺序规则适用于一个完整的层叠上下文元素。

2. z-index:0实际上和z-index:auto单纯从层叠水平上看，是可以看成是一样的。但是，两者在层叠上下文领域有着根本性的差异

## 层叠准则

1. 谁大谁上：当具有明显的层叠水平标示的时候，如识别的z-indx值，在同一个层叠上下文领域，层叠水平值大的那一个覆盖小的那一个。

2. 后来居上：当元素的层叠水平一致、层叠顺序相同的时候，在DOM流中处于后面的元素会覆盖前面的元素。

# 常见问题

## 1. 清除浮动

### 1.1 开启 BFC 清浮动

### 1.2 伪元素清浮动

```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

## 2. inline-block 的间隙问题

### 2.1 问题描述

两个相邻的`inline-block`元素放到一起会产生一段空白
原因：两个元素间的换行符被转换为空白符

```html
<style>
  #box1,
  #box2 {
    display: inline-block;
  }
</style>
<body>
  <div id="box1">1</div>
  <div id="box2">2</div>
</body>
```

### 2.2 解决办法

1. 直接删除换行符
2. 父元素设置`font-size: 0px`，子元素重新设置`font-size`

## 3. display: none visibility: hidden opacity: 0 三者区别

作用都是使元素不可见

### 3.1 结构上

- `display: none` 目标元素不会被渲染进渲染树，不占空间，不能点击
- `visibility: hidden` 目标元素会被渲染进渲染树，占空间，不能点击
- `opacity: 0` 目标元素会被渲染进渲染树，占空间，能点击

### 3.2 继承上

- `display: none` 作用于父元素后，子元素也不会被渲染（即使子元素添加了`display: block`）
- `visibility: hidden` 作用于父元素后，子元素继承属性，也不可见；但是给子元素设置`visibility: visible`使其可见
- `opacity: 0` 虽然不会继承，但是子元素透明度会被影响，因此也不可见（即使给子元素添加`opacity: 1`）

### 3.3 性能上

- `display: none` 会造成回流/重绘，性能影响大
- `visibility: hidden`会造成元素内部的重绘，性能影响相对小
- `opacity: 0` 由于`opacity`启动了 GPU 加速，性能最好

## 4. 文本溢出显示省略号

## 4.1 单行文本溢出

```css
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

## 4.2 多行文本溢出
