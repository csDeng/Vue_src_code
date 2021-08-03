import def from './utils';
import defineReactive from './defineReactive';
import arrayMethods from './Array';
import observe from './Observe';
import Dep from './Dep';


export default class Observer{
    // 将一个正常的对象转换成可观测对象
    // 创建类的时候要思考如何实例化
    constructor(value){
        
        // 每个Observer的实例成员都有Dep的实例对象
        this.dep = new Dep();

        // __ob__ 一般为不可枚举
        // 这里的this指向的是实例对象而不是类
        def(value,'__ob__', this, false);
        
        // console.log("我是Observer构造器",value)
        if(Array.isArray(value)){
            // 如果是数组则更改原型链
            Object.setPrototypeOf(value,arrayMethods)

            // 让这个数组变得observe
            this.observeArray(value)

        }else{
            this.walk(value)
        }

        
       // console.log('构造器结束') 
    }

    // 遍历
    walk(value){
        for(let k in value){
            defineReactive(value, k)
        }
    }

    // 数组的特殊遍历
    observeArray(arr){
        for(let i=0; i<arr.length; ++i){
            // 逐项观察observe
               
            observe(arr[i])
        }
    }

}