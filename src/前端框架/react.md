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

state可以理解为组件内部的状态？State 与 props 类似，但是 state 是私有的，并且完全受控于当前组件。

**初始化状态：**

```html
<div id="app"></div>
```

```js
class Count extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      count: 0
    }
  }
  render() {
    return (
      <div>
        // 通过this.state.count读取
        <span>点击了{this.state.count}次</span><br />
        <button onClick={this.increment.bind(this)}>+1</button>
      </div>
    )
  }
}
```

**状态更新：**

错误的做法：直接修改state。

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