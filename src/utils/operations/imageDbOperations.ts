import { db } from "@/db/db";
import { images } from "@/db/schema";

type NewImage = typeof images.$inferInsert;

export const insertImage = async (newImage: NewImage) => {
  return await db.insert(images).values(newImage).returning({
    id: images.id,
  });
};
