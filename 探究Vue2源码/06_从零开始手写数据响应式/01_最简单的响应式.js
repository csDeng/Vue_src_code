"use strict";
/**
 * 1. 这里的defineReactive实际上是一个闭包，
 * 外面的对面引用着函数内的变量，导致这些临时变量一直存在
 */
function defineReactive(obj, key, val){
    // 1. 利用getter setter 去拦截数据
    Object.defineProperty(obj,key, {
        get(){
            console.log('get', key)
            return val
        },
        set(newVal){
            if( newVal !== val){
                console.log(`set ${val} -> ${newVal}`)
                // 1. 传入的newVal是一个对象,observe 一下成为响应式
                // （俗称进行社会主义进行洗礼）
                observe(newVal)
                val = newVal
            }
        }
    })
}

// 2. 观察一个对象，让这个对象的所有属性重新定义使之变成响应式
function observe(obj){
    // 希望传入的是一个Object
    if( typeof obj !== 'object' || typeof(obj) == null){
        return ;
    }
    Object.keys(obj).forEach(key=>{
        defineReactive(obj, key, obj[key])
    })
}

let obj = {}

defineReactive(obj, 'foo','fooo')
obj.foo
console.log(1)
obj.foo = 'foooooooooooooooooo'

console.log(2)


