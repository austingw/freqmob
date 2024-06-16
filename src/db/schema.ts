import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const audio = sqliteTable("audio", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  uploadedAt: text("uploaded_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  url: text("url").notNull(),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id),
});

export const boards = sqliteTable("boards", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  primaryColor: text("primary_color"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id),
});

export const comments = sqliteTable("comments", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  content: text("content").notNull(),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
});

export const images = sqliteTable("images", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  uploadedAt: text("uploaded_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  url: text("url").notNull(),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id),
});

export const likes = sqliteTable("likes", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  isUpvote: integer("is_upvote", { mode: "boolean" }).notNull(),
});

export const commentLikes = sqliteTable("comment_likes", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id),
  commentId: text("comment_id")
    .notNull()
    .references(() => comments.id),
  isUpvote: integer("is_upvote", { mode: "boolean" }).notNull(),
});

export const posts = sqliteTable("posts", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  type: text("post_type", {
    enum: ["collab", "demo", "master", "mix", "sample", "text"],
  }).notNull(),
  bpm: real("bpm"),
  key: text("key"),
  inspiration: text("inspiration"),
  genre: text("genre"),
  likeCount: integer("like_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
  boardId: integer("board_id").references(() => boards.id),
  audioId: integer("audio_id").references(() => audio.id),
  imageId: integer("image_id").references(() => images.id),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id),
});

export const profiles = sqliteTable("profiles", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => randomUUID())
    .unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  bandcamp: text("bandcamp"),
  soundcloud: text("soundcloud"),
  spotify: text("spotify"),
  website: text("website"),
  boardList: text("board_list", { mode: "json" }).$type<string[]>(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => userTable.id),
});

export const userTable = sqliteTable("users", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => randomUUID())
    .unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export type PostWithMedia = {
  posts: typeof posts.$inferSelect;
  images: typeof images.$inferSelect | null;
  audio: typeof audio.$inferSelect | null;
  profiles: typeof profiles.$inferSelect;
};
