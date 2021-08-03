import observe from './Observe';
import Watcher from './Watcher';
import Dep from './Dep'
var obj = {
    a:{
        m: {
            n: 5
        }
    },
    b:{
        c:'hello'
    },
    g: [2,3,44,55,66]
}


observe(obj)
// obj.a = 10

console.log(obj.a.m.n)

// 全局位置
new Watcher(obj, 'a.m.n', (val)=>{
    console.log('※※※※※', val)
})
obj.a.m.n = 88
console.log(obj.a.m.n)
