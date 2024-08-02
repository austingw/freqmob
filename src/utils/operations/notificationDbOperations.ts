import { db } from "@/db/db";
import { notifications } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

type NewNotification = typeof notifications.$inferInsert;

export const deleteNotification = async (id: number) => {
  await db.delete(notifications).where(eq(notifications.id, id));
};

export const insertNotification = async (notification: NewNotification) => {
  await db.insert(notifications).values(notification);
};

export const updateNotificationAsRead = async (id: number) => {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, id));
};

export const queryUserNotifications = async (
  profileId: string,
  page: number,
) => {
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.profileId, profileId))
    .limit(5)
    .offset((page - 1) * 5)
    .orderBy(desc(notifications.createdAt));
};
