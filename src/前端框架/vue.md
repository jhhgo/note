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
