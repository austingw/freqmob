import { db } from "@/db/db";
import { audio, images, posts, profiles } from "@/db/schema";
import { count, desc, eq, like, or } from "drizzle-orm";
import { getSortVal } from "../getSortVal";

type NewPost = typeof posts.$inferInsert;
type UpdateDetails = {
  title: string;
  description: string;
  type: (typeof posts.type.enumValues)[number];
};

export const insertPost = async (post: NewPost) => {
  return await db.insert(posts).values(post).returning({
    id: posts.id,
  });
};

export const updatePost = async (postId: number, changes: UpdateDetails) => {
  return await db
    .update(posts)
    .set({
      title: changes.title,
      description: changes.description,
      type: changes.type,
    })
    .where(eq(posts.id, postId));
};

export const deletePost = async (postId: number) => {
  return await db.delete(posts).where(eq(posts.id, postId));
};

export const queryPosts = async (page: number, sort: SortOptions) => {
  const sortVal = getSortVal(sort);
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .leftJoin(images, eq(posts.imageId, images.id))
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .limit(10)
    .offset((page - 1) * 10)
    .orderBy(desc(sortVal));
};

export const queryPostsByBoard = async (
  boardId: number,
  page: number,
  sort: SortOptions,
) => {
  const sortVal = getSortVal(sort);
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .leftJoin(images, eq(posts.imageId, images.id))
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .where(eq(posts.boardId, boardId))
    .limit(10)
    .offset((page - 1) * 10)
    .orderBy(desc(sortVal));
};

export const queryPostsByProfile = async (profileId: string) => {
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .leftJoin(images, eq(posts.imageId, images.id))
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .where(eq(posts.profileId, profileId))
    .orderBy(desc(posts.createdAt));
};

export const queryPostCount = async (boardId?: number) => {
  if (boardId) {
    return await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.boardId, boardId));
  }

  return await db.select({ count: count() }).from(posts);
};

export const queryPostCountByProfileId = async (profileId: string) => {
  return await db
    .select({ count: count() })
    .from(posts)
    .where(eq(posts.profileId, profileId));
};

export const queryPostsBySearchTerm = async (
  searchTerm: string,
  page: number,
  sort: SortOptions,
) => {
  const sortVal = getSortVal(sort);
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .leftJoin(images, eq(posts.imageId, images.id))
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .where(
      or(
        like(posts.title, `%${searchTerm}%`),
        like(posts.description, `%${searchTerm}%`),
      ),
    )
    .limit(10)
    .offset((page - 1) * 10)
    .orderBy(desc(sortVal));
};

export const queryPostsCountBySearchTerm = async (searchTerm: string) => {
  return await db
    .select({ count: count() })
    .from(posts)
    .where(
      or(
        like(posts.title, `%${searchTerm}%`),
        like(posts.description, `%${searchTerm}%`),
      ),
    );
};

export const queryPostById = async (postId: number) => {
  return await db
    .select()
    .from(posts)
    .leftJoin(audio, eq(posts.audioId, audio.id))
    .leftJoin(images, eq(posts.imageId, images.id))
    .innerJoin(profiles, eq(posts.profileId, profiles.id))
    .where(eq(posts.id, postId));
};

export const queryPostDetailsById = async (postId: number) => {
  return await db
    .select({ profileId: posts.profileId, title: posts.title })
    .from(posts)
    .where(eq(posts.id, postId));
};
