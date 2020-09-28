# 编程题

## 两数之和

> 问题描述：给定一个整数数组 nums，和一个目标值 target，在数组中找出和为目标值的两个整数，并返回他们的数组下标

1. 两层循环：时间复杂度 O(n²)，空间复杂度 O(1)

```js
function twoSum(nums, target) {
  let arr = []
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        arr.push(i, j)
      }
    }
  }
  return arr
}
```

2. 使用 map（map 记录数组的值和下标，在数组中查找）空间换时间。时间复杂度 O(n)，O(n)

```js
function twoSum(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    let value = nums[i]
    let diff = target - value
    if (map.has(diff)) {
      return [i, map.get(diff)]
    } else {
      map.set(value, i)
    }
  }
}
```

## 两数相加

> 问题描述：给出两个   非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照   逆序   的方式存储的，并且它们的每个节点只能存储   一位   数字。如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。您可以假设除了数字 0 之外，这两个数都不会以 0  开头。

**示例**：

```js
输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807
```

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

var addTwoNumbers = function (l1, l2) {
  let res = new ListNode(-1)
  let cur = res
  let carry = 0
  while (l1 !== null || l2 !== null) {
    let v1 = l1 ? l1.val : 0
    let v2 = l2 ? l2.val : 0
    let sum = v1 + v2 + carry
    carry = sum >= 10 ? 1 : 0

    cur.next = new ListNode(sum % 10)
    cur = cur.next

    l1 = l1 ? l1.next : l1
    l2 = l2 ? l2.next : l2

    if (carry === 1) {
      cur.next = new ListNode(1)
    }
  }
  return res.next
}
```
