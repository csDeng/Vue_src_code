[TOC]



# <center><font color='lightgreen'>talk is cheap , show me the code!</font></center>

# 1. `v-if`和`v-for`谁的优先级高？

* 测试代码

```html
<head>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js"></script>
</head>
<body>
    <div id="app">
        <h1>v-if 和 v-for 谁的优先级更高？</h1>

        <p v-for="item in children" :key='item' v-if="isFolder"> {{item.title}} </p>
    </div>
    <script>
        const app = new Vue({
            el:'#app',
            data(){
                return {
                    children: [
                        {title: 'foo'},
                        {title: 'bar'}
                    ]
                }
            },
            computed :{
                isFolder(){
                    return this.children && this.children.length > 0 
                }
            }
        })
        console.log(app.$options.render)

    </script>
</body>
```



* 打印结果

```js
(function anonymous() {
    with (this) {
        return _c('div', {
            attrs: {
                "id": "app"
            }
        }, [_c('h1', [_v("v-if 和 v-for 谁的优先级更高？")]), _v(" "), _l((children), function(item) {
            return (isFolder) ? _c('p', {
                key: item
            }, [_v(" " + _s(item.title) + " ")]) : _e()
        })], 2)
    }
}
)

```

> 可以看到`_l`里面嵌套着`(isFolder) ? _c : ...` 的三元判断，说明同级的时候， `v-for`的优先级大于`v-if`。

> 另外我们在vue的源码里面的`src\compiler\codegen\index.js`里面发现这么一段代码
>
> ```js
>   if (el.staticRoot && !el.staticProcessed) {
>     return genStatic(el, state)
>   } else if (el.once && !el.onceProcessed) {
>     return genOnce(el, state)
>   } else if (el.for && !el.forProcessed) {
>     return genFor(el, state)
>   } else if (el.if && !el.ifProcessed) {
>     return genIf(el, state)
>   } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
>     return genChildren(el, state) || 'void 0'
>   } else if (el.tag === 'slot') {
>     return genSlot(el, state)
>   } else {
>     // component or element
>   }
> ```
>
> 也可以说明`v-for`的优先级比`v-if`高。

## 怎么进行性能优化

```html
<head>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js"></script>
</head>
<body>
    <div id="app">
        <h1>v-if 和 v-for 谁的优先级更高？</h1>
        <!-- 性能优化的代码 -->
        <template v-if='isFolder'>
            <p v-for="item in children" :key='item'> {{item.title}} </p>
        </template>
    </div>
    <script>
        const app = new Vue({
            el:'#app',
            data(){
                return {
                    children: [
                        {title: 'foo'},
                        {title: 'bar'}
                    ]
                }
            },
            computed :{
                isFolder(){
                    return this.children && this.children.length > 0 
                }
            }
        })
        console.log(app.$options.render)

    </script>
```

* 打印结果

```js
(function anonymous() {
    with (this) {
        return _c('div', {
            attrs: {
                "id": "app"
            }
        }, [_c('h1', [_v("v-if 和 v-for 谁的优先级更高？")]), _v(" "), (isFolder) ? _l((children), function(item) {
            return _c('p', {
                key: item
            }, [_v(" " + _s(item.title) + " ")])
        }) : _e()], 2)
    }
}
)

```

> 可以通过打印`app.$options.render`的渲染结果,可以知道，当`v-if`的层级比`v-for`高的时候，会优先判断`v-if`如果不成立则直接渲染空的子节点,从而避免不必要的列表渲染达到性能优化的效果。



# 2. Vue的组件data为什么要是个函数而Vue的根实例没有这个限制？

* 测试代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>

<!-- 
Vue的组件的data必须是一个函数，而Vue的根实例不需要。

 -->
<body>
  <div id="app">
    <!--根实例的data是共享的-->
    <button @click="$data.a++">{{a}}</button>
    <hr />
    <button @click='$data.a++'>{{a}}</button>

    <!-- 组件的data是相互隔离的 -->
    <h1>函数data</h1>
    <func-add > </func-add>
    <func-add></func-add>
    <hr />
    <h1>对象data</h1>
    <obj-add > </obj-add>
    <obj-add></obj-add>
    <hr />
  </div>

  <script>
    Vue.component('func-add',{
      data(){
        return {
          num:1
        }
      },
      template:`<button @click='num++'>{{num}}</button>`
    })

    Vue.component('obj-add', {
      data:{
        num1: 1   // 会报错vue.js:634 [Vue warn]: The "data" option should be a function that returns a per-instance value in component definitions.
      },
      template:`<button @click='num1++'>n{{num1}}</button>`
    })
    const vm = new Vue({
      el:'#app',
      data: {
        a: 1
      },

    })
  </script>
</body>
</html>
```

> 打开这个文件，我们会发现返回obj的组件是没办法正常渲染的，并且会报错，而跟组件跟返回函数的组件则没有任何问题，但是返回obj的根实例，点击的时候是同时发生变化的，而函数组件是各自变化的。而且即时我们把根组件的data改成返回一个data点击的时候，依然会相互影响，因为是同一个根组件实例，共享data。这也说明了Vue是一个单例模式。

> 然后，我们也可以到源码中去寻找答案，在`src\core\instance\init.js`里面有这么一段代码
>
> ```js
>     if (options && options._isComponent) {
>       // optimize internal component instantiation
>       // since dynamic options merging is pretty slow, and none of the
>       // internal component options needs special treatment.
>       initInternalComponent(vm, options)
>     } else {
>       /**
>        * 合并options
>        */
>       vm.$options = mergeOptions(
>         resolveConstructorOptions(vm.constructor),
>         options || {},
>         vm
>       )
>     }
> ```
>
> 说明根实例跟组件合并option配置项的时候的处理方法是不一致的,两个处理方法的源码如下：
>
> ```js
> 
> export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
>   const opts = vm.$options = Object.create(vm.constructor.options)
>   // doing this because it's faster than dynamic enumeration.
>   const parentVnode = options._parentVnode
>   opts.parent = options.parent
>   opts._parentVnode = parentVnode
> 
>   const vnodeComponentOptions = parentVnode.componentOptions
>   opts.propsData = vnodeComponentOptions.propsData
>   opts._parentListeners = vnodeComponentOptions.listeners
>   opts._renderChildren = vnodeComponentOptions.children
>   opts._componentTag = vnodeComponentOptions.tag
> 
>   if (options.render) {
>     opts.render = options.render
>     opts.staticRenderFns = options.staticRenderFns
>   }
> }
> 
> export function resolveConstructorOptions (Ctor: Class<Component>) {
>   let options = Ctor.options
>   if (Ctor.super) {
>     const superOptions = resolveConstructorOptions(Ctor.super)
>     const cachedSuperOptions = Ctor.superOptions
>     if (superOptions !== cachedSuperOptions) {
>       // super option changed,
>       // need to resolve new options.
>       Ctor.superOptions = superOptions
>       // check if there are any late-modified/attached options (#4976)
>       const modifiedOptions = resolveModifiedOptions(Ctor)
>       // update base extend options
>       if (modifiedOptions) {
>         extend(Ctor.extendOptions, modifiedOptions)
>       }
>       options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
>       if (options.name) {
>         options.components[options.name] = Ctor
>       }
>     }
>   }
>   return options
> }
> ```
>
> @没看懂系列呜呜呜~~



# 3. key的原理和应用

## 不使用key的时候

* 测试代码

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

    <!-- key的作用和原理 -->
    <div id="app">
       <ul>
           <li v-for='a in arr'  >{{a}}</li>
       </ul>
    </div>

    <script>
        const app = new Vue({
            el:'#app',
            data(){
                return {
                    arr:['a','b','c','d','e']
                }
            },
            mounted(){
                setTimeout(()=>{
                    this.arr.splice(2,0,'f')
                }, 3000)
            }
        })
        console.log(app.$options.render)
    </script>
</body>
</html>
```

* 测试结果

![image-20210909225008756](C:\Users\dcs\Desktop\Github\Vue_src_code\pics\image-20210909225008756.png)

![image-20210909225346259](C:\Users\dcs\Desktop\Github\Vue_src_code\pics\image-20210909225346259.png)

> 所以他的循环是这样的
>
> ```js
> // 第一次循环patch a
> a b c d e
> a b c f d e
> 
> 
> // 第二次循环patch b
> b c d e 
> b c f d e
> 
> // 第三次循环patch c
> c d e
> c f d e
> 
> // 第四次循环patch a
> d e
> f d e
> 
> // 第五次循环patch a
> e
> d e
> 
> ```
>
> 


* 
* 测试代码

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
    <!-- key的作用和原理 -->
    <div id="app">
       <ul>
           <li v-for='a in arr' :key='a' >{{a}}</li>
       </ul>
    </div>

    <script>
        const app = new Vue({
            el:'#app',
            data(){
                return {
                    arr:['a','b','c','d','e']
                }
            },
            mounted(){
                setTimeout(()=>{
                    this.arr.splice(2,0,'f')
                }, 3000)
            }
        })
        console.log(app.$options.render)
    </script>
</body>
</html>
```

通过调试，发现diff的循环是一下这样的

```js
// 第一轮循环 patch a
a b c d 
a

// 第二轮循环 patch b
b c d e
b f c d e

// 第三轮循环 patch e
c d e
f c d e

// 第四轮循环 patch d
c d
f c d

// 第五轮循环  patch c
c
f c


// oldch 全部处理完毕，newch剩下f， 创建f并插入

```



> 1. key的作用主要是为了更高效地更新虚拟DOM, 其原理是在判断是否是同一个节点的时候，Vue源码中首先判断的就是新旧节点的key, 如果不设置key的话，那么undefined === undefined 为真，然后tag等的判断也一致，导致每一个遍历节点都被判断为同一个节点，使得diff算法形同虚设，进行顺序更新，增加了dom的操作，但是如果设置了key的话，就可以有效地避免这些问题。
> 2. 另外，若不设置key还可能在列表更新地时候引发一些隐藏bug
> 3. Vue使用在使用相同标签元素地过渡切换时，也会使用到key，其目的也是为了可以让Vue区分不同节点，否则，Vue只会替换其内部属性，而不会触发到过渡效果。



























# 大总结

## 1. v-if 与v-for谁的优先级高？

> 首先，我的答案是`v-for`的优先级是优于`v-if`的，因为在源码的`src\compiler\codegen\index.js`里面有一段`if,else if ,else`里面，`v-for`是在`v-if`的上面,根据js的单线程顺序执行，我们可以知道，js会优先执行对`v-for`进行编译，然后才是`v-if`;
>
> 其次我曾写过`v-if`和`v-for`在同一层级的测试代码，打印`Vue`实例的`$options.render`的渲染结果，发现`_l`里面嵌套着我们`v-if`的三元运算符。所以我的答案是`v-for`的优先级是比`v-if`大的。

## 2. v-if和v-for同时出现的时候怎么进行性能优化？

> 首先我认为这里有两种情况
>
> 1. v-if的判断条件不在v-for的循环列表里面的时候，我们可以将v-if的层级提高，然后v-for在v-if的子节点里面，避免不必要的列表渲染。
> 2. v-if的判断条件在v-for的循环列表里面，这时候我们可以利用一个计算属性来获取一个新的需要渲染的v-for循环列表，然后v-if的判断条件是新列表的是否存在以及列表的长度是否大于0，来确定是否需要进行列表渲染。
>
> 从而达到性能优化。这是我的优化方案，请问面试官有更好的优化方案吗？

## 3. Vue的组件data为什么要是个函数而Vue的根实例没有这个限制？

> 因为Vue组件是可复用的，如果使用对象形式定义data，则会导致他们公用一个data对象，那么状态的变化就会影响到所有的组件实例，很显然这是不合理的；而采用函数的形式定义，在源码中的initData时会将其作为工厂函数返回一个全新的data对象，避免多例之间的状态污染。而Vue是一个单例模式，每个Vue工程都是共用同一个Vue实例的data的，所以不需要考虑状态的隔离，也就是说，Vue根实例的data可以是一个函数也可以是一个对象。



## 4. key的原理和作用

> 1. key的作用主要是为了更高效地更新虚拟DOM, 其原理是在判断是否是同一个节点的时候，Vue源码中首先判断的就是新旧节点的key, 如果不设置key的话，那么undefined === undefined 为真，然后tag等的判断也一致，导致每一个遍历节点都被判断为同一个节点，使得diff算法形同虚设，进行顺序更新，增加了dom的操作，但是如果设置了key的话，就可以有效地避免这些问题。
> 2. 另外，若不设置key还可能在列表更新地时候引发一些隐藏bug
> 3. Vue使用在使用相同标签元素地过渡切换时，也会使用到key，其目的也是为了可以让Vue区分不同节点，否则，Vue只会替换其内部属性，而不会触发到过渡效果。