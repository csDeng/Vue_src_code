"use strict";
function defineReactive(obj, key, val) {
    return Object.defineProperty(obj, key, {
        get() {
            console.log('get->', key)
            return val
        },

        set(newVal) {
            if (newVal === val) return;
            console.log(`set ${key} from ${val} to ${newVal}`)
            // 数据发生变化，我们就调用函数
            val = newVal
            fn()
        }
    })
}

let source = {}
defineReactive(source, 'a', 1)
defineReactive(source, 'b', 2)

let c ;
function fn(){
    let c = source.a + source.b; 
    console.log('c自动变化成为',c)
}

// 初始化一下c
fn()

source.a = 99



