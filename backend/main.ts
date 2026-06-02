import Backendium from "backendium";
import {setupEnv} from "./sql/index.sql.js";
import {importConfig} from "./config.js";
import configEndpoints from "./config.endpoints.js";
import mainEndpoints from "./main.endpoints.js";

(async () => {
    await importConfig();
    await setupEnv();

    const app = new Backendium({
        name: "inf54",
        version: "0.0.0",
        host: process.env.HOST,
        port: Number(process.env.PORT ?? 8080)
    });

    app.router(configEndpoints, "/config");
    app.router(mainEndpoints);
    app.start();

    process.on("SIGINT", () => process.exit());
    process.on("SIGTERM", () => process.exit());
    process.on("SIGQUIT", () => process.exit());
})();