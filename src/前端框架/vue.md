# Vue 基础

```html
<div id="app">
  {{count}}
  <button @click="increment">点我+1</button>
</div>

<script>
  const vm = new Vue({
    data: {
      count: 0,
    },
    methods: {
      increment: function () {
        this.count++
      },
    },
  })
</script>
```

## 指令

- `v-bind` 缩写为：`:`
- `v-on` 缩写为：`@`
- `v-show`
- `v-if`
- `v-else-if`
- `v-else`
- `v-for`
- `v-model`
- `v-text`：等价于`{{}}`
- `v-html`
- `v-once`

## `v-if`和`v-show`区别

> v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
> v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
> 相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
> 一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

## options

- el
- data
- methods
- computed
- template
- store
- router

## computed、methods、watcher 区别

### computed vs methods

> 计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数

### computed vs watcher

1. Computed 本质是一个具备缓存的 watcher，依赖的属性发生变化就会更新视图。适用于计算比较消耗性能的计算场景。当表达式过于复杂时，在模板中放入过多逻辑会让模板难以维护，可以将复杂的逻辑放入计算属性中处理。

2. Watch 没有缓存性，更多的是观察的作用，可以监听某些数据执行回调。当我们需要深度监听对象中的属性时，可以打开 deep：true 选项，这样便会对对象中的每一项进行监听。这样会带来性能问题，优化的话可以使用字符串形式监听，如果没有写到组件中，不要忘记使用 unWatch 手动注销哦。

## 组件间通信

### 父子组件通信

- 父->子 `props`

  1. 在子标签上注册自定义 attribute，当一个值传递给 prop attribute 时，就会变成子组件 vue 实例的一个属性

  2. 在子组件中声明接收属性

```html
<!-- parent vue -->
<div>
  <son :number="numbers"></son>
</div>

<script>
  export default {
    data() {
      return {
        numbers: [1, 2, 3],
      }
    },
  }
</script>

<!-- son vue -->
<script>
  export default {
    props: ['numbers'],
  }
</script>
```

- 子->父 `$on、$emit`

  1. 父组件对子组件的自定义事件使用 v-on:eventName=doSomething 进行监听
  2. 当子组件内部触发了该自定义事件时（使用\$emit('eventName')），父组件执行 doSomething，从而实现子组件向父组件的通信

- 获取父子组件实例`$parent、$children`

## vue-router

## vue 生命周期

![](C:\Users\姜嘿嘿\Desktop\vue生命周期.png)

## 生命周期钩子

- beforeCreate：new Vue()之后触发的第一个钩子，在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问
- created：在实例创建完成后发生，当前阶段已经完成了数据观测，也就是可以使用数据，更改数据，在这里更改数据不会触发 updated 函数。可以做一些初始数据的获取，在当前阶段无法与 Dom 进行交互，如果非要想，可以通过 vm.\$nextTick 来访问 Dom
- beforeMount：发生在挂载之前，在这之前 template 模板已导入渲染函数编译。而当前阶段虚拟 Dom 已经创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发 updated
- mounted：在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点，使用\$refs 属性对 Dom 进行操作
- beforeUpdate：发生在更新之前，也就是响应式数据发生更新，虚拟 dom 重新渲染之前被触发，你可以在当前阶段进行更改数据，不会造成重渲染
- updated：发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新
- beforeDestory：发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这时进行善后收尾工作，比如清除计时器
- destoryed：发生在实例销毁之后，这个时候只剩下了 dom 空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁

## 响应式原理

> vue 通过数据劫持和发布订阅者模式实现双向数据绑定。通过`Object.defineProperty()`实现数据劫持，在使用属性时，触发`getter`进行依赖收集（收集 watcher）（dep.depend() -> watcher.addDep() -> 将 watcher 添加到 dep.subs，并将 dep 添加到 watcher.depIds）

### Dep 和 Watcher

## 模板编译

> 简单说，Vue 的编译过程就是将`template`转化为`render`函数的过程。Compiler 用于将模板编译为渲染函数，并渲染视图页面。包括以下三个过程：

- parse()使用正则等方式解析 template 中的指令、class、style 等数据，生成 AST（抽象语法书，一种树状结构的 js 对象）
- optimize()进行优化，标记静态节点，静态节点会跳过 diff
- generate()，把 AST 转化为渲染函数，渲染函数用于生成虚拟 DOM
