"use strict";
const { log } = console;

let data = { a: 1, b:2 }
let target, c, d;

// 依赖收集,每个Object的key都有一个Dep实例
class Dep{
    constructor(){
        this.deps = []
    }
    depend(){
        target && !this.deps.includes(target) && this.deps.push(target)
    }
    notify() {
        this.deps.forEach(dep=>dep() )
    }
}

Object.keys(data).forEach(key=>{
    let v = data[key]
    const dep = new Dep()

    Object.defineProperty(data, key, {
        get(){
            dep.depend()
            return v;
        },
        set(nv){
            v = nv
            dep.notify()
        }
    })
})

function watcher(fn) {
    target = fn
    target()
    target = null
}

watcher(()=>{
    c = data.a + data.b
})

watcher(()=>{
    d = data.a - data.b
})

log('c=',c)
log('d=',d)
data.a = 99
log('c=',c)
log('d=',d)

/**
c= 3
d= -1 
c= 101
d= 97 
 */