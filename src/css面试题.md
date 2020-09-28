# CSS面试题

## 1.css全称？

Cascading Style Sheet 级联样式表

## 2.样式表的组成？

由一系列规则组成，规则又由选择器+声明块组成，声明块包含一条条具体声明，声明由属性名:属性值组成

## 3.浏览器解析选择器的顺序？

从右向左

## 4.盒模型？标准css盒模型？怪异盒子模型？IE盒模型？

标准css盒模型由4个部分组成

​	·内容区域: 可以放置元素的区域如文本、图像等

​	·内边距区域: 内容与边框之间的区域

​	·边框区域

​	·外边距区域

标准css盒模型的大小

​	·盒子的宽度 = margin-right + border-right+  + padding-right + width + padding-left + border-left + margin-left

​	·盒子的高度 = margin-top + border-top + padding-top + height + padding-bottom + border-bottom + margin-bottom

默认情况下,width和height设置的就是内容区的width和height。通过box-sizing属性可以修改盒子宽度和高度

当box-sizing的值为border-box时，这种盒子模型被称为IE盒子模型，这是设置的width和height属性决定了元素的边框盒 就是说，为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。通过从已设定的宽度和高度分别减去 *边框* 和 *内边距* 才能得到内容的宽度和高度。 

## 5.display有哪些值？说明他们的作用

display的作用: 两个作用，一是定义元素的类型（块级元素或行内元素），规定元素的[流式布局](https://wiki.developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flow_Layout)；二是控制其子元素的布局 

## 6.垂直居中

### 已知高宽

```css
#box1 {
    position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -100px;
	margin-left: -100px;
	width: 200px;
	height: 200px;
	background-color: pink;
}
```

### 未知高宽

```css
#box1 {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%, -50%, 0);
	width: 200px;
	height: 200px;
	background-color: pink;
}
```

