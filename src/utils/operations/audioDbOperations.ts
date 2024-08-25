import { db } from "@/lib/db/db";
import { audio } from "@/lib/db/schema";

type NewAudio = typeof audio.$inferInsert;

export const insertAudio = async (newAudio: NewAudio) => {
  return await db.insert(audio).values(newAudio).returning({
    id: audio.id,
  });
};
