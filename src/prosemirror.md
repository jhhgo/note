# prosemirror

简介：prosemirror不是一个开箱即用的编辑器，它由多个小的模块组成，类似一个个乐高积木堆叠出的编辑器。

## prosemirror核心库

- `prosemirror-model`: 定义编辑器的文档模型(prosemirror document)，用来描述编辑器内容的数据结构。

- `prosemirror-state`: 提供描述编辑器整个状态的数据结构，包括`selection`，以及从一个状态到下一个状态的`transaction`

- `prosemirror-view`: 在浏览器中将给定编辑器状态显示为可编辑元素，并且处理用户交互的用户界面组件。

- `prosemirror-transform`

## 核心概念

### Documents

prosemirror定义了它自己数据结构来表示document内容。