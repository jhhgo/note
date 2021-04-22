# css3

## 过渡(transition)

过渡可以为一个元素在不同状态之间切换的时候定义不同的过渡效果。

### 基本使用

```js
// css属性，花费时间，效果曲线(默认ease)，延迟时间(默认0)
transition: width, .5s, ease, .2s;
```

`transition`是以下属性的简写👇

```js
transition-property: width;
transition-duration: 1s;
transition-timing-function: linear;
transition-delay: 2s;
```