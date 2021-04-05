# filber原理篇

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

`ReactElement方法`👇。返回一个描述jsx标签的对象。即虚拟dom对象

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

一句话总结，**jsx标签会被转换成一个虚拟dom对象**

## render阶段

深度优先依次执行fiber节点的`beginWork`和`completeWork`

`beginWork()`

> 当某个进入beginWork时，会创建该节点的第一个子节点的fiber节点。

`completeWork()`



