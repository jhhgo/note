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

## Output

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

### 配置postcss-loader

这个loader可以解决一些css兼容性问题，即产商前缀

具体配置：[postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)

**第一步：下载**👇

```js
npm i postcss-loader postcss-preset-env -D
```

postcss-preset-env可以帮助postcss找到package.json中browserlist的配置，通过配置加载指定css兼容性样式



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

### mini-css-extract-plugin

该插件用于将css从js中提取出来，形成单独的文件

**第一步：下载**👇

```js
npm i mini-css-extract-plugin
```

**第二步：配置**👇

```js
// module
{
  test: /.\css$/
  use: [
    // 由于该插件把css提取成单独文件，所以不需要style-loader
    MiniCssExtractPlugin.loader,
    'css-loader'
  ]
}

//plugins
plugins:[
  new MiniCssExtractPlugin()
]
```

加入以上配置重新打包后，会生成一个css文件包含index.js依赖的所有css，同时html会自动引入该css文件

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
