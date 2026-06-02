import {float, object, ParsingError, string} from "parsium";
import * as fs from "node:fs";
import * as path from "node:path";

export const configValidator = object({
    freeTime: float({min: 0}),
    password: string()
});

export type ConfigType = ReturnType<typeof configValidator>;

export let config: ConfigType;

export async function importConfig() {
    if (!(await fs.promises.exists(path.resolve("./config/config.json")))) {
        await fs.promises.writeFile(path.resolve("./config/config.json"), JSON.stringify({
            freeTime: 5,
            password: "54"
        }, null, 4), {encoding: "utf8"});
    }
    config = JSON.parse(await fs.promises.readFile(path.resolve("./config/config.json"), {encoding: "utf8"}));
    try {
        configValidator(config, "config")
    } catch (err) {
        throw new ParsingError("Import config failed. errors: " + (err as ParsingError).message);
    }
}

export async function exportConfig(newConfig?: ConfigType) {
    if (newConfig) config = newConfig;
    await fs.promises.writeFile(
        path.resolve("./config/config.json"),
        JSON.stringify(config, null, 4),
        {encoding: "utf8"}
    );
}