<template>
  <div>
    <p @click="$store.commit('add')">counter:{{$store.state.counter}}</p>
    <p @click='$store.dispatch("add")'>asynchronous counter: {{$store.state.counter}}</p>
    <p>doubleCounter: {{$store.getters.doubleCounter}}</p>
  </div>
</template>

<script>
export default{
  name:'HelloWorld',
  mounted(){
    // this.$store.state = '1'     // 这个会报错
  }
}
</script>

<style>

</style>