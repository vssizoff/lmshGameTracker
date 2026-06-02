import {db} from "./index.sql.js";

export default async function () {
    try {
        await db.schema.createTable("teams")
            .addColumn("id", "uuid", cb => cb.primaryKey().unique())
            .addColumn("name", "varchar(64)", cb => cb.notNull())
            .addColumn("active", "boolean", cb => cb.notNull().defaultTo(true))
            .addColumn("score", "float8", cb => cb.notNull().defaultTo(0)).execute();
    } catch (error) {}
    try {
        await db.schema.createTable("times")
            .addColumn("id", "serial", cb => cb.primaryKey().unique())
            .addColumn("team", "uuid", cb => cb.notNull())
            .addColumn("catchersTeam", "uuid", cb => cb.notNull())
            .addColumn("pointsToCatcher", "integer", cb => cb.notNull())
            .addColumn("card", "integer")
            .addColumn("start", "timestamp", cb => cb.notNull())
            .addColumn("end", "timestamp").execute();
    } catch (error) {}
}