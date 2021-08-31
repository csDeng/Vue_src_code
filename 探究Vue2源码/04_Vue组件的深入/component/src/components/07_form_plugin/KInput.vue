<template>
  <div>
    <!-- 自定义组件双向绑定：:value  @input -->
    <!-- v-bind="$attrs"展开$attrs -->
    <input :type="type" :value="value" @input="onInput" v-bind="$attrs">
  </div>
</template>

<script>
  export default {
    inheritAttrs: false, // 设置为false避免设置到根元素上
    props: {
      value: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      }
    },
    mounted(){
      console.log('input里面拿到的$attrs', this.$attrs )
    },
    methods: {
      onInput(e) {
        // 派发一个input事件即可
        // console.log('onInput',e)
        this.$emit('input', e.target.value)

        // 通知父级执行校验
        this.$parent.$emit('validate')
      }
    },
  }
</script>

<style scoped>

</style>