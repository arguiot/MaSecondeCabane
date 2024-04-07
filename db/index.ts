import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const user = process.env.PGUSER;
const password = process.env.PGPASSWORD;
const host = process.env.PGHOST;
const port = "5432";
const database = process.env.PGPASSWORD;

const queryClient = postgres("postgres://username:password@host.com:5432/database", {
    host,
    port: parseInt(port || "5432"),
    database,
    username: user,
    password,
    ssl: true
});

export const db = drizzle(queryClient, { schema });