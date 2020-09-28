# css基础

## 1. 选择器

1. 通配符选择器 `*`
2. id选择器 `#`
3. class选择器 `.`
4. 元素选择器 `div`
5. 后代选择器  ` `  (如`div p`，可以是爷爷孙子关系)
6. 子元素选择器 `>` （如 `div > p`，只能是父子关系）
7. 相邻兄弟选择器 `+` (如`div + p`，选择紧邻着div后的p)
8. 通用兄弟选择器`~` (如`div ~ p`，选择div后的所有兄弟p)
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
      1. `:nth-child(index)` （如：`p:nth-child(1)`，只有当第一个p是其父元素的子元素时，才匹配）
      2. `:nth-of-type(index)` (如：`p:nth-of-type(1)`，选择父元素的第一个p元素)

         ```html
         <style>
         	p:first-child {
             	color: pink;
             }
         </style>
         <div>
             <p>111</p> <!-- 匹配 -->
             <span>111</span>
         </div>
         <div>
             <span>111</span>
             <p>111</p> <!-- 不匹配 -->
         </div>
         
         <style>
         	p:first-of-type {
             	color: pink;
             }
         </style>
         <div>
             <span>111</span>
             <p>111</p> <!-- 匹配 -->
             <span>111</span>
         </div>
         ```

11. 伪元素选择器
    - `::before`
    - `::after`
### 1.1 css样式（选择器）的优先级

#### 1.1.1 选择器的权重

1.内联样式                1,0,0,0
2.id选择器                0,1,0,0
3.类、属性、伪类选择器      0,0,1,0
4.元素、伪元素选择器        0,0,0,1
5.通配符选择器             0,0,0,0
6.继承样式没有权重

#### 1.1.2 !important
规则：重要声明和重要声明比，重要声明总是大于非重要声明

#### 1.1.3 属性权重
!important > 内联样式 > id > 类、属性、伪类 > 元素、伪元素 > 通配符(*) > 浏览器默认样式 > 继承样式

## 2. 继承属性

### 2.1  常见的继承属性

1. `font`系列： `font-weight`，`font-style`，`font-size`，`font-family`
2. 文本系列：`text-indent`，`text-align`，`line-height`，`word-spacing`，`letter-spacing`，`text-transform`，`color`
3. `visibility`

### 2.2 不可继承属性

1. 背景系列：`background`，`background-color`...
2. 盒模型系列：`width`，`height`，`margin`...
3. 定位系列：`float`，`position`，`top`
4. `opacity`

## 3. 盒模型

### 3.1 标准盒模型

`box-sizing: content-box`
当我们设置`width`时，实际设置的是`content`的长度，此时盒子的实际长度=`content(width)+padding+border`

### 3.2 怪异盒模型(ie盒模型)

`box-sizing: border-box`
此时`width`等于`content+width+padding`

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
	position:relative;
}

inner {
	position:absolute;
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
	position:relative;
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
	display:flex;
}

inner {
	margin: auto;
}
```

3. flex

```css
outer {
	display: flex;
	justify-content: center;
	align-items: center;
}
```

## 2. 三列布局

### 2.1 圣杯布局

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
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

        .left, .right {
            width: 200px;
            background-color: pink;
        }
        .main {
            width: 100%;
            background-color: deeppink;
        }

        /* 关键代码 */
        .left, .right, .main {
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
    <meta charset="utf-8">
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

        .left, .right {
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
        .left, .right, .main {
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

# BFC

## 1. 什么是BFC

Block Formatting Context 块级格式化上下文
它是指一个独立的块级渲染区域，只有Block-level BOX参与，该区域拥有一套渲染规则来约束块级盒子的布局，且与区域外部无关

## 2. 何时触发BFC

1. 根元素 `<html>`
2. `float`值不为`none`
3. `position` 值不为`relative`，`fixed`
4. `display`值为`table-cell`，`table-caption`，`inline-block`中的任何一个
5. `overflow`的值为`auto`，`scroll`，`hidden`

## 3. BFC布局规则

1. 属于同一个BFC的两个相邻的box的垂直margin会发生重叠
2. 浮动元素可以撑开BFC的高度

## 4. BFC应用场景

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

# 常见问题

## 1. 清除浮动

### 1.1 开启BFC清浮动

### 1.2 伪元素清浮动

```css
.clearfix::after {
	content: '';
	display: block;
	clear: both;
}
```

## 2. inline-block的间隙问题

### 2.1 问题描述

两个相邻的`inline-block`元素放到一起会产生一段空白
原因：两个元素间的换行符被转换为空白符

```html
<style>
	#box1, #box2 {
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
- `opacity: 0` 由于`opacity`启动了GPU加速，性能最好

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















