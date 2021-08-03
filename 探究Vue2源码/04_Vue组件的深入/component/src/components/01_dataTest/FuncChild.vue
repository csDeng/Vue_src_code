<template>
  <div class='main'>
    <button @click='$data.num++'>
      {{num}}
    </button>

  </div>
</template>

<script>
export default {
name:'FuncChild',
data(){
  return {
    num:1
  }
  
}
}
</script>

<style>

</style>