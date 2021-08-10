import Vue from 'vue'
import App from './App.vue'
import store from './kstore'
Vue.config.productionTip = false

new Vue({
  store,      // 注入store
  render: h => h(App),
}).$mount('#app')
