import "dotenv/config"; // 为本地 CLI (drizzle-kit) 加载 .env 环境变量
import { defineConfig } from "drizzle-kit";

/**
 * 注意：此文件仅由 drizzle-kit CLI 在本地开发环境运行。
 * 在 Cloudflare Workers 运行时，数据库连接由 server/utils/db.ts 处理，
 * 采用 Nuxt 的 useRuntimeConfig() 获取环境变量。
 */
export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
