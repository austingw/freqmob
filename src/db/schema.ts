import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const audio = sqliteTable("audio", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  url: text("url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const comments = sqliteTable("comments", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
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
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  url: text("url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const posts = sqliteTable("posts", {
  id: integer("id", {
    mode: "number",
  })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  type: text("post_type", {
    enum: ["collab", "demo", "master", "mix", "sample", "text"],
  }).notNull(),
  bpm: real("bpm"),
  key: text("key"),
  inspiration: text("inspiration"),
  genre: text("genre"),
  audioId: integer("audio_id").references(() => audio.id),
  imageId: integer("image_id").references(() => images.id),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
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
