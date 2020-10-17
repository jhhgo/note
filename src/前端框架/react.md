# react

## JSX

### {}表达式

在 JSX 语法中，可以在大括号内放置任何有效的 javascript 表达式。

```js
let myId = 'myh3'
let vDom = <h3 id={myh3}>{2 + 2}</h3>
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

**状态更新：**

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
