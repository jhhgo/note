# let与const命令

## 1. let命令

### 1. 1 特性

1. 不存在变量提升,变量不可以在声明前使用
2. 不允许重复声明变量 let不允许在相同作用域内，重复声明同一个变量
3. 暂时性死区：在代码块内，如果存在let命令，那么在使用let命令声明变量之前，该变量都是不可用的

```js
//ReferenceError: Cannot access 'a' before initialization
console.log(a)
let a = 1
```

## 2. 块级作用域

let为js提供了块级作用域

```js
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
  }
  console.log(n); // 5
}
```

##   3. const命令

const命令声明一个只读的常量

### 3. 1 特性

1. 一旦声明,常量的值就不能改变

2. const一声明就必须初始化

3. 作用域与let相同,只在块级作用域有效

4. 与let一样不存在变量提升,存在暂时性死区

5. 不可重复声明

## 4.总结：es6声明变量的方法

`var`和`funciton`，`let`和`const`，`import`，`class`



  顶层对象的属性

​    es5 var和function声明的全局变量是顶层对象(window)的属性

​    es6 let const class声明全局变量不再是顶层对象的属性



# 变量的解构赋值

## 1.数组的解构赋值 

### 基本用法

​    ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构

```js
let [a, b, c] = [1, 2, 3];
```

​    1.如果结构不成功,变量的值就等于undefined

```javascript
let [x, y] = [1]
x // 1
y // undefined
```

​    2.如果等号右边不是数组(**不是可遍历的结构**)，那么会报错

​	3.只要数据结构具有iterator接口，都可以采用数组的解构赋值

```javascript
// set的解构赋值
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

### 默认值

​	1.解构赋值允许指定默认值， ES6 内部使用严格相等运算符（`===`），判断一个位置是否有值。所以，只有当一个数组成员严格等于`undefined`，默认值才会生效 

```javascript
let [foo = true] = [];
foo // true

// x===undefined 默认值生效
let [x = 1] = [undefined];
x // 1
```

 2. 如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值

    ```javascript
    function f() {
      console.log('aaa');
    }
    
    let [x = f()] = [1];
    // x取得到值 所以f()不会执行 没有输出aaa
    ```

	3.  默认值可以引用解构赋值的其他变量，但该变量必须已经声明 

    ```javascript
    let [x = 1, y = x] = [];     // x=1; y=1
    let [x = y, y = 1] = [];     // ReferenceError: y is not defined x用y做默认值时 y还没有声明
    ```

## 2.对象的解构赋值

### 基本用法

​	解构不仅可以用于数组，还可以用于对象 

```javascript
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"
```

​	1.变量必须与属性同名，与次序无关

```javascript
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: 'aaa', bar: 'bbb' };
baz // undefined
```

 2. 如果解构失败，变量的值等于`undefined`

    ```javascript
    let {foo} = {bar: 'baz'};
    foo // undefined
    ```

	3.  如果变量名与属性名不一致，必须写成下面这样 

    ```javascript
    let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
    baz // "aaa"
    ```

	4.  与数组一样，解构也可以用于嵌套结构的对象 

    ```javascript
    let obj = {
      p: [
        'Hello',
        { y: 'World' }
      ]
    };
    
    let { p: [x, { y }] } = obj;
    x // "Hello"
    y // "World"
    ```

### 默认值

​	 对象的解构也可以指定默认值，默认值生效的条件是，对象的属性值严格等于`undefined`

```javascript
var {x = 3} = {};
x // 3

// x===undefined 默认值生效
var {x = 3} = {x: undefined};
x // 3

// x===null 默认值不生效
var {x = 3} = {x: null};
x // null
```

### 注意点

 1. 如果要将一个已经声明的变量用于解构赋值，必须非常小心 

    ```javascript
    // 错误的写法
    let x;
    {x} = {x: 1};
    // SyntaxError: syntax error
    // 报错 因为javascript引擎把{x}理解成代码块，从而发生语法错误
    
    // 正确的写法
    let x;
    ({x} = {x: 1});
    // 只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题
    ```

	2.  解构赋值允许等号左边的模式之中，不放置任何变量名

    ```javascript
    ({} = [true, false]);
    ({} = 'abc');
    ({} = []);
    
    // 可以正常执行
    ```

	3.  由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构

    ```javascript
    let arr = [1, 2, 3];
    let {0 : first, [arr.length - 1] : last} = arr;
    first // 1
    last // 3
    ```

## 3.string的解构赋值

​	 字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象

```javascript
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

let {length : len} = 'hello';
len // 5
// 类数组对象有一个length属性
```

## 4.数值和布尔值的解构赋值

​	 解构赋值时，如果等号右边是数值和布尔值，则会先转为对象

```javascript
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true

let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
// null undefined 无法转换成对象 所以报错
```

## 5.函数参数的解构赋值

​	 函数的参数也可以使用解构赋值 

```javascript
function add([x, y]){
  return x + y;
}

add([1, 2]); // 3
```

​	 函数参数的解构也可以使用默认值

```javascript
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

## 6.用途

	### 1.交换变量的值

```javascript
let x = 1;
let y = 2;

[x, y] = [y, x];
```

### 2.从函数返回多个值

```javascript
// 返回一个数组

function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```

### 3.函数参数的定义

```javascript
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

### 4.提取JSON数据

```javascript
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

### 5.函数参数的默认值

### 6.遍历Map结构

```javascript
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world

// 获取键名
for (let [key] of map) {
  // ...
}

// 获取键值
for (let [,value] of map) {
  // ...
}
```

# 函数的拓展

## 1.函数参数的默认值

## 基本用法

 ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面 

注意点： 参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的 

```javascript
function log(x, y = 'World') {
  console.log(x, y);
}

console.log('Hello') // Hello World
console.log('Hello', 'China') // Hello China
console.log('Hello', '') // Hello
```

惰性求值

```javascript
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101
```

### 与解构赋值默认值结合使用

​	 参数默认值可以与解构赋值的默认值，结合起来使用

```javascript
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined
```

### 参数默认值的位置

​	 通常情况下，定义了默认值的参数，应该是函数的尾参数 

### 函数的length属性

​	length属性的含义：该函数预期传入的参数个数

​	指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length`属性将失真 ，rest参数同样不计入length属性

```javascript
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```

​	如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数了

```javascript
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

### 参数默认值作用域

​	 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的

```javascript
var x = 1;

function f(x, y = x) {
  console.log(y);
}

// 参数y的默认值指向第一个参数x 而不是全局x 所以输出2
f(2) // 2


let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

// 参数y=x形成一个单独的作用域 这个作用域没有本身没有定义x 所以指向外层变量x 函数体内部的局部变量x 影响不到参数x
f() // 1
```

## 2.rest参数

### 基本用法

​	1.ES6 引入 rest 参数（形式为`...变量名`），用于获取函数的多余参数，这样就不需要使用`arguments`对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中 

```javascript
// 求和函数，利用rest参数可以向函数传入任意数目的参数
function add(...values) {
  let sum = 0;
  for (var val of values) {
    sum += val;
  }
  return sum;
}

add(2, 5, 3) // 10
```

	2. rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错 
	3.  函数的`length`属性，不包括 rest 参数 

### 代替arguments

```javascript
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```

​	arguments对象是类数组对象，要想使用数组方法，必须使用Array.prototype.slice.call将其转换为数组，而rest参数是一个真正的数组

## 3.函数内部的严格模式

​	es5，函数内部可以设定为严格模式

```javascript
function doSomething(a, b) {
  'use strict';
  // code
}
```

​	es6， 只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错 

```javascript
// 报错
function doSomething(a, b = a) {
  'use strict';
  // code
}

// 报错
const doSomething = function ({a, b}) {
  'use strict';
  // code
};

// 报错
const doSomething = (...a) => {
  'use strict';
  // code
};

const obj = {
  // 报错
  doSomething({a, b}) {
    'use strict';
    // code
  }
};
```

## 4. name属性

​	 函数的`name`属性，返回该函数的函数名

​	（1） 如果将一个匿名函数赋值给一个变量，ES5 的`name`属性，会返回空字符串，而 ES6 的`name`属性会返回实际的函数名 

```javascript
var f = function () {};

// ES5
f.name // ""

// ES6
f.name // "f"
```

​	（2） 如果将一个具名函数赋值给一个变量，则 ES5 和 ES6 的`name`属性都返回这个具名函数原本的名字 

```javascript
const bar = function baz() {};

// ES5
bar.name // "baz"

// ES6
bar.name // "baz"
```

​	（3） `Function`构造函数返回的函数实例，`name`属性的值为`anonymous` 

```javascript
(new Function).name // "anonymous"
```

​	（4） `bind`返回的函数，`name`属性值会加上`bound`前缀 

```javascript
function foo() {};
foo.bind({}).name // "bound foo"

(function(){}).bind({}).name // "bound "
```

## 5.箭头函数

### 基本用法

1.es6允许使用箭头（=>）定义函数

```javascript
var f = v => v;

// 等同于
var f = function (v) {
  return v;
};
```

2.如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分 

```javascript
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
  return num1 + num2;
};
```

3. 如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用`return`语句返回 

    ```javascript
    var sum = (num1, num2) => { return num1 + num2; }
    ```

	4. 由于大括号被解释为代码块，所以要返回对象时，必须在对象外面加上大括号，否则会报错

    ```javascript
    // 报错
    let getTempItem = id => { id: id, name: "Temp" };
    
    // 不报错
    let getTempItem = id => ({ id: id, name: "Temp" });
    ```

	5. 箭头函数与变量解构结合使用

    ```javascript
    const full = ({ first, last }) => first + ' ' + last;
    
    // 等同于
    function full(person) {
      return person.first + ' ' + person.last;
    }
    ```

	6. 注意点

    （1） 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象 ，与匿名函数在运行时决定this对象不同，箭头函数的this是固定的

    ​	`this`的本质：箭头函数没有自己的this，箭头函数内部的this就是外层代码的this，由于没有this所以箭头函数不能用作构造函数，也不能使用`bind` `apply` `call`改变this的指向

    ```javascript
    function foo() {
      setTimeout(() => {
        console.log('id:', this.id);
      }, 100);
    }
    
    var id = 21;
    
    foo.call({ id: 42 }); // 42 setTImeout参数中的箭头函数的定义生效是在foo函数中 而真正执行要在100ms后
    					// 如果此时是普通函数 this指向全局对象window 输出21 
    					// 但是箭头函数导致this总是指向函数定义生效时所在的对象 所以输出42
    ```

    ​	（2）不可以使用`yield`命令，因此箭头函数不能用作`Generator`函数
    
### 与普通函数的区别

1. 箭头函数没有自己的this，箭头函数的this在函数定义时就已经确定，为外层执行环境的this。
2. call apply bind无法改变this指向
3. 不能作为构造函数使用
4. 没有arguments
5. 没有原型对象prototype
6. 不能作为generator函数

### 不适用场合

​	1.定义对象方法，且方法内使用`this`

```javascript
const cat = {
    lives: 9,
    jumps: () => {
        this.lives--
    }
}

// 不能使用this 因为对象并不构成作用域 导致箭头函数定义时的作用域就是全局作用域
```

​	2.需要动态`this`的时候，不应该使用箭头函数

```javascript
var btn1 = document.getElementById('btn1')
btn1.addEventListener('click', () => {
    this.classList.toggle('on')
}, false)

// 报错 因为button的监听函数是一个箭头函数，导致里面的this就是全局对象
// 如果改成普通函数，this就会动态指向被点击的按钮对象
```



## 6.尾调用优化

#### 什么是尾调用？

​	指某个函数的最后一步是调用另一个函数 

```javascript
function f(x){
  return g(x);
}
```

​	以下三种情况，都不属于尾调用

```javascript
// 情况一
function f(x){
  let y = g(x);
  return y;
}

// 情况二
function f(x){
  return g(x) + 1;
}

// 情况三
function f(x){
  g(x);
}
```

#### 尾调用优化

​	函数在调用时会形成一个调用帧，当函数发送嵌套调用时，就会形成调用栈，当某个函数执行结束，该函数的调用帧从调用栈中弹出，并返回到上一个函数的调用帧。 尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了 

```javascript
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
```

​	 这就叫做“尾调用优化”（Tail call optimization），即只保留内层函数的调用帧 ，可以节省内存

#### 尾递归

## 7.Function.prototype.toString()

​	es2019以前，`toString()`方法会返回函数代码本身，并省略注释和空格

```javascript
function /* foo comment */ foo () {}

foo.toString()
// function foo() {}
// 省略了注释以及foo与()之间的空格
```

​	es2019，明确要求返回一模一样的原始代码，不省略注释和空格

```javascript
function /* foo comment */ foo () {}

foo.toString()
// "function /* foo comment */ foo () {}"
```

## 8.catch命令的参数省略

​	es2019允许`catch`语句省略参数

```javascript
try {
  // ...
} catch {
  // ...
}
```

# 数组的拓展

## 1.扩展运算符

​	 扩展运算符（spread）是三个点（`...`）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列 

	### 基本用法

```javascript
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]
```

1. 扩展运算符与正常的函数参数可以结合使用 

   ```javascript
   function f(v, w, x, y, z) { }
   const args = [0, 1];
   f(-1, ...args, 2, ...[3]);
   ```

2. 扩展运算符后面还可以放置表达式 

   ```javascript
   const arr = [
     ...(x > 0 ? ['a'] : []),
     'b',
   ];
   ```

3. 如果扩展运算符后面是一个空数组，则不产生任何效果

   ```javascript
   [...[], 1]
   // [1]
   ```

### 扩展运算符的应用

1. **替代函数的apply方法**，因为`...`可以展开数组，所以不需要`apply`方法，将数组转化为函数的参数

   ```javascript
   // ES5 的写法
   function f(x, y, z) {
     // ...
   }
   var args = [0, 1, 2];
   f.apply(null, args);
   
   // ES6的写法
   function f(x, y, z) {
     // ...
   }
   let args = [0, 1, 2];
   f(...args);
   
   // 使用Math.max方法求出数组中的最大值
   Math.max(...[14, 3, 77])
   ```

2. **复制数组**

   ```javascript
   const a1 = [1, 2];
   // 写法一
   const a2 = [...a1];
   // 写法二
   const [...a2] = a1;
   ```

3. **合并数组**

   ```javascript
   const arr1 = ['a', 'b'];
   const arr2 = ['c'];
   const arr3 = ['d', 'e'];
   
   // ES5 的合并数组
   arr1.concat(arr2, arr3);
   // [ 'a', 'b', 'c', 'd', 'e' ]
   
   // ES6 的合并数组
   [...arr1, ...arr2, ...arr3]
   // [ 'a', 'b', 'c', 'd', 'e' ]
   ```

4. **与解构赋值结合**，扩展运算符可以与解构赋值结合起来，用于生成数组

   ```javascript
   // ES5
   a = list[0], rest = list.slice(1)
   // ES6
   [a, ...rest] = list
   ```

5. **字符串**，扩展运算符可以将字符串转化为真正的数组

   ```javascript
   [...'hello']
   // [ "h", "e", "l", "l", "o" ]
   ```

6. **Iterator接口**， 任何定义了遍历器（Iterator）接口的对象（参阅 Iterator 一章），都可以用扩展运算符转为真正的数组 

   ```javascript
   let nodeList = document.querySelectorAll('div');
   let array = [...nodeList];
   // querySelectorAll 返回的NodeList对象是类数组对象 但是NodeList对象实现了Iterator接口
   // 所以可以使用扩展运算符将其转化为真正的数组
   ```

## 2.Array.from()

	### 基本用法

​	`Array.from`方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）

1. 将类数组对象（`Nodelist`、`arguments`）转化为数组

   ```javascript
   let arrayLike = {
       '0': 'a',
       '1': 'b',
       '2': 'c',
       length: 3
   };
   
   // ES5的写法
   var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
   
   // ES6的写法
   let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
   
   // NodeList对象
   let ps = document.querySelectorAll('p');
   Array.from(ps).filter(p => {
     return p.textContent.length > 100;
   });
   
   // arguments对象
   function foo() {
     var args = Array.from(arguments);
     // ...
   }
   ```

2. 将部署了`Iterator`接口的对象转化为数组

   ```javascript
   Array.from('hello')
   // ['h', 'e', 'l', 'l', 'o']
   
   let namesSet = new Set(['a', 'b'])
   Array.from(namesSet) // ['a', 'b']
   ```

3.  如果参数是一个真正的数组，`Array.from`会返回一个一模一样的新数组 

   ```javascript
   Array.from([1, 2, 3])
   // [1, 2, 3]
   ```

4.  `Array.from`还可以接受第二个参数，作用类似于数组的`map`方法，用来对每个元素进行处理，将处理后的值放入返回的数组 

   ```javascript
   Array.from(arrayLike, x => x * x);
   // 等同于
   Array.from(arrayLike).map(x => x * x);
   
   Array.from([1, 2, 3], (x) => x * x)
   // [1, 4, 9]
   ```

5.  `Array.from`的第三个参数，用来绑定`this`

## 3.Array.of()

	### 基本用法

​	 `Array.of`方法用于将一组值，转换为数组 

```javascript
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
```

## 4.数组实例的copyWithin()

### 基本用法

 数组实例的`copyWithin()`方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组 

#### 参数

- target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
- start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。
-  这三个参数都应该是数值，如果不是，会自动转为数值 

```javascript
[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]
```

## 5.数组实例的 find() 和 findIndex()

### 基本用法

-  数组实例的`find`方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为`true`的成员，然后返回该成员。如果没有符合条件的成员，则返回`undefined`

  ```javascript
  [1, 4, -5, 10].find((value, index, arr) => value < 0)
  // -5
  ```

-  数组实例的`findIndex`方法的用法与`find`方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回`-1` 

  ```javascript
  [1, 5, 10, 15].findIndex(function(value, index, arr) {
    return value > 9;
  }) // 2
  ```

-  这两个方法都可以接受第二个参数，用来绑定回调函数的`this`对象 

  ```javascript
  function f(v){
    return v > this.age;
  }
  let person = {name: 'John', age: 20};
  [10, 12, 26, 15].find(f, person);    // 26
  ```

## 6.数组实例的fill()

### 基本用法

​	 `fill`方法使用给定值，填充一个数组 

```javascript
['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]
```

-  `fill`方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置 

  ```javascript
  ['a', 'b', 'c'].fill(7, 1, 2)
  // ['a', 7, 'c']
  ```

## 7.数组实例的 entries()，keys() 和 values()

### 基本用法

-  ES6 提供三个新的方法——`entries()`，`keys()`和`values()`——用于遍历数组。它们都返回一个遍历器对象 , 可以用`for...of`循环进行遍历 

-  `keys()`是对键名的遍历

-  `values()`是对键值的遍历 

-  `entries()`是对键值对的遍历 

  ```javascript
  for (let index of ['a', 'b'].keys()) {
    console.log(index);
  }
  // 0
  // 1
  
  for (let elem of ['a', 'b'].values()) {
    console.log(elem);
  }
  // 'a'
  // 'b'
  
  for (let [index, elem] of ['a', 'b'].entries()) {
    console.log(index, elem);
  }
  // 0 "a"
  // 1 "b"
  ```

## 8.数组实例的 includes()

### 基本用法

-  `Array.prototype.includes`方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的`includes`方法类似 

  ```javascript
  [1, 2, 3].includes(2)     // true
  [1, 2, 3].includes(4)     // false
  [1, 2, NaN].includes(NaN) // true
  ```

-  该方法的第二个参数表示搜索的起始位置，默认为`0`。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为`-4`，但数组长度为`3`），则会重置为从`0`开始 

  ```javascript
  [1, 2, 3].includes(3, 3);  // false
  [1, 2, 3].includes(3, -1); // true
  ```

- 与`indexOf`不同，不存在对`NaN`的误判

  ```javascript
  [NaN].indexOf(NaN)
  // -1
  
  [NaN].includes(NaN)
  // true
  ```

## 9.数组实例的 flat()，flatMap()

### 基本用法

-  `Array.prototype.flat()`用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响 

  ```javascript
  [1, 2, [3, 4]].flat()
  // [1, 2, 3, 4]
  ```

-  `flat()`默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将`flat()`方法的参数写成一个整数，表示想要拉平的层数，默认为1 

  ```javascript
  [1, 2, [3, [4, 5]]].flat()
  // [1, 2, 3, [4, 5]]
  
  // 参数为2 拉平两层
  [1, 2, [3, [4, 5]]].flat(2)
  // [1, 2, 3, 4, 5]
  
  // 将Infinity关键字作为参数 无论多少层都会拉平
  [1, [2, [3]]].flat(Infinity)
  // [1, 2, 3]
  ```

-  如果原数组有空位，`flat()`方法会跳过空位 

  ```javascript
  [1, 2, , 4, 5].flat()
  // [1, 2, 4, 5]
  ```

-  `flatMap()`方法对原数组的每个成员执行一个函数（相当于执行`Array.prototype.map()`），然后对返回值组成的数组执行`flat()`方法。该方法返回一个新数组，不改变原数组 

  ```javascript
  // 相当于 [[2, 4], [3, 6], [4, 8]].flat()
  [2, 3, 4].flatMap((x) => [x, x * 2])
  // [2, 4, 3, 6, 4, 8]
  ```

-  `flatMap()`只能展开一层数组 

## 10.数组的空位

 数组的空位指，数组的某一个位置没有任何值（不是`undefiend`）。比如，`Array`构造函数返回的数组都是空位

```javascript
Array(3) // [, , ,]
```

### es5对空位的处理

- `forEach()`, `filter()`, `reduce()`, `every()` 和`some()`都会跳过空位。

- `map()`会跳过空位，但会保留这个值

- `join()`和`toString()`会将空位视为`undefined`，而`undefined`和`null`会被处理成空字符串。

  ```javascript
  // forEach方法
  [,'a'].forEach((x,i) => console.log(i)); // 1
  
  // filter方法
  ['a',,'b'].filter(x => true) // ['a','b']
  
  // every方法
  [,'a'].every(x => x==='a') // true
  
  // reduce方法
  [1,,2].reduce((x,y) => x+y) // 3
  
  // some方法
  [,'a'].some(x => x !== 'a') // false
  
  // map方法
  [,'a'].map(x => 1) // [,1]
  
  // join方法
  [,'a',undefined,null].join('#') // "#a##"
  
  // toString方法
  [,'a',undefined,null].toString() // ",a,,"
  ```

### es6对空位的处理

es6明确将空位转为`undefiend`

-  `Array.from`方法会将数组的空位，转为`undefined`，也就是说，这个方法不会忽略空位 

  ```javascript
  Array.from(['a',,'b'])
  // [ "a", undefined, "b" ]
  ```

-  扩展运算符（`...`）也会将空位转为`undefined` 

  ```javascript
  [...['a',,'b']]
  // [ "a", undefined, "b" ]
  ```

-  `copyWithin()`会连空位一起拷贝 

  ```javascript
  [,'a','b',,].copyWithin(2,0) // [,"a",,"a"]
  ```

-  `fill()`会将空位视为正常的数组位置 

  ```javascript
  new Array(3).fill('a') // ["a","a","a"]
  ```

-  `for...of`循环也会遍历空位 

  ```javascript
  let arr = [, ,];
  for (let i of arr) {
    console.log(1);
  }
  // 1
  // 1
  ```

-  `entries()`、`keys()`、`values()`、`find()`和`findIndex()`会将空位处理成`undefined` 

  ```javascript
  // entries()
  [...[,'a'].entries()] // [[0,undefined], [1,"a"]]
  
  // keys()
  [...[,'a'].keys()] // [0,1]
  
  // values()
  [...[,'a'].values()] // [undefined,"a"]
  
  // find()
  [,'a'].find(x => true) // undefined
  
  // findIndex()
  [,'a'].findIndex(x => true) // 0
  ```

## 11.Array.prototype.sort() 的排序稳定性

es2019规定， `Array.prototype.sort()`的默认排序算法必须稳定 

# 对象的拓展

## 1.对象的简洁表示

### 基本使用

 ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法 

- 属性简写

  ```javascript
  const foo = 'bar';
  const baz = {foo};
  baz // {foo: "bar"}
  
  // 等同于
  const baz = {foo: foo};
  ```

- 方法简写

  ```javascript
  const o = {
    method() {
      return "Hello!";
    }
  };
  
  // 等同于
  
  const o = {
    method: function() {
      return "Hello";
    }
  };
  ```

## 2.属性名表达式

### 基本使用

 ES6 允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内 

```javascript
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};
```

## 3.方法的name属性

### 基本使用

 函数的`name`属性，返回函数名。对象方法也是函数，因此也有`name`属性 

```javascript
const person = {
  sayName() {
    console.log('hello!');
  },
};

person.sayName.name   // "sayName"
```

-  `bind`方法创造的函数，`name`属性返回`bound`加上原函数的名字；`Function`构造函数创造的函数，`name`属性返回`anonymous` 

  ```javascript
  (new Function()).name // "anonymous"
  
  var doSomething = function() {
    // ...
  };
  doSomething.bind().name // "bound doSomething"
  ```

-  如果对象的方法是一个 Symbol 值，那么`name`属性返回的是这个 Symbol 值的描述 

  ```javascript
  const key1 = Symbol('description');
  const key2 = Symbol();
  let obj = {
    [key1]() {},
    [key2]() {},
  };
  obj[key1].name // "[description]"
  obj[key2].name // ""
  ```

## 4.属性的可枚举性和遍历

### 可枚举性

对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。描述对象的`enumerable`属性，即为可枚举型，当该属性为`false`，某些操作会忽略当前属性

有四个操作会忽略`enumerable`为`false`的属性

- `for...in`循环：只遍历对象自身的和继承的可枚举的属性。
- `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
- `JSON.stringify()`：只串行化对象自身的可枚举的属性。
- `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝对象自身的可枚举的属性。

### 属性的遍历

有5种方法可以遍历对象的属性

- **for ...in**

   `for...in`循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性） 

- **Object.keys(obj)**

   `Object.keys`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名 

- **Object.getOwnPropertyNames(obj)**

   `Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名 

-  **Object.getOwnPropertySymbols(obj)** 

   `Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有 Symbol 属性的键名 

-  **Reflect.ownKeys(obj)** 

   `Reflect.ownKeys`返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举 

## 5.super关键字

### 基本使用

`super`关键字，指向当前对象的原型对象

```javascript
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```

`super`关键字只能用在对象的方法中，用在其他方法中会报错

```javascript
// 报错
const obj = {
  foo: super.foo
}

// 报错
const obj = {
  foo: () => super.foo
}

// 报错
const obj = {
  foo: function () {
    return super.foo
  }
}

// 只有对象的简写属性 javascript引擎才可以确定是对象方法
```



## 6.对象的扩展运算符

### 解构赋值

```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
  // 变量z读取等号右边尚未读取的键 将它们连同值一起拷贝
```

### 扩展运算符

#### 基本用法

-  对象的扩展运算符（`...`）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中 

  ```javascript
  let z = { a: 3, b: 4 };
  let n = { ...z };
  n // { a: 3, b: 4 }
  ```

-  由于数组是特殊的对象，所以对象的扩展运算符也可以用于数组 

  ```javascript
  let foo = { ...['a', 'b', 'c'] };
  foo
  // {0: "a", 1: "b", 2: "c"}
  ```

-  如果扩展运算符后面是一个空对象，则没有任何效果 

  ```javascript
  {...{}, a: 1}
  // { a: 1 }
  ```

-  如果扩展运算符后面不是对象，则会自动将其转为对象 

  ```javascript
  // 等同于 {...Object(1)}
  {...1} // {}
  
  // 等同于 {...Object(true)}
  {...true} // {}
  
  // 等同于 {...Object(undefined)}
  {...undefined} // {}
  
  // 等同于 {...Object(null)}
  {...null} // {}
  ```

-  如果扩展运算符后面是字符串，它会自动转成一个类似数组的对象，因此返回的不是空对象 

  ```javascript
  {...'hello'}
  // {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}
  ```

## 7.链判断运算符

es2019引入的链判断运算符`?.`用于简化层层判断

```javascript
const firstName = message?.body?.user?.firstName || 'default';
const fooValue = myForm.querySelector('input[name=foo]')?.value
```

### 基本用法

- `obj?.prop` // 对象属性

- `obj?.[expr]` // 同上

- `func?.(...args)` // 函数或对象方法的调用

  ```javascript
  iterator.return?.()
  
  // 判断iterator.return()方法是否存在 如果存在立即调用
  ```

## 8.Null判断符

 [ES2020](https://github.com/tc39/proposal-nullish-coalescing) 引入了一个新的 Null 判断运算符`??`。它的行为类似`||`，但是只有运算符左侧的值为`null`或`undefined`时，才会返回右侧的值 

## 9.对象的新增方法

### Object.is()

`Object.is()`用来比较两个值是否严格相等，与严格比较运算符`===`的行为基本一致

有两个不同之处：1. `+0`不等于`-0`    2.`NaN`等于自身

```javascript
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### Object.assign()

#### 基本用法

-  `Object.assign`方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）

  ```javascript
  const target = { a: 1, b: 1 };
  
  const source1 = { b: 2, c: 2 };
  const source2 = { c: 3 };
  
  Object.assign(target, source1, source2);
  target // {a:1, b:2, c:3}
  ```

-  如果只有一个参数，`Object.assign`会直接返回该参数 

  ```javascript
  const obj = {a: 1};
  Object.assign(obj) === obj // true
  ```

- 第一个参数如果不能转化为对象就会报错，后面的参数如果不能转化为对象不会报错

  ```javascript
  let obj = {a: 1};
  Object.assign(obj, undefined) === obj // true
  Object.assign(obj, null) === obj // true
  Object.assign(undefined) // 报错
  Object.assign(null) // 报错
  ```

-  属性名为 Symbol 值的属性，也会被`Object.assign`拷贝

### Object.getOwnPropertyDescriptors()

 ES5 的`Object.getOwnPropertyDescriptor()`方法会返回某个对象属性的描述对象 

```javascript
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }
```

### __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()

-  `__proto__`属性（前后各两个下划线），用来读取或设置当前对象的原型对象（prototype）。目前，所有浏览器（包括 IE11）都部署了这个属性 
-  `Object.setPrototypeOf`方法的作用与`__proto__`相同，用来设置一个对象的原型对象（prototype），返回参数对象本身 
- `Object.setPropertyOf`用于读取一个对象的原型对象

### Object.keys()，Object.values()，Object.entries()

-  `Object.keys`方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名 
-  `Object.values`方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值 
-  `Object.entries()`方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组 
- 注意： 这三个方法只会遍历对象自身的（不会遍历继承）可枚举属性，不可遍历属性名是`Symbol`类型的属性



# Symbol基本数据类型

ES6 引入了一种新的原始数据类型`Symbol`，表示独一无二的值。

## 1.  基本使用

- `Symbol()`函数用于生成Symbol值，所以对象的属性名有两种数据类型，一种是字符串，一种是Symbol。只要属性名是Symbol，就可以保证不会与其他属性名冲突

```javascript
let s = Symbol();
  
typeof s
// "symbol"
```

- `Symbol()`函数前不可以使用`new`操作符，因为Symbol是原始类型值不是对象

- `Symbol()`函数接受一个字符串作为参数，表示对Symbol实例的描述

```javascript
let s1 = Symbol('foo');
let s2 = Symbol('bar');
s1 // Symbol(foo)
s2 // Symbol(bar)
  
s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

-  `Symbol`函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的`Symbol`函数的返回值是不相等的 

  ```javascript
  // 有参数的情况
  let s1 = Symbol('foo');
  let s2 = Symbol('foo');
  ```

- Symbol值不能与其他类型值进行计算，会报错

- Symbol值可以转化为字符串，布尔值

## 2.Symbol属性值的遍历

- 不会被`for...in` `for...of` `Object.keys()` `Object.getOwnPropertyNames()` `JSON.stringify()`返回
- `Object.getOwnPropertySymbols()`，可以获取指定对象的所有Symbol属性名

- `Reflect.ownKeys()`方法可以返回所有类型的键名，包括常规键名和 Symbol 键名 

## 3.Symbol.for()，Symbol.keyFor()

### 3.1 Symbol.for()

-`Symbol.for()` 接受一个字符串作为参数，然后搜索有没有以该参数为名称的Symbol值
-如果有则返回
-如果没有，建一个以该字符串为名称的Symbol值，并注册到全局

### 3.1.1 Symbol.for()与Symbol()的区别

-Symbol.for()返回的Symbol值会被登记在全局环境中供搜索
-Symbol()不会登记在全局

### 3.2 Symbol.keyFor()

-返回一个已等级的Symbol类型的key


## 4.内置的Symbol值

es6提供了11个内置的Symbol值，指向语言内部使用的方法

- `Symbol.hasInstance` 当其他对象使用`instanceof`运算符，判断是否为改对象的实例时，会调用这个方法
-  `Symbol.isConcatSpreadable`属性等于一个布尔值，表示该对象用于`Array.prototype.concat()`时，是否可以展开 
-  对象的`Symbol.species`属性，指向一个构造函数。创建衍生对象时，会使用该属性 
-  对象的`Symbol.match`属性，指向一个函数。当执行`str.match(myObject)`时，如果该属性存在，会调用它，返回该方法的返回值 
-  对象的`Symbol.replace`属性，指向一个方法，当该对象被`String.prototype.replace`方法调用时，会返回该方法的返回值 
-  对象的`Symbol.search`属性，指向一个方法，当该对象被`String.prototype.search`方法调用时，会返回该方法的返回值 
-  对象的`Symbol.split`属性，指向一个方法，当该对象被`String.prototype.split`方法调用时，会返回该方法的返回值 
-  对象的`Symbol.iterator`属性，指向该对象的默认遍历器方法 
-  对象的`Symbol.toPrimitive`属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值 
-  对象的`Symbol.toStringTag`属性，指向一个方法。在该对象上面调用`Object.prototype.toString`方法时，如果这个属性存在，它的返回值会出现在`toString`方法返回的字符串之中，表示对象的类型 
-  对象的`Symbol.unscopables`属性，指向一个对象。该对象指定了使用`with`关键字时，哪些属性会被`with`环境排除 

# async和await

## 1.基本使用

### 1.1 `async`函数返回一个`Promise`对象

```js
async function f() {
	return 1 // 相当于将函数的返回值通过Promise.resolve()包装
}
```

所以`async`的返回值，可以被`then`方法的回调函数接收

如果`async`函数内部抛出错误，会导致返回的`Promise`对象变为`reject`状态

```js
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log(v),
  e => console.log(e)
)
// Error: 出错了
```

### 1.2 `Promise`对象的状态变化

`async`函数返回的`Promise`对象，必须等到内部所有`await`命令后的`Promise`对象执行完，才会发生状态改变

### 1.3 `await`命令

如果`await`后是一个`Promise`对象，则返回`Promise`对象的`value`(`reason`)
如果不是，直接返回对应值

如果`await`后的`Promise`对象变为`rejected`状态，那么

1. `async`函数返回的`Promise`的状态变为`rejected`
	
	```js
	async function f() {
		await Promise.reject('出错了')
	}
	f().then((v) => {
		console.log(v)
	}, (e) => {
		console.log(e)
	})
	// 出错了
	```
2. 任何一个`await`语句后的`Promise`对象变为`rejected`状态，整个`async`函数都会中断
	```js
	async function f() {
	await Promise.reject('出错了');
	await Promise.resolve('hello world'); // 不会执行
	}
	```










































































   ```

   ```