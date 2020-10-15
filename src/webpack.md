# webpack

## webpack 基础知识

### 什么是 webpack

webpack 是一个前端资源构建工具，静态模块打包器

### webpack 配置文件

基础配置：

```js
const path = require('path')

module.exports = {
  entry: './scr/index.js',
  output: {
    filename: 'built.js',
    path: path.join(__dirname, 'dist'),
  },
}
```

以上是一个基本的 webpack 配置，入口文件`index.js`，output 打包出口。
那么这个时候，在命令行中运行 npx webpack，就会去找 webpack.config.js 文件中的配置信息。

1. Entry
2. Output
3. Loader
4. Plugins
5. Mode

## Entry

webpack打包的入口。

具体配置👉[entry](https://www.webpackjs.com/configuration/entry-context/)

entry支持设置单入口和多入口

```js
// 单入口，字符串。chunk名为main
entry: './src/index.js'
// 多入口，字符串数组。只生成一个bundle，chunk名为main
entry: ['./src/index.js', './src/test.js']
// 多入口，对象。有一个入口就生成几个bundle，chunk名为key值
entry: {
  index: './src/index.js',
  test: './src/test.js'
}
```

## Output

output 位于对象最顶级键(key)，包括了一组选项，指示 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」。

具体配置👉[output](https://www.webpackjs.com/configuration/output/)

```js
output: {
  // 文件名称（目录+指定名称）
  filename: 'js/[name].js',
  // 输出文件的目录（将来所有资源输出的公共目录）
  path: path.join(__dirname, 'dist'),
  // 引入资源的公共路径前缀
  publicPath: '/',
  // 非入口chunk的名称
  chunkFilename: '[name]_chunk.js'
}
```

## Loader

webpack 本身只能处理.js 文件，当 webpack 不清楚对于一些文件如何处理就会求助于 loader。简单地说，loader 作用在于解析文件，将 webpack 无法处理的非 js 文件，处理成 webpack 能够处理的模块

### 配置 file-loader

file-loader 用于处理除了 html\css\js 的资源

配置 👇

```js
{
  // 排除css\js\html文件
  exclude: /\.(css|js|html)$/,
  loader: 'file-loader',
  options: {
    // 输出文件命名
    name: '[name]_[hash:10].[ext]'
  }
}
```

### 配置 url-loader

对于图片资源，可以使用 url-loader 进行处理

具体配置：[url-loader](https://www.webpackjs.com/loaders/url-loader/)

下载 👇

```js
npm i url-loader -D
```

配置 👇

```js
{
  test: /\.(jpg|png|gif)/,
  // 使用一个loader时
  loader: 'url-loader',
  options: {
  }
}
```

上述配置的意思是，当图片小于 8kb 时，图片会以 base64 格式打包到 built.js 文件中。如果大于 8kb 打包到单独的文件夹。

base64 可以减少请求数量，减轻服务器压力。不过经过 base64 处理的图片资源，体积会比原来大，导致文件请求速度更慢

### 配置 html-loader

当我们在 html 文件中引入图片资源，url-loader 是无法处理的 👇

```html
<img src="./img/cdn.png" alt="" />
```

html-loader 就是用来处理 html 文件中的 img 图片，html-loader 引入 img 从而使 img 能被 url-loader 解析。

配置 👇

### 配置 css-loader

当我们引入 css 模块时，需要下载对应 loader 处理 css 文件。

```js
npm i style-loader css-loader -D
```

在 module 中配置 loader👇

```js
{
  // 匹配文件后缀名
  test: /\.css$/,
  // 使用哪些loader进行解析
  use: ['style-loader', 'css-loader']
},
```

注意 use 数组中 loader 的执行顺序是从右向左，即 css-loader 首先处理 css 文件，然后是 style-loader。

利用 style-loader 和 css-loader 可以处理 css 文件。两个 loader 的功能不同 👇

- css-loader，将 css 文件变成 commonjs 模块加载到 js 中，内容是样式字符串
- style-loader，创建 style 标签，将 css-laoder 处理后的样式字符串添加到 style 标签，并插入到 head 中

### 配置 less-loader

```js
npm i less less-loader -D
```

module 配置 👇

```js
{
  test: /\.less$/,
  use: ['style-loader', 'css-loader', 'less-loader']
}
```

由于 loader 执行顺序，所以 less-loader 先执行，将 less 文件编译为 css 文件。之后和处理 css 文件的步骤一致

### 配置 postcss-loader

这个 loader 可以解决一些 css 兼容性问题，即产商前缀

具体配置：[postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)

**第一步：下载**👇

```js
npm i postcss-loader postcss autoprefixer -D
```

**第二步：创建 postcss.config.js**👇

```js
// postcss.config.js  和webpack.config.js在一个目录下
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
      ],
    }),
  ],
}
```

**第三步：配置**👇

```js
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader', 'postcss-loader']
}
```

打包后的 css 文件加上了产商前缀 👇

```css
#box1 {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
```

### eslint-loader

通过 ESLint 检查 JavaScript 代码

**第一步：下载**👇

```js
npm i eslint eslint-loader -D
```

我们可以设置 eslint 语法检查的规则为 airbnb，github👉[airbnb](https://github.com/airbnb/javascript)

同时我们需要下载以下几个包 👇

```js
npm i eslint-config-airbnb-base eslint-plugin-import -D
```

**第二步：配置**👇

```js
// package.json
"eslintConfig": {
  "extends": "airbnb-base"
}
```

```js
{
  test: /\.js$/,
  // 排除node_modules文件夹
  exclude: /node_modules/,
  loader: 'eslint-loader',
  options: {
    // 自动修复
    fix: true
  }
}
```

### babel-loader

处理 js 兼容性问题，es6 -> es5

webpack 官网配置 👉[babel-loader](https://www.webpackjs.com/loaders/babel-loader/)

babel 官网 👉[babel-loader](https://www.babeljs.cn/)

**下载**👇

```js
npm install --save-dev babel-loader @babel/core
// @babel/core 是babel中的一个核心库
npm install --save-dev @babel/preset-env
// preset-env 这个模块就是将语法翻译成es5语法,这个模块包括了所有翻译成es5语法规则
npm install --save @babel/polyfill
// 将Promise,map等低版本中没有实现的语法,用polyfill来实现.
```

**配置**👇

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: [['@babel/preset-env']],
      },
    },
  ]
}
```

- preset-env 只能转化一些基本的 es6 语法，不能转化 Promise、箭头函数等语法
- 使用`@babel/polyfill`模块，对 Promise、箭头函数等进行补充

`@babel/polyfill`模块的使用 👇

```js
// 在index.js直接引入即可
import '@babel/polyfill'
```

`@babel/polyfill`默认会引入全部的兼容性解决方案。导致文件很大

所以需要以下配置 👇

```js
// 使用此配置后，只会兼容当前使用的es6语法而非兼容全部es6语法
useBuiltIns: 'usage'
```

当 js 同时被`eslint-loader`和`babel-loader`处理时，要先执行`eslint`再执行`babel`。首先对 js 进行 eslint 检查，然后再进行 es6->es5 转换。

```js
// eslint-loader
{
  test: /\.js$/,
  exclude: /node_modules/,
  // 优先执行此loader，无论顺序先后
  enforce: 'pre',
  loader: 'eslint-loader',
  options: {
    fix: true
  }
},
// babel-loader
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader'
  // ...
}
```

## Plugins

### HtmlWebpackPlugin 配置

这个插件的作用，以提供的 html 为模板创建一个新的 html 文件，并自动引入打包好的 js 文件

具体配置：[HtmlWebpackPlugin](https://www.webpackjs.com/plugins/html-webpack-plugin/)

**第一步：**下载 👇

```js
npm i html-webpack-plugin -D
```

**第二步：**配置 👇

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: path.join(__dirname, 'built'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  mode: 'development',
}
```

运行`webpack`命令，就会在`built`目录下生成了一个 html 文件，并自动引入了打包后的`built.js`文件。

`template: './src/index.html'`告诉插件以哪个文件为模板

如果需要压缩 html 加入以下配置 👇

```js
new HtmlWebpackPlugin({
  template: './src/index.html',
  minify: {
    // 移除空格
    collapseWhitespace: true,
    // 移除评论
    removeComments: true
  }
  }),
```

### mini-css-extract-plugin

该插件用于将 css 从 js 中提取出来，形成单独的文件

**第一步：下载**👇

```js
npm i mini-css-extract-plugin
```

**第二步：配置**👇

```js
// module
{
  test: /\.css$/
  use: [
    // 由于该插件把css提取成单独文件，所以不需要style-loader
    MiniCssExtractPlugin.loader,
    'css-loader',
  ]
}

//plugins
plugins: [new MiniCssExtractPlugin()]
```

加入以上配置重新打包后，会生成一个 css 文件包含 index.js 依赖的所有 css，同时 html 会自动引入该 css 文件

### OptimizeCssAssetsWebpackPlugin

该插件用于压缩 css

## webpack-dev-server

webpack-dev-server 能够用于快速开发应用程序，具体的说，它可以自动编译，自动打开浏览器，自动刷新浏览器等。并且 webpack-dev-server 只会在内存中编译打包，不会有任何输出

具体配置：[dev-server](https://www.webpackjs.com/configuration/dev-server/)

**第一步：下载**👇

```js
npm i webpack-dev-server -D
```

**第二步：配置**👇

```js
devServer: {
  // built目录开启服务器
  contentBase: path.join(__dirname, 'built'),
  // 是否使用gzip压缩
  compress: true,
  // 端口号
  port: 3000,
  // 是否自动打开浏览器
  open: true
},
```

## Mode

## webpack 性能优化

- 开发环境
  1. 优化打包构建速度
  2. 优化代码调试
- 生产环境

## 开发环境优化

### HMR

> 模块热替换(HMR - Hot Module Replacement)功能会在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。它允许在运行时更新各种模块，而无需进行完全刷新。

具体配置 👉[HMR](https://www.webpackjs.com/guides/hot-module-replacement/)

### source-map优化代码调试

source-map 是一种提供源代码到构建后代码的映射的技术。比如构建后的代码出错了，可以通过映射关系追踪到源代码错误。

具体配置 👉[source-map](https://www.webpackjs.com/configuration/devtool/)

推荐配置 👇

```js
devtool: 'cheap-module-eval-source-map'
```

### 构建缓存

利用`babel-loader`的`cacheDirectory`选项，缓存 loader 的执行结果，避免在每次执行构建时，可能产生的、高性能消耗的 babel 重新编译过程

> cacheDirectory：默认值为 false。当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。如果设置了一个空值 (loader: 'babel-loader?cacheDirectory') 或者 true (loader: babel-loader?cacheDirectory=true)，loader 将使用默认的缓存目录 node_modules/.cache/babel-loader，如果在任何根目录下都没有找到 node_modules 目录，将会降级回退到操作系统默认的临时文件目录。

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true
  }
}
```

## 生产环境优化

### contenthash 浏览器缓存

考虑一个需求，当一个项目上线时，你修改了部分文件，你希望浏览器仅请求被修改的文件，对于没有修改的文件可以去缓存中读取。此时就需要用到`contenthash`

webpack 中的三种 hash👇

**hash**

hash，主要用于开发环境中，在构建的过程中，当你的项目有一个文件发现了改变，整个项目的 hash 值就会做修改(整个项目的 hash 值是一样的)，这样子，每次更新，文件都不会让浏览器缓存文件，保证了文件的更新率，提高开发效率。

**chunkhash**

它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的 hash 值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，即一个入口代表一个 chunk。接着我们采用 chunkhash 的方式生成 hash 值，那么只要我们不改动公共库的代码，就可以保证其 hash 值不会受影响。

但是这个中 hash 的方法其实是存在问题的，生产环境中我们会用 webpack 的插件，将 css 代码打单独提取出来打包。这时候 chunkhash 的方式就不够灵活，因为只要同一个 chunk 里面的 js 修改后，css 的 chunk 的 hash 也会跟随着改动。因此我们需要 contenthash。

**contenthash**

contenthash 表示由文件内容产生的 hash 值，内容不同产生的 contenthash 值也不一样。在项目中，通常做法是把项目中 css 都抽离出对应的 css 文件来加以引用。

生产环境配置 👇

```js
output: {
  filename: '[name].[contenthash].js',
  chunkFilename: '[vendors].[contenthash].js',
  path: path.join(__dirname, 'dist')
}
```

对于开发环境，将`contenthash`改为`hash`即可。这样可以提高开发效率。

### tree shaking

在 webpack 项目中，有一个入口文件，相当于一棵树的主干，入口文件有很多依赖的模块，相当于树枝。实际情况中，虽然依赖了某个模块，但其实只使用其中的某些功能。通过 tree-shaking，将没有使用的模块摇掉，这样来达到删除无用代码的目的。

如何开启 tree shaking?

- 使用 es6 模块化(import export)
- 将`mode`改为`production`

将文件标记为无副作用(side-effect-free)

```js
{
  // 表示，所有代码都没有副作用（都可以进行tree shaking）
  "sideEffects": false
}
```

此时，如果 import 了 css 文件，webpack 会认为 css 是无用代码，从而删除 css 文件

所以我们需要将 css 添加到 sideEffects 中，避免 webpack 无意地将其删除

```js
{
  "sideEffects": [
    "*.css"
  ]
}
```

### code split

将打包后的一个 js 文件分为多个 js 文件

**多入口**

```js
entry: {
  // 多入口：有一个入口，就会输出一个bundle
  index: './src/js/index.js',
  test: './src/js/test.js'
},
output: {
  // [name]：文件名，即entry对象的属性名
  filename: 'js/[name].[contenthash:10].js',
  outputPath: path.join(__dirname, 'dist')
}
```

打包后在 dist/js 目录下，生成了两个 js 文件

**optimization**

```js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

optimization 的作用 👇

- 将`node_modules`中的代码单独打包成一个 chunk 最终输出
- 将多入口中的公共依赖单独打包成一个 chunk 最终输出

**es10 import 语法**

在`entry`是单入口的前提下，仍然想让某个文件单独打包成一个 chunk，可以这样做 👇

```js
// index.js

// import返回一个promise对象
// then方法成功回调传入的值是test.js的es6 module对象
// 通过webpackChunkName，可以设置打包后文件的文件名
import(/* webpackChunkName: 'test' */'./test')
  .then(({add, count}) => {
    add(1, 2)
    count(5, 2)
    console.log('文件加载成功')
  })
  .catch(() => {
    console.log('文件加载失败')
  })

// test.js
function add(x, y) {
  return x + y
}
function count(x, y) {
  return x - y
}
```

同时该语法还可以实现**懒加载**、**预加载**功能

在一个js文件中，引入了另外一个js文件。但是还没有用到另外一个文件中的方法，此时浏览器仍会先请求另一个js文件。

懒加载：在用到另一个文件中的方法时，才去请求该js文件

预加载：同样也是在使用前请求js文件。但是不会阻塞其他资源的请求，会在空闲时间，偷偷请求js文件

```js
// index.js
// 将import语法放到异步函数中，用到的时候才加载
// webpackPrefetch: true，开启预加载
document.getElementById('btn').onclick = function() {
  import(/*webpackPrefetch: true*/'.test').then({add} => {
    add(1, 2)
  })
}
```

### externals

externals用于防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外
部获取这些扩展依赖（CDN）。

具体配置👉[externals](https://www.webpackjs.com/configuration/externals/)

例如，从CDN引入jquer，而不是将其打包

```html
<!-- index.html -->
<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
```

```js
// wbepack.config.js
externals: {
  jquery: 'jQuery'
}
```

```js
// index.js
import $ from 'jquery'
console.log($)
```
