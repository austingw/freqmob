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
  name: text("name").notNull().unique(),
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
    .references(() => profiles.id, { onDelete: "cascade" }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
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
    .references(() => profiles.id, { onDelete: "cascade" }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
});

export const notifications = sqliteTable("notifications", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  postId: integer("post_id").references(() => posts.id, {
    onDelete: "cascade",
  }),
  boardId: integer("board_id").references(() => boards.id),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
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
  boardId: integer("board_id").references(() => boards.id, {
    onDelete: "cascade",
  }),
  audioId: integer("audio_id").references(() => audio.id, {
    onDelete: "cascade",
  }),
  imageId: integer("image_id").references(() => images.id, {
    onDelete: "cascade",
  }),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
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
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const userTable = sqliteTable("users", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => randomUUID())
    .unique(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password").notNull(),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const passwordResetToken = sqliteTable("password_reset_token", {
  tokenHash: text("token_hash").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
});

export type CommentWithPost = {
  comments: typeof comments.$inferSelect;
  posts: typeof posts.$inferSelect;
};

export type CommentWithProfile = {
  comments: typeof comments.$inferSelect;
  profiles: typeof profiles.$inferSelect;
};

export type PostWithAudio = {
  posts: typeof posts.$inferSelect;
  audio: typeof audio.$inferSelect | null;
};

export type PostWithMedia = {
  posts: typeof posts.$inferSelect;
  images: typeof images.$inferSelect | null;
  audio: typeof audio.$inferSelect | null;
  boards: typeof boards.$inferSelect;
  profiles: typeof profiles.$inferSelect;
};
