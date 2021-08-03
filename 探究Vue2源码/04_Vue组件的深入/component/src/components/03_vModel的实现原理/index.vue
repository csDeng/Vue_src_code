<template>
  <div class="main">
    <h1>使用v-model</h1>
    <input v-model='name' />
    <h1>不使用v-model</h1>
    <input :value='name1' @input='change' />
  </div>
</template>

<script>
export default {
name:'VModel',
data(){
  return {
    name:'默认名字',
    name1:'默认名字'
  }
},
methods:{
  change(e){
    console.log('发生变化', e)
    if(e.inputType === 'insertText'){
      console.log('插入',e.data)
      this.name1 += e.data
    }else if(e.inputType === 'deleteContentBackward'){
      console.log('删除')
      let s = this.name1
      this.name1 = s.substring(0, s.length-1)
    }else{
      return 
    }
  }
},
// 监听属性的变化
watch:{
name(n, o){
  console.log(`v-model导致name从--${o}--变化为--${n}--`)
},
name1(n,o){
  console.log(`模拟v-model导致name从--${o}--变化为--${n}--`)
}
}
}
</script>
