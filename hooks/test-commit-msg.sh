#!/bin/sh
# Self-test cho hooks/commit-msg. Chạy: sh hooks/test-commit-msg.sh
# CI chạy file này để hook không bị sửa hỏng mà không ai biết.

HOOK="$(dirname "$0")/commit-msg"
TMP=$(mktemp)
PASS=0
FAIL=0

check() { # $1 = pass|block  $2 = nhãn  $3 = message
  printf '%s\n' "$3" > "$TMP"
  if sh "$HOOK" "$TMP" >/dev/null 2>&1; then got=pass; else got=block; fi
  if [ "$got" = "$1" ]; then
    PASS=$((PASS + 1))
    printf '  ok    %-42s [%s]\n' "$2" "$got"
  else
    FAIL=$((FAIL + 1))
    printf '  FAIL  %-42s [got %s, want %s]\n' "$2" "$got" "$1"
  fi
}

# Dựng chuỗi đúng 72 và 73 ký tự, toàn chữ thường.
P='feat(skills): '
LEN72="$P$(printf 'a%.0s' $(seq 1 $((72 - ${#P}))))"
LEN73="$P$(printf 'a%.0s' $(seq 1 $((73 - ${#P}))))"

echo "Hợp lệ:"
check pass  "có scope, thường"          "feat(setup): add cross-platform bootstrap"
check pass  "breaking change"           "feat(api)!: drop legacy endpoint"
check pass  "scope có dấu gạch"         "refactor(commit-convention): clarify rules"
check pass  "đúng 72 ký tự"             "$LEN72"

echo "Bỏ qua (không phải commit thường):"
check pass  "merge"                     "Merge branch 'feature/x' into main"
check pass  "revert"                    "Revert \"feat(a): b\""
check pass  "fixup"                     "fixup! feat(a): b"
check pass  "squash"                    "squash! feat(a): b"

echo "Phải chặn:"
check block "không có type"             "update stuff"
check block "type không hợp lệ"         "feature: add x"
check block "thiếu scope"               "feat: add something"
check block "thiếu dấu cách sau dấu :"  "feat(setup):missing space"
check block "chữ hoa trong mô tả"       "feat(setup): add GitHub CLI"
check block "viết hoa chữ đầu"          "feat(setup): Add something"
check block "73 ký tự"                  "$LEN73"
check block "scope viết hoa"            "feat(Setup): add something"
check block "mô tả rỗng"                "feat(setup): "

rm -f "$TMP"
echo
echo "Kết quả: $PASS đạt, $FAIL hỏng"
[ "$FAIL" -eq 0 ] || exit 1
