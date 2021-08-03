var uid = 0;

export default class Dep{
    constructor(){
        // console.log('我是Dep的构造器');
        this.id = uid ++;

        // 用数组来存储自己的订阅者 subscribes
        this.subs = [];
    }

    // 添加订阅
    addSub(sub){
        this.subs.push(sub)
       // console.log(this.subs)
    }

    // 移除订阅
    rmSub(){
        // do nothing
    }

    // 添加依赖即是Watcher
    depend(){
        // Dep.target 是我们自己指定的一个全局位置
        if(Dep.target){
            this.addSub(Dep.target)
        }
    }


    // 通知Watcher更新数据
    notify(){
        // console.log("我是notitfy");

        // 浅克隆一份
        const subs = this.subs.slice()

        // 遍历所有对象，看看是否需要更新数据
        for(let i=0 ,l=subs.length; i<l; i++ ){
            subs[i].update();
        }
    }
}