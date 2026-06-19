<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {catch_, getCardsInUse, getScore, promptPassword, type ScoreType} from "@/api.js";
import {Button, InputNumber, Select, useToast} from "primevue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import ProgressIndicator from "@/components/ProgressIndicator.vue";

const accepted = ref(false);
const pending = ref(true);

const teams = ref<Array<ScoreType>>([]);
const catchersTeam = ref<ScoreType>();
const team = ref<ScoreType>();
const card = ref<number>();

const count1 = ref<number>();
const count2 = ref<number>();

const pointsToCatcher = computed(() => {
  return count2.value;
});

const invalidCard = ref<boolean>(false);

onMounted(async () => {
  await promptPassword();
  accepted.value = true;
  teams.value = (await getScore()).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  pending.value = false;
});

watch(card, async value => {
  invalidCard.value = Boolean(value && (await getCardsInUse()).includes(value));
});

const toast = useToast();

async function submit() {
  await catch_(catchersTeam.value?.id ?? '', team.value?.id ?? '', pointsToCatcher.value ?? 0, card.value ?? 0);
  catchersTeam.value = undefined;
  team.value = undefined;
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
      <div class="pointInputs">
        <InputNumber
            :modelValue="count1"
            @input="count1 = $event.value ? Number($event.value) : undefined"
            placeholder="Резинки поймавшего"
        />
        <InputNumber
            :modelValue="count2"
            @input="count2 = $event.value ? Number($event.value) : undefined"
            placeholder="Резинки пойманного"
        />
      </div>
      <span>Забрать у поймавшего: {{(count2 ?? 0) + 1}} | Итого: {{(count1 ?? 0) - (count2 ?? 0) - 1}}</span>
      <span>Отдать пойманому: {{Math.ceil((count2 ?? 0) / 2)}} | Итого: {{(count2 ?? 0) + Math.ceil((count2 ?? 0) / 2)}}</span>
      <span>Забрать организатору: {{(count2 ?? 0) + 1 - Math.ceil((count2 ?? 0) / 2)}}</span>
      <span>Баллы: {{pointsToCatcher}}</span>
      <InputNumber
          :modelValue="card"
          @input="card = $event.value ? Number($event.value) : undefined"
          placeholder="Карточка"
          :invalid="invalidCard"
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

.pointInputs {
  width: 100%;
  display: flex;
  gap: 10px;

  & > * {
    width: 100%;
  }
}
</style>