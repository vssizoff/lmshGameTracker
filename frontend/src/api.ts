import {useLocalStorage} from "@vueuse/core";
import superagent from "superagent";

export const password = useLocalStorage("password", "");

export type ScoreType = {
    id: string,
    name: string,
    score: number
};

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