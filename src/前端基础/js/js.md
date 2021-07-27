# js 基础

## 1. 数据类型

1. Undefined
2. Null
3. Number
4. Boolean
5. String
6. Symbol
7. Object
8. Bigint

### 1.1 typeof 操作符

```js
typeof undefined === 'undefined'
typeof null === 'object'
typeof 123 === 'number'
typeof '123' === 'string'
typeof true === 'boolean'
typeof Symbol() === 'symbol'
typeof 123n === 'bigint'
// 一共七种基本类型，最后一种bigint为新增基本类型
typeof {} === 'object'
typeof function () {} === 'function'
```

### 1.2 判断相等（==和===区别）

1. `==`会进行强制类型转换再比较
2. `===`不会进行强制类型转换，但是`NaN`不等于`NaN`，`+0 === -0`
3. `Object.is()判断两个参数是否完全相等`

# 数组

## 1. 判断数组

```js
var arr = []
arr instanceof Array
Array.prototype.isPrototypeOf(arr)
arr.constructor === Array
Object.prototype.toString.call(arr) === '[object Array]'
Array.isArray(arr) // ie8及以下不兼容
```

## 2.转化为数组

```js
var set = new Set([1, 2])

Array.from(set) // 可以将类数组或部署了iterator接口的对象转化为数组
[...set]
Array.prototype.slice.call(set) //只能转化类数组对象（具有length属性）例如：arguments Nodelist
```

## 3.数组去重

```js
var arr = [1, 2, 2, 4, 9, 6, 7, 5, 2, 3, 5, 6, 5]

// set
Array.from(new Set(arr))

// includes会遍历数组，时间复杂度高
function unique(arr) {
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    if (!newArr.includes(item)) {
      newArr.push(item)
    }
  }
  return newArr
}

// 将数组的值存在对象的键值中，利用空间换时间
function unique(arr) {
  let newArr = []
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    let type = typeof item
    if (!obj[item]) {
      newArr.push(item)
      obj[item] = [type]
    } else if (!obj[item].includes(type)) {
      newArr.push(item)
      obj[item].push(type)
    }
  }
  return newArr
}
```

## 4.数组扁平化

```js
var arr = [1, 2, [3, [4, 5]]]

// es6 flat()
arr.flat(Infinity)

// 递归
function flatter(arr) {
  let newArr = []
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      newArr = newArr.concat(flatter(item))
    } else {
      newArr.push(item)
    }
  })
  return newArr
}

// reduce + 递归
function flatter(arr) {
  return arr.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? flatter(cur) : cur)
  }, [])
}

// arr = [].concat(...arr)可以铺平一层
function flatter(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}
```

## 5.数组乱序

```js
let arr = [1, 2, 3, 4, 5]

// sort
arr.sort(() => {
  return Math.random() - 0.5
})

// 加强，数组每一项和改项之前的随机项交换位置
function shuffer(arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = (~~(Math.random() * (i + 1))[(arr[i], arr[j])] = [arr[j], arr[i]])
  }
}
```

# 对象

## 1. new 操作符

1. 首先创造一个空对象，该对象的`__proto__`属性指向构造函数的原型对象
   ```js
   const obj = {
     __proto__: fn.prototype,
   }
   ```
2. 将上面的空对象赋值为构造函数内部的`this`，用构造函数内部的方法修改空对象
3. 如果构造函数返回一个非基本类型的值 a，则返回 a，否则返回上面创建的对象
   ```js
   function A() {
     return [1, 2]
   }
   new A() // [1, 2]
   ```

### 1.1 实现一个 new

```js
function _new(fn, ...arg) {
  const obj = Object.create(fn.prototype)
  const ret = fn.apply(obj, arg)
  return ret instanceof Object ? ret : obj
}
```

## 2.浅拷贝

拷贝对象的指针，即拷贝出来的目标对象的指针和源对象指向的内存空间是同一块

```js
const source = {
  name: 'jt',
  age: 20,
}

// Object.assign()
const target = Object.assign({}, source)

// 扩展运算符
const target = { ...source }

// slice
let source = [1, 2, 3]
let target = source.slice()

// concat()
let source = [1, 2, 3]
let target = source.concat()
```

## 3. 深拷贝

```js
// 只能用于对象内部没有方法时
JSON.parse(JSON.stringify(obj))

// 递归 属性值为对象或数组时进行递归
function deepClone(source) {
  let target = null
  if (typeof source === 'object' && source !== null) {
    target = Array.isArray(source) ? [] : {}
    for (let [key, value] of Object.entries(source)) {
      target[key] = deepClone(value)
    }
  } else {
    target = source
  }
  return target
}
// 存在循环引用问题
// 例如：
// let obj = {}
// obj.a = obj
// deepClone(obj)
// 会一直递归执行deepClone，造成函数栈溢出

// 复杂版本，利用WeakMap解决循环引用问题，不用Map是因为WeakMap是弱引用防止内存泄露
function deepClone(source, hash = new WeakMap()) {
  let target = null
  if (hash.has(source)) {
    return hash.get(source)
  }

  if (typeof source === 'object' && source !== null) {
    target = Array.isArray(source) ? [] : {}
    hash.set(source, target)
    for (let [key, value] of Object.entries(source)) {
      target[key] = deepClone(value, hash)
    }
  } else {
    target = source
  }
  return target
}

// 以上的克隆，只克隆自身属性，丢失了原型链上的属性，为了不丢失，可以这么做
function completeClone(source) {
  let ret = deepClone(source)
  Object.setPrototypeof(ret, Object.getPrototypeOf(source))
  return ret
}
```

## 4.继承

```js
function Person(name, age) {
	this.name = name
	this.age = age
}
Person.prototype.sayName = function() {
	console.log(this.name)
}

// 1.构造继承
// 可以多继承
// 只能继承父类的实例属性和方法，不能继承原型属性和方法
// Student => Student.prototype => Student.prototype.__proto__ => Object.prototype
function Student(name, age, school) {
	Person.call(this, name, age)
	this.school = school
}

// 2.原型链继承
// 不能多继承
// 所有新实例共享父类的属性
// Student => Student.prototype => Person实例 => person.__proto__ => Person.prototype => Person.prototype.__proto__ => Object.prototype
function Student(shcool) {
	this.school = school
}
Student.prototype = new Person()
Student.prototype.name = 'jt'

// 3.组合继承
// 可以继承实例属性和方法，也可以继承原型链属性和方法
// 两次调用父类构造函数
function Student(name, age, school) {
	Person.call(this)
	this.school = school
}
Student.prototype = new Person()
Student.prototype.constructor = Student

// 4.寄生组合
function Student(name, age, school) {
	Person.call(this)
	this.school = school
}
Student.prototype = Object.create(Person.prototype)
Student.prototype.constructor = Student

// 5.es6 extend
class Student extend Person {
	constructor(name, age, school) {
		super(name, age)
		this.school = school
	}
}
```

## 5.判断两个对象是否相等

```js
function equal(a, b) {
  if (a === b) return true

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    // 判断数组
    let arrA = Array.isArray(a),
      arrB = Array.isArray(b),
      i,
      length
    if (arrA !== arrB) return false
    if (arrA && arrB) {
      length = a.length
      if (length !== b.length) return false
      for (i = 0; i < length; i++) {
        if (!equal(a[i], b[i])) return false
      }
      return true
    }

    // 判断日期类型
    let dateA = a instanceof Date,
      dateB = b instanceof Date
    if (dateA !== dateB) return false
    if (dateA && dateB) return a.getTime() === b.getTime()

    // 判断正则类型
    let regA = a instanceof RegExp
    let regB = b instanceof RegExp
    if (regA !== regB) return false
    if (regA && regB) return a.toString() === b.toString()

    // 判断对象
    let keys = Object.keys(a),
      len = keys.length
    // 判断属性个数
    if (len !== Object.keys(b).length) return false
    // 判断属性名
    for (i = 0; i < len; i++) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false
    }
    // 递归判断属性值
    for (i = 0; i < len; i++) {
      let key = keys[i]
      if (!equal(a[key], b[key])) return false
    }
    return true
  }

  return a !== a && b !== b
}
```

# 函数

## 1.函数防抖

事件连续触发，只执行最后一次

```js
window.onresize = debounce(A, 500)

function debounce(fn, delay) {
  return () => {
    clearTimeout(fn.timer)
    fn.timer = setTimeout(() => {
      fn.call(this)
    }, delay)
  }
}

function A() {
  console.log(1)
}
```

## 2.函数节流

每间隔一段时间，执行一次

```js
function throttle(fn, time) {
  let canRun = true
  return () => {
    if (!canRun) return false
    canRun = false
    setTimeout(() => {
      fn.call(this)
      canRun = true
    }, time)
  }
}
```

## 3.call apply bind

相同点：

- call apply bind 都是用来改变函数的 this 对象的指向
- call apply bind 第一个参数都是 this 要指向的对象
- call apply bind 都可以利用后续参数传参

区别：

- bind 返回对应函数，便于稍后调用。apply call 立即调用
- call 传参的方法是按顺序，apply 传入的是参数数组

### 3.1 实现 call/apply

```js
Function.prototype.call = function (context, ...args) {
  context = context || window
  context.fn = this
  let ret = context.fn(...args)
  delete context.fn
  return ret
}

// apply只需修改参数即可
Function.prototype.apply = function (context, args) {
  context = context || window
  context.fn = this
  let ret = contetx.fn(...args)
  delete context.fn
  return ret
}
```

### 3.2 实现 bind

```js
Function.prototype.bind = function (context, ...args) {
  return (...newArgs) => {
    return this.call(context, ...args, ...newArgs)
  }
}
```

# 原型链

## 函数的 prototype

每个函数都有一个 prototype 属性，这个对象指向实例的原型对象。每一个 JavaScript 对象(null 除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性

```js
function Person() {}
Person.ptototype.name = 'jt'
let p1 = new Person()
let p2 = new Person()
// p1.name = p2.name = 'jt'
```

**构造函数和实例的原型对象之间的关系 👇**

![原型链](C:\Users\姜嘿嘿\Desktop\imgs\构造函数与实例原型.png)

## 实例的__proto__

> 每一个 JavaScript 对象(除了 null )都具有的一个属性，叫**proto**，这个属性会指向该对象的原型。

```js
function Person() {}
var person = new Person()
console.log(person.__proto__ === Person.prototype) // true
```

更新关系图👇

![原型链](C:\Users\姜嘿嘿\Desktop\imgs\原型链1.png)

## 原型的constructor

> 原型的onstructor属性指向构造函数

```js
function Person() {

}
Person === Person.prototype.constructor // true
```

更新关系图👇

![原型链](C:\Users\姜嘿嘿\Desktop\imgs\原型链2.png)


## 查找实例属性的过程

> 当读取实例的属性时，如果找不到，就会查找实例原型的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

```js
function Person() {

}
Person.prototype.name = 'jt'
let p1 = new Person()
p1.name = 'jhh'

console.log(p1.name) // jhh
delete p1.name
console.log(p1.name) // jt
```

## 原型的原型

> 因为所有js对象都有原型对象，所以原型也有原型对象

其实原型对象就是通过 Object 构造函数生成的，结合之前所讲，实例的 __proto__ 指向构造函数的 prototype ，所以我们再更新下关系图：

![原型链](C:\Users\姜嘿嘿\Desktop\imgs\原型链3.png)

## 原型链

> 每个实例对象都有一个私有属性 __proto__ 指向它的构造函数的原型对象。该原型对象也有一个自己的原型对象__proto__  ，层层向上直到一个对象的原型对象为 null。根据定义，null 没有原型，并作为这个原型链中的最后一个环节。

**Object.prototype没有原型**

```js
Object.prototype.__proto__ === null // true
```

完整原型链👇

![原型链](C:\Users\姜嘿嘿\Desktop\imgs\原型链4.png)

# 作用域

> 作用域是指程序源代码中定义变量的区域。作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域。

> JavaScript代码执行一段可执行代码时，会创建对应的执行上下文(execution context)。

对于每个执行上下文，都有三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

## 作用域链

> 当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

下面，让我们以一个函数的创建和激活两个时期来讲解作用域链是如何创建和变化的。

## 函数创建

js采用静态作用域，函数的作用域在函数定义的时候就确定了。
因为函数有一个内部属性 [[scope]]，当函数创建的时候，就会保存所有父变量对象到其中，你可以理解 [[scope]] 就是所有父变量对象的层级链，但是注意：[[scope]] 并不代表完整的作用域链！ 不包含自身AO/VO

例子👇：

```js
function foo() {
  function bar() {

  }
}
```

函数创建时，各自的[[scope]]👇：

```js
foo.[[scope]] = [
  globalContext.VO
];

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];
```

## 函数激活

当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。
这时候执行上下文的作用域链，我们命名为 Scope：

```js
Scope = [AO].concat([[scope]])
```

至此，作用域链创建完毕。

## 总结

以下面的例子为例，结合着之前讲的变量对象和执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的创建过程：

```js
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
```

执行过程如下：

1.checkscope 函数被创建，保存作用域链到 内部属性[[scope]]

```js
checkscope.[[scope]] = [
    globalContext.VO
];
```

2.执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

```js
ECStack = [
    checkscopeContext,
    globalContext
];
```

3.checkscope 函数并不立刻执行，开始做准备工作，第一步：复制函数[[scope]]属性创建作用域链

```js
checkscopeContext = {
    Scope: checkscope.[[scope]],
}
```

4.第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

```j
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    }，
    Scope: checkscope.[[scope]],
}
```

5.第三步：将活动对象压入 checkscope 作用域链顶端

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    },
    Scope: [AO, [[Scope]]]
}
```

6.准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: 'local scope'
    },
    Scope: [AO, [[Scope]]]
}
```

7.查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```js
ECStack = [
    globalContext
];
```

## 静态作用域和函数作用域

> 因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。
> 而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

用一个例子说明区别👇

```js
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();

// 输出1
```

假设JavaScript采用静态作用域，让我们分析下执行过程：
执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。
假设JavaScript采用动态作用域，让我们分析下执行过程：
执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。
前面我们已经说了，JavaScript采用的是静态作用域，所以这个例子的结果是 1。

foo的[[scope]]👇

```js
foo.[[scope]] = [
  globalContext.VO
]
```

**思考题**

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

问两段代码的执行结果，答案：`local scope`

第一题f的`[[scope]]`👇

```js
f.[[scope]] = [
  checkscopeContext.VO,
  globalContext.VO
]
```

第二题f的`[[scope]]`和第一题一致。

# 闭包

**MDN中闭包的定义**

> 闭包是指那些能够访问自由变量的函数。

**什么是自由变量**

> 自由变量是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量。

所以闭包 = 函数 + 函数能够访问的自由变量

```js
var a = 1
function foo() {
  console.log(a)
}
foo()
```

foo可以访问变量a，但变量a既不是函数foo的参数也不是局部变量。
所以可以说 函数foo和变量a构成了一个闭包。

这样看的话，所有的js函数都可以是闭包。然而，实际谈到闭包时，实际谈的是另一种实际意义上的闭包。

ECMAScript中，闭包指的是：

从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。

从实践角度：以下函数才算是闭包：
- 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
- 在代码中引用了自由变量

## 分析一个例子

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo(); // local scope
```

**执行上下文栈变化情况👇**

1. 进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈
2. 全局执行上下文初始化
3. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 执行上下文被压入执行上下文栈
4. checkscope 执行上下文初始化，创建变量对象、作用域链、this等
5. checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出
6. 执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈
7. f 执行上下文初始化，创建变量对象、作用域链、this等
8. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

当 f 函数执行的时候，checkscope 函数上下文已经被销毁了啊(即从执行上下文栈中被弹出)，怎么还会读取到 checkscope 作用域下的 scope 值呢？

因为f执行上下文维护了一个作用域链👇

```js
fContext = {
  Scope: [AO,  checkscopeContext.AO, globalContext.VO]
}
```

即使checkscopeContext被销毁了，但是因为fContext中的Scope依然保持了对checkscopeContext.AO的引用，checkscopeContext.AO不会被销毁，所以f函数依然可以通过 f 函数的作用域链找到它。

一句话总结闭包：内部函数的作用域链引用了外部执行上下文的变量对象，所以当外部执行上下文被销毁时，仍然可以通过作用域链访问到外部变量。

## 题目

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0](); // 3
data[1](); // 3
data[2](); // 3
```

全局上下文的VO👇

```js
globalContext = {
  VO: {
    data: [...],
    i: 3
  }
}
```

当执行到data[0]时候，data[0]的作用域链👇

```js
data[0]Context = {
  Scope: [AO, globalContext.VO]
}
```

所以输出3，data[1]和data[2]同理

```js
var data = []
for (var i=0; i<3; i++) {
  data[i] = (function (i) {
    return function() {
      console.log(i)
    }
  })(i)
}

data[0]();
data[1]();
data[2]();
```

全局上下文的VO和上一段代码一样

匿名函数执行上下文的AO👇

```js
匿名函数Context = {
  AO: {
    arguments: {
      0: 0,
      length: 1
    },
    i: 0
  }
}
```

当执行到data[0]时候，data[0]的作用域链👇

```js
data[0]Context = {
  Scope: [AO, 匿名函数Context.AO , globalContext.VO]
}
```

所以data[0]输出0, 1输出1

# 变量对象

> 变量对象是与执行上下文相关的数据作用域，存储了在执行上下文中定义的变量和函数声明。

因为不同执行上下文下的变量对象稍有不同，所以我们来聊聊全局上下文下的变量对象和函数上下文下的变量对象。

## 全局上下文的变量对象

> 全局上下文的变量对象就是全局对象
> 在浏览器中就是window

## 函数上下文的变量对象

> 在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。活动对象和变量对象其实是一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object 呐，而只有被激活的变量对象，也就是活动对象上的各种属性才能被访问。

活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

## 执行过程

执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：

1. 进入执行上下文
2. 代码执行

**进入执行上下文**

当进入执行上下文时，这时候还没有执行代码，

变量对象会包括：

1. 函数的所有形参 (如果是函数上下文)

- 由名称和对应值组成的一个变量对象的属性被创建
- 没有实参，属性值设为 undefined

2. 函数声明
- 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
- 如果变量对象已经存在相同名称的属性，则完全替换这个属性

3. 变量声明
- 由名称和对应值（undefined）组成一个变量对象的属性被创建；
- 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

举个例子👇

```js
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

在进入执行上下文后，这时候的 AO 是👇

```js
AO = {
  arguments: {
    0: 1,
    length: 1
  },
  b: undefined,
  c: reference to function c(){},
  d: undefined
}
```

**代码执行**

在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值

还是上面的例子，当代码执行完后，这时候的 AO 是👇

```js
AO = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: 3,
  c: reference to function c(){},
  d: reference to FunctionExpression "d"
}
```

## 变量提升

进入函数执行上下文时，函数中的形参、函数声明、变量声明会被存入到AO中。进入执行上下文时，首先会处理函数声明，其次会处理变量声明，如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。
而且没有通过`var`关键字声明的变量，不会被存放到AO中。

```js
function foo() {
  console.log(a)
  console.log(b)
  console.log(c)
  var a = 1
  function b() {}
  var b = 2
  c = 3
}
foo()
// undefined
// ƒ b() {} 不是undefined
// Uncaught ReferenceError: c is not defined
```

进入执行上下文时，AO👇

```js
AO = {
  arguments: {
    length:0
  }
  a: undefined,
  b: function b
}
```

# this

## Reference

ECMAScript规范中定义了两种类型：语言类型和规范类型。语言类型是开发者可以直接操作的，比如：Undefined Null Boolean等
不同于语言类型。规范类型是一种只存在于规范中的类型，它们的作用是用来描述语言底层行为逻辑。

**什么是Reference**

Reference类型是用来解释诸如delete typeof 以及赋值等操作行为的。

Reference由三部分组成：
1. base value
2. referenced name
3. strict reference

base value 就是属性所在的对象或者就是 EnvironmentRecord，它的值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中的一种。

referenced name 就是属性的名称。

例子👇

```js
var foo = 1;

// 对应的Reference是：
var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict: false
};
```

```js
var foo = {
  bar: function () {
    return this;
  }
};
 
foo.bar(); // foo

// bar对应的Reference是：
var BarReference = {
  base: foo,
  propertyName: 'bar',
  strict: false
};
```

**获取Reference组成部分的方法**

1. GetBase 返回 reference 的 base value。

2. IsPropertyReference 如果 base value 是一个对象，就返回true。

**GetValue**

> 用于从 Reference 类型获取对应值的方法

```js
var foo = 1;

var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};

GetValue(fooReference) // 1;
```

## 如何确定this的值

步骤：
1. 计算 MemberExpression 的结果赋值给 ref
2. 判断 ref 是不是一个 Reference 类型
    2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)
    2.2 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)
    2.3 如果 ref 不是 Reference，那么 this 的值为 undefined

**MemberExpression是什么？**

```js
function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}

foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}

foo.bar(); // MemberExpression 是 foo.bar
```

简单理解，MemberExpression 其实就是()左边的部分。

**判断 ref 是不是一个 Reference 类型**

```js
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}

//示例1
console.log(foo.bar());
//示例2
console.log((foo.bar)());
//示例3
console.log((foo.bar = foo.bar)());
//示例4
console.log((false || foo.bar)());
//示例5
console.log((foo.bar, foo.bar)());
```

# 立即执行函数表达式(IIFE)

> 声明一个函数，并马上调用这个匿名函数就叫做立即执行函数；也可以说立即执行函数是一种语法，让你的函数在定义以后立即执行；

写法👇

```js
(function () {alert("我是匿名函数")}())   //用括号把整个表达式包起来
(function () {alert("我是匿名函数")})()  //用括号把函数包起来

// 如果不在意返回值，可以加上一元操作符来通过语法检查
!function () {alert("我是匿名函数")}() 
+function () {alert("我是匿名函数")}() 
-function () {alert("我是匿名函数")}() 
~function () {alert("我是匿名函数")}() 

void function () {alert("我是匿名函数")}() 
new function () {alert("我是匿名函数")}() 

```

# instanceof原理

手动实现instanceof👇

```js
function _instanceof(leftValue, rightValue) {
  let rightProto = rightValue.prototype
  leftValue = lefatValue.__proto__

  while(true) {
    if (leftValue === null) return false
    if (leftValue === rightProto) return true
    leftValue = leftValue.__proto__
  }
}
```

instanceof 主要的实现原理就是只要右边变量的 prototype 在左边变量的原型链上即可。因此，instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false。

几个例子👇

```js
function foo() {

}

Object instanceof Object // true
Function instanceof Function // true
Function instanceof Object // true
Foo instanceof Foo // false
Foo instanceof Object // true
Foo instanceof Function // true
```

# 手动实现bind

> 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。、

当bind返回的函数作为构造函数👇

```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
  this.habit = 'shopping';
  console.log(this.value);
  console.log(name);
  console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

```js
Function.prototype.bind = function(context, ...args) {

  if (typeof this !== 'function') {
    throw new Error('type error no function')
  }

  let self = this
  
  // 为了避免原函数的prototype被修改，使用一个中间函数
  let fNOP = function(){}
  let fBound = function(...newArgs) {
    // 当作为构造函数使用，此时结果为true，将绑定函数的this指向该实例
    // 当作为普通函数使用，this为window，结果为false,将绑定函数的this指向context
    return self.apply(this instanceof fNOP?this:context,[...args, ...newArgs])
  }
  fNOP.prototype = this.prototype
  // 为了继承原函数原型链上的属性，需要需改返回的函数的原型
  fBound.prototype = new fNOP()
  return fBound
}
```

# 函数柯里化

> 在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

简单理解：用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数。

curry👇
```js
let sub_curry = (fn, ...args) => {
  return (...newArgs) => {
    return fn.apply(this, [...args, ...newArgs])
  }
}

let curry = (fn, length) => {
  length = length || fn.length
  return (...args) => {
    if (args.length < length) {
      return curry(sub_curry(fn, ...args), length - args.length)
    } else {
      return fn.apply(this, args)
    }
  }
}
```

```js
function add(a, b, c, d) {
  return a + b + c + d

  let addCurry = curry(add)
  console.log(addCurry(1, 2, 3)(4)); // 10
  console.log(addCurry(1, 2)(3, 4)); // 10
  console.log(addCurry(1)(2, 3, 4)); // 10
}
```

# 浮点数精度

**为什么0.1 + 0.2 ！== 0.3**

十进制0.1在转化为二进制时，会得到一个无限循环的数。

>  0.1 用二进制表示就是 0.00011001100110011……

但是ECMAScript使用64位来存储一个浮点数，所以当 0.1 存下来的时候，就已经发生了精度丢失，当我们用浮点数进行运算的时候，使用的其实是精度丢失后的数。

**浮点数存储**

ECMA用64bit来存储一个浮点数。

浮点数可以用科学计数法表示。

例如0.1的二进制0.00011001100110011……可以表示为👇

```js
1 * 2^-4 * 1.1001100110011......
```

基本由3部分组成：

- `(-1)^S`: 表示符号位，当S=0, 表示正数；S=1，表示负数

- `(1 + Fraction)`: 这是因为所有的浮点数都可以表示为 1.xxxx * 2^xxx 的形式，前面的一定是 1.xxx，那干脆我们就不存储这个 1 了，直接存后面的 xxxxx 好了，这也就是 Fraction 的部分。

- `2^E`: 如果是 1020.75，对应二进制数就是 1111111100.11，对应二进制科学计数法就是 1 * 1.11111110011 * 2^9，E 的值就是 9，而如果是 0.1 ，对应二进制是 1 * 1.1001100110011…… * 2^-4， E 的值就是 -4，也就是说，E 既可能是负数，又可能是正数。

假如用 8 位字节来存储 E 这个数，如果只有正数的话，储存的值的范围是 0 ~ 254，而如果要储存正负数的话，值的范围就是 -127~127，我们在存储的时候，把要存储的数字加上 127，这样当我们存 -127 的时候，我们存 0，当存 127 的时候，存 254，这样就解决了存负数的问题。对应的，当取值的时候，我们再减去 127。

IEEE754标准👇

![浮点数存储](C:\Users\姜嘿嘿\Desktop\imgs\浮点数存储.png)

在这个标准下：

- 我们会用 1 位存储 S，0 表示正数，1 表示负数。
- 用 11 位存储 E + bias，对于 11 位来说，bias 的值是 2^(11-1) - 1，也就是 1023。
- 用 52 位存储 Fraction。

举个例子0.1的二进制是 1 * 1.1001100110011…… * 2^-4，sign是0，E + bias是 -4 + 1023，1029用二进制表示是1111111011，Fraction是1001100110011...

对于64bit的完整表示👇

> 0 01111111011 1001100110011001100110011001100110011001100110011010

**浮点数运算**

- 对阶：把阶码调整为相同，比如 0.1 是 `1.1001100110011…… * 2^-4`，阶码是 -4，而 0.2 就是 `1.10011001100110...* 2^-3`，阶码是 -3，两个阶码不同，所以先调整为相同的阶码再进行计算，调整原则是小阶对大阶，也就是 0.1 的 -4 调整为 -3，对应变成 0.11001100110011…… * 2^-3

- 尾数运算

```js
  0.1100110011001100110011001100110011001100110011001101
+ 1.1001100110011001100110011001100110011001100110011010
————————————————————————————————————————————————————————
 10.0110011001100110011001100110011001100110011001100111
```

得到结果：`10.0110011001100110011001100110011001100110011001100111 * 2^-3`

- 规格化：将结果规格化得到`1.0011001100110011001100110011001100110011001100110011(1) * 2^-2`，注：此时.后超过了52位，所以括号里的1要被舍弃。

- 舍入处理：四舍五入对应到二进制中，就是 0 舍 1 入。因为我们要把括号里的 1 丢了，所以这里会进一，结果变成
`1.0011001100110011001100110011001100110011001100110100 * 2^-2`

- 溢出判断

最终的64bit👇：

> 0 01111111101 0011001100110011001100110011001100110011001100110100

将他转化为10进制得到`0.30000000000000004440892098500626`

# 浏览器中js事件循环机制

**执行栈**

当js执行到一段可执行代码时，会生成执行上下文，并压入执行栈。当执行完代码，会弹出执行上下文。

**什么是事件循环？**

js引擎遇到一个异步事件后并不会一直等待其返回结果，而是会将这个事件挂起，继续执行执行栈中的其他任务。当一个异步事件返回结果后，js会将这个事件加入与当前执行栈不同的另一个队列，我们称之为事件队列。被放入事件队列不会立刻执行其回调，而是等待当前执行栈中的所有任务都执行完毕， 主线程处于闲置状态时，主线程会去查找事件队列是否有任务。如果有，那么主线程会从中取出排在第一位的事件，并把这个事件对应的回调放入执行栈中，然后执行其中的同步代码...，如此反复，这样就形成了一个无限的循环。

**macro task和micro task**

因为异步任务之间并不相同，因此他们的执行优先级也有区别。不同的异步任务被分为两类：微任务（micro task）和宏任务（macro task）。

宏任务：

- `setInterval()`

- `setTimeout()`

微任务：

- `new Promise()`: 注意传入Promise构造函数的函数是同步执行的，`Promise.prototype.then`是微任务

- `new MutaionObserver()`

前面我们介绍过，在一个事件循环中，异步事件返回结果后会被放到一个任务队列中。然而，根据这个异步事件的类型，这个事件实际上会被对应的`宏任务队列`或者`微任务队列`中去。并且在当前执行栈为空的时候，主线程会 查看`微任务队列`是否有事件存在。如果不存在，那么再去`宏任务队列`中取出一个事件并把对应的回到加入当前执行栈；如果存在，则会依次执行队列中事件对应的回调，直到`微任务队列`为空，然后去`宏任务队列`中取出最前面的一个事件，把对应的回调加入当前执行栈...如此反复，进入循环。

我们只需记住当当前执行栈执行完毕时会立刻先处理所有`微任务队列`中的事件，然后再去`宏任务队列`中取出一个事件。同一次事件循环中，`微任务永远在宏任务之前执行`。

# Generator函数

## 基本使用

```js
function* example() {
  yield 1;
  yield 2;
  yield 3;
}
var iter=example();
iter.next();//{value:1，done:false}
iter.next();//{value:2，done:false}
iter.next();//{value:3，done:false}
iter.next();//{value:undefined，done:true}
```

# 防抖和节流

## 防抖

原理：事件不断触发，但是在事件触发的几秒后才执行，并且以最新的事件的事件为准。即事件持续触发，但是只在几秒后执行最后一次事件的回调函数。

**简单版本**

```js
function debounce(fn, wait) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}
```

**this指向**

事件回调里的`this`一般指向触发的dom元素，例如👇

```html
<div></div>
<script>
  let div = document.querySelector('div')
  div.onClick = function() {
    console.log(this) // <div></div>
  }
</script>
```

```js
function debounce(fn, wait) {
  let timeout
  return function() {
    let context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(context)
    },wait)
  }
}
```

**event事件**

事件回调函数接受一个`event`对象

```js
function debounce(fn, wait) {
  let timeout
  return function(...args) {
    let context = this
    timeout = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}
```

**立刻执行**

立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。

```js
function debounce(fn, wait, immediate) {
  let timeout
  return function(...args) {
    let context = this
    if (timeout) clearTimeout(timeour)
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) return fn.apply(this, args)
    } else {
      timeout = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  }
}
```

## 节流

原理：如果你持续触发事件，每隔一段时间，只执行一次事件。

**使用时间戳**

>当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

```js
function throttle(fn, wait) {
  let previous = 0
  return function(...args) {
    let context = this
    let now = +new Date()
    if (now - previous > wait) {
      fn.apply(context, wait)
      previous = now
    }
  }
}
```

效果：第一次触发，事件立即执行。之后不断触发，每wait执行一次。

**定时器**

> 当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行。直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

```js
function throttle(fn, wait) {
  let timeout
  return function(...args) {
    let context = this
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        fn.apply(context, args)
      }, wait)
    }
  }
}
```

效果：第一次触发不会立即执行，而是wait之后执行。

**双剑合璧**

要实现的效果：事件首次触发，立即执行，停止触发的时候还能再执行一次。

```js
function throttle(fn, wait) {
  let timeout, previous = 0
  return function(...args) {
    let now = +new Date()
    let remaining = wait - (now - previous)
    let context = this
    if (reamining < 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      fn.apply(context, args)
    } else if(!timeout) {
      timeout = setTimeout(() => {
        previous = now
        timeout = null
        fn.apply(context, args)
      }, wait)
    }
  }
}
```

# ajax

Asynchronous JavaScript + XML（异步JavaScript和XML），异步发送请求无需卸载页面。

## XMLHttpRequest对象

### 实例方法

**open(method, url, async)方法**

参数：

- method: 要发送的请求类型`get`、`post`

- url: 请求的ulr

- async: 是否异步请求

作用：调用该方法并不会发送请求，而是准备一个请求以备发送

**send(data)方法**

参数：

- data: 作为请求主体发送的数据，就算没有也要填null(对有些浏览器是必须的)

作用：调用send后，请求被发送到服务端，收到响应后，响应的数据会自动填充xhr对象的属性。

**setRequestHeader(header, value)**

设置请求头，必须在调用`open`之后且调用`send`之间调用。

### 实例属性

- `status`: 响应的http状态
- `statusText`: http状态的说明
- `responseText`: 作为响应主体被返回的文本
- `responseXML`: 如果响应内容的类型是`text/xml`或`application/xml`，那这个属性保存着响应数据的XML DOM文档
- `readyState`: 表示请求/响应过程的当前活动阶段。0: 未初始化，1: 启动(调用open未调用send)，2: 发送(已调用send，还未接收到响应)，3: 接收(接收到部分响应数据)，4: 完成(接收到全部响应数据)
- `timeout`: 设置超时时间，如果在这个时间之后还没收到响应，就会触发`ontimeout`。`ie8`以下不可用。

**readystateChange事件**

可以利用这个`onreadystatechange`监听`readyState的改变`👇

```js
let xhr = new XMLHttpRequest()
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      // 请求成功
      alert(xhr.responseText)
    } else {
      // 请求失败
      alert(xhr.status)
    }
  }
}
```

### 回调函数封装

```js
const ajax = ({
  method = 'get',
  url = '/',
  data,
  async = true
}, callback) => {
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyStatus === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        let res = JSON.parse(xhr.responseText)
        callback(res)
      }
    }
  }
  xhr.open(method, url, async)
  // get 直接发送
  if (method === 'get') xhr.send(null)
  if (method === 'post') {
    let type = typeof data
    let header
    if (type === 'string') {
      header = 'application/x-www-form-urlended'
    } else {
      header = 'application/json'
      data = JSON.stringify(data)
    }
    xhr.setRequestHeader('Content-type', header)
    xhr.send(data)
  }
}
ajax.get = (url, callback) => {
  return ajax({url}, callback)
}

ajax.post = function (url, data, callback) {
    return Ajax({
        method: 'post',
        url,
        data,
    }, callback)
}

ajax.get('https://www.baidu/com', (res) => {
  console.log(res)
})
```

### Promise封装

```js
const ajax = ({
  method = 'get',
  url = '/',
  data,
  async = true
}) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >=200 && xhr.status < 300) || xhr.status === 304) {
          let res = JSON.parse(xhr.responseText)
          resolve(res)
        } else {
          reject(res.status)
        }
      }
    }
    xhr.open(method, url, data)
    if (method === 'get') xhr.send(null)
    if (method === 'post') {
      let type = typeof data
      let header
      if (type === 'string') {
        header = 'application/x-www-form-urlencoded' 
      } else {
        header = 'application/json'
        data = JSON.stringify(data)
      }
      xhr.setRequestHeader('Content-type', header)
      xhr.send(data)
    }
  })
}

ajax.get = url => {
  return ajax({url})
}

ajax.get('https://www.baidu.com').then(res => {
  console.log(resl)
})
```

