<template>
  <div class="main">
    <center><h1>插槽</h1></center>
    <hr />
    <child>
      <!-- <div v-slot:myheader>标题</div> -->
      <!-- v-slot必须在tempalte标签中使用，不然会发生错误，如上行就是错误代码 -->

      <!-- 具名插槽 -->
      <template v-slot:myheader>
        <div id='world'>父组件插入头部</div>
      </template>

      <!-- slot='xx' 在Vue2.6起就被废弃了-->
      <!-- <div slot='myheader'>
        <div>我是slot='xx' 插入的</div>
      </div> -->
      <template>默认</template>
      <div>hello</div>

      <!-- 具名插槽的简写 -->
      <template #footer>
        <center id='hello'>{{footer}}</center>
      </template>
    </child>
  </div>
</template>

<script>
import child from './child.vue'
export default {
name:'slotParent',
components:{
  child
},
data(){
  return {
    footer:'我是父组件的脚注'
  }
}
}
</script>
<style scoped>
#world{
  color:aqua;
}
</style>
<style  >
#hello{
  color:red;
}
</style>