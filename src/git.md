# git 

```js
// 初始化git仓库 多了一个.git目录
git init

// 把文件添加到仓库
git add

// 把文件提交到仓库，一次可以提交多个文件
git commit -m 'message'

// 查看提交历史
git log

// 查看历史命令
git reflog

// 版本回退,HEAD代表当前版本，HEAD^上一个版本，HEAD~100前100个版本
git reset --hard HEAD^
git reset --hard 版本号

// 撤销修改
// 撤销工作区的修改
git checkout -- file

// 把缓存区的修改回退到工作区
git reset HEAD file
```