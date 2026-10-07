import "server-only";

import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pool?: Pool };

// 開発時のホットリロードでプールが増え続けないよう使い回す
const pool = globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

// Vercel Fluid compute でアイドル接続を関数停止前に解放する
attachDatabasePool(pool);

export const db = drizzle({ client: pool, schema });
