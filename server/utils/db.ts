import { drizzle } from "drizzle-orm/libsql/node";
import { createClient } from "@libsql/client/node";
import * as schema from "../database/schema";

export const useDb = () => {
  console.log(process.env.TURSO_DATABASE_URL);

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
};
