import {BackendiumRouter} from "backendium";
import {config} from "./config.js";
import {int, object, uuid} from "parsium";
import {db} from "./sql/index.sql.js";

const router = new BackendiumRouter<void>();
router.setAuth(
    request => request.headers.authorization === config.password ? undefined : null,
    (_, response) => {
        response.status(401);
        response.end();
    }
);

async function addScore(team: string, score: number): Promise<void> {
    let old = (await db.selectFrom("teams").where("id", '=', team).select("score").executeTakeFirstOrThrow()).score;
    await db.updateTable("teams").where("id", '=', team).set({score: old + score}).execute();
}

router.post("/catch", {
    auth: true,
    bodyValidator: object({
        team: uuid(),
        catchersTeam: uuid(),
        pointsToCatcher: int({min: 0}),
        card: int()
    })
}, async (request, response) => {
    if (
        (await db.selectFrom("times")
            .where(({and, eb}) => and([
                eb("card", '=', request.body.card), eb("end", 'is', null)
            ]))
            .execute()).length
    ) {
        response.status(409);
        response.end(`Card ${request.body.card} is already in use`);
        return;
    }
    let data = await db.insertInto("times")
        .values({...request.body, start: new Date()})
        .returningAll()
        .executeTakeFirstOrThrow();
    await addScore(request.body.catchersTeam, request.body.pointsToCatcher);
    response.status(201);
    response.end(data);
});

function diffMinutes(dt1: Date, dt2: Date) {
    return Math.abs((dt2.getTime() - dt1.getTime()) / 60000);
}

router.post("/free", {
    auth: true,
    bodyValidator: object({card: int()})
}, async (request, response) => {
    if (
        (await db.selectFrom("times")
            .where(({and, eb}) => and([
                eb("card", '=', request.body.card), eb("end", 'is', null)
            ]))
            .execute()).length != 1
    ) {
        response.status(404);
        response.end(`Card ${request.body.card} not in use`);
        return;
    }
    let data = await db.updateTable("times")
        .where(({and, eb}) => and([
            eb("card", '=', request.body.card), eb("end", 'is', null)
        ]))
        .set({end: new Date()})
        .returningAll()
        .executeTakeFirstOrThrow();
    await addScore(data.team, -Math.max(Math.floor(diffMinutes(data.start, data.end as Date) - config.freeTime), 0));
    response.status(200);
    response.end(data);
});

router.post("/score", {}, async (request, response) => {
    response.end(await db.selectFrom("teams").selectAll().execute());
});

export default router;