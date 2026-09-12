import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  hashedPassword: text("hashedPassword").notNull(),
});

// Tracks anonymous "try it free" generations on the root page, so we can
// rate-limit by IP without requiring an account.
export const previewRequestsSchema = pgTable("previewRequests", {
  id: serial("id").primaryKey(),
  ip: text("ip").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const videosSchema = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .references(() => usersSchema.id, { onDelete: "cascade" })
    .notNull(),
  youtubeId: text("youtubeId").notNull(),
  title: text("title").notNull(),
  channel: text("channel"),
  thumbnailUrl: text("thumbnailUrl"),
  transcript: text("transcript"),
  timestamps: jsonb("timestamps")
    .$type<{ time: number; label: string }[]>()
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
