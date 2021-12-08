

# 1. 入口

1. `src\core\instance\index.js`里面的`renderMixin(Vue)` 

2. `src\core\instance\render.js` 里面的

```js
export function renderMixin (Vue: Class<Component>) {
  installRenderHelpers(Vue.prototype)
  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }
    ...
}

```

3. `src\core\util\next-tick.js`

   ```js
   export function nextTick (cb?: Function, ctx?: Object) {
     let _resolve
     callbacks.push(() => {
       if (cb) {
         try {
           cb.call(ctx)
         } catch (e) {
           handleError(e, ctx, 'nextTick')
         }
       } else if (_resolve) {
         _resolve(ctx)
       }
     })
     if (!pending) {
       pending = true
   
       /**
        * 异步函数
        */
       timerFunc()
     }
     // $flow-disable-line
     if (!cb && typeof Promise !== 'undefined') {
       return new Promise(resolve => {
         _resolve = resolve
       })
     }
   }
   
   ```

# 2. `nextTick`执行过程

1. 确定使用微任务还是宏任务，并确定`timerfunc`

```js
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    /**
     * 启动微任务
     */
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

2. 当`nextTick`被调用且回调函数处于非`pending`时，调用`TimerFuc`

```js

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true

    /**
     * 异步函数
     */
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

3. func是一个微任务或者宏任务的函数，里面放着`flushCallbacks`清空当前回调队列的任务

```js
function flushCallbacks () {
  pending = false

  // arrayObject.slice(start,end) 返回选定元素
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```



注意：`flushCallbacks`里面的`copies`是调用2的`nextTick`push进去的，也就是我们定义的回调函数

```js
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
```

回顾一下我们使用Vue的时候怎么使用nextTick就清楚了

```js
this.$nextTick(()=>{
	console.log('hahha')
})
```

```js
()=>{
	console.log('hahha')
}

// 这个函数就是我们的copies啦
```



贴个官方的图吧

![image-20211208233552905](.\pics\image-20211208233552905.png)



* 到这里`nextTick`的原理就很清楚啦。