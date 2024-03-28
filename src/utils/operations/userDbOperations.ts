import { db } from "@/db/db";
import { profiles, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

type NewUser = typeof userTable.$inferInsert;
type NewProfile = typeof profiles.$inferInsert;

export const insertUser = async (user: NewUser) => {
  return await db.insert(userTable).values(user).returning({
    id: userTable.id,
  });
};

export const insertProfile = async (profile: NewProfile) => {
  return await db.insert(profiles).values(profile);
};

export const checkUsername = async (username: string) => {
  return await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));
};
