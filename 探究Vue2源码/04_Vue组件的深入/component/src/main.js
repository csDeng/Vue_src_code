import Vue from 'vue'
import App from './App.vue'
import create from './utils/create.js'
import $create from './plugin/create'

Vue.use($create)
Vue.config.productionTip = false
Vue.prototype.$create = create
/**
 * Vue 的实现
1. $on
vm.$on( event, callback )
参数：
{string | Array<string>} event (数组只在 2.2.0+ 中支持)
{Function} callback
用法：

监听当前实例上的自定义事件。事件可以由 vm.$emit 触发。回调函数会接收所有传入事件触发函数的额外参数。

vm.$emit('test', 'hi')
// => "hi"
 * 
2. $emit
vm.$emit( eventName, […args] )
参数：

{string} eventName
[...args]
触发当前实例上的事件。附加参数都会传给监听器回调。

 */


// 事件总线 ： 事件派发，事件监听、回调管理
class Bus{
  constructor(){
    // 初始化回调队列
    this.callbacks = {}
  }
  $on(eventName,fn){
    // eventName: String || [String]
    this.callbacks[eventName] = this.callbacks[eventName] || [];
    this.callbacks[eventName].push(fn)
    console.log("$bus.$on添加",eventName)
  }

  $emit(eventName, args){
    // 如果触发的事件在回调队列里存在
    if( this.callbacks[eventName]){
      this.callbacks[eventName].forEach(cb=>{
        cb(args)
      })
    }else{
      // 不存在则给个错误提示
      console.error(`触发事件${eventName}不在回调队列`)
    }
  }

}
Vue.prototype.$bus = new Bus();

new Vue({
  render: h => h(App),
}).$mount('#app')
