<template>
  <div>
    <h2>组件通信</h2>
    <!-- props, 自定义事件 -->
    <Child1 msg="some msg from parent" @some-event="onSomeEvent"></Child1>

    <!-- $parent  $attrs  $listeners -->
    <Child2 msg="some msg from parent" @click="onClick"></Child2>
    <!-- $children -->
    <button @click="goHome">回家吃饭</button>
  </div>
</template>

<script>
  import Child1 from './Child1.vue'
  import Child2 from './Child2.vue'
  
  export default {
    provide() {
      return {
        foo: 'provide foo'
      }
    },
    components: {
      Child1, Child2
    },
    methods: {
      onSomeEvent(msg) {
        console.log('Communition:', msg);
      },
      goHome() {
        // $children
        this.$children[0].eat()
      },
      onClick() {
        console.log('来自老爹的回调函数处理', this);
        
      }
    },
    mounted(){
      console.log("this.$children = ", this.$children)
    }
  }
</script>

<style scoped>

</style>