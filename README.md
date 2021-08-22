# Vue_src_code
手写Vue源码





# Vue源码中的相关术语

> * `runtime`   : 仅包含运行时，不包含编译器
> * `common` : cjs规范， 用于webpack1
> * `esm` :  ES模块 ，用于webpack2+
> * `umd` : iniversal module definition ，兼容cjs和amd,用于浏览器

# 源码阅读的相关技巧

## 寻找入口文件

* `package.json`里面的`scripts`
* `?:`在`Flow`表示该参数可选
* 浏览器里`ctrl+p` 搜索源代码打断点











# 源码阅读

## 1. 入口文件

* `\vue\src\platforms\web\entry-runtime-with-compiler.js`

> 入口文件，覆盖`$mount`, 执行模板解析和编译工作

```js
// 保存原来的$mount
const mount = Vue.prototype.$mount

// 覆盖默认的$mount(扩展)
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)


  // 解析options
  const options = this.$options
  /**
   * 最后执行mount
   */
  return mount.call(this, el, hydrating)
}

```



## 2. new Vue 

* `\vue\src\platforms\web\runtime\index.js`	

> 定义`$mount`函数

* `\vue\src\core\index.js`

> 定义全局`API`

* `\vue\src\core\instance\index.js`

> `Vue `的构造函数
>
> ```js
> import { initMixin } from './init'
> import { stateMixin } from './state'
> import { renderMixin } from './render'
> import { eventsMixin } from './events'
> import { lifecycleMixin } from './lifecycle'
> import { warn } from '../util/index'
> 
> function Vue (options) {
>   if (process.env.NODE_ENV !== 'production' &&
>     !(this instanceof Vue)
>   ) {
>     warn('Vue is a constructor and should be called with the `new` keyword')
>   }
> 
>   /**
>    * 初始化
>    */
>   this._init(options)
> }
> /**
>  * 以下通过给Vue.prototype挂载的方法，混入其他方法
>  */
> initMixin(Vue)    // 通过该方法，给Vue提供__init方法
> stateMixin(Vue)
> eventsMixin(Vue)
> lifecycleMixin(Vue)
> renderMixin(Vue)
> 
> export default Vue
> 
> ```
>
> 

* `\vue\src\core\instance\init.js`

> 初始化方法定义的地方
>
> ```js
>     initLifecycle(vm)
>     initEvents(vm)
>     initRender(vm)
>     callHook(vm, 'beforeCreate')
>     initInjections(vm) // resolve injections before data/props
>     initState(vm)
>     initProvide(vm) // resolve provide after data/props
>     callHook(vm, 'created')
> ```
>
> 

# 初始化过程

1. `new Vue`, 调用`init`
2. 合并`options`
3. `$mount`
4. `mountComponent` (声明`updateCmponent`, 创建`Watcher`)
5. `render` (`虚拟dom`转成`真实dom`)
6. `update`

