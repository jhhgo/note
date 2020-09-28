# nodejs

## http模块

## url模块

## fs模块

1. fs.stat(filepath, callback)：检测目标是文件还是目录

   ```js
   fs.stat('./html', (err, data) => {
       if(err) {
           console.log(err);
           return
       }
   
       console.log(data.isFile());
       console.log(data.isDirectory());
   })
   ```

2. fs.mkdir(path, option,callback)：创建目录

   ```js
   fs.mkdir('./css', err => {
       if(err) {
           console.log(err)
           return
       }
       console.log('创建成功');
   })
   ```

3. fs.writeFile(path,data,options,callback)：创建并写入文件

4. fs.appendFile(path,data,callback)：追加文件

5. fs.readFile(path,callback)：读取文件

6. fs.readdir(path,callback)：读取目录

7. fs.rename(oldName,newName,callback)：重命名

8. fs.rmdir(path,callback)：删除目录

9. fs.unlink(path,callback)：删除文件