# typescript

## 变量声明

在声明变量时，指定变量的静态类型

```js
let count: number = 1
// count已经指定为number。报错
count = '2'
```

**基础静态类型**

```js
// null undefined boolean void symbol
let a: number = 111
let b: string = '111'
```

**对象静态类型**

```js
// 基础对象用法
const p1: {
  name: string,
  age: number
} = {
  name: 'jt',
  age: 20
}

// 数组类型
const names: stirng [] = {'jt', 'xmf', ''jhh}

// es6 class
class Person{}
const p1: Person = new Person()

// 函数类型
const foo: () => string = () => '123'
```

**自定义静态类型**

```js
interfact Person {
  name: string,
  age: number
}

const p1: Person = {
  name: 'jt',
  age: 20
}
```

## 接口

相当于自定义一种类型。被限定为该接口的变量，必须含有接口定义的属性、方法，并且类型要一致

**严格匹配和宽松匹配**

- 限定函数参数时，为宽松匹配
- 变量声明时限定，为严格匹配

```js
interfact A {
  bar: string;
}
// 报错，obj必须严格符合A，即有且只有一个属性bar且类型为string
let obj: A = {
  foo: 1,
  bar: '1'
}

let obj = {
  bar: '1',
  foo: 1
}
// 可以，只要参数满足A的要求就可以，且与属性顺序无关
function printA(obj: A) {
  console.log(obj.bar)
}
```

**可选属性**

接口里的属性不全都是必需的。

```js
interface Person {
  name: string;
  school?: string;
}
function printPerson(p: Person) {
  if (p.name) {
    console.log('my name is ' + p.name)
  }
  if (p.school) {
    console.log('and my school is ' + p.school)
  }
}
```

**只读属性**

一些对象属性只能在对象刚刚创建的时候修改其值。使用`readonly`指定只读属性

```js
interface Point {
  readonly x: number;
  readonly y: number;
}

let point: Point = {
  x: 1,
  y: 2
}
// 报错
point.x = 3
```

**定义函数**

接口中也可以定义函数

```js
interface funType {
  // 定义调用签名，即参数列表和返回值类型。参数列表中的每个参数都需要名字和类型
  (x: number, y: number): number;
}
let add: funType = function(x, y) {
  return x + y
}
// 报错，参数类型不对，返回值也不对
add(1, '2')
```

**类类型**

与java里接口的作用一致, TypeScript也能够用它来明确的强制一个类去符合某种契约。

```js
interface PersonInterFace {
  name: string;
  sayName(): void;
  setName(name: string): void;
}

class Person implements PersonInterFace {
  name = ''
  sayName() {
    console.log(this.name)
  }
  setName(name) {
    this.name = name
  }
}
```

注：接口不会检查静态部分

**继承接口**

接口之间也可以相互继承。支持多继承。可以拓展接口的功能

```js
interface A {
  bar: string;
}
interfact C {
  baz: string;
}
interface B extends A, C{
  foo: string;
}

let obj: B = {
  bar: '1',
  foo: '2',
  baz: '3'
}
```

## 类型注解和类型推断

- 通过`:`为变量指定类型
- typescript 会自动判断一些变量的类型

## 函数参数和返回类型的注解

**返回值类型注解**

```js
function add(x: number, y: number): number {
  return x + y
}

// 无返回值
function foo(str: string): void {
  console.log(str)
}
```

**参数类型注解**

```js
// 基本用法
function add(x: number, y: number) {
  return x + y
}

// 参数是对象时
function add({ x, y }: { x: number, y: number }) {
  return x + y
}
```

## 数组类型注解

```js
const arr: number[] = [1, 2, 3]
const arr: string[] = ['1', '2', '3']

const arr: (number | string)[] = [1, '2', 3]

const arr: {name: string, age: number}[] = [
  {
    name: 'jt',
    age: 19
  },
  {
    name: 'xmf',
    age: 20
  }
]
// 如果需要复用的话可以使用类型别名或者class
type Person = {name: string, age: number}
class Person {
  name: string,
  age: number
}
```

## interface

可以简化传参

```js
interface Person {
  name: string;
  age: number;
  // ? 代表这个属性可有可无
  school?: string;
  // 可以有任何属性
  [propname: string]: any;
  // 函数，返回值必须是string
  say(): string;
}

function introduce(p: Person) {
  console.log(`name: ${p.name}, age: ${p.age}`)
  p.school && console.log(`----school: p.school`)
}

// 使用implements可以使类也受interface约束
class Student implements Person {
  // 必须拥有接口中所定义的属性和方法
}

// 使用extends可以使一个接口继承自另一个接口并拓展功能
interface Teach extends Person {
  teach(): string;
}
```

## 类

**访问修饰符**

- public
- private 只能在类的内部使用
- protected 不允许在类的外部使用，但是可以在子类中使用

**抽象类**

```js
// 声明了一个抽象类
abstract class Person{
  // 抽象方法，不包含函数体，继承自抽象类的类必须实现全部的抽象方法
  abstract say()
}

class Student extends Person {
  say() {
    console.log('我是学生')
  }
}
```

## 联合类型和类型保护

**联合类型**

就是 | 只要满足其中一个类型就可以

```js
interface Person {
  say(): string;
}
interface Student {
  study(): string;
}

function bar(anyone: Person | Student) {
  anyone.say()
}
```

调用 bar 时存在问题，当 anyone 是 Student 类型时，没有 say 方法，程序报错。可以使用类型守护解决

**类型守护**

```js
// 直接断言
interface Student {
  isStudent: true;
  study(): string;
}
function bar(anyone: Person|Student) {
  if (anyone.isStudent) {
    (anyone as Student).study()
  } else {
    (anyone as Person).say()
  }
}
// in断言
function bar(anyone: Person|Student) {
  if ('study' in anyone) {
    anyone.study()
  } else {
    anyone.say()
  }
}
// typeof
function add(x: string|number, y: string|number) {
  if (typeof x === 'string' && typeof y === 'string') {
    return `${x}${y}`
  } else if (typeof x === 'number' && typeof y === 'number') {
    return x + y
  }
  return
}

// instanceof 用于对象
class MyObj {
  count:number
}
function addObj(first: Object | MyObj, second: Object | MyObj) {
  if (first instanceof MyObj && second instanceof MyObj) {
    return first.count + second.count
  }
  return 0
}
```

## 泛型

我的理解作用是可以动态的限定类型

```js
function join<Type>(first: Type, second: Type) {
  return `${first}${second}`
}

join<string>('hello', 'world')

// 数组泛型
function myFun<ANY>(params: ANY[]) {
  return params
}
// 也可以这样写
function myFun<ANY>(params: Array<ANY>) {
  return params
}
// 数组项必须是string
myFun<string>(['123', '456'])
// 定义多个泛型
function join<T,P>(first: T, second: P) {
  return `${first}${second}`
}
// 在类中使用泛型
```

## 命令空间