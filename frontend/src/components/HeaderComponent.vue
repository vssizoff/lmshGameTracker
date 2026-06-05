<script setup lang="ts">

</script>

<template>
  <header>
    <span>Перейти:</span>
    <RouterLink to="/catch">Поймать</RouterLink>
    <RouterLink to="/free">Освободить</RouterLink>
  </header>
</template>

<style scoped>
header {
  display: flex;
  gap: 10px;
}
</style>