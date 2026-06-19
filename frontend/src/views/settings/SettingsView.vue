<script setup lang="ts">
import {onMounted, ref} from "vue";
import {
  type ConfigType,
  freeAll,
  getAllTeams,
  getConfig, password,
  promptPassword,
  type TeamType,
  updateConfig,
  updateTeams
} from "@/api.ts";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {
  DataTable,
  Column,
  InputText,
  ToggleSwitch,
  Button,
  InputNumber,
  ConfirmDialog,
  useConfirm,
  useToast
} from "primevue";
import ProgressIndicator from "@/components/ProgressIndicator.vue";

const accepted = ref(false);
const pending = ref(true);

const teams = ref<Array<TeamType>>([]);
const config = ref<ConfigType>({password: "", freeTime: 0});

onMounted(async () => {
  await promptPassword();
  accepted.value = true;
  teams.value = await getAllTeams();
  config.value = await getConfig();
  pending.value = false;
});

function add() {
  let id = window.crypto.randomUUID();
  while (teams.value.map(({id}) => id).includes(id)) id = window.crypto.randomUUID();
  teams.value.push({
    id,
    name: "",
    active: true
  });
}

async function update() {
  await updateConfig(config.value);
  password.value = config.value.password;
  await promptPassword();
}

const confirm = useConfirm();
const toast = useToast();

async function freeAll_() {
  confirm.require({
    header: "Освободить всех?",
    rejectProps: {
      label: "Отмена",
      severity: "secondary",
      outlined: true
    },
    acceptProps: {
      label: "Освободить"
    },
    accept: async () => {
      await freeAll();
      toast.add({severity: "success", summary: "Done"});
    }
  });
}
</script>

<template>
  <ProgressIndicator v-if="pending"/>
  <div v-else-if="accepted">
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
        <label>
          <span>Пароль:</span>
          <InputText class="input" :modelValue="config.password" @input="config.password = ($event.target as HTMLInputElement).value"/>
        </label>
        <label>
          <span>Время без штрафа:</span>
          <InputNumber class="input" v-model="config.freeTime" @input="config.freeTime = $event.value ? Number($event.value) : 0"/>
        </label>
        <Button @click="update">Save</Button>
        <Button @click="freeAll_" severity="warn">Освободить всех</Button>
        <ConfirmDialog/>
      </div>
    </main>
  </div>
  <div v-else>Password in incorrect</div>
</template>

<style scoped>
main {
  display: flex;
  gap: 20px;
  margin-top: 20px;

  @media (width < 1105px) {
    flex-direction: column;
  }
}

.teams {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
  flex-basis: 70%;

  .table {
    width: 100%;
  }

  .buttons {
    display: flex;
    gap: 20px;
  }
}

.settings {
  flex-basis: 30%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  label {
    display: flex;
    align-items: center;
    gap: 20px;

    .input {
      width: 100%;
    }
  }
}
</style>