import {useLocalStorage} from "@vueuse/core";
import superagent from "superagent";

const password = useLocalStorage("password", "");

export type ScoreType = {
    id: string,
    name: string,
    score: number
};

export async function getScore() {
    return JSON.parse((await superagent.get("/api/score")).text);
}