<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getScore, type ScoreType} from "@/api.js";

const scores = ref<Array<ScoreType>>([])

onMounted(async () => {
  scores.value = await getScore();
});
</script>

<template>
  <main>
    <div v-for="{name, score} in scores" class="scores">
      <span class="name">{{name}}</span>
      <span class="score">{{score}}</span>
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scores {
  display: flex;
  justify-content: space-between;
  font-size: 32px;
  background: #131317;
  padding: 15px;
  border-radius: 20px;

  &:first-child {
    background: #00f637;
    color: black;
  }

  &:nth-child(2) {
    background: #00bc2b;
    color: black;
  }

  &:nth-child(3) {
    background: #008720;
    color: black;
  }
}
</style>

<style>
#app {
  display: flex;
  justify-content: center;
}
</style>