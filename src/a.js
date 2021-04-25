exports.done = false
var b = require('./b.js')
console.log('在a.js中 b.done=' + b.done);
exports.done = true
console.log('a执行完毕');