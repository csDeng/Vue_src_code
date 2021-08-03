<template>
  <div class="main">
    <header>
      <center>头部插槽</center>
      <slot name='myheader' />
      <hr />
    </header>
    
    <main>
      <center>默认插槽</center>
      <slot  />
      <hr />
    </main>

    <footer>
      <center>脚部插槽</center>
      <slot name='footer' />
    </footer>
  </div>
</template>

<script>
export default {
name:'slotChild'
}
</script>

<style>

</style>