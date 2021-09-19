import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }

  /**
   * 初始化
   */
  this._init(options)
}
/**
 * 以下通过给Vue.prototype挂载的方法，混入其他方法
 */
initMixin(Vue)    
/** 
 * initMixin
通过该方法，给Vue提供__init方法， 初始化生命周期
initLifecycle   -> initEvents  -> initRender
-> callHook(vm, 'beforeCreate') -> initInJections
-> initState  -> initProvide  
-> callHook(vm, 'created')
-> if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
*/

stateMixin(Vue)  
/**
stateMixin
$data   -> $props   -> $set   -> $delete    -> $watch
 */


eventsMixin(Vue)   
/** eventsMixin
$on  $once  $off  $emit

 */

lifecycleMixin(Vue) 
/** lifecycleMixin
 * _update(), $forceUpdate, $destroy 
 * 
 */

renderMixin(Vue)
/**
 * $nextTick, _render, $vnode
 *  
 * */     

export default Vue
