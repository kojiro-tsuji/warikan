import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // マイグレーションは pooler を通さない直接接続で行う
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
});
