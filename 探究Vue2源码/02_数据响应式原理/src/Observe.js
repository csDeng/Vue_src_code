import Observer from './Observer'

export default function Observe(value){

    // 创建observe 函数
    // 要求观测的对象必须是Object

    if(typeof value != 'object'){
        // do nothing
        return ;
    }

    // 定义ob
    var ob = null 
    if(typeof value.__ob !== 'undefined'){
        ob = value.__ob
    }else{
        ob = new Observer(value)
    }
    return ob;
}
