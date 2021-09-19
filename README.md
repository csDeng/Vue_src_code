# Vue_src_code
手写Vue源码

# https://github.dev/csDeng/Vue_src_code

# 调试环境搭建

* 安装依赖  `yarn `

* 安装rollup  `npm install -g rollup`

* 修改dev脚本 ` "dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",`

* > #### [output.sourcemap]([rollup.js (rollupjs.org)](https://rollupjs.org/guide/en/#outputsourcemap))
  >
  > Type: `boolean | 'inline' | 'hidden'`
  > CLI: `-m`/`--sourcemap`/`--no-sourcemap`
  > Default: `false`
  >
  > If `true`, a separate sourcemap file will be created. If `"inline"`, the sourcemap will be appended to the resulting `output` file as a data URI. `"hidden"` works like `true` except that the corresponding sourcemap comments in the bundled files are suppressed.

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
>     if (process.env.NODE_ENV !== 'production' &&
>        !(this instanceof Vue)
>     ) {
>        warn('Vue is a constructor and should be called with the `new` keyword')
>     }
> 
>     /**
>    * 初始化
>    */
>   this._init(options)
> }
> /**
>  * 以下通过给Vue.prototype挂载的方法，混入其他方法
>  */
> initMixin(Vue)    // 通过该方法，给Vue提供__init方法
> stateMixin(Vue)   // $set $delete $watch
> eventsMixin(Vue)   // $on $once $emit $off
> lifecycleMixin(Vue) // _update(), $forceUpdate, $destroy 
> renderMixin(Vue)    // $nextTick, _render, $vnode
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

## 3. 初始化过程

1. `new Vue`, 调用`init`
2. 合并`options`
3. `$mount`
4. `mountComponent` (声明`updateCmponent`, 创建`Watcher`)
5. `render` (`虚拟dom`转成`真实dom`)
6. `update`



## 4. 数据响应式

* `\vue\src\core\instance\state.js`

> 入口文件

* `src\core\instance\state.js`

> `initData`获取`data`，设置代理， 启动响应式`observe`

* `src\core\observer\index.js`

> 响应式处理的中心
>
> ```js
> obj = {foo: 'foo'}
> obj.bar = 'aaa'			// 这个不会响应式
> Vue.$set(obj, 'bar', 'aaa')
> 
> ```

### `Vue2.x`的响应式的缺点

* 递归遍历，性能问题
* `api`不统一




## 5. 异步更新

* `src\platforms\web\runtime\modules\index.js`

> 定义了属性更新的实现



> `Watcher.run()`  =>` componentUpdate()` => `render()`  => `update()` => `patch()`



## 6. patch

`src\core\vdom\patch.js`700行

* `patchVnode`

> 比较两个`VNode`, 包括三种操作： 属性更新、文本更新、子节点更新
>
> 具体规则：
>
> 1. 新老节点均有子节点，则对子节点进行diff操作，调用updateChildren
> 2. 如果老节点没有子节点而新节点有子节点，先清空老节点的文本内容，然后为其新增子节点
> 3. 当新节点没有子节点而老节点有子节点的时候，则移除该节点的所有子节点
> 4. 当新老节点都无子节点的时候，只是文本替换

* `updateChildren`





## 7. 动画 

`src\platforms\web\runtime\transition-util.js`



## 8. 组件化

`src\core\global-api\assets.js`

## 9. 一些常用工具函数

1. def

`src\core\util\lang.js`

```js
/**
 * Define a property.
 * 定义属性
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```



2. hasOwn

`packages\vue-server-renderer\build.dev.js`

```js
/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}
```

> obj.hasOwnProperty('xx')    确定xx属性是否来自obj而不是来自它的原型

