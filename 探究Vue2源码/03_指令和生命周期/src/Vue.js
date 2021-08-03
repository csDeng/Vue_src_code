import Compile from './Compile';
import observe from './Observe';
import Watcher from './Watcher';


export default class Vue{
    constructor(options){
        console.log('我是Vue构造器')
        // 把参数options对象存为$options
        this.$options = options || {}

        // 数据
        this.__data = options.data || undefined

        // 让数据变成响应式
        observe(this.__data)

        this.__initData()
        this.__initWatch()

        // 数据要变成响应式的
        // 模板编译
        new Compile(options.el, this) 

        // 生命周期
        options.created()
    }

    __initData(){
        var self = this;

        Object.keys(this.__data).forEach(key=>{
            Object.defineProperty(self,key,{
                get:()=>{
                    return self.__data[key]  
                },

                set:(newVal)=>{
                    self.__data[key] = newVal
                }
            })
        })
    }

    __initWatch(){
        var self = this;
        var watch = this.$options.watch;

        Object.keys(watch).forEach(key=>{
            new Watcher(self,key, watch[key])
        })
    }
}