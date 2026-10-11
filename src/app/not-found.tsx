import { MoreLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-6xl font-black text-aka">404</p>
      <p className="mt-4 font-bold">ページが見つかりませんでした。</p>
      <div className="mt-8">
        <MoreLink href="/">ホームへ</MoreLink>
      </div>
    </div>
  );
}
