import { db } from "@/db/db";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getBoardByName = async (name: string) => {
  return await db
    .select()
    .from(boards)
    .where(eq(boards.name, name.toLowerCase().trim()));
};
