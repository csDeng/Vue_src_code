import Dep from './Dep'
var uid = 0;
export default class Watcher{
    // target 要观测的Object
    // expression 是obj的点路径字符串
    // callback 是观测发生时的回调函数
    constructor(target,expression, callback){
        this.id = uid++
        this.target = target

        // 获取观测的对象值的函数， 
        // 后面通过this.getter(obj) 即可获取 obj.expression 的值
        this.getter = parsePath(expression)
        this.callback = callback
        this.value = this.get()
        // console.log("我是Watcher的构造器")
    }
    get(){
        // 进入依赖收集阶段
        // 让全局的window.target 设置为watcher本身
        Dep.target = this
        const obj = this.target
        var value = null
        try {
            value = this.getter(obj)
        } finally {
            // 设置Dep.target的类属性为null, 方便下次收集依赖
            Dep.target = null
        }
        return value
        
    }
    update(){
        //更新数据

        this.getAndInvoke(this.callback)
    }

    getAndInvoke(cb){
        // 获取并执行

        // 收集依赖
        const value = this.get()
        if(value!== this.value || typeof value == 'object'){
            const oldVal = this.value
            this.value = value
            cb.call(this.target, value, oldVal)
        }
    }
}


// 利用函数柯里化获取obj[str] 的值 , 
// 注意 str 是obj的属性.路径
function  parsePath(str){
    let segments = str.split('.')
    return (obj)=>{
        for(let i=0, l=segments.length; i<l; i++){
            if(!obj) return ;
            obj = obj[segments[i]]
        }
        return obj
    }
}