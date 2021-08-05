* 在form-item以及input中本次仅仅使用$parent以及$children 模式事件分发，但是如果组件跨级的话就会出现问题，解决方法有两种：

> 1. 利用$bus
> 2. 学习elementUI源码里面的混入的emitter(源码如下)，大致思路是跨级分发，通过ComponentName以及传入的name进行递归比较，且每次递归的时候都要绑定当前上下文

```js
function broadcast(componentName, eventName, params) {
// 遍历每个孩子，搜索name组件孩子
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

```