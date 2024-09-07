import { db } from "@/lib/db/db";
import { passwordResetToken, profiles, userTable } from "@/lib/db/schema";
import { UpdateProfile } from "@/types/userTypes";
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

export const getProfileFromUsername = async (username: string) => {
  return await db.select().from(profiles).where(eq(profiles.name, username));
};

export const addBoardSub = async (profileId: string, board: string) => {
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

export const updateProfile = async (profileId: string, data: UpdateProfile) => {
  return await db
    .update(profiles)
    .set(data)
    .where(eq(profiles.id, profileId))
    .returning();
};

export const queryPasswordToken = async (tokenHash: string) => {
  return await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.tokenHash, tokenHash));
};

export const deletePasswordToken = async (tokenHash: string) => {
  return await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.tokenHash, tokenHash));
};

export const updatePassword = async (userId: string, password: string) => {
  return await db
    .update(userTable)
    .set({ password })
    .where(eq(userTable.id, userId));
};
