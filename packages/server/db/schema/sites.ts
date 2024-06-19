import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sites = sqliteTable("sites", {
  siteId: text("id").primaryKey(),
  accessToken: text("access_token").notNull(),
});
