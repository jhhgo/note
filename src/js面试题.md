# 变量类型和计算

## 1. 值类型和引用类型的区别？

1. 值类型：存储的是具体的值。每个变量存储各自的值，不会互相影响
2. 引用类型：存储的是指向具体对象的指针。不用变量的指针指向同一个对象，会影响

## 2. typeof可以检测的数据类型

1. typeof只能区分值类型，不能区分引用类型
2. 基本数据类型：undefined null boolean number string symbol
3. typeof null === 'object' typeof Function === 'function'

## 3. ==和===区别

==会进行强制类型转换后再比较，===不会进行强制类型转换

### js类型转换为false的情况：null undefined NaN '' false 0

# 原型和原型链

## 1.原型

1. 所有对象都有一个proto属性（隐式原型），改属性指向构造函数的prototype属性
2. 所有函数都有一个prototype属性，这个属性就是一个普通对象

## 2.js寻找对象属性的过程

1. 首先在实例中搜索该属性
2. 如果没有，则继续搜索实例的原型
3. 在通过原型链实现继承的情况下，搜索就会沿着原型链继续向上

# 作用域和闭包

## 1.函数表达式和函数声明的区别

1. 函数声明存在函数声明提升，函数可以在函数声明之前调用
2. 函数表达式定义的函数，只能在声明后调用

## 2.对执行上下文的理解

执行上下文可以理解为当前代码的执行环境，它会形成一个作用域。
js中运行环境大概包括三种情况：
1.	全局环境：window
2.	函数环境
3.	eval

在一个js程序中，会产生多个执行上下文，js引擎以栈方式处理它们，这个栈被称为函数调用栈。栈底永远都是全局上下文（window），栈顶是当前正在执行的上下文。当执行流进入一个函数，就会生成一个上下文放入栈中，处于栈顶的上下文执行完毕后会出栈

## 3.作用域链

作用：保证对执行环境有权访问的所有变量和函数的有序访问
即当执行环境要访问某个变量时，首先在自己的作用域中查找，如果则沿着作用域链向上查找，直到找到第一个为止

## 4.对this的理解

this是一个指针，指向调用函数的对象

### 绑定规则

1. 默认绑定（window）
2. 隐式绑定（obj.fn()）
3. 显示绑定（bind、apply、call）
4. new绑定

### 绑定优先级

new > 显示 > 隐式 > 默认

# JS-API

## DOM操作常用API

###  节点查找API 

1. **document.getElementById** ：根据ID查找元素，大小写敏感，如果有多个结果，只返回第一个；
2. **document.getElementsByClassName** ：根据类名查找元素，多个类名用空格分隔，返回一个 HTMLCollection 。注意兼容性为IE9+（含）。另外，不仅仅是document，其它元素也支持 getElementsByClassName 方法；
3. **document.getElementsByTagName** ：根据标签查找元素， * 表示查询所有标签，返回一个 HTMLCollection 。
4. **document.getElementsByName** ：根据元素的name属性查找，返回一个 NodeList 。
5. **document.querySelector** ：返回单个Node，IE8+(含），如果匹配到多个结果，只返回第一个。
6. **document.querySelectorAll** ：返回一个 NodeList ，IE8+(含）。
7. **document.forms** ：获取当前页面所有form，返回一个 HTMLCollection ；

### 节点创建API

1. **createElement**创建元素
2. **createTextNode**创建文本节点
3. **cloneNode** 克隆一个节点
4. **createDocumentFragment**

### 节点修改API

1. **appendChild**
2. **insertBefore**
3. **insertAdjacentHTML**
4. **Element.insertAdjacentElement()**
5. **removeChild**
6. **replaceChild**

### 节点关系API

- 父关系API
	1. **parentNode** ：每个节点都有一个parentNode属性，它表示元素的父节点。
	2. **parentElement** ：返回元素的父元素节点，与parentNode的区别在于，其父节点必须是一个Element元素，如果不是，则返回null
	
- 子关系API
	1. children ：返回一个实时的 HTMLCollection ，子节点都是Element，IE9以下浏览器不支持；
	2. childNodes ：返回一个实时的 NodeList ，表示元素的子节点列表，注意子节点可能包含文本节点、注释节点等；
	3. firstChild ：返回第一个子节点，不存在返回null，与之相对应的还有一个 firstElementChild ；
	4. lastChild ：返回最后一个子节点，不存在返回null，与之相对应的还有一个 lastElementChild ；
	
- 兄弟关系API
	1. **previousSibling** ：节点的前一个节点，如果不存在则返回null。注意有可能拿到的节点是文本节点或注释节点，与预期的不符，要进行处理一下
	2. **nextSibling** ：节点的后一个节点，如果不存在则返回null。注意有可能拿到的节点是文本节点，与预期的不符，要进行处理一下
	3. **previousElementSibling** ：返回前一个元素节点，前一个节点必须是Element，注意IE9以下浏览器不支持。
	4. **nextElementSibling** ：返回后一个元素节点，后一个节点必须是Element，注意IE9以下浏览器不支持。

### 样式操作API

- 直接修改元素样式

```js
elem.style.color = 'red';  
elem.style.setProperty('font-size', '16px');  
elem.style.removeProperty('color');
```

- 动态添加样式规则

```js
let style = document.createElement('style')
style.innerHTML = 'body{font-size: 30px}'
document.head.appendChild(style)
```

- classList获取元素类属性集合

> ie9及以下不兼容，ie9以上部分兼容

- window.getComputedStyle

> 通过 `element.style.xxx`只能获取内联样式，借助`window.getComputedStyle`可以获取应用到元素上的所有样式。ie8及以下不可用

## BOM操作

### 如何检测浏览器类型

```js
let ua = navigator.userAgent
```

### 如何拆解URL的各个部分

```js
console.log(location.href)
console.log(location.protocol)
console.log(location.host, location.hostname)
console.log(location.pathname)
console.log(location.search)
console.log(location.hash)
```






