"use strict";
/**
 * 数组的响应式
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
// 替换数组中的原型方法
const originProto = Array.prototype

// 备份
const arrayProto = Object.create(originProto);

['push', 'pop', 'shift', 'unshift','reverse', 'sort', 'splice'].forEach(method=>{
    arrayProto[method] = function() {
        // 原始操作
        originProto[method].apply(this, arguments)

        // 覆盖操作
        // 通知更新
        console.log('数组执行' + method + '操作:' + arguments)
    }
})


/**
 * 对象的响应式
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
    // 
    if(Array.isArray(obj)) {
        // 覆盖原型，替换7个更换操作
        obj.__proto__ = arrayProto

        // 对数组内部元素执行响应式
        const keys = Object.keys(obj)
        for(let i=0; i<obj.length; i++){
            observe(obj[i])
        }
    }else{
        Object.keys(obj).forEach(key=>{
            defineReactive(obj, key, obj[key])
        })
    }

}

// 3. set
function set(obj, key, val){
    defineReactive(obj,key,val)
}





let arr = [1,2,3, [4,5]]

observe(arr)

console.log(arr)

arr.push(9)
arr.push({a:1})
console.log(arr)
