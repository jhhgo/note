# fiber理论篇

## 为什么需要fiber?

首先，浏览器是多线程的，这些线程包括JS引擎线程（主线程），以及GUI渲染线程，定时器线程，事件线程等工作线程。其中，JS引擎线程和GUI渲染线程是互斥的。又因为绝大多数的浏览器页面的刷新频率取决于显示器的刷新频率，即每16.6毫秒就会通过GUI渲染引擎刷新一次。所以，如果JS引擎线程一次性执行了一个长时间（大于16.6毫秒）的同步任务，就可能出现掉帧的情况，影响用户的体验。

### 旧版本react是如何工作的?

老的react架构(Stack Reconciler)：

1. Reconciler(协调器)：决定渲染什么组件

2. Rederer(渲染器)：将组件渲染到视图中

![老react](C:\Users\姜嘿嘿\Desktop\imgs\老react.png)

**旧版本react是如何工作的**

一个例子👇：

```js
class App extends Component {
  state = {
    count: 1
  }
  render() {
    const {count} = this.state
    return (
      <div>
        <button onClick={() => this.setState({count: count + 1})}>click me</button>
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

当点击`button`，工作流程如下👇

![老react工作流程1](C:\Users\姜嘿嘿\Desktop\imgs\老react工作流程1.png)

如图，当协调器发现一个dom节点需要更新时，渲染器会马上更新dom。由于dom更新是同步的，所以用户看到的效果是一起更新的。

在旧版本的react中，在setState后，react从父组件开始遍历将所有的Virtual DOM遍历完成后，reconciler才能给出当前需要修改真实DOM的信息，并传递给renderer，进行渲染，然后屏幕上才会显示此次更新内容。对于特别庞大的vDOM树来说，reconciliation过程会很长(x00ms)，在这期间，主线程是被js占用的，因此任何交互、布局、渲染都会停止，给用户的感觉就是页面被卡住了。

而React中的Fiber，将原本耗时很长的同步任务分成多个耗时短的分片，从而实现了浏览器中互斥的主线程与GUI渲染线程之间的调度。

## fiber架构

React中的Fiber（纤程）类似Coroutine（协程），比如ES6的Generator可以实现一个可中断的任务。fiber使更新可以中断，并且对更新划分了优先级，高优先级的更新可以打断低优先级的更新。

**fiber代表了一种新的架构**

fiber架构(fiber Reconciler)👇

![fiber架构](C:\Users\姜嘿嘿\Desktop\imgs\fiber架构.png)

fiber架构相比于老架构多了一个`Scheduler`调度器。可以用来调度更新操作，优先级高的更新会打断优先级低的更新。

**fiber数据结构**

fiber是一种数据结构，每个fiber节点对应一个jsx标签。包含了节点的信息比如类型、对应的dom节点等。

## 工作原理

**双缓存原理**

维护两颗树：

1. current树: 树上的每一个节点都是fiber节点，保存了上一次的状态，每个fiber节点对应一个jsx节点

2. workInProgress树: 在内存中构建，保存的是本次的状态。

首次渲染时，不存在current树，先创建workInProgress树，然后将current指针指向这棵树。

在更新阶段，会复用`current.alternate`创建workInProgress。然后比对current和jsx对象，创建workInProgress
将要更新的节点标记，连接成一个链表。然后传递给commit阶段。

**工作流程**

react工作的两个阶段：

1. render(通过diff算法创建workInProgress树，将workInProgress传递给commit)，render阶段有两个关键的函数`beginWork`和`completeWork`

2. commit(将workInProgress渲染到页面上)

**render阶段**

在render阶段，首屏渲染和更新的工作有一些区别。

1. 首屏渲染

![render](C:\Users\姜嘿嘿\Desktop\imgs\fiber render1.png)

首屏渲染时，会创建一个`fiberRootNode`，代表整个应用的根节点。其current指向`rootFiber`，`rootFiber`代表当前应用根节点。由于首次渲染不存在current树，`workInProgress`树无法复用current树。创建`workInProgress`树，同时`workInProgress.alternate = current`, `current.altername = workInProgress`。

之后`fiberRootNode`的current指向当前`workInProgress`树。👇

![render](C:\Users\姜嘿嘿\Desktop\imgs\fiber render2.png)

2. 更新阶段

创建`workInProgress`树时，不再重新创建，而是复用`current.alternate`。

这个阶段主要任务是，通过diff算法比对`current`和`jsx对象`，生成新的`workInProgress`。并对需要更新的节点打上effectTag标记，并将这些节点以链表的形式组织起来，交给`commitRoot`去更新。

## beginWork

beginWork的主要目的就是workInProgress树。区别在于，首屏渲染不存在current，直接创建一颗workInProgress，而更新阶段需要通过diff比对current与jsx对象，然后创建workInProgress

大致流程👇

![beginWork](C:\Users\姜嘿嘿\Desktop\imgs\beginWork.png)

在这里分别对`首屏渲染`和`更新阶段`的工作进行描述：

**首屏渲染beginWork**

首屏渲染：进入函数，判断`current`是否存在，由于首屏渲染所以`current`为`null`。然后根据节点的`tag`进入不同的case，以`hostComponent`为例，进入`updateHostComponent`，然后进入`reconcileChildren`

reconcilreChild源码👇

```js
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
  } else {
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
  }
}

var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);
```

可以看出，实际上调用的都是`ChildReconciler`，只不过传入的是不同的布尔值。这个布尔值表示，是否要为当前节点打上标记(`effcetTag`属性)。之后根据不同的`type`执行不同流程，最后会创建一个当前fiber的第一个子fiber节点。

**更新阶段beginWork**

进入`beginWork`，current存在，判断当前节点是否有变化。没有变化的话直接根据current克隆一个子fiber节点。有变化进入`update`流程，进入`reconcile`流程，此时会为有变化的fiber节点打上标记(`effectTag`)

## completeWork

**首屏渲染completeWork**

进入`completeWork`，根据`tag`进入不同的case，以`hostComponent`为例，会进入`createInstance`，创建当前fiber节点对应的dom实例，然后进入`appendAllChildren`将dom插入到已经创建好的dom树上，然后会将dom实例保存到fiber节点的`stateNode`属性上。

**更新阶段completeWork**

## diff算法

diff算法的最终目的就是比对`current`和`jsx对象`最终生成`workInProgress`。

**性能瓶颈**

前后两棵树完全比对的算法的复杂程度为 O(n 3 )，其中n是树中元素的数量。

**react diff策略**

1. 只对同级元素进行Diff。如果一个DOM节点在前后两次更新中跨越了层级，那么React不会尝试复用他。例如交换位置不会真正的交换，而是销毁再新建。

2. 两个不同类型的元素会产生出不同的树。如果元素由div变为p，React会销毁div及其子孙节点，并新建p及其子孙节点。

3. 开发者可以通过 key prop来暗示哪些子元素在不同的渲染下能保持稳定。即不会销毁key标记的元素

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

如果没有key，React会认为div的第一个子节点由p变为h3，第二个子节点由h3变为p。这符合限制2的设定，会销毁并新建。

但是当我们用key指明了节点前后对应关系后，React知道key === "ka"的p在更新后还存在，所以DOM节点可以复用，只是需要交换下顺序。

**单一节点的diff**

工作流程👇

![单一节点的diff](C:\Users\姜嘿嘿\Desktop\imgs\单一节点的diff.png)

结果：一定会返回一个workInProgress树的fiber节点。区别在于，是新建一个fiber节点还是复用current树的fiber节点。

如何判断是否可以复用？

首先判断`key`是否相同，然后判断`type`是否相同。都相同则可以复用。

不可复用情况：

- `child !== null`且`key`不同，此时仅删除`child`

- `child !== null`且`key`相同且`type`不同，执行`deleteRemainingChildren`将`child`及其兄弟fiber都标记删除。

**多节点的diff**

三种情况：

1. 节点更新

2. 节点新增或减少

3. 节点位置变化

## hook

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

首先触发状态更新，触发状态更新的方法有👇

- ReactDOM.render --- HostRoot
- this.setState --- ClassComponent
- this.forceUpdate --- ClassComponent
- useState --- FunctionComponent
- useReducer --- FunctionComponent

### Update对象

**Update结构**

由于不同类型组件工作方式不同，所以存在两种不同结构的`Update`，其中`ClassComponent`与`HostRoot`共用一套`Update`结构，`FunctionComponent`单独使用一种Update结构。

`ClassComponent`与`HostRoot`的`Update`结构👇

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
};
```

**与fiber的联系**

Fiber节点上的多个`Update`会组成链表并被包含在`fiber.updateQueue`中。

Fiber节点最多同时存在两个updateQueue：

- current fiber保存的updateQueue即current updateQueue

- workInProgress fiber保存的updateQueue即workInProgress updateQueue

在commit阶段完成页面渲染后，workInProgress Fiber树变为current Fiber树，workInProgress Fiber树内Fiber节点的updateQueue就变成current updateQueue。

**fiber.updateQueue结构**

ClassComponent与HostRoot使用的UpdateQueue结构如下：

```js
const queue: UpdateQueue<State> = {
  baseState: fiber.memoizedState,
  firstBaseUpdate: null,
  lastBaseUpdate: null,
  shared: {
    pending: null,
  },
  effects: null,
};
```

字段说明：

- `baseState`: 本次更新前该`Fiber`节点的`state`。会基于`Update对象`和`baseState`计算更新后的`state`。

- `firstBaseUpdate`与`lastBaseUpdate`: 本次更新前该`Fiber`节点已保存的`Update`。以链表形式存在，链表头为`firstBaseUpdate`，链表尾为`lastBaseUpdate`。之所以在更新产生前该`Fiber`节点内就存在`Update`，是由于某些`Update`优先级较低所以在上次`render`阶段由`Update`计算`state`时被跳过。

- `shared.pending`：触发更新时，产生的`Update`会保存在s`hared.pending`中形成单向环状链表。当由Update计算`state`时这个环会被剪开并连接在`lastBaseUpdate`后面。

- `effects`：数组。保存update.callback !== null的Update

**updateQueue工作流程**

假设有一个`fiber`刚经历`commit`阶段完成渲染。

该`fiber`上有两个由于优先级过低所以在上次的`render`阶段并没有处理的`Update`。他们会成为下次更新的`baseUpdate`。

我们称其为u1和u2，其中`u1.next === u2`。

```js
fiber.updateQueue.firstBaseUpdate === u1;
fiber.updateQueue.lastBaseUpdate === u2;
u1.next === u2;
```

我们用-->表示链表的指向：

```js
fiber.updateQueue.baseUpdate: u1 --> u2
```

现在我们在fiber上触发两次状态更新，这会产生两个新Update。

我们称其为u3和u4。

```js
fiber.updateQueue.shared.pending === u3;
u3.next === u4;
u4.next === u3;
```

由于shared.pending是环状链表，用图表示为：

```js
fiber.updateQueue.shared.pending:   u3 --> u4 
                                     ^      |                                    
                                     |______|
```

更新调度完成后进入render阶段。

此时shared.pending的环被剪开并连接在updateQueue.lastBaseUpdate后面：

```js
fiber.updateQueue.baseUpdate: u1 --> u2 --> u3 --> u4
```

接下来遍历`updateQueue.baseUpdate`链表，以`fiber.updateQueue.baseState`为初始state，依次与遍历到的每个`Update`计算并产生新的`state`（该操作类比Array.prototype.reduce）。

在遍历时如果有优先级低的Update会被跳过。

当遍历完成后获得的`state`，就是该Fiber节点在本次更新的`state`（源码中叫做`memoizedState`）。

`render`阶段的`Update`操作由`processUpdateQueue`完成。

state的变化在render阶段产生与上次更新不同的JSX对象，通过Diff算法产生effectTag，在commit阶段渲染在页面上。

渲染完成后`workInProgress Fiber`树变为`current Fiber`树，整个更新流程结束。

### Update计算机制

`processUpdateQueue`

主要工作：

1. 将本次更新的update，连接在baseUpdate后










**setState流程**





开启concurrent模式，更新会获得不同的优先级，不用的优先级以异步的方式运行。

render阶段的入口根据模式的不同分为`performSyncWorkOnRoot`和`performConcurrentWorkOnRoot`

触发状态更新的方法：

- ReactDOM.render
- this.setState
- this.forceUpdate
- useState
- useReducer

每次状态更新都会创建一个保存更新状态相关内容的对象，称之为`Update`。然后在`render`阶段的`beginWork`中会根据`Update`计算`state`

完整的更新流程👇

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