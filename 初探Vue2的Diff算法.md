[TOC]



---

# 学习目标

> 通过看[Vue2.x]([Vue_src_code/vue at master · csDeng/Vue_src_code (github.com)](https://github.com/csDeng/Vue_src_code/tree/master/vue))的源码, 学习`Vnode`以及`diff`算法，达到解决面试难题

# 学习过程

## 环境准备

* 修改`scripts`命令

```js
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",
```

* `yarn dev`进行打包（注意安装`rollup`）

## 查看Vnode长什么样

* 1. 在`src\core\vdom\vnode.js`中的`VNode`类的`constructor`里面打印`this`，观察什么是`Vnode`,删减代码如下：

```js
export default class VNode {
  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    console.log('Vnode class', this)
  }

```

* 2. 重新打包

* 3. 编写测试`html`

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
      <div id = 'demo'>
          <h1>虚拟dom</h1>
          <p id='p1'>{{foo}}</p>
      </div>
  
      <script>
          const app = new Vue({
              el:'#demo',
              data:{
                  foo:'foo'
              },
              mounted(){
                  setTimeout(()=>{
                      this.foo = 'foooooooo'
                  },3000)
              }
          })
      </script>
  </body>
  </html>
  ```

* 4. 浏览器中打开，查看结果

  ![image-20210829005429034](.\pics\image-20210829005429034.png)

* 5. 打开其中一个节点看看具体结构

  ![image-20210829005829978](.\pics\image-20210829005829978.png)

* 6. 可以看到其实`Vnode`就是把我们的`html`标签转化成一个`js`对象.
  7. `Vdom`就是一个又一个`Vnode`构成的

## 测试Vue的批量异步更新的

* 环境准备

> 注释掉前面在`vnode`里加的注释，重新打包，避免不必要的干扰

* 测试`html`

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
    <div id = 'demo'>
        <h1>异步更新</h1>
        <p id='p1'>{{foo}}</p>
    </div>

    <script>
        const app = new Vue({
            el:'#demo',
            data:{
                foo:'ready'
            },
            mounted(){
                /* 说明批量异步更新的代码*/
                setInterval(()=>{
                    this.foo = Math.random()
                    console.log('1', this.foo)
                    this.foo = Math.random()
                    console.log('2',this.foo)
                    this.foo = Math.random()
                    console.log('3', this.foo)

                    // 异步行为,此时内容没变
                    console.log(p1.innerHTML)
                    this.$nextTick(()=>{
                         console.log('$nextTick', p1.innerHTML)
                    })
                },3000)
            }
        })
    </script>
</body>
</html>
```

* 浏览器打开观察结果

![image-20210829010910990](.\pics\image-20210829010910990.png)



## Diff算法

* 源码位置`src\core\vdom\patch.js`

* 进行`diff`的入口源码

```js
function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      // 新老节点一样
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    const elm = vnode.elm = oldVnode.elm

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }

    /**
     * 执行一些组件的钩子
     */
    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }

    // 看看新旧节点是否有孩子队列
    const oldCh = oldVnode.children
    const ch = vnode.children

    // 属性更新
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }

    // 判断是否是元素， 没有文本则是Element
    if (isUndef(vnode.text)) {

      // 都有孩子
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        // 只有新节点有孩子
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        // 清空老节点文本
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')

        // 添加孩子
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 只有老节点有孩子
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        // 老节点有文本
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // 新旧都是文本，且不相同
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }

```

> 总结一下
>
> 比较两个`VNode`, 包括三种操作： 属性更新、文本更新、子节点更新
>
> 具体规则：
>
> 1. 新老节点均有子节点，则对子节点进行diff操作，调用updateChildren
> 2. 如果老节点没有子节点而新节点有子节点，先清空老节点的文本内容，然后为其新增子节点
> 3. 当新节点没有子节点而老节点有子节点的时候，则移除该节点的所有子节点
> 4. 当新老节点都无子节点的时候，只是文本替换

* `updateChildren`， 进行diff的具体细节，源码如下：

```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0

    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]

    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    /**
     * 两边向中间靠拢，dfs
     */
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        // 老的开始节点移动到了队尾
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left

      } else if (isUndef(oldEndVnode)) {
        // 老的尾节点移动到了队头
        oldEndVnode = oldCh[--oldEndIdx]

      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 新旧的开始节点相同，同时+1
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]

      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 新旧的结束节点相同， 同时-1
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]

      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 老的尾节点与新的头节点相同，把老的头节点移动到老的尾巴去，提高相同度
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]

      } else if (sameVnode(oldEndVnode, newStartVnode)) { 
        // 老的尾节点与新的头节点相同
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]

      } else {
        // 4种猜想都没有找到相同的，才被迫进行循环查找

        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        
        // 查找在老的数组中的索引key
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)

        // 老的子节点数组中没有这个元素，则新建
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {

          // 如果找到元素可以复用，则进一步比较
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // 是完全一样的元素
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // 只有key相同，但是内容不相同
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }

    // 最后收尾，进行整理工作
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm

      // 批量创建
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {

      // 批量删除
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }

```

* `addVnodes`批量增加节点的操作

```js
  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      // 批量创建
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx)
    }
  }
```

* `removeVnodes`批量删除旧的废弃节点

```js
  function removeVnodes (vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch)
          invokeDestroyHook(ch)
        } else { // Text node
          removeNode(ch.elm)
        }
      }
    }
  }

```

* 比较两个节点是否完全一致的源码

```js
function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

```

# 学习总结(从一道面试题进行总结)

## 你怎么看Vue中的Diff算法

1. 必要性 ， `lifecycle.js`里面的 `mountComponent`

> 组件内存在很多个`data`中的`key`使用

2. 执行方式 `patch.js`   里面的 `patchVnode`

diff具体实现细节在`patch.js`里面的`updateChildren()`，执行的是两头比较

> 新旧的头头，尾尾， 旧头新尾， 新头旧尾，递归搜索是否是相同的虚拟节点，没有搜索到则遍历比较，从而实现两头向中间靠，最后批量更新和删除`vnode`，从而达到性能的优化。

3. 整体策略

> 深度优先，同层比较



---

![img](.\pics\www.webdevelopment247.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg)

## 答案

1. `diff`算法主要是通过新旧的虚拟`dom`的比对，将变化的地方更新在真实的`dom`上
2. `vue2`中为了降低`Watcher`粒度，每个组件只有一个`Watcher`与之对应，引入`diff`可以精确找到发生变化的地方
3. `Vue2`中的`diff`执行的时刻是组件实例执行其更新函数时，他会比对上一次渲染的结果`oldVnode`与新的渲染结果`newVnode`，此过程被尤大称为`patch`
4. `diff`的实现细节遵循`深度优先，同层比较`的策略，两个新旧节点根据自己是否有文本或者children分别进行头头，尾尾，旧头新尾，新头旧尾, 四个猜想进行比对，尝试找到相同的节点，然后递归搜索，实现两头向中间靠拢，最后批量更新中间不一致的部分，此时他还会搜索oldVnode的队列里面是否有可以重用的节点。如果没有找到相同的节点，则进行常规的遍历操作。
5. 最后diff进行比对的时候，还使用到了`key`, key不一致则判断不一致，从而加快比对效率。
6. 不知道我说的有没有不合理的地方，请你指点。（友情客串）







