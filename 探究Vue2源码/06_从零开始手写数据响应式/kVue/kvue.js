"use strict";

/**
 * readme
模拟的是Vue1.x
没有使用虚拟dom 每一次都是操作真实dom

 */
/**
 * 这里的defineReactive实际上是一个闭包，
 * 外面的对面引用着函数内的变量，导致这些临时变量一直存在
 */
function defineReactive(obj, key, val){
    // observe 避免key的val是一个对象，对象里面的值没有响应式
    observe(val)

    /**
     * 创建一的Dep和当前的key一一对应
     */
    const dep = new Dep()


    // 利用getter setter 去拦截数据
    Object.defineProperty(obj,key, {
        get(){
            console.log('get', key)

            /**
             * 依赖收集在这里 
             */
            Dep.Target && dep.addDep(Dep.Target)
            return val
        },
        set(newVal){
            if( newVal !== val){
                console.log(`set ${val} -> ${newVal}`)

                // 如果传入的newVal依然是obj，需要响应式处理
                observe(newVal)
                val = newVal

                // 通知更新
                dep.notify()

            }
        }
    })
}

// 观察一个对象，让这个对象的属性变成响应式
function observe(obj){
    console.log('observe拿到', obj)
    // 希望传入的是一个Object
    if( typeof obj !== 'object' || typeof(obj) == null){
        return ;
    }
    // 创建Observer实例
    new Observer(obj)

}

// 3. set
function set(obj, key, val){
    defineReactive(obj,key,val)
}

// 代理函数，方便用户直接访问$data
function proxy(vm, source){
    // vm[source] 相当于 this.$data  然后利用Object.defineProperty进行数据劫持
    Object.keys(vm[source]).forEach(key=>{
        Object.defineProperty(vm, key, {
            get() {
                return vm[source][key];
            },
            set(newVal) {
                vm[source][key] = newVal;
            }
        })
    })
}

class kvue{
    constructor(options){
        // 保存选项
        this.$options = options;
        this.$data = options.data();

        // 响应化处理
        observe(this.$data)

        // 代理$data 指向$vm.data
        proxy(this, '$data')

        new Compile(options.el, this)
    }
}


class Observer {
    constructor(value){
        this.value = value

        // 判断其类型
        if( typeof value=== 'object' ){
            this.walk(value)
        }
    }


    // 对象数据的响应式
    walk( obj ){
        Object.keys(obj).forEach(key=>{
            defineReactive(obj, key, obj[key])
        })
    }

    // 数组数组的响应式待补充
}


/**
 * 观察者
 * 保存更新函数，值发生变化，调用更新函数
 */

// const watchers = []

class Watcher{
    constructor(vm, key, updateFn){
        this.vm = vm

        this.key = key

        this.updateFn = updateFn

        // watchers.push(this)
        // 在Dep.Target 静态属性上，设置为当前Watcher实例
        Dep.Target = this
        this.vm[this.key]               // 读取触发了getter
        Dep.Target = null               // 收集完就置空,避免二次依赖收集
    }

    update() {
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}

/**
 * Dep 依赖， 管理某个key 相关的所有Watcher 实例
 */
class Dep{
    constructor(){
        this.deps = []
    }

    addDep(dep){
        this.deps.push(dep)
    }
    notify() {
        // 更新与这个key有关的所有Watcher
        this.deps.forEach(dep=>dep.update() )
    }
}