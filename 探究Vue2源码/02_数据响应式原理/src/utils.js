export default function def(obj, key, value, enumerable){
    // console.log('开始定义属性',key)
    Object.defineProperty(obj,key, {
        value,
        enumerable,
        writable:true,
        configurable:true
    })
}