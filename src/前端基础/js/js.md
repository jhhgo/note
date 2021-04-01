# js 基础

## 1. 数据类型

1. Undefined
2. Null
3. Number
4. Boolean
5. String
6. Symbol
7. Object
8. Binint

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

// [].concat(...arr)
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