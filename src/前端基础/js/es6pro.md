# Proxy

> Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

**代理对象**

```js
let handler = {
  get: function(target, propKey, receiver) {
    console.log(target, propKey)
  },
  set: function(target, propKey, newValue, receiver) {
    console.log(target, propKey, newValue)
    target[propKey] = newValue
  }
}

let proxy = new Proxy({
  name: 'jt';
}, handler)

proxy.name
// 输出
// {name: 'jt'}, 'name'

proxy.name = 'jhh'
// 输出
// {name: 'jt'}, 'name', 'jhh'
```

**代理函数**

```js
let handler = {
  apply: function(target, myThis, args) {
    console.log(myThis, args)
    Reflect.apply(...arguments)
  }
}

let proxy = new Proxy(function(name, age) {
  this.name = name
  this.age = age
}, handler)

proxy.call({}, 'jt', 22)
// 输出
// {}, ['jt', 22]
```

# Reflect

Reflect对象的设计目的有这样几个。

- 将许多Object上的方法，如Object.defineProperty放在了Reflect上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。

- 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。

```js
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```

- 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。

```js
// 老写法
'assign' in Object // true
delete obj.name

// 新写法
Reflect.has(Object, 'assign') // true
Reflect.deleteProperty(obj, 'name')
```

- Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

```js
// 老写法
Proxy(target, {
    set: function(target, name, value, receiver) {
        target[name] = value
    }
})

// 新写法
Proxy(target, {
    set: function(target, name, value, receiver) {
    	Reflect.set(target, name, value, receiver)
    }
})
```

**Reflect所有静态方法**

- Reflect.apply(target, thisArg, args)
- Reflect.construct(target, args)
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.defineProperty(target, name, desc)
- Reflect.deleteProperty(target, name)
- Reflect.has(target, name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

# Set

> 类似于数组，但成员的值是唯一的，没有重复的值

**基本用法**

Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

```js
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4] 实现了数组的去重
```

**实例方法**

主要分为：操作方法、遍历方法

操作方法：

- add(value): 添加某个值，返回 Set 结构本身
- delete(value): 删除某个值,返回布尔值表示删除是否成功
- has(value): 返回一个布尔值，表示该值是否为Set的成员
- clear(): 清除所有成员，没有返回值

遍历方法：

- keys()
- values()
- entries()
- forEach()

# Map

> 类似于对象，也是键值对的集合，但是键的类型不限于字符串。

**基本用法**

```js
const map = new Map()
map.set({}, 'value')
// 这里map的键是一个对象
```

# Weakmap WeakSet

**和map set的区别**

- WeakSet的成员只能是对象。其次，WeakSet 中的对象都是弱引用。
- WeakMap只接受对象作为键名。其次，WeakMap 中的键名所指向的对象都是弱引用。

**弱引用**

指的是不被在引用计数中被计数的引用。（当引用次数为0，会回收内存）

# Promise

## Promise.prototype.finally(callback)

无论promise状态是`fulfilled`还是`rejected`，都会执行callback

## Promise.all

将多个 Promise 实例，包装成一个新的 Promise 实例

```js
// 如果数组项不是promise对象，会先调用Promise.resolve转换为promise
const p = Promise.all([p1, p2, p3])
```

**p的状态**

1. 只有`p1`、`p2`、`p3`的状态都变为`fulfilled`时，`p`的状态才是`fulfilled`。此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
2. 只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

**手写Promise.all**

```js
Promise.prototype.all = function(promises) {
	let result = []
	let count = 0
	return new Promise((resolve, reject) => {
		promises.forEach(promise => {
			Promise.resolve(promise).then(value => {
				count++
				result[i] = value
				if (count === promises.length) return resolve(result)
			}, error => {
				return reject(error)
			})
		})
	})
}
```

## Promise.race

同样是将多个 Promise 实例，包装成一个新的 Promise 实例

```js
const p = Promise.race([p1, p2, p3]);
```

只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

## Promise.allSettled

## Promise.any

方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。只要参数实例有一个变成`fulfilled`状态，包装实例就会变成`fulfilled`状态；如果所有参数实例都变成`rejected`状态，包装实例就会变成`rejected`状态。