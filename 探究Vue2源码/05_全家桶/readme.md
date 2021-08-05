[TOC]



# vue-router

## 思考

1. 为什么router要放到`new Vue `的配置项里面？

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'


Vue.config.productionTip = false

new Vue({
  router,				// 为什么router要挂载到这里
  render: h => h(App),
}).$mount('#app')

```

> 如果是为了让所有组件都能访问，那他跟`Vue.prototype.$router = router`有什么区别？

2. 为什么`router-view`和`router-link`可以直接用？

> 因为全局挂载了

## 任务（模拟hashRouter）

1. 作为一个插件的存在，实现一个`Vuerouter`类和`install`方法
2. 实现两个全局组件 `router-view`和`router-link`
3. 监控`url`变化
4. 响应`url`
5. 数据响应式

> 用到了`Vue.util.defineReactive()`



