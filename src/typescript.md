# typescript

## 静态类型

定义了就不可改变

```js
let count: number = 1
// 报错
count = '2'
```

**基础静态类型**

```js
// null undefined boolean void symbol
let a: number = 111
let a: string = '111'
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