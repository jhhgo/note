# react流程

## JSX

首先，JSX语法会被`babel`编译如下👇

```js
<div id='box1'>1</div>

// 编译为createElement
React.createElement("div", {id: 'box1'}, 1) // 当不是类组件、函数组件，传的是字符串 如'div'

// 当为类组件、函数组件，传的是自身
class A extends Component() {

}
<A />

React.createElement(A, null)
```

源码中的`createElemet`方法👇。对jsx对象的属性进行处理，然后调用`ReactElement`方法。

```js
export function createElement(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  // 处理jsx上的属性
  if (config != null) {
    // 检查ref合法性
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 检查key合法性
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 遍历属性，将除了key、ref、__self、__source的属性，赋值到props对象上
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```

`ReactElement方法`👇。返回一个描述jsx标签的对象。即`fiber`节点

```js
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,

    type: type,
    key: key,
    ref: ref,
    props: props,

    _owner: owner,
  };

  return element;
};
```

## fiber数据结构

```js
function FiberNode(tag, pendingProps, key, mode) {
  this.tag = tag; //标识当前fiber的类型
  this.key = key; 
  this.elementType = null;
  this.type = null; // 'div' | 'h1' | Component
  this.stateNode = null; // dom实例

  this.return = null; // 父节点
  this.child = null; // 子节点
  this.sibling = null; // 兄弟节点
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode; // Effects

  this.effectTag = NoEffect; // 当前节点更新的类型
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null;
}
```
















## render阶段

深度优先依次执行fiber节点的`beginWork`和`completeWork`

`beginWork()`

> 当某个进入beginWork时，会创建该节点的第一个子节点的fiber节点。

`completeWork()`

