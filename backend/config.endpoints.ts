import {BackendiumRouter} from "backendium";
import {config, configValidator, exportConfig} from "./config.js";
import {array, boolean, object, optional, string, uuid} from "parsium";
import {db} from "./sql/index.sql.js";

const router = new BackendiumRouter<void>();
router.setAuth(
    request => request.headers.authorization === config.password ? undefined : null,
    (_, response) => {
        response.status(401);
        response.end();
    }
);

router.get("/check-password", {
    auth: true
}, (request, response) => {
    response.end();
});

router.post("/teams", {
    auth: true,
    bodyValidator: array(object({
        name: string(),
        id: uuid(),
        active: optional(boolean())
    }))
}, async (request, response) => {
    let trx = await db.startTransaction().execute();

    try {
        await Promise.all(request.body.map(async (row) => {
            if (await trx.selectFrom("teams").where("id", '=', row.id).executeTakeFirst()) {
                await trx.updateTable("teams").where("id", '=', row.id).set(row).execute();
            }
            else {
                await trx.insertInto("teams").values(row).execute();
            }
        }));

        await trx.commit().execute();
    } catch (error) {
        await trx.rollback().execute();
    }

    response.end(await db.selectFrom("teams").selectAll().execute());
});

router.get("/teams", {}, async (request, response) => {
    response.end(await db.selectFrom("teams").select(["id", "name", "active"]).execute());
});

router.post("/", {
    bodyValidator: configValidator,
    auth: true
}, async (request, response) => {
    await exportConfig(request.body);
    response.end(config);
});

router.get("/", {
    auth: true
}, async (request, response) => {
    response.end(config);
})

export default router;