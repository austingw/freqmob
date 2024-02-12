import { Lucia } from "lucia";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { client } from "./db";

const adapter = new LibSQLAdapter(client, {
  user: "user",
  session: "session",
});
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
