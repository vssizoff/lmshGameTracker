import setupDB from "./setup.sql.js";
import {type ColumnType, type Generated, Kysely, PostgresDialect} from "kysely";
import pg from "pg";

export interface TeamsTable {
    id: string;
    name: string;
    active: Generated<boolean>;
    score: Generated<number>;
}

export interface TimesTable {
    id: Generated<number>;
    team: string;
    catchersTeam: string;
    pointsToCatcher: number;
    card: number;
    start: ColumnType<Date, Date | string, Date | string>;
    end?: ColumnType<Date, Date | string, Date | string>;
}

export interface Database {
    teams: TeamsTable;
    times: TimesTable;
}

export let pool: pg.Pool, dialect: PostgresDialect, db: Kysely<Database>;

export function connect(host: string, port: number, user: string, password: string, database: string) {
    pool = new pg.Pool({host, port, user, password, database});
    dialect = new PostgresDialect({pool});
    db = new Kysely<Database>({dialect});
}

export async function setup(host: string, port: number, user: string, password: string, database: string) {
    connect(host, port, user, password, database);
    await setupDB();
}

export async function setupEnv() {
    await setup(process.env.DB_HOST ?? "localhost", Number(process.env.DB_PORT ?? 5432), process.env.DB_USER ?? "postgres", process.env.DB_PASSWORD ?? "", process.env.DB_NAME ?? "postgres");
}
