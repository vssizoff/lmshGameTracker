<script setup lang="ts">
import {onMounted, ref} from "vue";
import {promptPassword} from "@/api.ts";
import HeaderComponent from "@/components/HeaderComponent.vue";

const accepted = ref(false);

onMounted(async () => {
  await promptPassword();
  accepted.value = true;
});
</script>

<template>
  <div v-if="accepted">
    <HeaderComponent/>
  </div>
  <div v-else>Password in incorrect</div>
</template>

<style scoped>

</style>