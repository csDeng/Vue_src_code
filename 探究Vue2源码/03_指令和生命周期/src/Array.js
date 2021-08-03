import def from './utils';

// 得到Array.prototype

const arrayPrototype = Array.prototype

// 以Array.prototype 为原型创建一个arrayMethods对象
const arrayMethods = Object.create(arrayPrototype) 

const methodsNeedChange = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

methodsNeedChange.forEach(methodName =>{
    // 备份原来的方法
    // 因为push, pop 等7个函数的功能不能被剥夺
    const original = arrayPrototype[methodName]


    // 把类数组对象转换成数组
    const args = [...arguments]
    // 把数组身上的__ob__取出来， __ob__已经被添加了
    // 因为数组肯定不是最高层， 

    // 定义新的方法
    def(arrayMethods, methodName, function(){
        

        const ob = this.__ob__
        // 有三种方法，push\unshift\shift能够插入新项，现在把插入的新项也要变成observe的
        const result = original.apply(this,arguments)
        let inserted = []

        // console.log('arguments',arguments);

        switch(methodName){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                // splice（下标，数量， 插入的新项）
                inserted = args.slice(2);
                break;
        }

        // 判断有没有要插入的项，把新插入的项变成响应式
        if(inserted){
            ob.observeArray(inserted)
        }
        
        ob.dep.notify();
        // console.log('aaaa')
        return result
    },false)
})


export default arrayMethods; 
