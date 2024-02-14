import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const audio = sqliteTable("audio", {
  id: integer("id").notNull().primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  url: text("url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const comments = sqliteTable("comments", {
  id: text("id").notNull().primaryKey().default(randomUUID()),
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
  id: integer("id").notNull().primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  url: text("url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const posts = sqliteTable("posts", {
  id: text("id").notNull().primaryKey(),
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
  bpm: integer("bpm"),
  key: text("key"),
  influences: text("influences"),
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

export const sessionTable = sqliteTable("sessions", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => randomUUID())
    .unique(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});
