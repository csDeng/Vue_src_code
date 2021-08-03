<template>
  <div>
      <p>$bus父组件</p>
      <p>{{ name }}</p>
      <hr />
    <child />
  </div>
</template>

<script>
import Child from './Child.vue'
export default {
name:'Parent',
components:{
    Child
},
data(){
    return {
        name:"默认"
    }
},
mounted(){
    const _this = this
    this.$bus.$on('changeName',function(args){
        console.log('$bus.$on触发，参数为',args)
        _this.name = args
    })
}
}
</script>

<style>

</style>