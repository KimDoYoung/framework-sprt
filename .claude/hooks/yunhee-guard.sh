#!/usr/bin/env bash
# PreToolUse(Bash) 훅: AS-IS Java·색인·TOBE 소스를 cat/sed/head/tail/less/more/awk(와 grep 문맥 출력)로 직접 읽으면 막고 yunhee를 쓰게 한다.
# 사용자 지시(2026-10-12, A05 뒤): "yunhee를 계속 수정하고 업그레이드 해 가는데, 그대가 사용하지 않으면 무슨 소용일까?"
# 보강(2026-10-12, C03 뒤): AS-IS 색인(docs/as-is)도 대상, grep -A/-B/-C(문맥 출력)도 막음. 색인 화면 파일은 grep도 막는다(menus는 허용).
# 쓰기(cat > / heredoc, sed -i)와 yunhee 명령 자체는 막지 않는다. 끄려면 /hooks 또는 .claude/settings.json에서 뺀다.
cmd=$(jq -r '.tool_input.command // empty')
[ -z "$cmd" ] && exit 0

# 대상 경로: AS-IS 원본·색인, TOBE 백엔드·매퍼·프론트 소스
# (cd 로 들어간 뒤 상대 경로, 변수에 담은 경로도 잡도록 디렉터리 이름만 본다)
src_re='(oms-data/src|backend/src/main/java|backend/src/main/resources/mapper|backend/src/test/java|frontend/src)(/|[[:space:];&|]|$)'
idx_re='docs/as-is/'

# yunhee 명령 구간은 지우고 본다 (yunhee run "…" 안의 경로는 통과, 그 앞뒤에 붙인 cat은 잡는다)
cmd=$(echo "$cmd" | sed -E 's/(^|[;&|(]\s*)yunhee\s+(run\s+("[^"]*"|'"'"'[^'"'"']*'"'"')|[^;&|]*)//g')

deny() {
  jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
  exit 0
}

reason='AS-IS 원본·색인과 TOBE 소스를 cat/sed/head/tail/awk나 grep 문맥 출력(-A/-B/-C)으로 직접 읽지 않는다(05 §7, 사용자 지시 2026-10-12). 대신:
- AS-IS: yunhee analysis screen <화면> --class <클래스> --section …, analysis method <클래스>.<메서드> [-o code], analysis grid <클래스>, analysis sql <ns.id>, yunhee table <테이블>
- TOBE: yunhee outline <파일…> 또는 yunhee analysis tobe <파일> → 필요한 줄만 Read(offset/limit)
- 메뉴 찾기(docs/as-is/**/menus.md·menus.tsv)의 grep은 된다
yunhee로 정말 안 되면 작업기록에 사유를 쓰지 말고 yunhee 수정사항으로 제안할 것.'

has_src=0; has_idx=0
echo "$cmd" | grep -Eq "$src_re" && has_src=1
# 색인 경로 중 menus.md·menus.tsv만 가리키면 색인 대상이 아니다
idx_paths=$(echo "$cmd" | grep -Eo "[^[:space:];&|'\"]*${idx_re}[^[:space:];&|'\"]*")
if [ -n "$idx_paths" ] && echo "$idx_paths" | grep -Evq '/menus\.(md|tsv)$'; then has_idx=1; fi
[ $has_src = 0 ] && [ $has_idx = 0 ] && exit 0

# grep 문맥 출력(-A/-B/-C, --context 등)은 줄 범위 읽기와 같다 — 파일을 여는 grep(파이프 앞)만
first_grep=$(echo "$cmd" | sed -E 's/\|\s*grep\b[^|;&]*//g')
if echo "$first_grep" | grep -Eq '(^|[;&(`]\s*|\s)(grep|rg)\s([^|;&]*\s)?(-[a-zA-Z]*[ABC][0-9]*|--(after|before)?-?context)'; then
  deny "$reason"
fi
# 색인 화면·SQL·서비스 파일은 grep으로도 열지 않는다(analysis가 절을 뽑아 준다)
if [ $has_idx = 1 ] && echo "$first_grep" | grep -Eq '(^|[;&(`]\s*|\s)(grep|rg)\s'; then
  deny "$reason"
fi

# 읽기 도구가 파일을 직접 여는 경우만 막는다. 파이프 뒤(git diff … | head)는 출력 자르기라 통과
echo "$cmd" | grep -Eq '(^|[;&(`]\s*|&&\s*|\s)(cat|sed|head|tail|less|more|awk|bat)\s' || exit 0
stripped=$(echo "$cmd" | sed -E 's/\|\s*(cat|sed|head|tail|less|more|awk|bat)\b[^|;&]*//g')
echo "$stripped" | grep -Eq '(^|[;&(`]\s*|\s)(cat|sed|head|tail|less|more|awk|bat)\s' || exit 0
# 쓰기는 통과: cat > 파일, heredoc, sed -i
if echo "$cmd" | grep -Eq '(cat\s*>|<<|sed\s+(-[a-zA-Z]*i|--in-place))'; then
  echo "$cmd" | grep -Eq '(^|[;&|]\s*)(head|tail|less|more|awk|bat)\s' || exit 0
fi

deny "$reason"
