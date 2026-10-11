"""favicon（白石篤司の顔写真）と OGP 画像（public/ogp-shiraishi-2026.jpg）を生成する。

使い方: python3 scripts/build_brand_assets.py
フォント（Noto Sans JP / Oswald）は Google Fonts から ~/.cache/atsushi-fonts に取得する。
"""
import re
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "public/images"
APP = ROOT / "src/app"
CACHE = Path.home() / ".cache/atsushi-fonts"

INK = (17, 17, 17)
AKA = (215, 38, 30)
AO = (29, 78, 216)


def font(family, weight):
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / f"{family.replace(' ', '')}-{weight}.ttf"
    if not path.exists():
        css_url = f"https://fonts.googleapis.com/css2?family={family.replace(' ', '+')}:wght@{weight}"
        req = urllib.request.Request(css_url, headers={"User-Agent": "Mozilla/4.0"})
        css = urllib.request.urlopen(req).read().decode()
        url = re.search(r"url\((https://[^)]+\.ttf)\)", css).group(1)
        path.write_bytes(urllib.request.urlopen(url).read())
    return str(path)


def favicon():
    face = Image.open(IMG / "oyako.jpg").convert("RGB").crop((0, 150, 440, 590))
    for size, name in [(512, "icon.png"), (180, "apple-icon.png")]:
        im = face.resize((size, size), Image.LANCZOS)
        # 赤い輪で縁取った丸アイコン
        mask = Image.new("L", (size * 4, size * 4), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
        mask = mask.resize((size, size), Image.LANCZOS)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(im, (0, 0), mask)
        ring = Image.new("RGBA", (size * 4, size * 4), (0, 0, 0, 0))
        w = int(size * 4 * 0.045)
        ImageDraw.Draw(ring).ellipse((0, 0, size * 4 - 1, size * 4 - 1), outline=AKA + (255,), width=w)
        out.alpha_composite(ring.resize((size, size), Image.LANCZOS))
        if name == "apple-icon.png":  # iOS は透過非対応なので黒背景
            bg = Image.new("RGBA", (size, size), INK + (255,))
            bg.alpha_composite(out)
            out = bg
        out.save(APP / name)
    # favicon.ico（16/32/48）
    small = Image.open(APP / "icon.png")
    small.save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    small.resize((128, 128), Image.LANCZOS).save(IMG / "face.png")  # ヘッダーのロゴ用


def ogp():
    W, H = 1200, 630
    base = Image.new("RGB", (W, H), INK)
    # 右側：試合前の写真（赤い拳サポーター・赤帯）
    photo = Image.open(IMG / "ogp-photo.jpg").convert("RGB")
    pw = 700
    photo = ImageOps.fit(photo, (pw, H), centering=(0.5, 0.3))
    photo = Image.blend(photo, Image.new("RGB", photo.size, INK), 0.08)
    base.paste(photo, (W - pw, 0))
    # 左から黒のグラデーションで写真に溶け込ませる
    grad = Image.new("L", (W, H), 0)
    gd = ImageDraw.Draw(grad)
    for x in range(W):
        a = 255 if x < W - pw else max(0, int(255 * (1 - (x - (W - pw)) / 320)))
        gd.line([(x, 0), (x, H)], fill=a)
    base.paste(Image.new("RGB", (W, H), INK), (0, 0), grad)
    d = ImageDraw.Draw(base)
    # 赤・青コーナーの斜めストライプ
    d.polygon([(W - 120, 0), (W - 70, 0), (W - 250, H), (W - 300, H)], fill=AKA)
    d.polygon([(W - 50, 0), (W - 20, 0), (W - 200, H), (W - 230, H)], fill=AO)

    osw = ImageFont.truetype(font("Oswald", 700), 26)
    jp900 = lambda s: ImageFont.truetype(font("Noto Sans JP", 900), s)
    jp700 = lambda s: ImageFont.truetype(font("Noto Sans JP", 700), s)

    x = 70
    d.text((x, 70), "FORMER PRO KICKBOXER × KARATE-DO", font=osw, fill=AKA)
    title = jp900(92)
    for i, line in enumerate(["40歳、", "再び道着を", "締める。"]):
        d.text((x, 118 + i * 108), line, font=title, fill=(255, 255, 255))
    d.rectangle((x, 466, x + 60, 472), fill=AKA)
    d.rectangle((x + 60, 466, x + 120, 472), fill=AO)
    d.text((x, 492), "白石篤司", font=jp900(44), fill=(255, 255, 255))
    d.text((x + 196, 506), "全日本空手道連盟マスターズ優勝への挑戦", font=jp700(24), fill=(200, 200, 200))
    # 下端の赤青ライン
    d.rectangle((0, H - 10, W // 2, H), fill=AKA)
    d.rectangle((W // 2, H - 10, W, H), fill=AO)
    # LINE / X / Facebook / note などすべての OGP で共通に使う（src/lib/seo.ts）
    base.save(ROOT / "public/ogp-shiraishi-2026.jpg", quality=90, optimize=True, progressive=True)


if __name__ == "__main__":
    favicon()
    ogp()
    print("generated favicon / OGP")
