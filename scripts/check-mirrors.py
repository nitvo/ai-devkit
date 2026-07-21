#!/usr/bin/env python3
"""So bản tiếng Anh với bản dịch tiếng Việt.

Không so nội dung chữ (khác ngôn ngữ là đương nhiên), mà so phần KHÔNG đổi theo
ngôn ngữ: token trong backtick và số lượng heading. Đây đúng là chỗ đã lệch
nhiều lần khi sửa một bản mà quên bản kia.

Chạy: python3 scripts/check-mirrors.py
"""

import re
import sys
from pathlib import Path

PAIRS = [
    ("CLAUDE.md", "docs/vi/CLAUDE.md"),
    ("skills/commit-convention/SKILL.md", "docs/vi/commit-convention/SKILL.md"),
    ("skills/pr-convention/SKILL.md", "docs/vi/pr-convention/SKILL.md"),
]

ROOT = Path(__file__).resolve().parent.parent


def strip_banner(text):
    """Bỏ khối blockquote đầu file, banner riêng của bản dịch."""
    return "\n".join(l for l in text.splitlines() if not l.startswith(">"))


def tokens(text):
    """Token trong backtick, bỏ khối code nhiều dòng."""
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return sorted(re.findall(r"`([^`\n]+)`", text))


def headings(text):
    return [l.split(" ", 1)[0] for l in text.splitlines() if l.startswith("#")]


failed = 0
for en_rel, vi_rel in PAIRS:
    en_path, vi_path = ROOT / en_rel, ROOT / vi_rel
    if not en_path.exists() or not vi_path.exists():
        print(f"FAIL  {en_rel} <-> {vi_rel}: thiếu file")
        failed = 1
        continue

    en = strip_banner(en_path.read_text(encoding="utf-8"))
    vi = strip_banner(vi_path.read_text(encoding="utf-8"))

    problems = []

    en_t, vi_t = tokens(en), tokens(vi)
    only_en = sorted(set(en_t) - set(vi_t))
    only_vi = sorted(set(vi_t) - set(en_t))
    if only_en:
        problems.append(f"chỉ có ở EN: {', '.join(only_en)}")
    if only_vi:
        problems.append(f"chỉ có ở VI: {', '.join(only_vi)}")

    en_h, vi_h = headings(en), headings(vi)
    if len(en_h) != len(vi_h):
        problems.append(f"số heading lệch: EN={len(en_h)} VI={len(vi_h)}")

    if problems:
        failed = 1
        print(f"FAIL  {en_rel} <-> {vi_rel}")
        for p in problems:
            print(f"        {p}")
    else:
        print(f"ok    {en_rel} <-> {vi_rel}  ({len(en_t)} token, {len(en_h)} heading)")

sys.exit(failed)
