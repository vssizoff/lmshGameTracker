<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getScore, type ScoreType} from "@/api.js";

const scores = ref<Array<ScoreType & {place: number}>>([])
const navShowed = ref(true);

onMounted(async () => {
  let place = 1;
  scores.value = (await getScore()).map((score, index, array) => {
    if (index !== 0 && array[index - 1]?.score !== score.score) place++;
    return {
      ...score,
      place
    };
  });
});
</script>

<template>
  <main>
    <div
        v-for="{name, score, place} in scores"
        class="scores"
        :class="{
          first: place === 1,
          second: place === 2,
          third: place === 3
        }"
    >
      <div>
        <span class="place">{{place}}</span>
        <span class="name">{{name}}</span>
      </div>
      <span class="score">{{score}}</span>
    </div>
    <nav v-if="navShowed">[ <RouterLink to="/catch">Вход для организатора</RouterLink> | <span @click="navShowed = false" class="hide">скрыть</span> ]</nav>
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

  .place {
    background: black;
    color: white;
    padding: 10px;
    border-radius: 10px;
    margin-right: 10px;
  }
}

.first {
  background: #00f637;
  color: black;
}

.second {
  background: #00bc2b;
  color: black;
}

.third {
  background: #008720;
  color: black;
}

.hide {
  color: cornflowerblue;
  cursor: pointer;
}
</style>

<style>
#app {
  display: flex;
  justify-content: center;
}
</style>