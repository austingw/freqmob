import { db } from "@/db/db";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";

type NewBoard = typeof boards.$inferInsert;

export const queryBoardByName = async (name: string) => {
  return await db
    .select()
    .from(boards)
    .where(eq(boards.name, name.toLowerCase().trim()));
};

export const insertBoard = async (board: NewBoard) => {
  return await db.insert(boards).values(board);
};
