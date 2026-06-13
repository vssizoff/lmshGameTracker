<script setup lang="ts">
import {onMounted, ref} from "vue";
import {catch_, getCardsInUse, getScore, promptPassword, type ScoreType} from "@/api.js";
import {Button, InputNumber, Select, useToast} from "primevue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import ProgressIndicator from "@/components/ProgressIndicator.vue";

const accepted = ref(false);
const pending = ref(true);

const teams = ref<Array<ScoreType>>([]);
const catchersTeam = ref<ScoreType>();
const team = ref<ScoreType>();
const pointsToCatcher = ref<number>();
const card = ref<number>();

const invalidCard = ref<boolean>(false);

onMounted(async () => {
  await promptPassword();
  accepted.value = true;
  teams.value = (await getScore()).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  pending.value = false;
});

async function checkCard(value: number) {
  invalidCard.value = Boolean(value && (await getCardsInUse()).includes(value));
}

const toast = useToast();

async function submit() {
  await catch_(catchersTeam.value?.id ?? '', team.value?.id ?? '', pointsToCatcher.value ?? 0, card.value ?? 0);
  catchersTeam.value = undefined;
  team.value = undefined;
  pointsToCatcher.value = undefined;
  card.value = undefined;
  toast.add({summary: "Done", severity: "success"});
}
</script>

<template>
  <div class="wrapper">
    <ProgressIndicator v-if="pending"/>
    <main v-else-if="accepted">
      <HeaderComponent/>
      <Select :options="teams" v-model="catchersTeam" optionLabel="name" placeholder="Отряд поймавшего" filter/>
      <Select :options="teams" v-model="team" optionLabel="name" placeholder="Отряд пойманного" filter/>
      <InputNumber v-model="pointsToCatcher" placeholder="Баллы"/>
      <InputNumber
          v-model="card"
          placeholder="Карточка"
          :invalid="invalidCard"
          @input="event => checkCard(Number(event.value))"
      />
      <span v-if="invalidCard">Карточка используется</span>
      <Button
          @click="submit"
          :disabled="invalidCard || !catchersTeam || !card || !pointsToCatcher || !card"
      >
        Отправить
      </Button>
    </main>
    <div v-else>Password in incorrect</div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 600px;
  width: 100%;
}
</style>