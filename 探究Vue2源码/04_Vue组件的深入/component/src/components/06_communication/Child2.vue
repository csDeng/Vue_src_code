<template>
  <div>
    <!-- $listeners会被展开并监听 -->
    <h3 v-on="$listeners">child2</h3>
    <button @click="sendToChild1">给child1发送消息</button>
    <!-- $attrs -->
    <p>$attrs收到的msg == {{$attrs.msg}}</p>
    <!-- provide/inject -->
    <p>inject收到的foo == {{foo}}</p>
  </div>
</template>

<script>
  export default {
    inject: ['foo'],
    methods: {
      sendToChild1() {
        this.$parent.$emit('event-from-child2', 'some msg from child2')
      }
    },
    mounted(){
      console.log("this.$attrs = ", this.$attrs)
      console.log("this.$parent", this.$parent)
    }
  }
</script>

<style scoped>

</style>