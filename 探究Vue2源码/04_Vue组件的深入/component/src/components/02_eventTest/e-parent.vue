<template>
  <div class="main">
    <event-child @add='pNum++' :num='pNum' />
    <hr />
    <event-child @add='myAdd' :num='pNum1' />
    <hr />
    <p>带参数的子组件通信</p>
    <p>父组件input</p>
    <input v-model='name'/>
    <p>父组件里的name={{name}}</p>
    <event-child-params :name='getName' @change='rec'>{{name}}</event-child-params>
  </div>
</template>

<script>
/**
 * 父子组件数据同步的逻辑：
 * 1. 父组件给子组件传一个数据
 * 2. 子组件通过props接收，并监听props中具体的属性,此后如果父组件更新了，子组件就会监听到变化
 * 3. 如果子组件备份的数据发生变化，那就利用$emit触发父组件的v-on事件，更新父组件数据
 * 
 */

import EventChild from './e-child.vue';
import EventChildParams from './e-child-params.vue';
// 注意这里不能写成 e-child
export default {
components: { EventChild, EventChildParams },
name:'Eventparent',
data(){
  return {
    pNum:1,
    pNum1:11,
    name:'默认'
  }
},
mounted(){
  this.$on('change', function(params){
    console.log("父组件监听change, 接收到的参数",params)
  })
},
methods: {
  myAdd(){
    this.$data.pNum1++
  },
  rec(params){
    console.log("在父组件中@监听到更新", params)
    this.name = params
  }
},
computed:{
  getName(){
    console.log("getname触发",this.name)
    return this.name
  }
},
watch:{
  name(val){
    console.log("父组件name发生变化", val)
  }
}
}
</script>

<style>

</style>