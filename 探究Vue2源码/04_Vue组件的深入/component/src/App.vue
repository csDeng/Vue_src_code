<template>
  <div id="app">
    <!-- 1. 为什么data要返回一个对象函数 -->
    <!-- <func-parent /> -->
    <!-- 因为返回一个对象的data直接报错了，所以展示不了 -->
    <!-- <obj-parent />  -->

    <!-- 2. 组件的事件通信 -->
    <!-- 父子组件数据同步，父组件更新子组件监听，子组件更新，触发父组件更新 -->
    <!-- <eventparent /> -->

    <!-- 3. v-model的实现原理 -->
    <!-- <v-model /> -->

    <!-- 4. 插槽 -->
    <!-- <slot-parent /> -->

    <!-- 5. $bus -->
    <!-- <parent /> -->

    <!-- 6. 不常用的高级用法 $parent $children -->
    <!-- <com /> -->

    <my-form />

  </div>
</template>

<script>
// 打开注释查看不能组件的代码效果
// 1. 为什么data要是一个函数
// import FuncParent from './components/01_dataTest/FuncParent.vue'

// 2.父子组件通信
// import Eventparent from './components/02_eventTest/e-parent.vue'

// 3. v-model的实现原理
// import VModel from './components/03_vModel的实现原理'

// 4.v-slot的用法
// import slotParent from './components/04_slot插槽/parent.vue'

// 5. $bus的手动实现
// import Parent from './components/05_$bus/Parent.vue'

// 6. $parent $children $attr 
// import Com from './components/06_communication'


// 7. 封装一个form表单
import myForm from './components/07_form';
export default {
  name: 'App',
  components: {
    // FuncParent,
    // Eventparent
    // VModel
    // slotParent

    // Parent

    // Com

    myForm


  }
}
</script>

<style>

</style>
