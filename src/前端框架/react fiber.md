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

**双缓存**

维护两颗树：

1. current树: 树上的每一个节点都是fiber节点，保存了上一次的状态，每个fiber节点对应一个jsx节点

2. workInProgress树: 在内存中构建，保存的是本次的状态。

每次更新时候会比对两棵树。将要更新的节点标记，连接成一个链表。然后传递给commit阶段。

**双缓存工作流程**

react工作的两个阶段：

1. render(创建workInProgress树，将workInProgress传递给commit)，render阶段有两个关键的函数`beginWork`和`completeWork`

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

```js
```
