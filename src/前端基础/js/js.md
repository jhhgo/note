# js 基础

## 1. 数据类型

1. Undefined
2. Null
3. Number
4. Boolean
5. String
6. Symbol
7. Object

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
    } else if (!obj[item].includes(item)) {
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

// flat()
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
2. 将上面的空对象赋值构造函数内部的`this`，用构造函数内部的方法修改空对象
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
    if (dateA && dateB) return dateA.getTime() === dateB.getTime()

    // 判断正则类型
    let regA = a instanceof RegExp
    let regB = b instanceof RegExp
    if (regA !== regB) return false
    if (regA && regB) return regA.toString() === regB.toString()

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
  let ret = contetx.fn(...args)
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

```

```

```

```
