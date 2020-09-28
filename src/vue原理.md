# vue原理分析

通过分析 https://github.com/DMQ/mvvm 项目，理解vue双向数据绑定原理以及核心代码模块。

整理的笔记如下

## 数据代理

通过一个对象代理对另一个对象中属性的操作

vue数据代理：当我们通过vm.xxx=val来修改值是，实际上修改的是data中的数据

项目源码

```javascript
var me = this;
Object.keys(data).forEach(function(key) {
    me._proxy(key);
})

_proxy(key) {
    Object.defineProperty(me, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
            return me._data[key]
        },
        
        set: function proxySetter(newVal) {
            me._data[key] = newVal
        }
    })
}
```

总结: 新建一个vue的实例时。会遍历data中的属性名，利用Object.defineProperty给vue实例添加与data中属性名一致的属性。所有添加的属性中都包含getter/setter, getter/setter内部会去操作data中对应的属性



## 模板解析



1.调用Complie构造函数,传入选择对象的el属性，对el表示的选择器的节点进行模板解析

```javascript
// Complie构造函数
function Compile(el, vm) {
  // 保存vm
  this.$vm = vm;
  // 保存el元素
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);
  // 如果el元素存在
  if (this.$el) {
    // 1. 取出el中所有子节点, 封装在一个framgment对象中
    this.$fragment = this.node2Fragment(this.$el);
    // 2. 编译fragment中所有层次子节点 
    this.init();
    // 3. 将fragment添加到el中
    this.$el.appendChild(this.$fragment);
  }
}
```

2.模板解析的关键方法init，遍历该节点的所有子节点进行解析

```javascript
init: function () {
    // 编译fragment
    this.compileElement(this.$fragment);
  },

  compileElement: function (el) {
    // 得到所有子节点
    var childNodes = el.childNodes,
      // 保存compile对象
      me = this;
    // 遍历所有子节点
    [].slice.call(childNodes).forEach(function (node) {
      // 得到节点的文本内容
      var text = node.textContent;
      // 正则对象(匹配大括号表达式)
      var reg = /\{\{(.*)\}\}/;  // {{name}}
      // 如果是元素节点
      if (me.isElementNode(node)) {
        // 编译元素节点的指令属性
        me.compile(node);
        // 如果是一个大括号表达式格式的文本节点
      } else if (me.isTextNode(node) && reg.test(text)) {
        // 编译大括号表达式格式的文本节点
        me.compileText(node, RegExp.$1); // RegExp.$1: 表达式   name
      }
      // 如果子节点还有子节点
      if (node.childNodes && node.childNodes.length) {
        // 递归调用实现所有层次节点的编译
        me.compileElement(node);
      }
    });
  }
```

如果解析{{}}表达式:

1.调用complieText工具对象的bind()方法进行解析

2.根据指令名(大括号表达式等价于v-text指令)得到Updater对象对应的更新方法

3.调用Updater的更新方法，完成初始化显示

```javascript
compileText: function (node, exp) {
    // 调用编译工具对象解析
    compileUtil.text(node, this.$vm, exp);
  }

// 指令处理集合
var compileUtil = {
  // 解析: v-text/{{}}
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  }
}
    
     // 真正用于解析指令的方法
  bind: function (node, vm, exp, dir) {
    /*实现初始化显示*/
    // 根据指令名(text)得到对应的更新节点函数
    var updaterFn = updater[dir + 'Updater'];
    // 如果存在调用来更新节点 , _getVMVal获得表达式的值
    updaterFn && updaterFn(node, this._getVMVal(vm, exp));

    // 创建表达式对应的watcher对象
    new Watcher(vm, exp, function (value, oldValue) {/*更新界面*/
      // 当对应的属性值发生了变化时, 自动调用, 更新对应的节点
      updaterFn && updaterFn(node, value, oldValue);
    });
  }

var updater = {
  // 更新节点的textContent
  textUpdater: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  }
}

```

如果解析的是事件指令:

1.调用Compile实例的compile方法，从属性节点中解析出属性的属性名和属性值

2.调用complieUtil的eventHandler方法，根据属性值从methods中得到对应的事件处理函数

给当前元素节点绑定指定事件名和回调函数(通过bind()强制把this绑定成vue实例)的dom事件监听

最后从元素节点上移除指令属性

如果解析的是一般指令:

1.调用Compile实例的compile方法，从属性节点中解析出属性的属性名和属性值

2.根据属性名调用complieUtil中指定的解析方法

3.根据指令名得到并调用Updater中的更新方法，根据指令名确定要操作的节点的属性，将得到的表达式的值设置到对应属性上

4.最后移除元素的指令属性

```javascript
// Compile实例的compile方法

compile: function (node) {
    // 得到所有标签属性节点
    var nodeAttrs = node.attributes,
      me = this;
    // 遍历所有属性
    [].slice.call(nodeAttrs).forEach(function (attr) {
      // 得到属性名: v-on:click
      var attrName = attr.name;
      // 判断是否是指令属性
      if (me.isDirective(attrName)) {
        // 得到表达式(属性值): test
        var exp = attr.value;
        // 得到指令名: on:click
        var dir = attrName.substring(2);
        // 判断是否是事件指令
        if (me.isEventDirective(dir)) {
          // 解析事件指令
          compileUtil.eventHandler(node, me.$vm, exp, dir);
        // 普通指令
        } else {
          // 解析普通指令
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
        }

        // 移除指令属性
        node.removeAttribute(attrName);
      }
    });
    
    //compileUtil对象的eventHandler方法
    eventHandler: function (node, vm, exp, dir) {
    // 得到事件名/类型: click
    var eventType = dir.split(':')[1],
      // 根据表达式得到事件处理函数(从methods中)
      fn = vm.$options.methods && vm.$options.methods[exp];
    // 如果都存在
    if (eventType && fn) {
      // 绑定指定事件名和回调函数的DOM事件监听, 将回调函数中的this强制绑定为vm
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  }
```

# 数据绑定

更新data中的数据，界面中使用到对应数据的节点都会更新。vue中的数据绑定是通过数据劫持来实现的，所谓数据劫持就是通过Object.defineProperty()来监视data中的所有属性数据的变化，一旦发生变化，就去更新界面

![image-20200311222535269](C:\Users\姜嘿嘿\AppData\Roaming\Typora\typora-user-images\image-20200311222535269.png)

### 创建Dep实例和Watcher实例

1. 在Vue构造函数内部，调用observe方法，针对data内的每一个属性数据都会创建一个Dep实例并且对data内的所有属性通过Object.defineProperty设置set方法实现数据劫持

2. 解析模板时，调用compileUtil的bind方法时，会根据每个表达式各自创建一个watcher实例

   ```javascript
   function observe(value, vm) {
       // value必须是对象, 因为监视的是对象内部的属性
       if (!value || typeof value !== 'object') {
           return;
       }
       // 创建一个对应的观察者对象
       return new Observer(value);
   };
   
   defineReactive: function(data, key, val) {
           // 创建与当前属性对应的dep对象
           var dep = new Dep();
           // 间接递归调用实现对data中所有层次属性的劫持
           var childObj = observe(val);
           // 给data重新定义属性(添加set/get)
           Object.defineProperty(data, key, {
               enumerable: true, // 可枚举
               configurable: false, // 不能再define
               get: function() {
                   // 建立dep与watcher的关系
                   if (Dep.target) {
                       dep.depend();
                   }
                   // 返回属性值
                   return val;
               },
               set: function(newVal) {
                   if (newVal === val) {
                       return;
                   }
                   val = newVal;
                   // 新的值是object的话，进行监听
                   childObj = observe(newVal);
                   // 通过dep
                   dep.notify();
               }
           });
   ```

   ### watcher与dep关系的建立

   1.在创建一个watcher实例时，会触发watcher对应的表达式的属性数据的get方法

   2.通过调用dep.dpend()，在dpend内部，又调用了watcher的addDep方法 建立了 watcher与dep之间的联系

   

   ```javascript
   function Watcher(vm, exp, cb) {
     this.cb = cb;  // callback
     this.vm = vm;
     this.exp = exp;
     this.depIds = {};  // {0: d0, 1: d1, 2: d2}
     this.value = this.get();
   }
   
    Object.defineProperty(data, key, {
               enumerable: true, // 可枚举
               configurable: false, // 不能再define
               get: function() {
                   // 建立dep与watcher的关系
                   if (Dep.target) {
                       dep.depend();
                   }
                   // 返回属性值
                   return val;
               },
               set: function(newVal) {
                   if (newVal === val) {
                       return;
                   }
                   val = newVal;
                   // 新的值是object的话，进行监听
                   childObj = observe(newVal);
                   // 通过dep
                   dep.notify();
               }
           });
   
   depend: function() {
           Dep.target.addDep(this);
       }
   
     addDep: function (dep) {
       if (!this.depIds.hasOwnProperty(dep.id)) {
         // 建立dep到watcher
         dep.addSub(this);
         // 建立watcher到dep的关系
         this.depIds[dep.id] = dep;
       }
     }
   
   
   ```

   

### 更新数据时的流程

vue.xxx=val时

vue.xxx的set=>data.xxx的set=>通知dep=>dep.notify()=>watcher.update()=>Updater内的更新方法=>界面更新

### 

### Observe Dep Watcher对象的理解

1.Observe

类比: Observe相当于发布者，有几个data属性数据就会创建几个Observe实例用来对属性数据进行劫持

-  1.用来对 data 所有属性数据进行劫持的构造函数
-  2.对每个data中的每个属性都会进行重新定义属性描述(get/set)
- 3.为每个属性创建dep实例

2.Dep

类比:Dep相当于发布订阅模式中的事件调度中心，每个data属性都有自己对应的dep实例，每个dep实例中都有一个subs[]数组，用来维护订阅者



3.Watcher

类比: Watcher相当于发布订阅模式中的订阅者，模板中的每个非事件指令或表达式都对应一个watcher对象



## 双向数据绑定

在单项数据绑定(model=>view)的基础上，实现修改view同时更新data中的属性数据(view=>model)

```javascript
model: function (node, vm, exp) {
    this.bind(node, vm, exp, 'model');

    var me = this,
      val = this._getVMVal(vm, exp);
    node.addEventListener('input', function (e) {
      var newValue = e.target.value;
      if (val === newValue) {
        return;
      }

      me._setVMVal(vm, exp, newValue);
      val = newValue;
    });
  }
```

总结：当模板解析v-model指令时，会给有v-model属性指令的节点添加input事件监听，当节点修改对应的属性数据时，通过回调函数，修改data中的属性数据。结合之前的单向数据绑定，实现双向数据绑定

