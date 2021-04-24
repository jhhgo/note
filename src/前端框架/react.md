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

现代框架的原则是不直接操作DOM，不过在某些特定情况我们希望打破该原则。

比如当我们希望管理输入框的焦点，这个时候我们可以使用ref来获取对应的DOM元素。👇

```jsx
class App extends React.Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }

    handleClick = () => {
        this.myRef.current.focus()
    }

    render() {
        return (
            <div>
                <input type="text" ref={this.myRef} />
                <button onClick={this.handleClick}>点我</button>
            </div>
        )
    }
}
```

正常函数组件不能被分配refs，以下代码会报错。

```jsx
const FancyButton = () => <button>jhh</button>
// 函数组件不能被分配refs
<FancyButton ref={myRef}></FancyButton>
```

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
- Context
- redux

### Context

Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。举个例子，在下面的代码中，我们通过一个 “theme” 属性手动调整一个按钮组件的样式：

```jsx
class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // Toolbar 组件接受一个额外的“theme”属性，然后传递给 ThemedButton 组件。
  // 如果应用中每一个单独的按钮都需要知道 theme 的值，这会是件很麻烦的事，
  // 因为必须将这个值层层传递所有组件。
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
```

使用 context, 我们可以避免通过中间元素传递 props👇

```jsx
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext('light');
class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

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

## 合成事件

SyntheticEvent 实例将被传递给你的事件处理函数，它是浏览器的原生事件的跨浏览器包装器。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括` stopPropagation()` 和 `preventDefault()`。

即`event`是合成事件，抹平了浏览器差异。

- 原生事件: 在 `componentDidMount`生命周期里边进行`addEventListener`绑定的事件
- 合成事件: 通过 JSX 方式绑定的事件，比如`onClick={() => this.handle()}`

通过jsx注册合成事件的过程，大致可以分为三步。

1. 事件注册：把事件注册到`document`上
2. 事件存储：把 React 组件内的所有事件统一的存放到一个对象里，缓存起来，为了在触发事件的时候可以查找到对应的方法去执行
3. 事件分发：从触发事件的对象开始，向父元素回溯，依次调用它们注册的事件 callback
4. 事件执行

## redux

redux是状态管理工具。可以用来进行兄弟组件的通信。

### redux基本使用

**什么时候需要使用redux？**

- 某个组件的状态，需要共享
- 某个状态需要在任何地方都可以拿到
- 一个组件需要改变全局状态
- 一个组件需要改变另一个组件的状态

- action：用户操作时，分发一个action，表示state药品发生变化了

  1. 包含一个 type 字段，常被定义为字符串常量，表示要执行的动作。
  2. 其他结构完全自定义，通常用来传递数据，建议尽量减少在 action 中传递的数据

- reducer：Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

  1. 接收旧的 state，action，更新并返回新的 state
  2. 不要修改旧的 state

- store：Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。

  1. `getState()`方法获取某个时间点的 state
  2. `dispatch(action)`用户操作导致dispatch(action)调用，分发action。内部会调用`reducer`更新状态
  3. `subscribe()`注册监听器

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
const createAcion = (val) => ({ type: 'add', val })

// 使用store.dispatch来分发action
// 内部会自动调用reducer更新状态
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

### redux核心原则

1. 单一数据源：整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。

2. State 是只读的：唯一改变 state 的方法就是触发 action(`dispatch(action)`)，action 是一个用于描述已发生事件的普通对象。

3. 使用纯函数来执行修改：Reducer 只是一些纯函数，它接收先前的 state 和 action，并返回新的 state。

### redux数据流与flux数据流

**redux数据流**

![redux数据流](C:\Users\姜嘿嘿\Desktop\imgs\redux数据流.png)

1. 首先，用户（通过View）发出Action，发出方式就用到了dispatch方法。
2. 然后，Store自动调用Reducer，并且传入两个参数：当前State和收到的Action，Reducer会返回新的State。
3. State一旦有变化，Store就会调用监听函数，来更新View。

**flux数据流**

![flux数据流](C:\Users\姜嘿嘿\Desktop\imgs\flux数据流.png)

1. 用户访问View。
2. View发出用户的Action。
3. Dispatcher收到Action，要求Store进行相应的更新。
4. Store更新后，发出一个“change”事件。

**redux和flux区别**

1. Redux只有一个Store。

> Flux中允许有多个Store，但是Redux中只允许有一个，相较于Flux，一个Store更加清晰，容易管理。Flux里面会有多个Store存储应用数据，并在Store里面执行更新逻辑，当Store变化的时候再通知controller-view更新自己的数据；Redux将各个Store整合成一个完整的Store，并且可以根据这个Store推导出应用完整的State。

> 同时Redux中更新的逻辑也不在Store中执行而是放在Reducer中。单一Store带来的好处是，所有数据结果集中化，操作时的便利，只要把它传给最外层组件，那么内层组件就不需要维持State，全部经父级由props往下传即可。子组件变得异常简单。

2. Redux中没有Dispatcher的概念。

> Redux去除了这个Dispatcher，使用Store的Store.dispatch()方法来把action传给Store，由于所有的action处理都会经过这个Store.dispatch()方法，Redux聪明地利用这一点，实现了与Koa、RubyRack类似的Middleware机制。Middleware可以让你在dispatch action后，到达Store前这一段拦截并插入代码，可以任意操作action和Store。很容易实现灵活的日志打印、错误收集、API请求、路由等操作。

## react hook

简单来说，通过 react hook 可以在 react 函数组件中使用 state 以及其他的 react 特性

### useState

```jsx
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

### useRef

```jsx
import React, { useRef } from 'react'

function App(props) {
    let refs = useRef(null)
    return (
    	<input ref={refs} />
    )
}
```

### useReducer

`useState`的替代方案，类似于`redux`。

```jsx
const initialState = {count: 0}
function reducer(state, action) {
  switch(action.type) {
    case 'increment':
      return {count: state.count + 1}
    case 'decrement':
      return {count: state.count - 1}
    default:
      throw new Error()
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      Count: {state.count}<br />
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </div>
  )
}
```

### useCallback

useCallback可以用来保存函数地址，使函数不会在每次渲染都变更地址。

一个死循环的例子👇

```jsx
function Child({val, getData}) {
  useEffect(() => {
    getData()
  }, [getData])
  return <div>{val}</div>
}

export default function App() {
  const [val, setVal] = useState('')
  
  function getData() {
  	setTimeout(() => {
  		setVal('newVal' + count)
  	})
  }

  return (
    <div>
      <Child val={val} getData={getData} />
    </div>
  )
}
```

以上例子，父亲组件传递`getData`给`Child`，`Child`在`useEffect`中调用，由于依赖了`getData`，所以需要在第二个参数中添加。

`Child`调用`getData`导致父组件的`val`发生变化，父组件重新渲染。重渲染导致`getData`函数地址发生变化。

`Child`接收的`getData`发生了变化，`useEffect`依赖发生变化，重新调用`getData`。

解决办法：利用useCallbakc保存函数地址，使得函数地址仅在依赖项发生变化时，才变化。👇

```jsx
function Child({val, getData}) {
  useEffect(() => {
    getData()
  }, [getData])
  return <div>{val}</div>
}

export default function App() {
  const [val, setVal] = useState('')
  
  const getData = useCallback(() => {
  	setTimeout(() => {
  		setVal('newVal' + count)
  	})
  }, [])

  return (
    <div>
      <Child val={val} getData={getData} />
    </div>
  )
}
```

### useMemo

`useMemo`接收两个参数，一个参数是函数，一个是依赖项。`useMemo`可以使函数仅在依赖项发生改变时执行，并且可以缓存函数执行的结果(useEffect不行)。

没有使用`useMemo`的情况👇

```jsx
function App() {
  const [val, setVal] = useState('')
  const [count, setCount] = useState(0)

  function getCountValue() {
    let sum = 0
    for (let i=0;i<100;i++) {
      sum += count
    }
    return sum
  }

  return (
    <div>
      Count-value: {getCountValue()} <br />
      <button onClick={() => setVal('change')}>change val</button>
      <button onClick={() => setCount(1)}>change count</button>
    </div>
  )
}
```

`getCountValue`会根据`count`值计算出一个值。`getCountValue`仅依赖`count`，但是当`val`发生变化，也会导致`getCountValue`的重新调用。

使用useMemo👇

```jsx
function App() {
  const [val, setVal] = useState('')
  const [count, setCount] = useState(0)

  const countValue = useMemo(() => {
    console.log('go');
    let sum = 0
    for (let i=0;i<100;i++) {
      sum += count
    }
    return sum
  }, [count])

  return (
    <div>
      Count-value: {countValue} <br />
      <button onClick={() => setVal('change')}>change val</button>
      <button onClick={() => setCount(1)}>change count</button>
    </div>
  )
}
```

`useMemo`缓存并返回函数执行的结果。并且仅在依赖项`count`发生变化时，才重新执行。


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