#!/usr/bin/env bash
# check-environment: 이 PC(사무실 t3600 / 집 omen)가 AssetERP 개발·배포에 필요한 환경을 갖췄는지 점검한다. 읽기 전용(아무것도 고치지 않는다).
# 사용: ./tools/check-environment.sh [옵션]   (AssetERP 폴더 어디서든 됨)
#   (옵션 없음)      hostname(소문자)으로 기기를 판정해 전부 점검
#   --host <이름>    hostname 대신 이 기기로 판정 (omen | t3600)
#   -h, --help       이 도움말
# 점검: 1 기기·프로필(setenv.sh, application-<프로필>.properties의 IP)  2 Docker·DB·Tomcat  3 시뮬레이터 포트(0.0.0.0 바인딩, 컨테이너→호스트 연결 = ufw)
#       4 도구 버전(java 21·node·gradle·psql·yunhee)  5 AS-IS 소스·색인  6 개발 포트 사용 현황  7 외부 연결(ntfy.sh, 알림은 보내지 않음)
# 결과: 항목마다 ✅/⚠/❌ 한 줄, 끝에 "고칠 명령"(sudo 명령은 출력만 한다). ❌가 하나라도 있으면 종료코드 1.
# 기기를 새로 들이면 아래 HOSTS 표에 한 줄 추가하고 application-<프로필>.properties·/data/docker/<호스트>-tomcat/bin/setenv.sh 를 만든다.
set -uo pipefail

# ── 기기별 값 ───────────────────────────────────────────────
# hostname(소문자) → Spring 프로필. 컨테이너 이름은 <호스트>_postgres, <호스트>-tomcat 규칙(db_dump_backup.sh와 같음)
declare -A HOSTS=( [omen]=omen [t3600]=t3600 )
DOCKER_NET="172.16.0.0/12"              # ufw 허용 대역 (docker 브리지 전체)
SIM_PORTS=(5151 5161 2525 5171)         # RD · 알림(talk·sms) · 알림 SMTP · 외부연동(AI·메일)
declare -A SIM_NAME=( [5151]="RD 시뮬레이터 (tools/run-rd-server.sh, RD_SIM_HOST=0.0.0.0)"
                      [5161]="알림 talk·sms (tools/run-notice-server.sh, NOTICE_SIM_HOST=0.0.0.0)"
                      [2525]="알림 SMTP (tools/run-notice-server.sh, NOTICE_SIM_HOST=0.0.0.0)"
                      [5171]="외부연동 AI·메일 (tools/run-ext-server.sh, EXT_SIM_HOST=0.0.0.0)" )
TOMCAT_PORT=8082                        # 호스트 → Tomcat 컨테이너
DEV_PORTS=(5173 8080 5432)              # Vite · bootRun · PostgreSQL
DATA_DIR="/home/kdy987/tmp/asseterp-data"   # compose 공유 볼륨 (asseterp.base.dir)
JAVA_MAJOR=21
# ────────────────────────────────────────────────────────────

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST_LC="$(hostname -s 2>/dev/null || hostname)"; HOST_LC="${HOST_LC,,}"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --host) [[ $# -ge 2 && -n "$2" ]] || { echo "[ERROR] --host 에는 이름이 필요합니다." >&2; exit 2; }
                HOST_LC="${2,,}"; shift ;;
        -h|--help) sed -n '2,10p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) echo "모르는 옵션: $1 (--help)" >&2; exit 2 ;;
    esac
    shift
done

OK=0; WARN=0; FAIL=0; FIXES=()
ok()   { echo "  ✅ $*"; OK=$((OK+1)); }
warn() { echo "  ⚠  $*"; WARN=$((WARN+1)); }
fail() { echo "  ❌ $*"; FAIL=$((FAIL+1)); }
fix()  { FIXES+=("$*"); }
section() { echo; echo "■ $*"; }
have() { command -v "$1" >/dev/null 2>&1; }
# properties 파일에서 키 값 (없으면 빈 값)
prop() { [[ -f "$1" ]] && sed -n "s/^$2=//p" "$1" | tail -1; }
# URL·값에서 호스트만
url_host() { local u="${1#*://}"; u="${u%%/*}"; echo "${u%%:*}"; }

# ── 1. 기기·프로필 ──────────────────────────────────────────
section "1. 기기·프로필"
PROFILE="${HOSTS[$HOST_LC]:-}"
if [[ -z "$PROFILE" ]]; then
    fail "hostname '$HOST_LC' 이(가) HOSTS 표(${!HOSTS[*]})에 없음 — 표에 추가하거나 --host 로 지정"
    echo; echo "기기를 모르면 나머지를 점검할 수 없어 끝냅니다."; exit 1
fi
ok "hostname $HOST_LC → 프로필 $PROFILE"

PG_CONTAINER="${HOST_LC}_postgres"
TOMCAT_CONTAINER="${HOST_LC}-tomcat"
SETENV="/data/docker/${HOST_LC}-tomcat/bin/setenv.sh"
PROPS="$ROOT/backend/src/main/resources/application-$PROFILE.properties"
LOCAL_IPS=" $(ip -4 -o addr show 2>/dev/null | awk '{sub(/\/.*/,"",$4); printf "%s ", $4}')"

if [[ -f "$SETENV" ]]; then
    active="$(sed -n 's/.*spring\.profiles\.active=\([A-Za-z0-9_,-]*\).*/\1/p' "$SETENV" | tail -1)"
    if [[ "$active" == "$PROFILE" ]]; then ok "setenv.sh spring.profiles.active=$active"
    else fail "setenv.sh spring.profiles.active='${active:-없음}' (기대 $PROFILE) — $SETENV"
         fix "$SETENV 에 export CATALINA_OPTS=\"\$CATALINA_OPTS -Dspring.profiles.active=$PROFILE\" 후 docker restart $TOMCAT_CONTAINER"; fi
else
    fail "setenv.sh 없음 — $SETENV"
    fix "$SETENV 생성 (export CATALINA_OPTS=\"\$CATALINA_OPTS -Dspring.profiles.active=$PROFILE\")"
fi

SIM_HOST=""
if [[ -f "$PROPS" ]]; then
    ok "application-$PROFILE.properties 있음"
    for key in asseterp.rd.url asseterp.notice.talk-url asseterp.notice.sms-url asseterp.notice.mail-host asseterp.bot.url asseterp.assetmail.base-url; do
        val="$(prop "$PROPS" "$key")"
        if [[ -z "$val" ]]; then warn "$key 값 없음 (application.properties 기본값 사용)"; continue; fi
        h="$(url_host "$val")"; [[ -z "$SIM_HOST" ]] && SIM_HOST="$h"
        if [[ "$LOCAL_IPS" == *" $h "* ]]; then ok "$key → $h (이 PC IP)"
        else fail "$key → $h 이(가) 이 PC IP(${LOCAL_IPS# }) 가 아님"
             fix "backend/src/main/resources/application-$PROFILE.properties 의 시뮬레이터 호스트를 이 PC IP로 고치고 재배포 (./deploy.sh)"; fi
    done
    grep -q "TODO" "$PROPS" && warn "application-$PROFILE.properties 에 TODO 남음: $(grep -m1 -o 'TODO.*' "$PROPS")"
else
    fail "application-$PROFILE.properties 없음 — $PROPS"
fi

# ── 2. Docker·DB·Tomcat ─────────────────────────────────────
section "2. Docker·DB·Tomcat"
DOCKER_OK=0
if ! have docker; then fail "docker 명령 없음"
elif ! docker info >/dev/null 2>&1; then fail "docker 데몬에 접속 못 함"; fix "sudo systemctl start docker  (또는 사용자를 docker 그룹에)"
else
    DOCKER_OK=1; ok "docker 데몬 동작"
    for c in "$PG_CONTAINER" "$TOMCAT_CONTAINER"; do
        st="$(docker inspect -f '{{.State.Status}}' "$c" 2>/dev/null || echo 없음)"
        if [[ "$st" == running ]]; then ok "컨테이너 $c running"
        else fail "컨테이너 $c $st"; fix "cd /data/docker && docker compose up -d $c"; fi
    done
fi
if have pg_isready; then
    if pg_isready -h localhost -p 5432 -d asseterpdb -t 3 >/dev/null 2>&1; then ok "PostgreSQL localhost:5432 접속 가능"
    else fail "PostgreSQL localhost:5432 응답 없음"; fi
else warn "pg_isready 없음 — DB 접속 점검 건너뜀"; fi
if have yunhee; then
    if yunhee sql "select 1" >/dev/null 2>&1; then ok "yunhee sql → asseterpdb 조회 가능 (YUNHEE_DB)"
    else fail "yunhee sql 실패 — .env.yunhee 의 YUNHEE_DB 확인 (yunhee config)"; fi
fi
if have curl; then
    code="$(curl -s -o /dev/null -m 5 -w '%{http_code}' "http://localhost:$TOMCAT_PORT/AssetERP/" || true)"
    if [[ "$code" =~ ^[23] ]]; then ok "Tomcat http://localhost:$TOMCAT_PORT/AssetERP/ → $code"
    else warn "Tomcat http://localhost:$TOMCAT_PORT/AssetERP/ → ${code:-응답 없음} (배포 전이면 정상)"; fi
fi
if [[ -d "$DATA_DIR" && -w "$DATA_DIR" ]]; then ok "공유 볼륨 $DATA_DIR 쓰기 가능"
else fail "공유 볼륨 $DATA_DIR 없음 또는 쓰기 불가"; fix "mkdir -p $DATA_DIR"; fi

# ── 3. 시뮬레이터 포트·방화벽 ───────────────────────────────
section "3. 시뮬레이터 포트 (컨테이너 → 호스트 ${SIM_HOST:-?})"
LISTEN="$(ss -ltnH 2>/dev/null | awk '{print $4}')"
CAN_PROBE=0
if (( DOCKER_OK )) && [[ -n "$SIM_HOST" ]] && docker exec "$TOMCAT_CONTAINER" bash -c 'exit 0' >/dev/null 2>&1; then CAN_PROBE=1; fi
for p in "${SIM_PORTS[@]}"; do
    name="${SIM_NAME[$p]}"
    addr="$(grep -E "[:.]$p\$" <<<"$LISTEN" | head -1)"
    if [[ -z "$addr" ]]; then warn "$p 꺼짐 — $name"; continue; fi
    case "$addr" in
        127.0.0.1:*|\[::1\]:*) fail "$p 가 $addr 에만 바인딩 — 컨테이너에서 못 닿음. $name"
                               fix "$p: 시뮬레이터를 *_SIM_HOST=0.0.0.0 으로 다시 켠다 — $name"; continue ;;
    esac
    if (( ! CAN_PROBE )); then ok "$p 열림 ($addr) — 컨테이너 연결은 점검 못 함"; continue; fi
    if docker exec "$TOMCAT_CONTAINER" timeout 3 bash -c "</dev/tcp/$SIM_HOST/$p" >/dev/null 2>&1; then
        ok "$p 열림 ($addr), $TOMCAT_CONTAINER → $SIM_HOST:$p 연결 OK"
    else
        fail "$p 열림 ($addr) 이지만 $TOMCAT_CONTAINER → $SIM_HOST:$p 연결 실패 (방화벽 의심)"
        fix "sudo ufw allow from $DOCKER_NET to any port $p proto tcp"
    fi
done
if sudo -n true 2>/dev/null && have ufw; then
    echo "  · ufw 규칙 ($DOCKER_NET):"; sudo -n ufw status | grep -F "${DOCKER_NET%%/*}" | sed 's/^/      /'
else
    echo "  · ufw 규칙 직접 보기: sudo ufw status | grep ${DOCKER_NET%%.*}  (이 스크립트는 sudo를 쓰지 않음)"
fi

# ── 4. 도구 ─────────────────────────────────────────────────
section "4. 도구"
if have java; then
    jv="$(java -version 2>&1 | head -1 | sed -n 's/.*version "\([0-9]*\).*/\1/p')"
    if [[ "$jv" == "$JAVA_MAJOR" ]]; then ok "java $jv"; else fail "java ${jv:-?} (기대 $JAVA_MAJOR)"; fi
else fail "java 없음"; fi
for t in node npm gradle psql yunhee git; do
    if have "$t"; then
        v="$("$t" --version 2>/dev/null | grep -m1 -oE '[0-9]+\.[0-9]+(\.[0-9]+)?')"
        ok "$t ${v:-?}"
    else fail "$t 없음"; fi
done
[[ -d "$ROOT/frontend/node_modules" ]] && ok "frontend/node_modules 있음" || { warn "frontend/node_modules 없음"; fix "cd $ROOT/frontend && npm ci"; }

# ── 5. AS-IS 소스·색인 ──────────────────────────────────────
section "5. AS-IS 소스·색인"
ASIS="$(yunhee config 2>/dev/null | sed -n 's/.*Source (ASIS)[^/]*\(\/[^ │]*\).*/\1/p' | head -1)"
ASIS="${ASIS:-$HOME/work/IDMS-IC}"
if [[ -d "$ASIS/.git" ]]; then
    ok "AS-IS 소스 $ASIS ($(git -C "$ASIS" rev-parse --abbrev-ref HEAD 2>/dev/null))"
    if timeout 10 git -C "$ASIS" ls-remote --exit-code origin HEAD >/dev/null 2>&1; then ok "AS-IS git 원격 접속 가능 (check-git.sh)"
    else warn "AS-IS git 원격 접속 실패 — check-git.sh 의 pull 이 안 됨"; fi
else fail "AS-IS 소스 없음 — $ASIS"; fi
for f in docs/as-is/src/menus.md docs/as-is/menus.tsv docs/as-is/db; do
    if [[ -e "$ROOT/$f" ]]; then
        age=$(( ( $(date +%s) - $(stat -c %Y "$ROOT/$f") ) / 86400 ))
        if (( age > 14 )); then warn "$f ${age}일 전 — ./check-git.sh 로 갱신"; else ok "$f (${age}일 전)"; fi
    else fail "$f 없음"; fix "AssetERP/CLAUDE.md '색인 다시 만들기' 실행"; fi
done

# ── 6. 개발 포트 ────────────────────────────────────────────
section "6. 개발 포트 사용 현황 (참고)"
for p in "${DEV_PORTS[@]}" "$TOMCAT_PORT"; do
    who="$(ss -ltnpH "sport = :$p" 2>/dev/null | sed -n 's/.*users:(("\([^"]*\)".*/\1/p' | head -1)"
    if grep -qE "[:.]$p\$" <<<"$LISTEN"; then echo "  · $p 사용 중${who:+ ($who)}"; else echo "  · $p 비어 있음"; fi
done

# ── 7. 외부 연결 ────────────────────────────────────────────
section "7. 외부 연결"
if have curl && curl -s -o /dev/null -m 5 -I https://ntfy.sh; then ok "ntfy.sh 접속 가능 (작업 완료 알림)"
else warn "ntfy.sh 접속 못 함 — 작업 완료 알림이 안 감"; fi

# ── 요약 ────────────────────────────────────────────────────
echo
echo "결과: ✅ $OK  ⚠ $WARN  ❌ $FAIL   (기기 $HOST_LC / 프로필 $PROFILE)"
if (( ${#FIXES[@]} )); then
    echo; echo "고칠 명령:"
    printf '%s\n' "${FIXES[@]}" | awk '!seen[$0]++' | sed 's/^/  /'
fi
(( FAIL == 0 ))
