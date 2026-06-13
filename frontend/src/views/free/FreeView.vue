<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {free, getCardsInUse, promptPassword} from "@/api.ts";
import {Button, useToast} from "primevue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import ProgressIndicator from "@/components/ProgressIndicator.vue";

const accepted = ref(false);
const pending = ref(true);

const cards = ref<Array<number>>([]);
const timeout = ref<NodeJS.Timeout>();

async function updateCards() {
  cards.value = await getCardsInUse();
  timeout.value = setTimeout(updateCards, 1000);
}

onMounted(async () => {
  await promptPassword();
  accepted.value = true;
  await updateCards();
  pending.value = false;
});

onUnmounted(() => {
  clearTimeout(timeout.value);
});

const toast = useToast();

async function submit(card: number) {
  await free(card);
  toast.add({summary: "Done", severity: "success"});
}
</script>

<template>
  <div class="wrapper">
  <ProgressIndicator v-if="pending"/>
    <div v-else-if="accepted">
      <HeaderComponent/>
      <main>
        <Button v-for="card in cards" @click="submit(card)">{{card}}</Button>
      </main>
    </div>
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
  margin-top: 10px;
  max-width: 600px;
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>