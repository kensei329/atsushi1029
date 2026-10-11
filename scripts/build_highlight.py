"""ホーム・ファーストビュー用ハイライト動画（約30秒）を生成する。

赤（AKA）選手＝白石篤司を自動追尾してズームし、スローモーション・フラッシュ・カラーグレーディングを加える。
縦型（スマホ用 9:16）と横型（PC用 16:9）の2本を出力する。

使い方:
  python3 scripts/build_highlight.py <試合動画1> <試合動画2> <試合動画3> [--bgm 許諾済み音源.mp3]

※ BGM は Web 公開の利用許諾がある音源のみ指定すること（市販曲・TV番組テーマ曲は不可）。
"""
import argparse
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from track_red import track  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
FLASH = 4  # カット頭の白フラッシュのフレーム数

FORMATS = {
    # 名前: (出力サイズ, 元映像での切り抜き高さ px)
    "v": ((720, 1280), 480),
    "h": ((1280, 720), 380),
}


def photo_frames(img_path, size, dur, focus_y=0.3, zoom=(1.0, 1.12)):
    """写真をぼかし背景＋ゆっくりズームインで動画化"""
    W, H = size
    img = cv2.imread(str(img_path))
    ih, iw = img.shape[:2]
    bg = cv2.resize(img, (W, H)) if iw / ih > W / H else cv2.resize(img, (W, int(ih * W / iw)))
    bg = cv2.resize(bg[: H if bg.shape[0] >= H else None], (W, H))
    bg = (cv2.GaussianBlur(bg, (0, 0), 25) * 0.45).astype(np.uint8)
    n = int(dur * FPS)
    for i in range(n):
        z = zoom[0] + (zoom[1] - zoom[0]) * i / max(n - 1, 1)
        # 画面に収まる倍率 × z
        base = min(W / iw, H / ih) if W > H else max(W / iw, H / ih)
        s = base * z
        fw, fh = int(iw * s), int(ih * s)
        fg = cv2.resize(img, (fw, fh), interpolation=cv2.INTER_AREA)
        x0 = (fw - W) // 2
        y0 = int((fh - H) * focus_y)
        frame = bg.copy()
        # 前景を中央に貼り付け（はみ出しは切り取り）
        sx, sy = max(x0, 0), max(y0, 0)
        dx, dy = max(-x0, 0), max(-y0, 0)
        cw, ch = min(W - dx, fw - sx), min(H - dy, fh - sy)
        frame[dy : dy + ch, dx : dx + cw] = fg[sy : sy + ch, sx : sx + cw]
        yield frame


def match_frames(src, start, dur, size, crop_h, slow=1.0, push=0.1):
    """赤選手を追尾してズームした映像。slow>1 でスローモーション（フレーム補間ブレンド）"""
    W, H = size
    pts, (sw, sh) = track(src, start, dur, FPS)
    cap = cv2.VideoCapture(src)
    cap.set(cv2.CAP_PROP_POS_MSEC, start * 1000)
    raw = []
    for _ in range(len(pts)):
        ok, f = cap.read()
        if not ok:
            break
        raw.append(f)
    cap.release()
    n = len(raw)
    out_n = int(n * slow)
    for k in range(out_n):
        t = k / slow
        i = min(int(t), n - 1)
        j = min(i + 1, n - 1)
        a = t - i
        f = raw[i] if a < 1e-3 else cv2.addWeighted(raw[i], 1 - a, raw[j], a, 0)
        x, y = pts[i]
        # 時間とともにわずかに寄る
        ch = crop_h * (1 - push * k / max(out_n - 1, 1))
        cw = ch * W / H
        cx = np.clip(x, cw / 2, sw - cw / 2)
        cy = np.clip(y - ch * 0.12, ch / 2, sh - ch / 2)
        M = np.float32([[W / cw, 0, -(cx - cw / 2) * W / cw], [0, H / ch, -(cy - ch / 2) * H / ch]])
        yield cv2.warpAffine(f, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def build(fmt, srcs, out_path):
    size, crop_h = FORMATS[fmt]
    W, H = size
    V1, V2, V3 = srcs
    img = ROOT / "public/images"
    # (種類, 引数...) — 合計約30秒
    # 試合映像の時刻は「赤選手周辺の動き量」が大きい場面（攻防の瞬間）から選定
    plan = [
        ("photo", img / "kumite.jpg", 2.5, 0.15),
        ("match", V3, 47.0, 3.0, 1.0),
        ("match", V2, 52.7, 2.4, 2.0),   # 攻防 → スロー
        ("match", V3, 79.5, 2.5, 1.0),
        ("photo", img / "oyako.jpg", 2.0, 0.25),
        ("match", V2, 23.0, 3.0, 1.0),
        ("match", V3, 82.8, 2.0, 2.0),
        ("match", V1, 28.5, 2.6, 1.0),
        ("match", V2, 90.5, 2.5, 1.0),
        ("match", V3, 24.0, 2.5, 1.0),
        ("match", V2, 115.5, 2.0, 2.0),
        ("photo", img / "kumite.jpg", 3.0, 0.12),
    ]
    total_sec = sum(seg[2] if seg[0] == "photo" else seg[3] for seg in plan)
    enc = subprocess.Popen(
        [
            "ffmpeg", "-v", "error", "-y",
            "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
            "-vf", "unsharp=5:5:0.8,eq=contrast=1.15:saturation=1.2:brightness=-0.03,vignette=PI/4.5,"
                   f"fade=t=in:d=0.6,fade=t=out:st={total_sec - 0.8}:d=0.8",
            "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart", str(out_path),
        ],
        stdin=subprocess.PIPE,
    )
    total = 0
    for seg in plan:
        if seg[0] == "photo":
            # 横型では縦長写真が小さくなるので大きめに寄せる
            zoom = (1.0, 1.12) if H > W else (1.45, 1.6)
            frames = photo_frames(seg[1], size, seg[2], focus_y=seg[3], zoom=zoom)
        else:
            _, src, st, dur, slow = seg
            frames = match_frames(src, st, dur / slow, size, crop_h, slow=slow)
        for i, fr in enumerate(frames):
            if i < FLASH and total > 0:  # カット頭に白フラッシュ
                a = 1 - i / FLASH
                fr = cv2.addWeighted(fr, 1 - a * 0.85, np.full_like(fr, 255), a * 0.85, 0)
            enc.stdin.write(fr.tobytes())
            total += 1
    enc.stdin.close()
    enc.wait()
    print(f"{out_path.name}: {total / FPS:.1f}s")


def mux_bgm(video, bgm):
    tmp = video.with_suffix(".tmp.mp4")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", bgm,
         "-af", "afade=t=in:d=0.5,afade=t=out:st=28:d=2", "-map", "0:v", "-map", "1:a", "-shortest",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(tmp)],
        check=True,
    )
    tmp.replace(video)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("videos", nargs=3)
    ap.add_argument("--bgm")
    args = ap.parse_args()
    for fmt in FORMATS:
        out = ROOT / f"public/videos/hero-highlight-{fmt}.mp4"
        build(fmt, args.videos, out)
        if args.bgm:
            mux_bgm(out, args.bgm)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "4", "-i", str(out), "-frames:v", "1",
                        "-q:v", "4", str(ROOT / f"public/images/hero-highlight-{fmt}.jpg")], check=True)
