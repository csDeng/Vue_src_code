"use strict";
/**
 * 这里的defineReactive实际上是一个闭包，
 * 外面的对面引用着函数内的变量，导致这些临时变量一直存在
 */
function defineReactive(obj, key, val){
    // observe 避免key的val是一个对象，对象里面的值没有响应式
    observe(val)


    // 利用getter setter 去拦截数据
    Object.defineProperty(obj,key, {
        get(){
            console.log('get', key)
            return val
        },
        set(newVal){
            if( newVal !== val){
                console.log(`set ${val} -> ${newVal}`)
                val = newVal
            }
        }
    })
}

// 观察一个对象，让这个对象的属性变成响应式
function observe(obj){
    // 希望传入的是一个Object
    if( typeof obj !== 'object' || typeof(obj) == null){
        return ;
    }
    Object.keys(obj).forEach(key=>{
        defineReactive(obj, key, obj[key])
    })
}

// 3. set
function set(obj, key, val){
    defineReactive(obj,key,val)
}

/**
 * 4. 首先要明确，改变数组方法的只有7个
 * push
 * pop
 * shift
 * unshift
 * reverse
 * sort
 * splice
 *
 */


let o = { a: 1, b: 'hello', c:{age:9}}
observe(o)

o.a
o.a = 2
o.b
o.b = 'world'
o.c.age
o.c.age = 99
// o.c = 'ccccc'
// o.c

set(o, 'foo', 'foo')
o.foo
o.foo = 'fooooo'

