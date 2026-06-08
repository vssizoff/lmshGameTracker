<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getAllTeams, promptPassword, type TeamType, updateTeams} from "@/api.ts";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {DataTable, Column, InputText, ToggleSwitch, Button} from "primevue";

const teams = ref<Array<TeamType>>([]);
const accepted = ref(false);

onMounted(async () => {
  await promptPassword();
  accepted.value = true;
  teams.value = await getAllTeams();
});

function add() {
  let id = window.crypto.randomUUID();
  while (teams.value.map(({id}) => id).includes(id)) id = window.crypto.randomUUID();
  teams.value.push({
    id,
    name: "",
    active: true
  })
}
</script>

<template>
  <div v-if="accepted">
    <HeaderComponent/>
    <main>
      <div class="teams">
        <DataTable :value="teams" class="table">
          <Column field="name" header="name">
            <template #body="{data}">
              <InputText v-model="data.name"/>
            </template>
          </Column>
          <Column field="id" header="uuid"/>
          <Column field="active" header="active">
            <template #body="{data}">
              <ToggleSwitch v-model="data.active"/>
            </template>
          </Column>
        </DataTable>
        <div class="buttons">
          <Button @click="add" severity="secondary">Add</Button>
          <Button @click="updateTeams(teams)">Save</Button>
        </div>
      </div>
      <div class="settings">

      </div>
    </main>
  </div>
  <div v-else>Password in incorrect</div>
</template>

<style scoped>
main {
  display: flex;
}

.teams, .settings {
  flex-basis: 50%;
}

.teams {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
  margin-top: 20px;

  .table {
    width: 100%;
  }

  .buttons {
    display: flex;
    gap: 20px;
  }
}
</style>