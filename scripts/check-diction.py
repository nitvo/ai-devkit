#!/usr/bin/env python3
"""Catch AI writing tells in documentation and code.

Only prose is inspected. Fenced blocks and backtick spans are stripped, so a
rule that quotes a banned character inside backticks does not flag itself.

Run: python3 scripts/check-diction.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXTS = {".md", ".mjs", ".yml", ".sh", ".py"}
EXTRA = {"hooks/commit-msg"}

# Unicode punctuation: wrong everywhere, including inside code.
PUNCT = [
    ("em-dash", re.compile("\u2014"), "Split into two sentences, or use a colon."),
    ("en-dash", re.compile("\u2013"), "Use an ASCII hyphen."),
    ("ellipsis", re.compile("\u2026"), "Use three ASCII dots, or drop it."),
]

# Prose only (.md). In code, a semicolon is syntax.
PROSE = [
    ("semicolon", re.compile(r"[a-z]; [a-z]"), "Split into two sentences."),
    ("not-only", re.compile(r"\bnot (only|just)\b", re.I), "State the point directly."),
]

# Arrows belong in tables, lists and CLI output. Not in prose.
ARROW = re.compile("\u2192")


def strip_code(text):
    """Blank out fenced blocks and backtick spans, keeping line numbers."""
    def blank(m):
        return re.sub(r"[^\n]", " ", m.group(0))

    text = re.sub(r"```.*?```", blank, text, flags=re.S)
    text = re.sub(r"`[^`\n]*`", blank, text)
    return text


def is_structural(line):
    """Tables, lists and headings: an arrow there is a mapping, which is fine."""
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
            print(f"{rel}:{n}: arrow-in-prose -- Use only in tables, lists and CLI output.")
            hits += 1

print()
if hits:
    print(f"{hits} issues to fix")
    sys.exit(1)
print("No issues")
