import { videosSchema } from "@/database/schema";

export type Video = Omit<typeof videosSchema.$inferSelect, "userId" | "createdAt"> & {
  createdAt: string;
};
