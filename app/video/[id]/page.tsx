import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/helpers/auth";
import { db } from "@/database/index";
import { videosSchema } from "@/database/schema";
import { eq } from "drizzle-orm";
import VideoTabs from "./VideoTabs";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const [video] = await db
    .select()
    .from(videosSchema)
    .where(eq(videosSchema.id, Number(id)));

  if (!video || video.userId !== user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl p-6 text-gray-900">
      <div className="mb-4 flex items-center gap-3 rounded-md border border-gray-300 p-3">
        {video.thumbnailUrl && (
          <img
            src={video.thumbnailUrl}
            alt=""
            className="h-14 w-24 rounded object-cover"
          />
        )}
        <div>
          <p className="font-medium">
            {video.title}
            {video.channel ? ` - ${video.channel}` : ""}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <VideoTabs
        youtubeId={video.youtubeId}
        timestamps={video.timestamps}
        transcript={video.transcript}
      />
    </div>
  );
}
