#!/usr/bin/env bash
# PreToolUse(Read) 훅: AS-IS 원본·색인과 TOBE 소스를 Read 도구로 통째로 읽으면 막는다(05 §7).
# 사용자 지시(2026-10-12, C03 뒤): Bash 훅만으로는 Read 통독이 걸리지 않았다 → Read에도 건다.
# 통과: limit을 준 읽기(outline으로 줄을 찾은 뒤), 작은 파일(80줄 이하), 메뉴 색인(menus.md·menus.tsv), 대상 밖 파일(문서·설정·스크립트).
input=$(cat)
path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
limit=$(echo "$input" | jq -r '.tool_input.limit // empty')
[ -z "$path" ] && exit 0
[ -n "$limit" ] && exit 0

echo "$path" | grep -Eq '(oms-data/src|backend/src/main/java|backend/src/main/resources/mapper|backend/src/test/java|frontend/src|docs/as-is)/' || exit 0
echo "$path" | grep -Eq '/menus\.(md|tsv)$' && exit 0
[ -f "$path" ] || exit 0
lines=$(wc -l < "$path")
[ "$lines" -le 80 ] && exit 0

reason="$(basename "$path")(${lines}줄)를 Read로 통째로 읽지 않는다(05 §7, 사용자 지시 2026-10-12). 대신:
- TOBE: yunhee outline <파일> 또는 yunhee analysis tobe <파일>로 줄 번호를 찾고 → Read(offset/limit)로 그 줄만
- AS-IS 원본·색인: yunhee analysis screen|method|grid|model|sql …
정말 전체가 필요하면 limit을 주어 범위를 밝힌다."
jq -n --arg r "$reason" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
exit 0
