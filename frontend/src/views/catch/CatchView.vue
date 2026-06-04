<script setup lang="ts">
import {onMounted, ref} from "vue";
import {catch_, getCardsInUse, getScore, promptPassword, type ScoreType} from "@/api.js";
import {Button, InputNumber, Select} from "primevue";

const accepted = ref(false);
const teams = ref<Array<ScoreType>>([]);
const catchersTeam = ref<ScoreType>();
const team = ref<ScoreType>();
const pointsToCatcher = ref<number>();
const card = ref<number>();

const invalidCard = ref<boolean>(false);

onMounted(async () => {
  await promptPassword();
  accepted.value = true;
  teams.value = await getScore();
});

async function checkCard(value: number) {
  invalidCard.value = Boolean(value && (await getCardsInUse()).includes(value));
}
</script>

<template>
  <main v-if="accepted">
    <Select :options="teams" v-model="catchersTeam" optionLabel="name" placeholder="Отряд поймавшего"/>
    <Select :options="teams" v-model="team" optionLabel="name" placeholder="Отряд пойманного"/>
    <InputNumber v-model="pointsToCatcher" placeholder="Баллы"/>
    <InputNumber
        v-model="card"
        placeholder="Карточка"
        :invalid="invalidCard"
        @input="event => checkCard(Number(event.value))"
    />
    <span v-if="invalidCard">Карточка используется</span>
    <Button
        @click="catch_(catchersTeam?.id ?? '', team?.id ?? '', pointsToCatcher ?? 0, card ?? 0)"
        :disabled="invalidCard || !catchersTeam || !card || !pointsToCatcher || !card"
    >
      Отправить
    </Button>
  </main>
  <div v-else>Password in incorrect</div>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 600px;
  width: 100%;
}
</style>

<style>
#app {
  display: flex;
  justify-content: center;
}
</style>