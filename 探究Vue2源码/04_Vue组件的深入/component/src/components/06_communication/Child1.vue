<template>
  <div @click="$emit('some-event', 'msg from child1')">
    <h3>child1</h3>
    <p>{{msg}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      msg: {
        type: String,
        default: ''
      },
    },
    mounted () {
      this.$parent.$on('event-from-child2', msg => {
        console.log('Child1:', msg);
      });
    },
    methods: {
      eat() {
        console.log('这就回家！');
        
      }
    },
  }
</script>

<style scoped>

</style>