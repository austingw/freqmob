import { db } from "@/lib/db/db";
import { boards } from "@/lib/db/schema";
import { asc, eq, like } from "drizzle-orm";

type NewBoard = typeof boards.$inferInsert;

export const queryBoardByName = async (name: string) => {
  return await db
    .select()
    .from(boards)
    .where(eq(boards.name, name.toLowerCase().trim()));
};

export const queryBoardById = async (id: number) => {
  return await db.select().from(boards).where(eq(boards.id, id));
};

export const insertBoard = async (board: NewBoard) => {
  return await db.insert(boards).values(board);
};

export const queryBoardsBySearchTerm = async (searchTerm: string) => {
  return await db
    .select()
    .from(boards)
    .where(like(boards.name, `%${searchTerm}%`))
    .orderBy(asc(boards.name));
};
