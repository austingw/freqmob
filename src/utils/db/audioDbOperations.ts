import { db } from "@/db/db";
import { audio } from "@/db/schema";

type NewAudio = typeof audio.$inferInsert;

export const insertAudio = async (newAudio: NewAudio) => {
  return db.insert(audio).values(newAudio).returning({
    id: audio.id,
  });
};
