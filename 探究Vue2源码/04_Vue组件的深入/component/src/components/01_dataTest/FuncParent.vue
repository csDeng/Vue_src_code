<template>
  <div class="main">
    <h1>返回函数的组件</h1>
    <func-child />
    <func-child />
    <func-child />
  </div>
</template>

<script>
/**
 * 因为data返回的是一个函数的时候，他们会拥有单独的一个实例对象，
 * 每个实例对象的data互不干扰
 * 
 */
import FuncChild from './FuncChild.vue'
export default {
name:'FuncParent',
components:{
  FuncChild
}
}
</script>

<style>

</style>