import {useLocalStorage} from "@vueuse/core";
import superagent from "superagent";

export const password = useLocalStorage("password", "");

export type ScoreType = {
    id: string,
    name: string,
    score: number
};

export type TeamType = {
    id: string,
    name: string,
    active: boolean
}

export type ConfigType = {
    password: string,
    freeTime: number
}

export async function getScore(): Promise<Array<ScoreType>> {
    return JSON.parse((await superagent.get("/api/score")).text);
}

export async function checkPassword(): Promise<boolean> {
    return (await superagent.get("/api/config/check-password")
        .set({authorization: password.value})
        .ok(() => true)).status === 200;
}

export async function promptPassword() {
    while (!(await checkPassword())) {
        password.value = prompt("password");
    }
}

export async function catch_(catchersTeam: string, team: string, pointsToCatcher: number, card: number) {
    await superagent.post("/api/catch")
        .send({catchersTeam, team, pointsToCatcher, card})
        .set({authorization: password.value});
}

export async function getCardsInUse(): Promise<Array<number>> {
    return JSON.parse((await superagent.get("/api/cards-in-use")).text);
}

export async function getFree(card: number): Promise<number> {
    return Number((await superagent.get(`/api/free?card=${card}`).set({authorization: password.value})).text);
}

export async function free(card: number) {
    await superagent.post("/api/free").send({card}).set({authorization: password.value});
}

export async function getAllTeams(): Promise<Array<TeamType>> {
    return JSON.parse((await superagent.get("/api/config/teams")).text);
}

export async function updateTeams(teams: Array<TeamType>) {
    await superagent.post("/api/config/teams").send(teams).set({authorization: password.value});
}

export async function getConfig(): Promise<ConfigType> {
    return JSON.parse((await superagent.get("/api/config").set({authorization: password.value})).text);
}

export async function updateConfig(config: ConfigType) {
    await superagent.post("/api/config").send(config).set({authorization: password.value});
}

export async function freeAll() {
    await superagent.post("/api/free-all").set({authorization: password.value});
}