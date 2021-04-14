# DFS 和 BFS 刷题实战

## DFS&BFS

[搜索思想——DFS&BFS](https://zhuanlan.zhihu.com/p/24986203)

### DFS: 深度优先搜索

> 从根节点出发，向下搜索，直到遇到叶子结点。然后向上回溯，继续向下递归未访问过的结点

### BFS: 广度优先搜索

> BFS 是从根节点开始，沿着树的宽度遍历树的节点，如果发现目标，则演算终止

## 题目合集

> 解题技巧：

- 递归出口：找到递归结束的条件（递归有一个截止条件，否则会溢出）
- 筛选条件：筛选出符合题干条件的结点（即什么样的节点才可以进入dfs）

### 网易面试题

**题目：**

```js
const tree = {
  name: 'root',
  children: [
    {
      name: 'c1',
      children: [
        {
          name: 'c11',
          children: [],
        },
        {
          name: 'c12',
          children: [],
        },
      ],
    },
    {
      name: 'c2',
      children: [
        {
          name: 'c21',
          children: [],
        },
        {
          name: 'c22',
          children: [],
        },
      ],
    },
  ],
}
// 深度优先的方式遍历 打印 name
// ['root', 'c1','c11', 'c12', 'c2', 'c21', 'c22']
```

1. 递归

```js
function dfs(root, res = [root.name]) {
    if (root === null) {
        return []
    }
    for (let i=0;i < root.children.length; i++) {
        let child = root.children[i]
        res.push(child.name)
        dfs(child, res)
    }
    return res
}
```

2. 使用栈模拟递归

```js
function dfs(root) {
  if (root === null) {
    return []
  }
  // 存储待访问的节点
  let stack = [root]
  let res = []
  while (stack.length > 0) {
    let node = stack.pop()
    res.push(node.name)
    let children = node.children
    for (let i = children.length - 1; i >= 0; i--) {
      stack.push(children[i])
    }
  }
  return res
}
```

### 二叉树的最大深度

> 问题描述：给定一个二叉树，找出其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**示例：**

```js
给定二叉树 [3,9,20,null,null,15,7]
    3
   / \
  9  20
    /  \
   15   7
返回它的最大深度 3 。
```

1. 递归 DFS 时间复杂度 O(n) 空间复杂度由于用到递归所以是 O(height)

> 思路：递归出口：当节点为 null，表示深度为 0，返回 0。递归地求出左子树深度，右子树深度，取两者最大值即为树的最大深度

```js
var maxDepth = function (root) {
  if (root === null) {
    return 0
  }
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}
```

2. 非递归 BFS 时间复杂度 O(n) 空间复杂度 O(n)

> 思路：遍历树的每一层，每遍历一层，count+1

```js
var maxDepth = function (root) {
  if (!root) {
    return 0
  }
  // 存储未访问过的节点
  let queue = [root]
  let height = 0
  // 当队列存在未访问的结点时，广度遍历
  while (queue.length > 0) {
    // 保存下一层的所有结点
    let tmp = []
    // 访问结点，将下一层结点添加到tmp中
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].left) {
        tmp.push(queue[i].left)
      }
      if (queue[i].right) {
        tmp.push(queue[i].right)
      }
    }
    // 遍历完一层结点深度+1
    height++
    // 未访问队列更新为下一层结点
    queue = tmp
  }
  return height
}
```

### 二叉树的最小深度

[leetcode](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

> 问题描述：给定一个二叉树，找出其最小深度。最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

**示例：**

```js
给定二叉树 [3,9,20,null,null,15,7],
    3
   / \
  9  20
    /  \
   15   7
返回它的最小深度  2.
```

1. 递归 DFS 时间复杂度 O(N) 空间复杂度 O(h)：最坏 O(n) 平均 O(NlogN)

> 思路：对于每一个非叶子节点，我们只需要分别计算其左右子树的最小叶子节点深度

- 递归出口：当前结点为 null 时，返回 0
- 如果该节点是叶子结点（无左右子结点），返回 1
- 如果该节点是非叶子结点，分别计算左右子树的最小叶子结点深度

```js
var minDepth = function (root) {
  // 递归出口
  if (!root) return 0
  if (!root.left && !root.right) return 1
  let min = 10000
  if (root.left) min = Math.min(min, minDepth(root.left))
  if (root.right) min = Math.min(min, minDepth(root.right))
  return min + 1
}
```

2. 非递归 BFS

> 思路：当我们找到一个叶子节点时，直接返回这个叶子节点的深度。广度优先搜索的性质保证了最先搜索到的叶子节点的深度一定最小

- 遍历每一层结点，当找到叶子结点时，就返回最小深度

```js
function bfs(root) {
  if (!root) return 0
  let queue = [root]
  let min = 0
  while (queue.length > 0) {
    let tmp = []
    min++
    for (let i = 0; i < queue.length; i++) {
      if (!queue[i].left && !queue[i].right) return min
      if (queue[i].left) tmp.push(queue[i].left)
      if (queue[i].right) tmp.push(queue[i].right)
    }
    queue = tmp
  }
}
```

### 二叉树的层序遍历

[leetcode](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

> 问题描述：给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。

**示例：**

```js
二叉树：[3,9,20,null,null,15,7],
    3
   / \
  9  20
    /  \
   15   7
返回其层次遍历结果：
[
  [3],
  [9,20],
  [15,7]
]
```

1. 非递归 bfs

```js
var levelOrder = function (root) {
  if (!root) return []
  let queue = [root]
  let res = [[root.val]]
  while (queue.length > 0) {
    let tmp = []
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].left) tmp.push(queue[i].left)
      if (queue[i].right) tmp.push(queue[i].right)
    }
    if (tmp.length > 0) res.push(tmp.map((root) => root.val))
    queue = tmp
  }
  return res
}
```

### 二叉树的锯齿形层次遍历

[leetcode](https://leetcode-cn.com/problems/binary-tree-zigzag-level-order-traversal/)

> 问题描述：给定一个二叉树，返回其节点值的锯齿形层次遍历。（即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）。

**示例：**

```js
例如：
给定二叉树 [3,9,20,null,null,15,7],
    3
   / \
  9  20
    /  \
   15   7
返回锯齿形层次遍历如下：
[
  [3],
  [20,9],
  [15,7]
]
```

1. bfs

> 思路：bfs 思路和普通层次遍历思路基本一致。需要新增 flag 位，标记是否需要反转数组。每遍历一层后，flag 取反

```js
var zigzagLevelOrder = function (root) {
  if (!root) return []
  let queue = [root]
  let res = [[root.val]]
  // true, 左->右
  // false, 右->左
  let flag = false
  while (queue.length > 0) {
    let tmp = []
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].left) tmp.push(queue[i].left)
      if (queue[i].right) tmp.push(queue[i].right)
    }
    if (tmp.length > 0) {
      let arr = tmp.map((root) => root.val)
      if (!flag) arr.reverse()
      res.push(arr)
    }
    queue = tmp
    flag = !flag
  }
  return res
}
```

### 矩阵中的最长递增路径

[leetcode](https://leetcode-cn.com/problems/longest-increasing-path-in-a-matrix/)

> 问题描述：给定一个整数矩阵，找出最长递增路径的长度。对于每个单元格，你可以往上，下，左，右四个方向移动。 你不能在对角线方向上移动或移动到边界外（即不允许环绕）。

**示例：**

```js
输入: nums =
[
  [9,9,4],
  [6,6,8],
  [2,1,1]
]
输出: 4
解释: 最长递增路径为 [1, 2, 6, 9]。

输入: nums =
[
  [3,4,5],
  [3,2,6],
  [2,2,1]
]
输出: 4
解释: 最长递增路径是 [3, 4, 5, 6]。注意不允许在对角线方向上移动。
```

### 电话号码的字母组合

[leetcode](电话号码的字母组合)

> 问题描述：给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

**示例：**

```js
输入："23"
输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
```

1. dfs + 回溯

> 思路：

![dfs](C:\Users\姜嘿嘿\Desktop\imgs\电话.png)

- 利用 stack 存储已有的字母排列，stack 初始为空
- 每次取号码的一位数字，从 letters 获得该数字对应的所有可能的字母
- 将一个字母推入 stack
- 继续处理下一个数字，直到处理完所有数字得到一个完整的字母排列
- 然后进行回溯，遍历其余的字母排列
- 递归出口：当 stack 长度与 digits 长度一致，表示已得到一个完整的字母排位，push 到 res 中

```js
var letterCombinations = function (digits) {
  if (digits.length === 0) return []
  let letters = [
    [],
    [],
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i'],
    ['j', 'k', 'l'],
    ['m', 'n', 'o'],
    ['p', 'q', 'r', 's'],
    ['t', 'u', 'v'],
    ['w', 'x', 'y', 'z'],
  ]

  let dfs = (digits, stack = [], res = []) => {
    if (stack.length === digits.length) {
      res.push(stack.join(''))
      return
    }
    let letter = letters[digits.substr(stack.length, 1)]
    for (let i = 0; i < letter.length; i++) {
      let str = letter[i]
      stack.push(str)
      dfs(digits, stack, res)
      stack.pop()
    }
    return res
  }
  return dfs(digits)
}
```

### 复原 IP 地址

[leetcode](https://leetcode-cn.com/problems/restore-ip-addresses/)

> 问题描述：给定一个只包含数字的字符串，复原它并返回所有可能的 IP 地址格式。效的 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。

**示例：**

```js
示例 1：
输入：s = "25525511135"
输出：["255.255.11.135","255.255.111.35"]

示例 2：
输入：s = "0000"
输出：["0.0.0.0"]

示例 3：
输入：s = "1111"
输出：["1.1.1.1"]

示例 4：
输入：s = "010010"
输出：["0.10.0.10","0.100.1.0"]

示例 5：
输入：s = "101023"
输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]

```

- 递归出口：
  1. stack 长度为 4
  2. 输入字符串取尽
  3. 当 stack 正好为 4 并且输入字符串取尽时，表示这是一个正确的 IP 地址，push 到 res 中
- 筛选条件：ip 小于 256 且当 ip 为两位时不能以 0 开头

```js
var restoreIpAddresses = function (s) {
  if (s === '') return []
  let dfs = (s, stack = [], res = [], index = -1) => {
    if (stack.length === 4 || index === s.length - 1) {
      if (stack.length === 4 && index === s.length - 1) {
        res.push(stack.join('.'))
      }
      return
    }
    for (let i = 1; i < 4; i++) {
      let ip = s.substr(index + 1, i)
      if (parseInt(ip) < 256 && (ip === '0' || !ip.startsWith('0'))) {
        stack.push(ip)
        dfs(s, stack, res, index + i)
        stack.pop()
      }
    }
    return res
  }
  return dfs(s)
}
```

### 岛屿数量

[leetcode](https://leetcode-cn.com/problems/number-of-islands/)

> 问题描述：给你一个由  '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
> 岛屿总是被水包围，并且每座岛屿只能由水平方向或竖直方向上相邻的陆地连接形成。此外，你可以假设该网格的四条边均被水包围。

**示例：**

```js
输入: [
  ['1', '1', '1', '1', '0'],
  ['1', '1', '0', '1', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '0', '0', '0'],
]
输出: 1

输入: [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1'],
]
输出: 3
```

> 思路：遍历二维数组，如果当前 item 为 1，则以当前 item 开始深度遍历，遍历当前 item 的上下左右，同时每开始一次 dfs 意味着岛屿数量+1。dfs：递归出口：数组越界或当前 item 为 0，则跳出循环

```js
var numIslands = function (grid) {
  let dfs = (grid, i, j) => {
    if (
      i < 0 ||
      i >= grid.length ||
      j < 0 ||
      j >= grid[0].length ||
      grid[i][j] === '0'
    ) {
      return
    }
    // 将访问过的节点置0，防止无限循环
    grid[i][j] = '0'
    // 深度遍历上下左右
    dfs(grid, i + 1, j)
    dfs(grid, i - 1, j)
    dfs(grid, i, j - 1)
    dfs(grid, i, j + 1)
  }
  let count = 0
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++
        dfs(grid, i, j)
      }
    }
  }
  return count
}
```

### 矩阵中的路径

[leetcode](https://leetcode-cn.com/problems/ju-zhen-zhong-de-lu-jing-lcof/)

**思路：**

主要的思路是 dfs。首先遍历二维数组，如果某个 item 等于 word[0]，则从这个 item 开始深度优先遍历。由于要遍历 item 的上下左右，所以递归出口是数组越界或者当前遍历的 item 的值不等于 word[index]。

```js
var exist = function (board, word) {
  let row = board.length
  let col = board[0].length
  let dfs = (i, j, index) => {
    // 递归出口同时是筛选条件
    if (i < 0 || i >= row || j < 0 || j >= col || board[i][j] !== word[index]) {
      return false
    }
    if (index === word.length - 1) {
      return true
    }
    let tmp = board[i][j]
    // 标记已访问过的节点，避免无限循环
    board[i][j] = '-'
    let res =
      dfs(i - 1, j, index + 1) ||
      dfs(i + 1, j, index + 1) ||
      dfs(i, j - 1, index + 1) ||
      dfs(i, j + 1, index + 1)
    // 遍历后重置该节点
    board[i][j] = tmp
    return res
  }
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (board[i][j] === word[0]) {
        if (dfs(i, j, 0)) {
          return true
        }
      }
    }
  }
  return false
}
```
