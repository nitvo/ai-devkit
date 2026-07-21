#!/usr/bin/env python3
"""Bắt các dấu hiệu văn AI trong tài liệu và code.

Chỉ soi văn xuôi. Khối code và đoạn trong backtick được bỏ qua, nên quy tắc tự
nhắc tới ký tự bị cấm (viết trong backtick) không bị chính nó bắt.

Chạy: python3 scripts/check-diction.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXTS = {".md", ".mjs", ".yml", ".sh", ".py"}
EXTRA = {"hooks/commit-msg"}

# Ký tự Unicode: sai ở mọi nơi, kể cả trong code.
PUNCT = [
    ("em-dash", re.compile("\u2014"), "Tách thành hai câu, hoặc dùng dấu hai chấm."),
    ("en-dash", re.compile("\u2013"), "Dùng dấu gạch nối ASCII."),
    ("ellipsis", re.compile("\u2026"), "Dùng ba dấu chấm ASCII, hoặc bỏ."),
]

# Chỉ áp cho văn xuôi (.md). Trong code, dấu chấm phẩy là cú pháp.
PROSE = [
    ("semicolon", re.compile(r"[a-z]; [a-z]"), "Tách thành hai câu."),
    ("not-only", re.compile(r"\bnot (only|just)\b", re.I), "Viết thẳng điều muốn nói."),
]

# Arrow chỉ được dùng trong bảng, bullet, hoặc output CLI. Cấm trong văn xuôi.
ARROW = re.compile("\u2192")


def strip_code(text):
    """Bỏ khối code và đoạn backtick, thay bằng khoảng trắng để giữ số dòng."""
    def blank(m):
        return re.sub(r"[^\n]", " ", m.group(0))

    text = re.sub(r"```.*?```", blank, text, flags=re.S)
    text = re.sub(r"`[^`\n]*`", blank, text)
    return text


def is_structural(line):
    """Bảng, bullet, list đánh số, heading: arrow ở đây là ánh xạ, chấp nhận được."""
    s = line.strip()
    return (s.startswith(("|", "- ", "* ", "#"))
            or re.match(r"^\d+\.\s", s) is not None)


def files():
    for p in sorted(ROOT.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(ROOT).as_posix()
        if rel.startswith(".git/") or rel.startswith("node_modules/"):
            continue
        if p.suffix in EXTS or rel in EXTRA:
            yield p, rel


hits = 0
for path, rel in files():
    raw = path.read_text(encoding="utf-8", errors="replace")
    prose = strip_code(raw)
    is_md = path.suffix == ".md"
    rules = PUNCT + (PROSE if is_md else [])
    for n, line in enumerate(prose.splitlines(), 1):
        for name, pat, fix in rules:
            if pat.search(line):
                print(f"{rel}:{n}: {name} -- {fix}")
                hits += 1
        if is_md and ARROW.search(line) and not is_structural(line):
            print(f"{rel}:{n}: arrow-in-prose -- Chỉ dùng trong bảng, bullet, output CLI.")
            hits += 1

print()
if hits:
    print(f"{hits} ca cần sửa")
    sys.exit(1)
print("Không có ca nào")
