[TOC]





---



# 定义

> 1. 计算属性是基于它们的响应式依赖进行缓存的，只在相关响应式依赖发生改变时它们才会重新求值。这就意味着只要 `message` 还没有发生改变，多次访问 `reversedMessage` 计算属性会立即返回之前的计算结果，而不必再次执行函数。
>
> 2. Vue 在数据变化执行异步或开销较大的操作时，`watch`是最有用的。



# 用法

> 监听器和计算属性都可以使用函数方法或者对象形式定义

## 函数式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src='../dist/vue.js'></script>
</head>
<body>
    <div id="app">
        {{fullName}}
        <hr />
        <input  v-model='foo'/>
    </div>

    <script>
        const app = new Vue({
            el:'#app',
            data: {
                firstName:'D',
                lastName: 'cs',
                foo: 'foo'
            },
            methods:{
                bar(){
                    console.log('bar:' ,this.foo)
                }
            },
            watch:{
                foo(newVal, oldVal){
                    console.log(`foo change: ${oldVal} -> ${newVal} `)
                    this.bar()
                }
            },
            computed:{
                fullName: function(){
                    return this.firstName + this.lastName;
                }
            }
            
        })
    </script>
</body>
</html>
```

[为什么计算属性不能`f(){}`](###为什么计算属性不能简写函数)

## 对象式

> 偷懒了，使用官方的例子

```js
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: 'someMethod',
      immediate: true
    },
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1
```



```js
var vm = new Vue({
  data: { a: 1 },
  computed: {
    // 仅读取
    aDouble: function () {
      return this.a * 2
    },
    // 读取和设置
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
vm.aPlus   // => 2
vm.aPlus = 3
vm.a       // => 2
vm.aDouble // => 4
```







# 使用场景



* 监听器

> 1. 当一个值发生变化，需要其他处理的时候
> 2. 因为一个值发生变化，需要异步请求的时候
>
> 即，一个影响多个的时候



* 计算属性

> 值得注意是，计算属性可以完成的事情，方法都可以完成，但是计算属性得优势在于他会缓存起来，在其他地方直接复用

> 当一个值需要根据其他值得出的时候
>
> 即：多个影响一个值的时候。





# 源码解析

相对路径`https://github.com/csDeng/Vue_src_code/blob/master/vue/src/core/instance/state.js`

## initState

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  /**
   * state的初始化顺序
   * props -> methods -> data -> computed -> watch
   */
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)

//  Firefox has a "watch" function on Object.prototype...
// export const nativeWatch = ({}).watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```



## computed

```js
function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  // 遍历computed对象
  for (const key in computed) {
    // userDef 暂存每一个computed 属性
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
 
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher()
    }
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      } else if (vm.$options.methods && key in vm.$options.methods) {
        warn(`The computed property "${key}" is already defined as a method.`, vm)
      }
    }
  }
}

export function defineComputed (
  target: any,
  key: string,		// key必须是字符串
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()

  // 如果当前属性是函数式定义
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {

    // computed是对象式
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}
```

### 为什么计算属性不能简写函数

回头看一下[函数式定义](##函数式)

![image-20210914014921908](C:\Users\dcs\Desktop\Github\Vue_src_code\pics\image-20210914014921908.png)

* 控制台打印结果

![image-20210914015403600](C:\Users\dcs\Desktop\Github\Vue_src_code\pics\image-20210914015403600.png)

## watch

```js
// 定义监听器
function initWatch (vm: Component, watch: Object) {
  // 遍历watch 对象的key
  for (const key in watch) {
    const handler = watch[key]
    /***
     * 如果handler是一个数组,即官网API给的例子
    e: [
      'handle1',
        function handle2 (val, oldVal) {  },
        {
          handler: function handle3 (val, oldVal) { },
        }
    ],
     * 
     * **/
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher (
  vm: Component,
  expOrFn: string | Function,		// key可以是字符串或者函数
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```

```js
Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      const info = `callback for immediate watcher "${watcher.expression}"`
      pushTarget()
      invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
      popTarget()
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```

