import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema_neon/user.schema.js",
  out: "./drizzle",
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_8bYM5JOBQZzV@ep-summer-unit-a86hc493-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
  }
});
