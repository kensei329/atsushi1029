import type { Video } from "@/data/types";
import { videoCategoryLabel } from "@/data/videos";
import { formatDate } from "@/lib/content";
import { YouTubeEmbed } from "./YouTubeEmbed";

export function VideoPlayer({ video }: { video: Video }) {
  if (video.source.type === "youtube") {
    return <YouTubeEmbed id={video.source.youtubeId} title={video.title} />;
  }
  return (
    <video
      className="aspect-video w-full rounded-md bg-ink object-contain"
      src={video.source.src}
      poster={video.source.poster}
      controls
      playsInline
      preload="none"
    />
  );
}

export function VideoCard({ video }: { video: Video }) {
  const isKick = video.category === "kickboxing";
  return (
    <article>
      <VideoPlayer video={video} />
      <div className="mt-3 flex items-center gap-2 text-xs font-bold">
        <span className={`rounded-sm px-2 py-0.5 text-white ${isKick ? "bg-ao" : "bg-aka"}`}>
          {videoCategoryLabel[video.category]}
        </span>
        {video.date && <time className="text-ink/50">{formatDate(video.date)}</time>}
      </div>
      <h3 className="mt-1.5 font-bold leading-snug">{video.title}</h3>
      {video.description && <p className="mt-1 text-sm text-ink/65">{video.description}</p>}
    </article>
  );
}
