<template>
  <div class="main">
    <!-- $emit() 触发父组件的$on() -->
    <button @click= '$emit("add")' >子组件的num={{num}}</button>
  </div>
</template>

<script>
export default {
name:'EventChild',
props:{
  num:{
    type:Number,
    required:true
  }
}
}
</script>

