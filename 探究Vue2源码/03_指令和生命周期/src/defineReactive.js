import observe from './Observe';
import Dep from './Dep';

// 构造闭包环境
export default function defineReactive(data, key, val){
    // console.log("我是defineReactive",key)

    // 定义管理依赖成员
    const dep = new Dep()

    if( arguments.length === 2){
        // console.log("arguments=",arguments)
        val = data[key]
    }

    // 让子元素进行observe, 至此形成了递归， 
    // 这个递归不是函数自己调用自己，而是多个函数、类循环调用

    let childOb = observe(val)

    Object.defineProperty(data, key,{
        // 可枚举
        enumerator : true,
        
        // 可以被配置 ，比如说可以被delete
        configurable : true,
        
        // 数据劫持   getter
        get(){
            // console.log('获取'+ key + '属性')

            // 如果现在处于依赖的收集阶段
            // 即有watcher被劫持
            if(Dep.target){
                dep.depend()
                if(childOb){
                    childOb.dep.depend()
                }
            }
            return val
        },

        // setter
        set(newVal){
            // console.log(`尝试设置${key}属性 = `,newVal)
            if(val === newVal){
                return 
            }
            val = newVal

                // 当设置了新值的时候，这个新值也要被observe
            childOb = observe(childOb)

            // 发布订阅模式
            // 依赖管理员通知观察者，观察数据是否发生变化， 如果变化了，则保存新数据
            dep.notify()
        }
})

}



