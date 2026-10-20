#!/usr/bin/env bash
# PreToolUse(Bash) 훅: AS-IS Java·색인·TOBE 소스를 cat/sed/head/tail/less/more/awk(와 grep 문맥 출력)로 직접 읽으면 막고 yunhee를 쓰게 한다.
# 2026-10-20 (수정사항 039 #5): 명령 위치만 검사하며 heredoc 본문, 따옴표 안 문자열, echo, -m 인자는 검사에서 완전 제외.

read -r -d '' PY_GUARD << 'EOF'
import sys, json, re

def strip_heredocs(cmd: str) -> str:
    lines = cmd.splitlines(keepends=True)
    out_lines = []
    in_heredoc = False
    delimiter = None
    hd_start_re = re.compile(r"<<-?[ \t]*['\"]?([A-Za-z0-9_]+)['\"]?")
    for l in lines:
        if in_heredoc:
            if l.strip() == delimiter:
                in_heredoc = False
                out_lines.append("\n")
            continue
        m = hd_start_re.search(l)
        if m:
            in_heredoc = True
            delimiter = m.group(1)
            out_lines.append(l)
        else:
            out_lines.append(l)
    return "".join(out_lines)

def mask_string_literals(text: str) -> str:
    chars = list(text)
    in_q = None
    escape = False
    for i, c in enumerate(chars):
        if escape:
            escape = False
            chars[i] = " "
            continue
        if in_q:
            if c == "\\":
                escape = True
                chars[i] = " "
            elif c == in_q:
                in_q = None
            else:
                chars[i] = " "
        elif c in ("'", '"'):
            in_q = c
    return "".join(chars)

def split_shell_commands(cmd: str) -> list[tuple[str, bool, str]]:
    clean = strip_heredocs(cmd)
    masked = mask_string_literals(clean)
    sep_pattern = re.compile(r"(\n|;|&&|\|\||\|)")
    splits = []
    last_idx = 0
    is_pipe = False
    for m in sep_pattern.finditer(masked):
        start, end = m.span()
        splits.append((clean[last_idx:start].strip(), is_pipe, masked[last_idx:start].strip()))
        is_pipe = (m.group(1) == "|")
        last_idx = end
    if last_idx < len(clean):
        splits.append((clean[last_idx:].strip(), is_pipe, masked[last_idx:].strip()))
    return [(r, p, m) for r, p, m in splits if r]

PROT_PATHS_RE = re.compile(
    r"(oms-data/src|backend/src/main/java|backend/src/main/resources/mapper|backend/src/test/java|frontend/src|docs/as-is/|docs/[0-9]+-)"
)
PSQL_RE = re.compile(
    r"(^|[;&|(`]\s*|&&\s*)(sudo\s+([^;&|]*\s)?)?(psql|pg_dump|pg_restore)(\s|$)|(docker|podman)\s+(compose\s+)?exec\s[^;&|]*\s(psql|pg_dump)(\s|$)"
)

def inspect_command(cmd: str) -> tuple[bool, str, str]:
    if not cmd or not cmd.strip():
        return False, "", ""

    clean_no_hd = strip_heredocs(cmd)
    masked_for_psql = mask_string_literals(clean_no_hd)
    check_psql = re.sub(r"yunhee\s+(run\s+.*|[^;&|]*)", "", masked_for_psql)
    check_psql = re.sub(r"\b(echo|printf|curl)\b[^;&|\n]*", "", check_psql)
    check_psql = re.sub(r"\bgit\s+commit\b[^;&|\n]*", "", check_psql)

    if PSQL_RE.search(check_psql):
        m = PSQL_RE.search(check_psql)
        return True, m.group(0).strip(), (
            "psql 직접 실행은 비밀번호 대기로 멈춘다(터미널 없음). 읽기 쿼리는 yunhee를 쓴다(05 §7):\n"
            "- 조회·행 수·중복: yunhee sql \"<SELECT>\" [-n 행수] [--timeout 초]  (읽기 전용 강제, 기본 5행, 결과는 마크다운 표)\n"
            "- 쓰기 SQL 시험: yunhee sql -f x.sql --rollback  (항상 ROLLBACK)\n"
            "- 테이블 구조: yunhee table <이름>  /  스키마 문서: yunhee dbml\n"
            "- 파일로 받기(예: menus.tsv): yunhee sql … -n 2000 → 표를 변환.\n"
            "DDL·DML을 실제로 실행해야 하면 사용자에게 `! psql …`로 직접 실행해 달라고 요청한다."
        )

    read_reason = (
        "AS-IS 원본·색인과 TOBE 소스를 cat/sed/head/tail/awk나 grep 문맥 출력(-A/-B/-C)으로 직접 읽지 않는다(05 §7, 사용자 지시 2026-10-12). 대신:\n"
        "- AS-IS: yunhee analysis screen <화면> --class <클래스> --section …, analysis method <클래스>.<메서드> [-o code], analysis grid <클래스>, analysis sql <ns.id>, yunhee table <테이블>\n"
        "- TOBE: yunhee outline <파일…> 또는 yunhee analysis tobe <파일> → 필요한 줄만 Read(offset/limit)\n"
        "- 메뉴 찾기(docs/as-is/**/menus.md·menus.tsv)의 grep은 된다\n"
        "yunhee로 정말 안 되면 작업기록에 사유를 쓰지 말고 yunhee 수정사항으로 제안할 것."
    )

    for seg_raw, is_pipe, seg_mask in split_shell_commands(cmd):
        if re.match(r"^yunhee\b", seg_mask) or re.match(r"^(echo|printf|python3?|bash|sh|node)\b", seg_mask):
            continue
        if re.search(r"\bcat\b.*?(>|>>)", seg_mask) or re.search(r"\bcat\s*(>|>>)", seg_mask):
            continue
        if re.search(r"\bsed\b.*(-i|--in-place)", seg_mask):
            continue

        m_tool = re.match(r"^(sudo\s+)?(cat|sed|head|tail|less|more|awk|bat|grep|rg)\b", seg_mask)
        if not m_tool:
            continue
        tool = m_tool.group(2)

        if is_pipe and not PROT_PATHS_RE.search(seg_raw):
            continue

        if PROT_PATHS_RE.search(seg_raw):
            if "menus.md" in seg_raw or "menus.tsv" in seg_raw:
                cleaned = re.sub(r"[^ \t]*menus\.(md|tsv)", "", seg_raw)
                if not PROT_PATHS_RE.search(cleaned):
                    continue
            if tool in ("grep", "rg"):
                has_ctx = bool(re.search(r"(-[a-zA-Z]*[ABC][0-9]*|--(after|before)?-?context)", seg_mask))
                is_idx_screen = "docs/as-is/" in seg_raw
                if has_ctx or is_idx_screen:
                    return True, seg_raw.splitlines()[0][:80], read_reason
                continue
            return True, seg_raw.splitlines()[0][:80], read_reason

    return False, "", ""

try:
    data = json.loads(sys.stdin.read())
except Exception:
    sys.exit(0)

cmd = (data.get("tool_input") or {}).get("command", "")
blocked, trigger, reason = inspect_command(cmd)
if blocked:
    msg = f"[차단 원인: {trigger}] {reason}" if trigger else reason
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": msg,
        }
    }, ensure_ascii=False))
sys.exit(0)
EOF

python3 -c "$PY_GUARD"
