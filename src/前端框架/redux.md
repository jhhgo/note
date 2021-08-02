# redux

redux是状态管理工具。可以用来进行兄弟组件的通信。

## redux基本使用

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
  2. `dispatch(action)`用户操作导致`dispatch(action)`调用，分发`action`。内部会调用`reducer`更新状态
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

## redux核心原则

1. 单一数据源：整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。

2. State 是只读的：唯一改变 state 的方法就是触发 action(`dispatch(action)`)，action 是一个用于描述已发生事件的普通对象。

3. 使用纯函数来执行修改：Reducer 只是一些纯函数，它接收先前的 state 和 action，并返回新的 state。

## redux数据流与flux数据流

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