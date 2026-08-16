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
