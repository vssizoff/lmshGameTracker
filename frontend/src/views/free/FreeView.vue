<script setup lang="ts">
import {onMounted, ref} from "vue";
import {free, getCardsInUse, promptPassword} from "@/api.ts";
import {Button, useToast} from "primevue";
import HeaderComponent from "@/components/HeaderComponent.vue";

const accepted = ref(false);

const cards = ref<Array<number>>([]);

async function updateCards() {
  cards.value = await getCardsInUse();
  setTimeout(updateCards, 1000);
}

onMounted(async () => {
  await promptPassword();
  accepted.value = true;
  await updateCards();
});

const toast = useToast();

async function submit(card: number) {
  await free(card);
  toast.add({summary: "Done", severity: "success"});
}
</script>

<template>
  <div v-if="accepted">
    <HeaderComponent/>
    <main>
      <Button v-for="card in cards" @click="submit(card)">{{card}}</Button>
    </main>
  </div>
  <div v-else>Password in incorrect</div>
</template>

<style scoped>
main {
  margin-top: 10px;
  max-width: 600px;
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>

<style>
#app {
  display: flex;
  justify-content: center;
}
</style>