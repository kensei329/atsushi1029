"""試合映像から赤（AKA）選手の位置を推定する。

赤い拳サポーター・足サポーター・赤帯の画素のうち、手前の試合場（白いマット）上にあるものを
重み付きでぼかし、前フレーム位置に近いピークを選手中心とみなす。
"""
import sys
import cv2
import numpy as np

SCALE = 0.5  # 解析解像度（640x360）


def mat_hull(hsv):
    """手前の試合場の内側（白いマット面）＋選手の上半身が入る上方向の余白"""
    h, w = hsv.shape[:2]
    blue = cv2.inRange(hsv, (95, 120, 80), (125, 255, 255))
    blue = cv2.morphologyEx(blue, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(blue)
    if n <= 1:
        return np.ones((h, w), np.uint8) * 255
    # 手前の試合場の場外エリア（審判などで分断されるので、画面下寄りの大きな青領域をまとめる）
    areas = stats[1:, cv2.CC_STAT_AREA]
    cy = stats[1:, cv2.CC_STAT_TOP] + stats[1:, cv2.CC_STAT_HEIGHT] / 2
    keep = 1 + np.flatnonzero((areas >= areas.max() * 0.2) & (cy > h * 0.3))
    if keep.size == 0:
        keep = np.array([1 + int(np.argmax(areas))])
    hull = np.zeros((h, w), np.uint8)
    cv2.fillConvexPoly(hull, cv2.convexHull(cv2.findNonZero(np.isin(lab, keep).astype(np.uint8))), 255)
    # 青い場外エリアに囲まれた内側 = 試合場（白・灰の市松マット＋その上の選手）
    band = cv2.morphologyEx(blue, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    white = cv2.bitwise_and(cv2.bitwise_not(band), cv2.erode(hull, np.ones((9, 9), np.uint8)))
    white = cv2.morphologyEx(white, cv2.MORPH_OPEN, np.ones((11, 11), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(white)
    if n <= 1:
        return hull
    # 審判や選手でマット面が分断されるため、一定以上の大きさの領域をすべてまとめる
    areas = stats[1:, cv2.CC_STAT_AREA]
    keep = 1 + np.flatnonzero(areas >= max(areas.max() * 0.15, h * w * 0.005))
    nz = cv2.findNonZero(np.isin(lab, keep).astype(np.uint8))
    if nz is None:
        return hull
    mat = np.zeros((h, w), np.uint8)
    cv2.fillConvexPoly(mat, cv2.convexHull(nz), 255)
    # 足元は場外ライン際まで、上半身はマットより上にはみ出すので上方向に広げる
    mat = cv2.dilate(mat, np.ones((9, 25), np.uint8))
    k = np.zeros((101, 1), np.uint8)
    k[:51] = 1
    return cv2.dilate(mat, k)


def red_mask(hsv):
    a = cv2.inRange(hsv, (0, 120, 90), (8, 255, 255))
    b = cv2.inRange(hsv, (170, 120, 90), (180, 255, 255))
    # マット上の赤い開始線（細線）を除去し、拳・足サポーターや帯の塊だけ残す
    return cv2.morphologyEx(cv2.bitwise_or(a, b), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))


def track(path, start, dur, fps=30):
    cap = cv2.VideoCapture(path)
    cap.set(cv2.CAP_PROP_POS_MSEC, start * 1000)
    n = int(dur * fps)
    src_fps = cap.get(cv2.CAP_PROP_FPS) or 30
    step = src_fps / fps
    pts, prev, i, t = [], None, 0, 0.0
    W = H = None
    while len(pts) < n:
        ok, frame = cap.read()
        if not ok:
            break
        if i < round(t):
            i += 1
            continue
        i += 1
        t += step
        H, W = frame.shape[:2]
        small = cv2.resize(frame, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_AREA)
        hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
        m = cv2.bitwise_and(red_mask(hsv), mat_hull(hsv)).astype(np.float32)
        heat = cv2.GaussianBlur(m, (0, 0), 18)
        if prev is not None:
            yy, xx = np.mgrid[0 : heat.shape[0], 0 : heat.shape[1]]
            heat *= np.exp(-((xx - prev[0]) ** 2 + (yy - prev[1]) ** 2) / (2 * 90.0**2)) + 0.15
        if heat.max() > 1.0:
            y, x = np.unravel_index(np.argmax(heat), heat.shape)
            prev = (float(x), float(y))
        pts.append(prev)
    cap.release()
    # 未検出フレームを前後で補完
    first = next((p for p in pts if p is not None), (W * SCALE / 2, H * SCALE / 2))
    out, last = [], first
    for p in pts:
        last = p if p is not None else last
        out.append((last[0] / SCALE, last[1] / SCALE))
    arr = np.array(out)
    # 手ブレ感を抑えるカメラワーク：移動平均を2回
    k = 15
    for _ in range(2):
        pad = np.pad(arr, ((k, k), (0, 0)), mode="edge")
        arr = np.stack([np.convolve(pad[:, j], np.ones(2 * k + 1) / (2 * k + 1), mode="valid") for j in range(2)], 1)
    return arr, (W, H)


if __name__ == "__main__":
    path, start, dur = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
    arr, _ = track(path, start, dur)
    for x, y in arr[::15]:
        print(f"{x:.0f},{y:.0f}")
