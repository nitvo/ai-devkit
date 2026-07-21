#!/usr/bin/env python3
"""Compare every English file with its translation under docs/vi/.

docs/vi/ is a local reading copy that is not published, so this script exits
quietly when the directory is absent.

Prose is never compared, since the two languages differ by design. What is
compared is everything that must not change with language:

  documents  backtick tokens and heading counts
  code       the executable text, with comments and string literals removed

The code rule matters most. A translation may reword any comment or message,
but if the logic differs the two files would behave differently while looking
equivalent, so that fails the build.

Run: python3 scripts/check-mirrors.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VI = ROOT / "docs" / "vi"

DOC_SUFFIX = {".md"}
# Letters that only Vietnamese uses. A range plus re.I would also match ASCII
# "i" and "s", because case folding maps them onto characters inside the range.
VIETNAMESE = re.compile("[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệ"
                        "ìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ"
                        "ĂÂĐÊÔƠƯÀÁẢÃẠẰẮẲẴẶẦẤẨẪẬÈÉẺẼẸỀẾỂỄỆ"
                        "ÌÍỈĨỊÒÓỎÕỌỒỐỔỖỘỜỚỞỠỢÙÚỦŨỤỪỨỬỮỰỲÝỶỸỴ]")
SKIP = {"LICENSE", "package.json", ".gitignore"}


def pairs():
    """Every file under docs/vi/ paired with the source file it mirrors."""
    for vi_path in sorted(VI.rglob("*")):
        if not vi_path.is_file():
            continue
        rel = vi_path.relative_to(VI).as_posix()
        yield ROOT / rel, vi_path, rel


def strip_banner(text):
    """Drop the leading blockquote, which is the translation banner."""
    return "\n".join(l for l in text.splitlines() if not l.startswith(">"))


def doc_tokens(text):
    """Backtick tokens, ignoring fenced code blocks."""
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return sorted(re.findall(r"`([^`\n]+)`", text))


def doc_headings(text):
    return [l.split(" ", 1)[0] for l in text.splitlines() if l.startswith("#")]


def code_skeleton(text, suffix):
    """The executable text, with comments and string literals blanked out."""
    if suffix == ".py":
        text = re.sub(r'""".*?"""', '""', text, flags=re.S)
        text = re.sub(r"#[^\n]*", "", text)
    elif suffix in {".mjs", ".js"}:
        text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
        text = re.sub(r"//[^\n]*", "", text)
    else:
        text = re.sub(r"(?m)(^|\s)#[^\n]*", " ", text)

    text = re.sub(r'"(?:[^"\\\n]|\\.)*"', '""', text)
    text = re.sub(r"'(?:[^'\\\n]|\\.)*'", "''", text)
    text = re.sub(r"`(?:[^`\\]|\\.)*`", "``", text, flags=re.S)

    return re.sub(r"\s+", " ", text).strip()


if not VI.is_dir():
    print("No docs/vi directory, so there is nothing to compare.")
    sys.exit(0)

failed = 0
checked = 0
for en_path, vi_path, rel in pairs():
    if rel in SKIP:
        continue
    if not en_path.exists():
        print(f"FAIL  {rel}: no English source for this translation")
        failed = 1
        continue

    en_raw = en_path.read_text(encoding="utf-8")
    vi_raw = strip_banner(vi_path.read_text(encoding="utf-8"))
    checked += 1

    if not VIETNAMESE.search(vi_raw):
        print(f"FAIL  {rel}: the translation holds no Vietnamese, so it was never translated")
        failed = 1
        continue

    if en_path.suffix in DOC_SUFFIX:
        problems = []
        en_t = doc_tokens(strip_banner(en_raw))
        vi_t = doc_tokens(vi_raw)
        only_en = sorted(set(en_t) - set(vi_t))
        only_vi = sorted(set(vi_t) - set(en_t))
        if only_en:
            problems.append(f"only in EN: {', '.join(only_en)}")
        if only_vi:
            problems.append(f"only in VI: {', '.join(only_vi)}")
        en_h = doc_headings(strip_banner(en_raw))
        vi_h = doc_headings(vi_raw)
        if len(en_h) != len(vi_h):
            problems.append(f"heading count differs: EN={len(en_h)} VI={len(vi_h)}")
        if problems:
            failed = 1
            print(f"FAIL  {rel}")
            for p in problems:
                print(f"        {p}")
        else:
            print(f"ok    {rel}  ({len(en_t)} tokens, {len(en_h)} headings)")
    else:
        a = code_skeleton(en_raw, en_path.suffix)
        b = code_skeleton(vi_raw, en_path.suffix)
        if a != b:
            failed = 1
            print(f"FAIL  {rel}: code differs once comments and strings are removed")
            for i in range(min(len(a), len(b))):
                if a[i] != b[i]:
                    print(f"        first difference at character {i}")
                    print(f"        EN: ...{a[max(0, i - 40):i + 40]}...")
                    print(f"        VI: ...{b[max(0, i - 40):i + 40]}...")
                    break
        else:
            print(f"ok    {rel}  (code identical, {len(a)} chars compared)")

print()
if failed:
    print("Mirrors are out of step")
    sys.exit(1)
print(f"All {checked} mirrors in step")
