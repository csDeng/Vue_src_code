<template>
  <div>
      $bus子组件
      <hr />
      <input placeholder="输入内容按button更新" v-model='cName' />
      <button @click='go'>bus派发</button>
  </div>
</template>

<script>
export default {
name:'Child',
data(){
    return{
        cName:''
    }
    
},
methods:{
    go(){
        this.$bus.$emit('changeName',this.cName)
        console.log('$bus.$emit触发',this.cName)
    }
}
}
</script>

<style>

</style>