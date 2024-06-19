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

export const getProfileFromUserId = async (userId: string) => {
  return await db.select().from(profiles).where(eq(profiles.userId, userId));
};

export const addBoardSub = async (board: string, profileId: string) => {
  const profile = await db
    .select({ boardList: profiles.boardList })
    .from(profiles)
    .where(eq(profiles.id, profileId));
  const prevList = profile[0].boardList && profile[0].boardList;
  return await db.update(profiles).set({
    boardList: prevList ? [...prevList, board] : [board],
  });
};

export const removeBoardSub = async (profileId: string, board: string) => {
  const profile = await db
    .select({ boardList: profiles.boardList })
    .from(profiles)
    .where(eq(profiles.id, profileId));
  const prevList = profile[0].boardList && profile[0].boardList;
  return await db.update(profiles).set({
    boardList: prevList
      ? prevList.filter((item: string) => item !== board)
      : [],
  });
};

export const getUserBoards = async (profileId: string) => {
  return await db
    .select({ boardList: profiles.boardList })
    .from(profiles)
    .where(eq(profiles.id, profileId));
};
