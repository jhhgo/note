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



root(整个应用的根，不是fiber节点，有一个节点指向current树，同样有个属性指向workInProgress树)

current树(树上的每一个节点都是fiber节点，保存了上一次的状态，每个fiber节点对应一个jsx节点)

workInProgress树(在内存中构建，保存的是本次的状态)

react工作的两个阶段：

1. render(创建fiber节点)

  `beginWork()`递过程

  `completeWork()`归过程

  mount递过程

  mount归过程

  update递过程

  update归过程

2. commit(操作页面)