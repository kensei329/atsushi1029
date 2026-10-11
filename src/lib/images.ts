import { existsSync } from "node:fs";
import path from "node:path";

/** public 配下に実ファイルがあるか（ビルド時に評価。未アップロードの写真は表示しない） */
export function hasPublicFile(src: string) {
  return existsSync(path.join(process.cwd(), "public", src));
}
