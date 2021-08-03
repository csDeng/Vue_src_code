<template>
  <div>
      <input placeholder='请输入新的名字' v-model='childname' />
      <p>子组件里面的name={{childname}}</p>
      <button @click='change'>触发父组件更新</button>
  </div>
</template>

<script>
export default {
name:'EventChildParams',
props:{
    name: {
        type : String,
        required: true,
    }
},
data(){
    return {
        childname:null,
    }
},
mounted(){
    this.childname = this.name
},
watch:{
    name:{
        deep:true,
        handler(newVal, oldVal){
            console.log("子组件监听到props更新",newVal, oldVal)
            this.childname = newVal
        }
    }
},
methods:{
    change(){
        console.log('子组件开始回传name=',this.childname)
        this.$emit('change',this.childname)
        console.log("子组件回传完毕")
    }
}
}
</script>

<style>

</style>