# react

## JSX

### {}表达式

在 JSX 语法中，可以在大括号内放置任何有效的 javascript 表达式。

```js
let myId = 'myh3'
let vDom = <h3 id={myh3}>{2 + 2}</h3>
```

实际上，Babel 会把 JSX 转译为`React.createElement()`函数调用，如下。

```js
const element = <h1 className="greeting">Hello, world!</h1>

// 等价于

const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!'
)

;<App />

// 等价于
React.createElement(App, null)
```

## 组件

### 创建组件

- 工厂函数
- es6 类组件

### props

组件可以接受一个参数`props`。

```html
<div id="app"></div>
```

```js
// 工厂函数
function Person(props) {
  return (
    <ul>
      <li>姓名: {props.name}</li>
      <li>年龄: {props.age}</li>
      <li>性别: {props.sex}</li>
    </ul>
  )
}
// es6类
class Person {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <ul>
        <li>姓名: {this.props.name}</li>
        <li>年龄: {this.props.age}</li>
        <li>性别: {this.props.sex}</li>
      </ul>
    )
  }
}
let p1 = {
  name: 'jhh',
  age: 20,
  sex: '男'
}
ReactDOM.render(<Person name= />, document.querySelector('#app'))
```

**默认值：**

同时`props`可以通过配置`defaultProps`设定默认值，当没有传入属性时，使用默认值。👇

```js
Person.defaultProps = {
  name: 'xxx',
  age: 18,
  sex: '女',
}
```

**PropType 类型检查：**

利用`PropType`可以对`props`中的属性进行类型和必要性检查。注意：`React.PropTypes`已移入另一个包中，需要使用`prop-types`库。

官网配置 👉[prop-types](https://react.docschina.org/docs/typechecking-with-proptypes.html)

```js
Person.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  sex: PropTypes.string.isRequired,
}
```

### state

state 可以理解为组件内部的状态？State 与 props 类似，但是 state 是私有的，并且完全受控于当前组件。

**初始化状态：**

```html
<div id="app"></div>
```

```js
class Count extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
    }
  }
  render() {
    return (
      <div>
        // 通过this.state.count读取
        <span>点击了{this.state.count}次</span>
        <br />
        <button onClick={this.increment.bind(this)}>+1</button>
      </div>
    )
  }
}
```

**状态更新：setState({})**

错误的做法：直接修改 state。

```js
increment() {
  // 虽然state.count确实自增了，但是这不会重新渲染组件
  this.state.count++
}
```

正确的做法：通过`setState`设置

```js
increment() {
  let count = this.state.count + 1
  this.setState({count})
}
```

state 的更新可能/通常是异步的

```js
class App ..{
    ..() {
        this.state = {
            count: 0
        }
    }

    ..() {
        this.setState({
        	count: 1
    	})
        console.log(this.state.count) // 输出0
    }
}
```

想要获取修改后的值，我们可以传一个回调函数给 setState

```js
this.setState(
  {
    count: 1,
  },
  () => {
    console.log(this.state.count) // 输出1
  }
)
```

### refs

### 事件处理

- React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。

```html
<!-- 传统html -->
<button onclick="handleClick()">click me</button>
```

```js
// react
<button onClick={handleClick}>click me</button>
```

**取消默认行为：**

传统 html 通过返回值为`false`来取消默认行为。React 不行，必须使用`event.preventDefault()`

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

```js
function ActionLink() {
  function handleClick(e) {
    e.preventDefault()
    console.log('The link was clicked.')
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  )
}
```

**事件处理函数：**

当使用 es6 class 语法定义一个组件时，通常将事件处理函数声明为 class 中的方法

同时为了在回调函数中使用`this`必须通过`bind`绑定`this`

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    // 给事件处理函数绑定this
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    console.log('click me')
  }

  render() {
    return <button onClick={this.handleClick}></button>
  }
}
```

**向事件处理函数传递参数：**

不能直接向事件处理函数传递参数 👇

```js
// 错误的
<button onClick={this.handleClick(arg)}></button>
```

react 中向事件处理函数传递参数的方法有两种:

- 匿名函数
- `bind`

```js
// 匿名函数
<button onClick={(e) => this.handleClick(arg, e)}></button>

// bind
<button onClick={this.handleClick.bind(this, id)}></button>
```

### 组件生命周期

[组件生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

**挂载：**

- constructor()
- static getDerivedStateFromProps()
- render()
- componetDidMount()

**更新：**

- static getDerivedStateFromProps()
- shouldComponentUpdate()
- render()
- getSnapshotBeforeUpdate()
- componetDidUpdate()

**卸载：**

- componentWillUnmount()

下面是一个 clock 例子 👇

```js
<script type="text/babel">
    class Clock extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          data: new Date()
        }
        this.tick = this.tick.bind(this)
      }
      // 组件挂载后执行
      componentDidMount(){
        // 开启定时器
        this.timer = setInterval(() => {
          console.log('定时器执行...')
          this.tick()
        }, 1000)
      }
      // 组件卸载前执行
      componentWillUnmount(){
        // 在组件卸载前清除定时器，防止内存泄露
        clearInterval(this.timer)
      }
      // 更新时间
      tick() {
        this.setState({
          data: new Date()
        })
      }
      deleteComponent() {
        ReactDOM.unmountComponentAtNode(document.querySelector('#app'))
      }
      render() {
        return (
          <div>
            <h1>hello react</h1>
            <h2>当前时间 {this.state.data.toLocaleTimeString()}</h2>
            <button onClick={this.deleteComponent}>删除组件</button>
          </div>
        )
      }
    }

    ReactDOM.render(<Clock/>, document.querySelector('#app'))
  </script>
```

## 表单

### 受控组件

通常，在 HTML 中表单元素自己维护 state。而在 React 中，可变状态通常保存在组件的 state 属性中，并且只能通过`setState()`更新（相当于被 React 劫持？）

React 的 state 成为组件/表单的唯一数据源，渲染表单的组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。当然，与之对应的成为“非受控组件”。

```js
// 受控组件
class NameForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }
  }
  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}
```

## 条件渲染

使用 JavaScript 运算符 if 或者条件运算符去创建元素来表现当前的状态，然后让 React 根据它们来更新 UI

```js
// 根据登录状态渲染组件
function UserGreeting(props) {
  return <h1>Welcome back</h1>
}
function GuestGreeting(props) {
  return <h1>Please sign up</h1>
}
function Greeting(props) {
  if (isLoggedIn) {
    return <UserGreeting />
  }
  return <GuestGreeting />
}
ReactDOM.render(
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
)
```

### 与运算符&&

```js
function App(props) {
  return <div>{props.count > 0 && <span>hello world</span>}</div>
}
```

true && expression 总是会返回 expression, 而 false && expression 总是会返回 false。

### 三目运算符

```js
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

### 阻止组件渲染

让`render`方法直接返回`null`，从而不进行任何渲染

```js
function App(props) {
  if (props.flag) return null
  // ...
}
```

## 组件间通信

**父子间通信**

- 父组件通过`props`传递数据给子组件
- 父组件通过`props`传递函数给子组件，子组件内部调用传参，实现子组件向父组件通信

## react-router

**基本使用：**

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, NavLink, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <NavLink to="/">首页</NavLink>
      <NavLink to="/blog">博客</NavLink>
      <NavLink to="/about">关于我</NavLink>

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog">
          <Blog />
        </Route>
        <Route path="/about">
          <About />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
```

**动态路由匹配：**

```js
import {
    ...
    useParams,
} from 'react-router-dom'

<Switch>
  <Route path='/user/:id'>
    <User />
  </Route>
</Switch>


function User() {
  // 或者 let {id} = this.props.match.params
  let { id } = useParams()
  return (
    <div>
      user: id
    </div>
  )
}
```

## redux

- action
  1. 描述有事情发生了
  2. 包含一个 type 字段，常被定义为字符串常量，表示要执行的动作。
  3. 其他结构完全自定义，通常用来传递数据，建议尽量减少在 action 中传递的数据
- reducer
  1. 接收旧的 state，action，更新并返回新的 state
  2. 不要修改旧的 state
- store
  1. 维持应用的 state
  2. 利用`getState()`方法获取 state
  3. 利用`dispatch(action)`方法更新 state
  4. 利用`subscribe()`注册监听器

**基本使用**

```js
import { createStore } from 'redux'
// reducer是一个纯函数，参数为state（可以设置初始值），和action，返回新的state
const reducer = (state = 0, action) => {
  switch (action.type) {
    case 'add':
      return state + action.data
    case 'delete':
      return state - action.data
    default:
      return state
  }
}

// createStore创建一个store
const store = createStore(reducer)

// 获取状态
store.getState()

// action是一个对象，通常有type属性
const action = {
  type: 'add',
  data: 1,
}

// 可以用action生成函数来生成action
const createAcion = (val) => ({ type: 'add', val: 1 })

// 使用store.dispatch来分发action
store.dispatch(action)
store.dispatch(createAction(2))

// store订阅监听器
// dispatch后会调用
store.subscribe(() => {
  console.log('change state')
})
```

**createStore 基本实现**

```js
const createStore = (reducer) => {
  let state
  let listeners = []
  const getState = () => {
    return state
  }
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }
  const subscribe = (listener) => {
    listeners.push(listener)
    // 调用subscribe会返回一个取消订阅函数
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }
  // 第一次创建store后会默认调用一次
  dispatch()
  return {
    getState,
    dispatch,
    subscribe,
  }
}
```

**实战代码**

```js
// action.js
export const CHANGE_CHANNEL = 'change_channel'
// action生成函数
export const changeChannel = (channel) => ({
  type: CHANGE_CHANNEL,
  channel,
})
```

```js
// reducer.js
import { CHANGE_CHANNEL } from './action.js'
// combineReducers用来合并多个reducer
import { combineReducers } from 'redux'

const channel = (state = 'cctv5', action) => {
  switch (action.type) {
    case CHANGE_CHANNEL:
      return action.channel
    default:
      return state
  }
}
// 为了测试，简单的reducer
const name = (state = 'test', action) => {
  return state
}
const rootReducer = combineReducers({
  channel,
  name,
})
// 暴露顶级reducer
export default rootReducer
```

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
// 在渲染根组件时使用，让所有组件都可以访问store，而不必显示传递
import { Provider } from 'react-redux'
import reducer from './reducers.js'
import App from './app.js'

const store = createStore(reducer)
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

**容器组件**

技术上讲，容器组件就是使用 store.subscribe() 从 Redux state 树中读取部分数据，并通过 props 来把这些数据提供给要渲染的组件。

个人理解：容器组件可以将 redux 和 react 关联起来，具体地说容器组件向展示组件传入组件渲染需要的 state，以及更新 state 需要的方法。

mapStateToProps 这个函数来指定如何把当前 Redux store state 映射到展示组件的 props 中。判断组件需要哪些 state

mapDispatchToProps() 方法接收 dispatch() 方法并返回期望注入到展示组件的 props 中的回调方法。

以 redux 官网的 todolist 为例 👇

```js
// VisibleTodoList 需要计算传到 TodoList 中的 todos，所以定义了根据 state.visibilityFilter 来过滤 state.todos 的方法，并在 mapStateToProps 中使用。

// 根据state.visibilityFilter 来过滤 state.todos
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter((t) => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter((t) => !t.completed)
    case 'SHOW_ALL':
    default:
      return todos
  }
}

// 调用getVisibleTodos获取过滤好的state，并且会传递给展示组件
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter),
  }
}

//  VisibleTodoList 向 TodoList 组件中注入一个叫 onTodoClick 的 props ，还希望 onTodoClick 能分发 TOGGLE_TODO 这个 action
const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    },
  }
}

//  最后，使用 connect() 创建 VisibleTodoList，并传入这两个函数。
const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList)
export default VisibleTodoList
```

## react hook

简单来说，通过 react hook 可以在 react 函数组件中使用 state 以及其他的 react 特性

**useState**

```js
import React, { useState } from 'react'
function App() {
  // 声明了一个叫count的state变量，并设置为0
  // 返回了当前state的值以及更新state的函数
  const { count, setCount } = useState(0)
  return (
    <div>
      click {count} times
      <button onClick={() => setCount(count + 1)}>click me</button>
    </div>
  )
}
```

useState 的使用：

1. useState 参数：`useState()`的唯一参数就是初始 state
2. useState 返回值：返回一个数组，包含了当前 state 以及更新 state 的函数

## 高阶组件

> 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

**具体而言，高阶组件是参数为组件，输出为新组件的函数**

```js
const CatWithMouse = withMouse(Cat)
```

```js
function App () {
  const CatWithMouse = withMouse(Cat)
  return <CatWithMouse />
}

function Cat(props) {
  let {x, y} = props.mouse
  return <img src='test.png' style={{position: 'absolute', left: x, top: y, width: '40px', height: '40px'}} />
}

function withMouse(WrappedWithMouse) {
  return function () {
    let [point, setPoint] = useState({x: 0, y: 0})
    const move = (e) => {
      setPoint({x: e.clientX, y: e.clientY})
    }
    return (
      <div style={{height: '100vh'}} onMouseMove={move}>
        鼠标位置：{point.x}, {point.y}
        <WrappedWithMouse mouse={point} />
      </div>
    )
  }
}
```