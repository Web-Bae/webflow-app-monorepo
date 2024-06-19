import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "db/schema/sites.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
