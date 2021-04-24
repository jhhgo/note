# fiber 理论篇

## 为什么需要 fiber?

首先，浏览器是多线程的，这些线程包括 JS 引擎线程（主线程），以及 GUI 渲染线程，定时器线程，事件线程等工作线程。其中，JS 引擎线程和 GUI 渲染线程是互斥的。又因为绝大多数的浏览器页面的刷新频率取决于显示器的刷新频率，即每 16.6 毫秒就会通过 GUI 渲染引擎刷新一次。所以，如果 JS 引擎线程一次性执行了一个长时间（大于 16.6 毫秒）的同步任务，就可能出现掉帧的情况，影响用户的体验。

### 旧版本 react 是如何工作的?

老的 react 架构(Stack Reconciler)：

1. Reconciler(协调器)：决定渲染什么组件

2. Rederer(渲染器)：将组件渲染到视图中

![老react](C:\Users\姜嘿嘿\Desktop\imgs\老react.png)

**旧版本 react 是如何工作的**

一个例子 👇：

```js
class App extends Component {
  state = {
    count: 1,
  }
  render() {
    const { count } = this.state
    return (
      <div>
        <button onClick={() => this.setState({ count: count + 1 })}>
          click me
        </button>
        <ul>
          <li>{1 * count}</li>
          <li>{2 * count}</li>
          <li>{3 * count}</li>
        </ul>
      </div>
    )
  }
}
```

当点击`button`，工作流程如下 👇

![老react工作流程1](C:\Users\姜嘿嘿\Desktop\imgs\老react工作流程1.png)

如图，当协调器发现一个 dom 节点需要更新时，渲染器会马上更新 dom。由于 dom 更新是同步的，所以用户看到的效果是一起更新的。

在旧版本的 react 中，在 setState 后，react 从父组件开始遍历将所有的 Virtual DOM 遍历完成后，reconciler 才能给出当前需要修改真实 DOM 的信息，并传递给 renderer，进行渲染，然后屏幕上才会显示此次更新内容。对于特别庞大的 vDOM 树来说，reconciliation 过程会很长(x00ms)，在这期间，主线程是被 js 占用的，因此任何交互、布局、渲染都会停止，给用户的感觉就是页面被卡住了。

而 React 中的 Fiber，将原本耗时很长的同步任务分成多个耗时短的分片，从而实现了浏览器中互斥的主线程与 GUI 渲染线程之间的调度。

## fiber 架构

React 中的 Fiber（纤程）类似 Coroutine（协程），比如 ES6 的 Generator 可以实现一个可中断的任务。fiber 使更新可以中断，并且对更新划分了优先级，高优先级的更新可以打断低优先级的更新。

**fiber 代表了一种新的架构**

fiber 架构(fiber Reconciler)👇

![fiber架构](C:\Users\姜嘿嘿\Desktop\imgs\fiber架构.png)

fiber 架构相比于老架构多了一个`Scheduler`调度器。可以用来调度更新操作，优先级高的更新会打断优先级低的更新。

**fiber 数据结构**

fiber 是一种数据结构，每个 fiber 节点对应一个 jsx 标签。包含了节点的信息比如类型、对应的 dom 节点等。

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
  this.pendingProps = pendingProps; // fiber新的props
  this.memoizedProps = null; // fiber当前的Props
  this.updateQueue = null;   // 保存了Update链表
  this.memoizedState = null; // fiber本次的state，通过遍历updateQueue得出
  this.dependencies = null;
  this.mode = mode; // Effects

  this.effectTag = NoEffect; // 当前节点更新的类型，如：placement 插入、update 更新、deletion 删除。
  this.nextEffect = null;  // 下一个要更新的子节点
  this.firstEffect = null;  // 第一个要更新的子节点
  this.lastEffect = null; // 最后一个要更新的子节点
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null; // 用于连接current树和workInProgress树
}
```

## 工作原理

**双缓存原理**

维护两颗树：

1. current 树: 树上的每一个节点都是 fiber 节点，保存了上一次的状态，每个 fiber 节点对应一个 jsx 节点

2. workInProgress 树: 在内存中构建，保存的是本次的状态。

首次渲染时，不存在 current 树，先创建 workInProgress 树，然后将 current 指针指向这棵树。

在更新阶段，会复用`current.alternate`创建 workInProgress。然后比对 current 和 jsx 对象，创建 workInProgress
将要更新的节点标记，连接成一个链表。然后传递给 commit 阶段。

**工作流程**

react 工作的两个阶段：

1. render(通过 diff 算法创建 workInProgress 树，将 workInProgress 传递给 commit)，render 阶段有两个关键的函数`beginWork`和`completeWork`

2. commit(将 workInProgress 渲染到页面上)

**render 阶段**

在 render 阶段，首屏渲染和更新的工作有一些区别。

1. 首屏渲染

![render](C:\Users\姜嘿嘿\Desktop\imgs\fiber render1.png)

首屏渲染时，会创建一个`fiberRootNode`，代表整个应用的根节点。其 current 指向`rootFiber`，`rootFiber`代表当前应用根节点。由于首次渲染不存在 current 树，`workInProgress`树无法复用 current 树。创建`workInProgress`树，同时`workInProgress.alternate = current`, `current.altername = workInProgress`。

之后`fiberRootNode`的 current 指向当前`workInProgress`树。👇

![render](C:\Users\姜嘿嘿\Desktop\imgs\fiber render2.png)

2. 更新阶段

创建`workInProgress`树时，不再重新创建，而是复用`current.alternate`。

这个阶段主要任务是，通过 diff 算法比对`current`和`jsx对象`，生成新的`workInProgress`。并对需要更新的节点打上 effectTag 标记，并将这些节点以链表的形式组织起来，交给`commitRoot`去更新。

## render阶段

### beginWork

beginWork 的主要目的就是 workInProgress 树。区别在于，首屏渲染不存在 current，直接创建一颗 workInProgress，而更新阶段需要通过 diff 比对 current 与 jsx 对象，然后创建 workInProgress

大致流程 👇

![beginWork](C:\Users\姜嘿嘿\Desktop\imgs\beginWork.png)

在这里分别对`首屏渲染`和`更新阶段`的工作进行描述：

**首屏渲染 beginWork**

首屏渲染：进入函数，判断`current`是否存在，由于首屏渲染所以`current`为`null`。然后根据节点的`tag`进入不同的 case，以`hostComponent`为例，进入`updateHostComponent`，然后进入`reconcileChildren`

reconcilreChild 源码 👇

```js
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    )
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    )
  }
}

var reconcileChildFibers = ChildReconciler(true)
var mountChildFibers = ChildReconciler(false)
```

可以看出，实际上调用的都是`ChildReconciler`，只不过传入的是不同的布尔值。这个布尔值表示，是否要为当前节点打上标记(`effcetTag`属性)。之后根据不同的`type`执行不同流程，最后会创建一个当前 fiber 的第一个子 fiber 节点。

**更新阶段 beginWork**

进入`beginWork`，current 存在，判断当前节点是否有变化。没有变化的话直接根据 current 克隆一个子 fiber 节点。有变化进入`update`流程，进入`reconcile`流程，此时会为有变化的 fiber 节点打上标记(`effectTag`)

### completeWork

**首屏渲染 completeWork**

进入`completeWork`，根据`tag`进入不同的 case，以`hostComponent`为例，会进入`createInstance`，创建当前 fiber 节点对应的 dom 实例，然后进入`appendAllChildren`将 dom 插入到已经创建好的 dom 树上，然后会将 dom 实例保存到 fiber 节点的`stateNode`属性上。

**更新阶段 completeWork**

### diff 算法

diff 算法的最终目的就是比对`current`和`jsx对象`最终生成`workInProgress`。

**性能瓶颈**

前后两棵树完全比对的算法的复杂程度为 O(n 3 )，其中 n 是树中元素的数量。

**react diff 策略**

1. 只对同级元素进行 Diff。如果一个 DOM 节点在前后两次更新中跨越了层级，那么 React 不会尝试复用他。例如交换位置不会真正的交换，而是销毁再新建。

2. 两个不同类型的元素会产生出不同的树。如果元素由 div 变为 p，React 会销毁 div 及其子孙节点，并新建 p 及其子孙节点。

3. 开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定。即不会销毁 key 标记的元素

```js
// 更新前
<div>
  <p key="ka">ka</p>
  <h3 key="song">song</h3>
</div>

// 更新后
<div>
  <h3 key="song">song</h3>
  <p key="ka">ka</p>
</div>
```

如果没有 key，React 会认为 div 的第一个子节点由 p 变为 h3，第二个子节点由 h3 变为 p。这符合限制 2 的设定，会销毁并新建。

但是当我们用 key 指明了节点前后对应关系后，React 知道 key === "ka"的 p 在更新后还存在，所以 DOM 节点可以复用，只是需要交换下顺序。

**单一节点的 diff**

工作流程 👇

![单一节点的diff](C:\Users\姜嘿嘿\Desktop\imgs\单一节点的diff.png)

结果：一定会返回一个 workInProgress 树的 fiber 节点。区别在于，是新建一个 fiber 节点还是复用 current 树的 fiber 节点。

如何判断是否可以复用？

首先判断`key`是否相同，然后判断`type`是否相同。都相同则可以复用。

不可复用情况：

- `child !== null`且`key`不同，此时仅删除`child`

- `child !== null`且`key`相同且`type`不同，执行`deleteRemainingChildren`将`child`及其兄弟 fiber 都标记删除。

**多节点的 diff**

三种情况：

1. 节点更新

2. 节点新增或减少

3. 节点位置变化

## commit阶段

### beforeMutation

1. 调用`getSnapshotBeforeUpdate`生命周期钩子，此时页面还没有可见的更新。
2. 调度`useEffect`

### mutation

`mutation`阶段会遍历`effectList`(要更新的fiber链表)，依次执行`commitMutationEffects`，该方法的主要工作为“根据effectTag调用不同的处理函数处理Fiber。

**commitMutationEffects**

commitMutationEffects会遍历effectList，对每个Fiber节点执行如下三个操作：

1. 根据ContentReset effectTag重置文字节点
2. 更新ref
3. 根据effectTag分别处理，其中effectTag包括(Placement | Update | Deletion | Hydrating)

- placement effect

当Fiber节点含有Placement effectTag，意味着该Fiber节点对应的DOM节点需要插入到页面中。调用的方法为commitPlacement。

`commitPlacement`的工作分3步：

1. 获取父级`dom`节点

```js
const parentFiber = getHostParentFiber(finishedWork) //finishedWork为传入的fiber节点
const parentStateNode = parentFiber.stateNode
```

2. 获取兄弟`dom`节点

```js
const before = getHostSibling(finishedWork);
```

3. 根据DOM兄弟节点是否存在决定调用`parentNode.insertBefore`或`parentNode.appendChild`执行DOM插入操作。

```js
if (isContainer) {
  insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
} else {
  insertOrAppendPlacementNode(finishedWork, before, parent);
}
```

- update effect

当Fiber节点含有`Update effectTag`，意味着该Fiber节点需要更新。调用的方法为`commitWork`，他会根据`Fiber.tag`分别处理。两种情况👇

1. FunctionComponent

当fiber.tag为`FunctionComponent`，会调用`commitHookEffectListUnmount`。该方法会遍历`effectList`，执行所有`useLayoutEffect hook`的销毁函数。

2. HostComponent 

当`fiber.tag`为`HostComponent`，会调用`commitUpdate`。

最终会在updateDOMProperties (opens new window)中将render阶段 completeWork (opens new window)中为Fiber节点赋值的updateQueue对应的内容渲染在页面上。

- deletion effect

当`Fiber`节点含有`Deletion effectTag`，意味着该Fiber节点对应的DOM节点需要从页面中删除。调用的方法为`commitDeletion`。

该方法会执行如下操作：

1. 递归调用Fiber节点及其子孙Fiber节点中fiber.tag为ClassComponent的componentWillUnmount (opens new window)生命周期钩子，从页面移除Fiber节点对应DOM节点
2. 解绑ref
3. 调度useEffect的销毁函数

### layout

该阶段之所以称为layout，因为该阶段的代码都是在DOM渲染完成（mutation阶段完成）后执行的。

该阶段触发的生命周期钩子和hook可以直接访问到已经改变后的DOM，即该阶段是可以参与DOM layout的阶段。

与前两个阶段类似，layout阶段也是遍历effectList，执行函数。具体执行的函数是commitLayoutEffects。

**commitLayoutEffects**

commitLayoutEffects一共做了两件事：

1. commitLayoutEffectOnFiber（调用生命周期钩子和hook相关操作）
2. commitAttachRef（赋值 ref）

**commitLayoutEffectOnFiber**

`commitLayoutEffectOnFiber`方法会根据`fiber.tag`对不同类型的节点分别处理

- 对于`ClassComponent`，他会通过`current === null?`区分是`mount`还是`update`，调用c`omponentDidMount`或`componentDidUpdate` 。
- 对于`FunctionComponent`及相关类型，他会调用`useLayoutEffect hook`的回调函数，调度`useEffect`的销毁与回调函数

## 状态更新

**大致流程**

```shell
触发状态更新(this.setState useState)
     |
     |
创建update对象(dispatchAction)
     |
     |
从触发更新的fiber，向上递归到root(markUpdateLaneFromFiberToRoot)
     |
     |
从root调度本次更新(ensureRootIsScheduled)
     |
     |
render阶段(performConcurrentWorkOnRoot | performSyncWorkOnRoot)
     |
     |
commit阶段(commitRoot)
```

首先触发状态更新，触发状态更新的方法有 👇

- ReactDOM.render --- HostRoot
- this.setState --- ClassComponent
- this.forceUpdate --- ClassComponent
- useState --- FunctionComponent
- useReducer --- FunctionComponent

### Update 对象

**Update 结构**

由于不同类型组件工作方式不同，所以存在两种不同结构的`Update`，其中`ClassComponent`与`HostRoot`共用一套`Update`结构，`FunctionComponent`单独使用一种 Update 结构。

`ClassComponent`与`HostRoot`的`Update`结构 👇

```js
const update: Update<*> = {
  eventTime, // 任务时间
  lane, // 优先级，update的优先级可能是不同的
  suspenseConfig,
  tag: UpdateState, // 更新的类型 UpdateState | ReplaceState | ForceUpdate | CaptureUpdate
  payload: null, // 更新挂载的数据，不同类型组件挂载的数据不同。
  // 对于ClassComponent，payload为this.setState的第一个传参。对于HostRoot，payload为ReactDOM.render的第一个传参。
  callback: null, // 更新的回调函数。
  next: null, // 与其他Update连接形成链表。
}
```

**与 fiber 的联系**

Fiber 节点上的多个`Update`会组成链表并被包含在`fiber.updateQueue`中。

Fiber 节点最多同时存在两个 updateQueue：

- current fiber 保存的 updateQueue 即 current updateQueue

- workInProgress fiber 保存的 updateQueue 即 workInProgress updateQueue

在 commit 阶段完成页面渲染后，workInProgress Fiber 树变为 current Fiber 树，workInProgress Fiber 树内 Fiber 节点的 updateQueue 就变成 current updateQueue。

**fiber.updateQueue 结构**

ClassComponent 与 HostRoot 使用的 UpdateQueue 结构如下：

```js
const queue: UpdateQueue<State> = {
  baseState: fiber.memoizedState,
  firstBaseUpdate: null,
  lastBaseUpdate: null,
  shared: {
    pending: null,
  },
  effects: null,
}
```

字段说明：

- `baseState`: 本次更新前该`Fiber`节点的`state`。会基于`Update对象`和`baseState`计算更新后的`state`。

- `firstBaseUpdate`与`lastBaseUpdate`: 本次更新前该`Fiber`节点已保存的`Update`。以链表形式存在，链表头为`firstBaseUpdate`，链表尾为`lastBaseUpdate`。之所以在更新产生前该`Fiber`节点内就存在`Update`，是由于某些`Update`优先级较低所以在上次`render`阶段由`Update`计算`state`时被跳过。

- `shared.pending`：触发更新时，产生的`Update`会保存在 s`hared.pending`中形成单向环状链表。当由 Update 计算`state`时这个环会被剪开并连接在`lastBaseUpdate`后面。

- `effects`：数组。保存 update.callback !== null 的 Update

**updateQueue 工作流程**

假设有一个`fiber`刚经历`commit`阶段完成渲染。

该`fiber`上有两个由于优先级过低所以在上次的`render`阶段并没有处理的`Update`。他们会成为下次更新的`baseUpdate`。

我们称其为 u1 和 u2，其中`u1.next === u2`。

```js
fiber.updateQueue.firstBaseUpdate === u1
fiber.updateQueue.lastBaseUpdate === u2
u1.next === u2
```

我们用-->表示链表的指向：

```js
fiber.updateQueue.baseUpdate: u1 --> u2
```

现在我们在 fiber 上触发两次状态更新，这会产生两个新 Update。

我们称其为 u3 和 u4。

```js
fiber.updateQueue.shared.pending === u3
u3.next === u4
u4.next === u3
```

由于 shared.pending 是环状链表，用图表示为：

```js
fiber.updateQueue.shared.pending:   u3 --> u4
                                     ^      |
                                     |______|
```

更新调度完成后进入 render 阶段。

此时 shared.pending 的环被剪开并连接在 updateQueue.lastBaseUpdate 后面：

```js
fiber.updateQueue.baseUpdate: u1 --> u2 --> u3 --> u4
```

接下来遍历`updateQueue.baseUpdate`链表，以`fiber.updateQueue.baseState`为初始 state，依次与遍历到的每个`Update`计算并产生新的`state`（该操作类比 Array.prototype.reduce）。

在遍历时如果有优先级低的 Update 会被跳过。

当遍历完成后获得的`state`，就是该 Fiber 节点在本次更新的`state`（源码中叫做`memoizedState`）。

`render`阶段的`Update`操作由`processUpdateQueue`完成。

state 的变化在 render 阶段产生与上次更新不同的 JSX 对象，通过 Diff 算法产生 effectTag，在 commit 阶段渲染在页面上。

渲染完成后`workInProgress Fiber`树变为`current Fiber`树，整个更新流程结束。

### Update 计算机制

`processUpdateQueue`

主要工作：

前置知识复习 👇：

update 对象中通过 next 属性连接下一个 update。

```js
Fibrer.updateQueue = {
  baseState, // 上次的state
  firstBaseUpdate,// 上次已存在的update，优先级不够被跳过
  lastBaseUpdate,
  shared: {
    pending // 本次更新的update
  }
  effects // 有callback的update
}
```

1. 将本次更新的 update，连接在 baseUpdate(上次更新)后
2. 然后准备遍历 update，并基于 baseState(上一次 state)生成新的 state。

   - 如果当前 update 优先级不够，会跳过该 update。并且当前 update 会被当成下一次更新的 baseUpdate。并且下一次更新的 baseState 会变成此次 update 之前的 update 计算出的 state。（为了保证状态以来的连续性）

   - 如果 update 优先级足够，会基于 baseState 生成本次新的 state

3. 遍历完所有 update 后

   - 判断是否有被跳过的 update，如果没有那么下一次更新的 baseState 就是本次更新的最新 state
   - `workInProgress.memoizedState = newState`。更新 fiber 的 memoizedState 为新的 state。

render 阶段可能被中断。如何保证 updateQueue 中保存的 Update 不丢失？

有时候当前状态需要依赖前一个状态。如何在支持跳过低优先级状态的同时保证状态依赖的连续性？

**如何保证 Update 不丢失**

实际上`shared.pending`会被同时连接在`workInProgress updateQueue.lastBaseUpdate`与`current updateQueue.lastBaseUpdate`后面。

- 当 render 阶段被中断后重新开始时，会基于`current updateQueue`克隆出`workInProgress updateQueue`(workInProgress 会复用 current)。由于`current updateQueue.lastBaseUpdate`已经保存了上一次的`Update`，所以不会丢失。

- 当 commit 阶段完成渲染，由于`workInProgress updateQueue.lastBaseUpdate`中保存了上一次的 Update，所以 `workInProgress Fiber`树变成`current Fiber`树后也不会造成 Update 丢失

**如何保证状态依赖的连续性**

- 当某个 Update 由于优先级低而被跳过时，保存在 baseUpdate 中的不仅是该 Update，还包括链表中该 Update 之后的所有 Update。

- 并且，当某个 Update 被跳过后，下一次更新的 baseState，不是基于本次所有 update 计算出的 state。而是这个 update 之前基于之前一个 update 更新的 state。

举个例子 👇

页面首先是空字符，然后触发更新插入 ABCD。但是每次更新的优先级不同。

```js
baseState: ''
shared.pending: A1 --> B2 --> C1 --> D2
```

每次状态更新都会创建一个保存更新状态相关内容的对象，称之为`Update`。然后在`render`阶段的`beginWork`中会根据`Update`计算`state`

完整的更新流程 👇

```shell
触发状态更新(this.setState useState)
     |
     |
创建update对象(dispatchAction)
     |
     |
从触发更新的fiber，向上递归到root(markUpdateLaneFromFiberToRoot)
     |
     |
从root调度本次更新(ensureRootIsScheduled)，确定本次调度的优先级，开始调度更新，进入render阶段。
     |
     |
render阶段(performConcurrentWorkOnRoot | performSyncWorkOnRoot)：这个阶段根据update对象返回新的state，effectTag。判断是否要更新视图。
     |
     |
commit阶段(commitRoot)
```

## HOOK

```js
function App() {
  // 返回state，state是基于baseState和update产生的。和一个创建update即创建更新的方法。
  const [state, updateState] = useState(0)
  return <p onClick={() => updateState((state) => state + 1)}></p>
}
```

工作流程大致是 👇

- 通过一些途径产生更新，更新会造成组件`render`。

- 组件`render`时`useState`返回的`state`为更新后的结果。

更新可以分为`mount`(首次更新)和`update`

1. 调用`ReactDOM.render`会产生`mount`的更新，更新内容为`useState`的`initialValue`（即 0）。
2. 点击`p`标签触发`updateNum`会产生一次`update`的更新，更新内容为`num => num + 1`。

**更新是什么**

和之前的更新流程一样，触发更新后，会创建一个`update`对象

`update`的数据结构大概如下 👇

```js
const update = {
  // 更新执行的函数或数值，即updateState的第一个参数
  action,
  // 与同一个Hook的其他更新形成链表。如果有多个update通过next属性相连，可以批量更新
  next: null,
}
```

**多个 update 是如何连接在一起的？**

答：多个 update 会形成一个环状单向链表。

例子：当调用`updateState`时，实际上调用的是`dispatchAction.bind(null, hook.queue)`👇

```js
function dispatchAction(queue, action) {
  // 创建update
  const update = {
    action,
    next: null,
  }
  if (queue.pending === null) {
    update.next = update
  } else {
    // 环状链表操作
    // 3->0->1->2->3 这是已经存在的queue.pending
    // 4->0->1->2->3->4 产生了一次更新update，需要插入到3后，并且形成环状
    // 由于queue.pending始终指向最后一个update，且环状，所以queue.pending.next是第一个
    update.next = queue.pending.next
    queue.pending.next = update
  }
  // queue.pending始终指向最后一个update
  queue.pending = update
  // 模拟React开始调度更新
  schedule();
}
```

**更新如何保存**

更新的`queue`保存在`Function Component`的`fiber`上

`fiber`结构👇

```js
const fiber = {
  // 保存该函数组件的hooks链表
  memoizedState: null,
  // 指向函数自身
  stateNode: App
}
```

**hook数据结构**

hook数据结构大致如下👇

```js
const hook = {
  // 保存update queue
  queue: {
    pending: null
  }
  // 保存该hook对应的state
  memoizedState: initialState // 第一次就是初始化的值
  // 连接下一个hook形成单向无环链表
  next: null
}
```

`update`与`hook`的所属关系:

- 每个`useState`对应一个`hook`对象。
- 调用`const [state, updateState] = useState(0)`;时`updateState`（即上文介绍的`dispatchAction`）产生的`update`保存在`useState`对应的`hook.queue`中。

**模拟react调度**

```js
// 区分mount还是update
let isMount = true

// 当前指向的hook
let workInProgressHook = null

// App函数组件对应的fiber
const fiber = {
  // 保存hook
  memoizedState: null,
  stateNode: App
}

// 模拟render、commit
function run() {
  // 将当前hook指向第一个hook
  workInProgressHook = fiber.memoizedState
  // render阶段会执行函数组件对应的函数
  const app = fiber.stateNode()
  // commit之后，就不再是首屏渲染
  isMount = false
  return app
}

// 创建Update，并形成环状链表
function dispatchAction(queue, action) {
  const update = {
    action,
    next
  }

  if (queue.pending === null) {
    update.next = update
  } else {
    update.next = queue.pending.next
    queue.pending.next = update
  }
  queue.pending = update
  run()
}

// 模拟useState
function useState(initialState) {
  let hook
  if (isMount) {
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next
    }
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook
    } else {
      workInProgressHook.next = hook
    }
    workInProgressHook = hook
  } else {
    hook = workInProgressHook
    workInProgressHook = workInProgressHook.next
  }

  let baseState = hook.memoizedState
  // hook是否有更新
  if (hook.queue.pending) {
    
    let firstUpdate = hook.queue.pending.next
    // 遍历更新链表
    do {
      const action = firstUpdate.action
      // 计算新的state
      basState = action(baseState)
      // 下一个
      firstUpdate = firstUpdate.next
    } while (firstUpdate !== hook.update.pending.next)

    // 所有update计算完成
    hook.queue.pending = null
  }
  hook.memoizedState = baseState
  return [baseState, dispatchAction.bind(null, hook.queue)]
}

function App() {
  const [state, updateState] = useState(0)
  return {
    // 模拟点击触发更新
    onClcick() {
      updateState(state => state + 1)
    }
  }
}

window.app = run()
```

## schduler原理

### 时间切片原理

**什么是时间切片？**

时间切片的目的是不阻塞主线程，而实现目的的技术手段是将一个长任务拆分成很多个不超过指定时间的小任务分散在宏任务队列中执行。

简单地说就是在浏览器空闲的时候执行js。

浏览器一帧中可以用于执行js的时间👇

```js
一个task(宏任务) -- 队列中全部job(微任务) -- requestAnimationFrame -- 浏览器重排/重绘 -- requestIdleCallback
```

**react是如何实现的？**

`Scheduler`的时间切片功能是通过task（宏任务）实现的。`Scheduler`将需要被执行的回调函数作为`MessageChannel`的回调执行。如果当前宿主环境不支持`MessageChannel`，则使用`setTimeout`。

在`render阶段`的起点，`workLoopConcurrent`中，每次遍历`workInProgress`前，都会通过Scheduler提供的`shouldYield`方法判断是否需要中断遍历，使浏览器有时间渲染👇

```js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

是否中断的依据，最重要的一点便是每个任务的剩余时间是否用完。在`Schdeduler`中，为任务分配的初始剩余时间为5ms。

### 优先级调度

> 首先我们来了解优先级的来源。需要明确的一点是，Scheduler是独立于React的包，所以他的优先级也是独立于React的优先级的。

Scheduler对外暴露了一个方法`unstable_runWithPriority`

这个方法接受一个`优先级`与一个`回调函数`，在回调函数内部调用获取优先级的方法都会取得第一个参数对应的优先级(所以react可以获取schduler包的优先级)👇

```js
function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }
  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;
  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}
```

从以上源码中可以看出scheduler一共有5种优先级。

在`React`内部凡是涉及到优先级调度的地方，都会使用`unstable_runWithPriority`

举个例子：比如，我们知道`commit`阶段是同步执行的。可以看到，`commit`阶段的起点`commitRoot`方法的优先级为`ImmediateSchedulerPriority`。👇

```js
function commitRoot(root) {
  const renderPriorityLevel = getCurrentPriorityLevel();
  runWithPriority(
    ImmediateSchedulerPriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
```

**react如何调度schduler优先级？**

`Scheduler`对外暴露最重要的方法便是`unstable_scheduleCallback`。该方法用于以某个优先级注册回调函数。

比如在`React`中，在`commit`阶段的`beforeMutation`阶段会调度`useEffect`的回调👇

```js
if (!rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = true;
  scheduleCallback(NormalSchedulerPriority, () => {
    flushPassiveEffects();
    return null;
  });
}
```

这里的回调便是通过`scheduleCallback`调度的，优先级为`NormalSchedulerPriority`，即`NormalPriority`。

不同的优先级意味着任务的`过期时间`不同，优先级越高的优先级过期时间越短。

如果一个任务的优先级是`ImmediatePriority`，对应`IMMEDIATE_PRIORITY_TIMEOUT`为-1，该任务的过期时间比当前时间还短，代表它已经过期了，需要立即执行。

**按过期时间将任务分类**

- 已过期任务
- 未过期任务

对应着`scheduler`中的两个队列：

- timerQueue: 保存未过期任务
- taskQueue: 保存已过期任务

执行过程：

- 每当有新的未就绪的任务被注册，我们将其插入`timerQueue`并根据开始时间重新排列`timerQueue`中任务的顺序。
- 当timerQueue中有任务就绪，即``startTime`` <= c`urrentTime`，我们将其取出并加入`taskQueue`。
- 取出`taskQueue`中最早过期的任务并执行他。

为了能在O(1)复杂度找到两个队列中时间最早的那个任务，`Scheduler`使用小顶堆实现了`优先级队列`。

## 异步可中断更新

## batchedUpdates

## 面试：说一下 ReactDOM.render()的流程

1. 创建整个应用的根节点`FiberRootNode`

2. `updateContainer`: 创建 update 对象

3. `enqueueUpdate`: 将 update 添加到`fiber.updateQueue`上

4. `shcedulUpdateOnFiber`: 调度首屏渲染的更新

5. `performSyncWorkOnRoot`: 进入 render 阶段。

## 面试：说一下 this.setState()的流程

1. 调用`this.setState()`

2. 调用`updater.enqueueSetState(this, partialState, callback, 'setState')`

- this: 本次触发 setState 的 ClassComponent 实例
- partialState: 本次的 state{}，最后会变成 Update 的 payload
- callback: setState 的第二个参数

3. 创建 Update 对象并且`update.payload = payload`
4. 将 update 添加到`fiber.updateQueue`











commit阶段

- `before mutation阶段`

- `mutation阶段`：在`commitMutationEffects()`中执行



- `layout阶段`