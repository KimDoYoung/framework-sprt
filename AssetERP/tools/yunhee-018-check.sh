#!/usr/bin/env bash
# yunhee 수정사항 018(`yunhee analysis`, MyBatis 펼치기 통합, 작은 것 C-1~C-5) 검증.
# 문서: ~/work/yunhee-cli/docs/수정사항018.md  절차: docs/work/yunhee/yunhee-018-검증.md
#
# 사용 (AssetERP 폴더에서, Tomcat 배포본이 떠 있어야 함 — 기대값을 TOBE API로 다시 센다):
#   tools/yunhee-018-check.sh                 # 전체 (C-3 gradle test 포함, 약 1분)
#   tools/yunhee-018-check.sh A-2 B           # 고른 절만 (A-0 A-1 … A-9 B C-1 … C-5, 022 023 024, 027 028 029)
#   tools/yunhee-018-check.sh --reindex A-3   # A-3·A-9: 옛 원본 색인($IDX)을 다시 만든 뒤 확인
# A·B·C 절의 기대값은 옛 원본(~/oms-data/src/Asset-ERP, 2026-10-08 손 확인) 기준이다. 2026-10-13에 작업 색인이
# 새 원본(IDMS-IC)으로 바뀌어서, 이 절들은 옛 원본 전용 색인 .yunhee/018-old-index(git-ignored)를 쓴다 — 없으면 처음에 만든다(약 2분).
# 027~029 절은 작업 색인(새 원본)을 쓴다.
# 결과: 항목마다 ✅/❌ 한 줄 + 끝에 합계. 각 명령의 원문 출력은 $LOG 폴더에 남는다(❌만 열어 본다).
# 데이터를 바꾸지 않는다(조회·EXPLAIN·롤백 테스트만).
set -uo pipefail
cd "$(dirname "$0")/.."            # AssetERP
SRC=${SRC:-$HOME/oms-data/src/Asset-ERP}
IDX=${IDX:-.yunhee/018-old-index}   # 옛 원본 색인(작업 색인을 덮지 않음)
LOG=${LOG:-.yunhee/018-check}
mkdir -p "$LOG"; LOG=$(cd "$LOG" && pwd)
rm -f "$LOG"/[0-9][0-9]-*.txt   # 지난 실행의 원문(번호가 바뀌면 헷갈림)
REINDEX=0; SECTIONS=()
for a in "$@"; do [ "$a" = --reindex ] && REINDEX=1 || SECTIONS+=("$a"); done
want() { [ ${#SECTIONS[@]} -eq 0 ] && return 0; for s in "${SECTIONS[@]}"; do [ "$s" = "$1" ] && return 0; done; return 1; }

PASS=0; FAIL=0; N=0
# chk <이름> <기대 exit|-> <명령> <정규식…> : 명령 출력에 정규식이 모두 있어야 통과(grep -E). 정규식 앞에 !를 붙이면 "없어야 함"
chk() {
  local name=$1 want_rc=$2 cmd=$3; shift 3
  N=$((N+1)); local f="$LOG/$(printf %02d $N)-${name//[^A-Za-z0-9._-]/_}.txt"
  bash -c "$cmd" >"$f" 2>&1; local rc=$?
  local ok=1 why=""
  if [ "$want_rc" != - ] && [ "$rc" != "$want_rc" ]; then ok=0; why="exit $rc (기대 $want_rc)"; fi
  for p in "$@"; do
    if [[ $p == !* ]]; then grep -Eq -- "${p:1}" "$f" && { ok=0; why="$why / 있으면 안 됨: ${p:1}"; }
    else grep -Eq -- "$p" "$f" || { ok=0; why="$why / 없음: $p"; }; fi
  done
  if [ $ok = 1 ]; then PASS=$((PASS+1)); echo "✅ $name"; else FAIL=$((FAIL+1)); echo "❌ $name —${why} ($f)"; fi
}
rows() { yunhee api GET "$@" 2>/dev/null | sed -n 's/^Rows: //p'; }   # TOBE API 행 수(기대값)

echo "yunhee $(yunhee --version 2>/dev/null | awk '{print $2}') · src=$SRC · log=$LOG"
if ! yunhee analysis --help >/dev/null 2>&1; then
  echo "⚠ 'yunhee analysis'가 없다 — 018이 아직 반영되지 않았다(A·C 항목은 모두 ❌로 나온다)"
fi

# ── 기대값: 2026-10-08 손 확인 값. TOBE API가 같은 값을 주는지 먼저 본다(다르면 데이터가 바뀐 것 → 아래 기대값을 API 값으로) ──
E100=48 E000=66 E800=3 E900=15 EUR=8 EORG=24 EPER=52
if want B || want A-2; then
  for c in 100 000 800 900; do
    v=$(rows /api/v1/emp/trans-infos -p transCode=$c -p transDate=2026-10-08 -c kfstest); eval "e=\$E$c"
    [ -n "$v" ] && [ "$v" != "$e" ] && { echo "ℹ transCode=$c 기대값 $e → API $v로 바꿈(데이터 변경)"; eval "E$c=$v"; }
    [ -z "$v" ] && echo "⚠ API 응답 없음(Tomcat?) — 기대값 $e 그대로 씀"
  done
  v=$(rows /api/v1/sys/roles/28120/user-roles -c kfstest); [ -n "$v" ] && [ "$v" != "$EUR" ] && { echo "ℹ user-roles 28120: $EUR → $v"; EUR=$v; }
  v=$(rows /api/v1/org/org-infos -p baseDate=2026-10-08 -c kfstest); [ -n "$v" ] && [ "$v" != "$EORG" ] && { echo "ℹ org-infos: $EORG → $v"; EORG=$v; }
  v=$(rows /api/v1/emp/trans -c kfstest); [ -n "$v" ] && [ "$v" != "$EPER" ] && echo "ℹ 사원찾기 API(오늘 기준) $v — 018 기대값은 2026-10-08 기준 $EPER(다르면 날짜 차이일 수 있음)"
fi
COMMON="-s $SRC --src-index $IDX"
P100="--param companyId=28000 --param searchText=%% --param transDate=2026-10-08 --param isSeparateAddTitle=true"

if [ $REINDEX = 1 ] || [ ! -f "$IDX/_index.json" ]; then
  echo "… 옛 원본 색인 만들기 → $IDX"; mkdir -p "$IDX"; IDX_ABS=$(cd "$IDX" && pwd)
  (cd .. && yunhee index-src "$SRC" -t "$IDX_ABS" --menus AssetERP/docs/as-is/menus.tsv >"$LOG/00-index-src.txt" 2>&1) || echo "❌ index-src 실패 ($LOG/00-index-src.txt)"
fi

# ── A-0 공통 ──
if want A-0; then
  chk "A-0 --list에 유형 8개" - "yunhee analysis --list" method sql model grid screen ui tobe run
fi

# ── A-1 method ──
if want A-1; then
  chk "A-1 insertRow code 276-323" 0 "yunhee analysis method Emp03_TabPage_Trans.insertRow $COMMON -o code" "276" "323" "사원을 먼저 선택해주세요" "selectByOrgCodeId"
  chk "A-1 insertRow md 요약" 0 "yunhee analysis method Emp03_TabPage_Trans.insertRow $COMMON" "사원을 먼저 선택해주세요" "org\.Org00_OrgInfo\.selectByOrgCodeId" "E3"
  chk "A-1 서버 update 395-492" 0 "yunhee analysis method Emp00_TransInfo.update --server $COMMON" "395" "492" "getSeq" "emp02_others\.insert" "commit" "emp01_person" "emp03_trans" "100" "emp35_deduct\.insert" "sys09_code\.selectByCodeName" "emp36_add_deduct\.insert" "selectById"
  chk "A-1 retrieve 오버로드 2개 → Exit 2" 2 "yunhee analysis method Emp03_TabPage_Trans.retrieve $COMMON" "197" "202"
  chk "A-1 open 후보 3개 → Exit 2" 2 "yunhee analysis method Org00_Lookup_SelectSingle.open $COMMON" "71" "98" "103" "!77"
  chk "A-1 open#3 → 103-191" 0 "yunhee analysis method 'Org00_Lookup_SelectSingle.open#3' $COMMON -o code" "103" "191"
  chk "A-1 deleteConfirm: 로그인 사용자 ID로 겸직 조회" 0 "yunhee analysis method Emp01_TabPage_Person.deleteConfirm $COMMON" "Emp04_AddTitle\.selectByPersonId" "getUserId"
fi

# ── A-2 sql ──
if want A-2; then
  for c in 100 000 800 900; do eval "e=\$E$c"
    chk "A-2 selectByText transCode=$c --count = $e" 0 "yunhee analysis sql emp00_trans_info.selectByText $COMMON $P100 --param transCode=$c --count" "(^|[^0-9])$e([^0-9]|$)"
  done
  chk "A-2 emp03_trans.selectByText --count = $EPER" 0 "yunhee analysis sql emp03_trans.selectByText $COMMON --param companyId=28000 --param searchText=%% --param transDate=2026-10-08 --count" "(^|[^0-9])$EPER([^0-9]|$)"
  chk "A-2 sys05 selectByRoleId --count = $EUR" 0 "yunhee analysis sql sys05_user_role.selectByRoleId $COMMON --param roleId=28120 --count" "(^|[^0-9])$EUR([^0-9]|$)"
  chk "A-2 org00 selectByKorName --count = $EORG" 0 "yunhee analysis sql org00_org_info.selectByKorName $COMMON --param companyId=28000 --param korName=% --param baseDate=2026-10-08 --count" "(^|[^0-9])$EORG([^0-9]|$)"
  chk "A-2 -o sql은 yunhee sql -f로 실행된다" 0 "yunhee analysis sql emp00_trans_info.selectByText $COMMON $P100 --param transCode=100 -o sql > $LOG/a2.sql && yunhee sql -f $LOG/a2.sql --limit 1" "rows=" "!ERROR" "!include"
  chk "A-2 md: include 2·bind 3" 0 "yunhee analysis sql emp00_trans_info.selectByText $COMMON" "common\.emp00_trans_info" "1372" "common\.org00_org_info" "1511" "emp00CompanyId" "org00CompanyId" "emp00TransDateString" "isSeparateAddTitle" "orgCodeId"
  chk "A-2 값 없는 파라미터 경고" - "yunhee analysis sql emp00_trans_info.selectByText $COMMON --param companyId=28000 -o sql" "값 없음"
fi

# ── A-3 model ──
if want A-3; then
  chk "A-3 Sys05_UserRoleModel 권한조직 함정" 0 "yunhee analysis model Sys05_UserRoleModel $COMMON --sql sys05_user_role.selectByRoleId" "orgInfoModel\.parentFullName" "org00_parent_full_nm" "authOrgName" "sys05_auth_org_nm"
  chk "A-3 Emp00_TransInfoModel 중첩 경로" 0 "yunhee analysis model Emp00_TransInfoModel $COMMON" "empPersonModel\.korName" "emp01_kor_nm" "org00_parent_full_nm" "emp02_gender_nm"
  chk "A-3 Emp01_PersonModel 계산 getter" 0 "yunhee analysis model Emp01_PersonModel $COMMON" "thYear" "workYear" "계산"
  if [ $REINDEX = 1 ]; then
    chk "A-3 index-src Grid Spec ⚠DB없음 0 (Sys05_Tab_UserRole)" - "grep -c '⚠DB없음' $IDX/sys/screens/Sys05_Tab_UserRole.md" "^0$"
  else echo "ℹ A-3 Grid Spec ⚠DB없음 확인은 --reindex 때만"; fi
fi

# ── A-4 grid ──
if want A-4; then
  chk "A-4 Org00 열 index·숨김" 0 "yunhee analysis grid Org00_Lookup_SelectSingle $COMMON" "orgCode" "parentFullName" "korName" "117" "120" "SINGLE"
  chk "A-4 Emp00 addOfficer 렌더링" 0 "yunhee analysis grid Emp00_Tab_TransInfo $COMMON" "임원" "SingleGrid"
  chk "A-4 Emp03 Trans → CellEditGrid" 0 "yunhee analysis grid Emp03_TabPage_Trans $COMMON" "CellEditGrid" "gradeName"
fi

# ── A-5 screen ──
if want A-5; then
  # 0.3.1(026)부터 같은 도메인 연결 컴포넌트(Emp00_Lookup_SelectSingle·Emp01_Lookup_PersonModel)가 합계에 들어간다: 26개 82·176·18 → +9·+15·+2
  chk "A-5 --list 26개+연결 91·191·20" 0 "yunhee analysis screen Emp00_Tab_TransInfo $COMMON --list" "\*\*91\*\*" "\*\*191\*\*" "\*\*20\*\*" "Emp03_TabPage_Trans" "Emp00_Lookup_SelectSingle \(연결\)"
  chk "A-5 Emp03_TabPage_Trans events E0~E12" 0 "yunhee analysis screen Emp00_Tab_TransInfo $COMMON --class Emp03_TabPage_Trans --section events" "\[E0\]" "\[E12\]" "!\[E13\]"
  chk "A-5 services --class Emp03_Edit_Person" 0 "yunhee analysis screen Emp00_Tab_TransInfo $COMMON --section services --class Emp03_Edit_Person" "emp\.Emp00_TransInfo\.update" "!emp\.Emp03_Trans\.update"
fi

# ── A-6 ui ──
if want A-6; then
  chk "A-6 단계 합계 14·45·2 / 6·18·1 / 미착수 71·128·17(연결 포함)" 0 "yunhee analysis ui Emp00_Tab_TransInfo $COMMON --done Emp00_Tab_TransInfo,Emp03_Edit_Person,Emp01_TabPage_Person,Emp03_TabPage_Trans,Emp00_Current_TransInfoModel --later '2단계=Emp02_Lookup_HireDate,Emp03_Lookup_Grade,Emp02_TabPage_Others'" "이번 단계.*\| 14 \| 45 \| 2 \|" "2단계.*\| 6 \| 18 \| 1 \|" "미착수.*\| 71 \| 128 \| 17 \|" "\*\*91\*\* \| \*\*191\*\*"
  chk "A-6 Sys05 --tobe 5/5·10/10·2/2" 0 "yunhee analysis ui Sys05_Tab_UserRole $COMMON --tobe frontend/src/pages/sys" "1/1" "4/4" "7/7"
fi

# ── A-7 tobe ──
if want A-7; then
  chk "A-7 Sys01_Tab_Company 골격" 0 "yunhee analysis tobe frontend/src/pages/sys/Sys01_Tab_Company.tsx" "Splitter" "Tabs" "Sys01_Edit_Company" "E1"
  chk "A-7 useGridCrud 옵션·반환" 0 "yunhee analysis tobe frontend/src/hooks/useGridCrud.ts" "idField" "deleteConfirm" "onChanged" "saveRows" "deleteChecked" "hasChanges"
  chk "A-7 EmpTransInfoService 호출 순서" 0 "yunhee analysis tobe backend/src/main/java/kr/co/kfs/asseterp/biz/emp/service/EmpTransInfoService.java" "countEmpNo" "insertOthers" "insertDeduct" "이미 사용 중인 사원번호입니다"
fi

# ── A-8 run ──
if want A-8; then
  PW=${PW:-$(ls -d /tmp/claude-1000/*/*/scratchpad/pw/node_modules 2>/dev/null | head -1)}
  if [ -n "$PW" ]; then
    yunhee run "bash -c 'NODE_PATH=$PW node tools/screens/A03.js $LOG'" >/dev/null 2>&1
    chk "A-8 run last --json --keys" 0 "yunhee analysis run last --json --keys errs,msgs,roles" '"errs"' '사원을 선택해주세요' '"roles"' '!pickHeaders'
  else echo "ℹ A-8: playwright-core 폴더(PW=…/node_modules)를 못 찾아 건너뜀"; fi
fi

# ── A-9 _index.json ──
if want A-9; then
  chk "A-9 _index.json 있음" 0 "ls -la $IDX/_index.json" "_index.json"
  # /usr/bin/time이 없는 환경(CachyOS)이 있어 bash TIMEFORMAT으로 잰다
  chk "A-9 method 1초 이내" 0 "TIMEFORMAT='%R s'; time (yunhee analysis method Emp03_TabPage_Trans.insertRow $COMMON -o code >/dev/null)" "^0\.[0-9]+ s$"
fi

# ── B 펼치기 통합: compare·port-sql ──
if want B; then
  for c in 100 000 800 900; do eval "e=\$E$c"
    chk "B compare selectByText transCode=$c ($e)" 0 "yunhee compare GET /api/v1/emp/trans-infos -p transCode=$c -p transDate=2026-10-08 -c kfstest --sql emp00_trans_info.selectByText $P100 --param transCode=$c" "API rows=$e, SQL rows=$e" "!ERROR"
  done
  chk "B port-sql selectByText: 엉뚱한 조각 없음" - "yunhee port-sql emp00_trans_info.selectByText -s $SRC --package kr.co.kfs.asseterp.biz.emp.dto" "!LicenseRes" "!FROM emp08_license\s*$"
fi

# ── C 작은 것 ──
if want C-1; then
  chk "C-1 port-save emp03_trans: 없는 회사 컬럼 안 넣음" - "yunhee port-save emp03_trans -s $SRC --cols emp03_trans_date,emp03_trans_cd" "!emp03_company_id" "회사 컬럼"
  chk "C-1 --company-via 서브쿼리" - "yunhee port-save emp03_trans -s $SRC --cols emp03_trans_date,emp03_trans_cd --company-via emp01_person.emp01_person_id=emp03_person_id" "emp03_person_id IN \(SELECT emp01_person_id FROM emp01_person WHERE emp01_company_id"
fi
if want C-2; then
  chk "C-2 compare 그리드 = 하위 페이지" 0 "yunhee compare GET /api/v1/sys/roles/28120/user-roles -c kfstest --sql sys05_user_role.selectByRoleId --param roleId=28120" "API rows=$EUR, SQL rows=$EUR" "grid cols ✅" "!roleName"
fi
if want C-3; then
  chk "C-3 run gradle test 요약에 tests N" 0 "yunhee run \"bash -c 'cd backend && gradle test'\"" "tests [0-9]+ \(fail 0"
fi
if want C-4; then
  (cd frontend && yunhee run "npx tsc -b --noEmit" >/dev/null 2>&1)
  chk "C-4 frontend 실행이 AssetERP runs에 보임" 0 "yunhee runs" "tsc" "frontend"
fi
if want C-5; then
  chk "C-5 outline 경로 여러 개" 0 "yunhee outline frontend/src/pages/sys/Sys05_Tab_UserRole.tsx frontend/src/pages/sys/Sys05_Page_UserRole.tsx" "Sys05_Tab_UserRole" "Sys05_Page_UserRole"
fi

# ── 022 log 보정 검증 ──
if want 022 || want D; then
  FIX_LOG="$HOME/work/yunhee-cli/tests/fixtures/log"
  chk "022-1 빈 첫 줄" 0 "yunhee log errors --file $FIX_LOG/AssetERP-backend-error.log --tz UTC --from '2026-10-12 09:00'" "Using generated security password: \*\*\*\*" "!70ea24fd"
  chk "022-1 실서버" 0 "yunhee log errors --since 1h" "!list index"
  # 022-2·023-2는 지난 실서버 trace를 쓴다 — 로그 보관에서 빠지면(2026-10-15 확인: 두 trace 모두 gz에도 없음) 건너뛴다
  if [[ $(yunhee log trace b1e9fbe5f5f3021f --archived 2>&1) == *"로그에 없음"* ]]; then echo "ℹ 022-2: trace b1e9fbe5 로그 보관에서 빠짐 — 건너뜀"
  else chk "022-2 중복 제거" 0 "yunhee log trace b1e9fbe5f5f3021f --archived" "WARN/ERROR 1:"; fi

  F022="$LOG/022_tail.log"
  cat > "$F022" <<'EOF'
2026-10-08 06:35:20.100 [c1e9fbe500000001] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-10] DEBUG k.c.k.a.b.e.m.E.selectOthers - ==>  Preparing: SELECT 1
2026-10-08 06:35:20.105 [c1e9fbe500000001] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-10] WARN  k.c.k.a.c.e.GlobalExceptionHandler - 요청 처리 실패: status=405, Request method 'GET' is not supported
2026-10-08 06:35:20.106 [c1e9fbe500000001] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-10] INFO  kr.co.kfs.asseterp.access - GET /AssetERP_1/api/v1/emp/educations 405 6ms
2026-10-08 06:34:27.100 [afc00e8900000001] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-11] DEBUG k.c.k.a.b.e.m.E.selectCareers - ==>  Preparing: SELECT * FROM emp07_career WHERE person_id = ?
2026-10-08 06:34:27.103 [afc00e8900000001] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-11] DEBUG k.c.k.a.b.e.m.E.selectCareers - ==>  Preparing: SELECT * FROM emp07_career WHERE person_id = ?
2026-10-08 06:34:27.111 [afc00e8900000001] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-11] INFO  kr.co.kfs.asseterp.access - GET /AssetERP_1/api/v1/emp/persons/1/careers 200 11ms
EOF

  chk "022-3 level" 0 "yunhee log tail --file $F022 --level WARN" "educations" "!careers" "!200 "
  chk "022-4 grep" 0 "yunhee log tail --file $F022 --grep careers" "SQL 2"
  chk "022-5 tail 경고 표시" 0 "yunhee log tail --file $F022" "⚠WARN" "status=405"
  chk "022-6 archived" 0 "yunhee log trace --help" "archived"
  chk "022-7 trace ID" 2 "yunhee log trace xyz" "16진수"
fi

# ── 023 log --archived 마무리 검증 ──
if want 023 || want E; then
  if [[ $(yunhee log req GET /api/public/companies --archived --from '2026-10-08 16:30' --to '2026-10-08 16:45' 2>&1) == *"일치하는 요청 없음"* ]]; then echo "ℹ 023-1: 2026-10-08 로그가 보관에서 빠짐 — 건너뜀"
  else chk "023-1 archived 범위" 0 "yunhee log req GET /api/public/companies --archived --from '2026-10-08 16:30' --to '2026-10-08 16:45'" "abd1f652"; fi
  chk "023-1 안내" 0 "yunhee log req GET /api/public/companies --from '2026-10-08 16:30' --to '2026-10-08 16:45'" "그 전은 --archived"
  if [[ $(yunhee log trace abd1f6520f3647c6 --archived 2>&1) == *"로그에 없음"* ]]; then echo "ℹ 023-2: trace abd1f652 로그 보관에서 빠짐 — 건너뜀"
  else chk "023-2 archived 안내" 0 "yunhee log trace abd1f6520f3647c6 --archived" "--raw --archived" "2026-10-08"; fi
  chk "023-3 archived 없음 문구" 1 "yunhee log trace deadbeef00000000 --archived" "archived gz" "!지난 날은"
fi

# ── 024 log --since-run 시작 시각 보정 검증 ──
if want 024 || want F; then
  chk "024-1 since-run 시작" 0 "yunhee run \"bash -c 'yunhee api GET /api/v1/emp/persons/1/careers >/dev/null; sleep 3'\" >/dev/null 2>&1 && yunhee log tail --since-run last" "persons/1/careers"
  chk "024-1 runs 시각" 0 "yunhee runs -n 1 | awk -F'│' '/[0-9]{8}_[0-9]{6}/ {gsub(/[^0-9]/,\"\",\$2); gsub(/[^0-9]/,\"\",\$7); if (substr(\$2,9,6)==substr(\$7,9,6)) print \"time-matched\"}'" "time-matched"
fi

# ── 027~029 그리드 여럿·compare 그리드 선택·sql-check --old (0.3.2~0.3.4) ──
# 분석 명령은 새 원본 색인(docs/as-is/src)을 쓴다(-s 없음). OLD는 2026-10-13 전 원본.
OLD=${OLD:-$HOME/oms-data/src/Asset-ERP}
MAP=backend/src/main/resources/mapper
CMP_ROLES="yunhee compare GET /api/v1/sys/persons/29035/roles -c kfstest --sql sys04_role.selectByUserId --param userId=29035 --param companyId=28000"
if want 027 || want G; then
  chk "027-1 list 그리드 2" 0 "yunhee analysis screen Sys05_Tab_PersonRole --list" "\| Sys05_Tab_PersonRole \| [0-9]+ \| [0-9]+ \| [0-9]+ \| 2 \|"
  chk "027-1 ui 그리드 2/2" 0 "yunhee analysis ui Sys05_Tab_PersonRole --tobe frontend/src/pages/sys" "\| 2/2 \|$"
  chk "027-1 ui RoleAdmin 2/2" 0 "yunhee analysis ui Sys04_Tab_RoleAdmin --tobe frontend/src/pages/sys" "Sys04_Tab_RoleAdmin .*\| 2/2 \|$"
  chk "027-1 그리드 1 그대로" 0 "yunhee analysis screen Sys05_Tab_UserRole --list" "\| Sys05_Tab_UserRole \| [0-9]+ \| [0-9]+ \| [0-9]+ \| 1 \|"
  chk "027-1 트리 그리드 1" 0 "yunhee analysis screen Org01_Tab_OrgCode --list" "\| Org01_Tab_OrgCode \| [0-9]+ \| [0-9]+ \| [0-9]+ \| 1 \|"
  chk "027-2 grid 분리" 0 "yunhee analysis grid Sys05_Tab_PersonRole" "buildUserGrid\(\)" "buildRoleGrid\(\)" "!retireYn"
  chk "027-2 grid --method" 0 "yunhee analysis grid Sys05_Tab_PersonRole --method buildRoleGrid" "userRoleYn" "!orgKorName"
  chk "027-3 compare 그리드 선택" 0 "$CMP_ROLES --grid Sys05_Tab_PersonRole" "✅ \(Sys05_Tab_PersonRole#buildRoleGrid, 4컬럼\)"
  chk "027-3 없는 클래스 fallback 안 함" 0 "$CMP_ROLES --grid Nope_Class" "그리드 못 찾음: Nope_Class"
  chk "027-4 drift 같은 원본 바뀜 0" 0 "yunhee sql-check --old $OLD --new $OLD" "바뀜: 0개"
fi
if want 028 || want H; then
  chk "028-1 compare buildGridXxx 자동 선택" 0 "$CMP_ROLES --grid Sys04_Tab_RoleAdmin" "#buildGridRole, 6컬럼"
  chk "028-1 compare #메서드·#변수" 0 "$CMP_ROLES --grid 'Sys04_Tab_RoleAdmin#buildGridRole' && $CMP_ROLES --grid 'Sys04_Tab_RoleAdmin#gridRole'" "#buildGridRole" "!그리드 못 찾음"
  chk "028-1 Address↔Addr" 0 "yunhee compare GET /api/v1/emp/trans-infos -p transCode=100 -p separateAddTitle=false -c kfstest --sql emp00_trans_info.selectByText --param companyId=28000 --param searchText=%% --param transCode=100 --param transDate=2026-10-14 --param isSeparateAddTitle=false --grid 'Sys05_Tab_PersonRole#buildUserGrid'" "✅ \(Sys05_Tab_PersonRole#buildUserGrid, 8컬럼\)"
  # drift 출력은 한 번만 만들고(수십 초) 029에서도 쓴다
  chk "028-2 TOBE 영향 목록" 0 "yunhee sql-check --old $OLD --tobe $MAP --only-tobe | tee $LOG/drift-tobe.md" "바뀐 원본 SQL을 사용하는 TOBE statement" "!server \(미존재\)"
  chk "028-4 대소문자만 다른 것 빠짐" 0 "cat $LOG/drift-tobe.md" "!SysFileMapper\.deleteById" "!' false '" "!# \{"
  # 028-3: 매퍼 복사본에 (IDMS-IC) 표시를 달아 본다(저장소 파일은 안 바꿈)
  M2="$LOG/mapper-mark"; rm -rf "$M2"; cp -r $MAP "$M2"
  python3 - "$M2/EmpTransInfoMapper.xml" <<'EOF'
import sys, pathlib
p = pathlib.Path(sys.argv[1]); t = p.read_text()
a = '<!-- AS-IS selectByText L339 ('
if a in t: p.write_text(t.replace(a, '<!-- AS-IS selectByText L339 (IDMS-IC) (', 1))
EOF
  chk "028-3 반영 표시 statement 1개" 0 "yunhee sql-check --old $OLD --tobe $M2 --only-tobe" "반영 표시됨: 1개" "^- \`EmpTransInfoMapper\.searchTransInfos\`$" "EmpTransInfoMapper\.selectCurrentTransInfo\` ← "
fi
if want 029 || want I; then
  [ -s "$LOG/drift-tobe.md" ] || yunhee sql-check --old $OLD --tobe $MAP --only-tobe >"$LOG/drift-tobe.md" 2>&1
  chk "029-1 미존재 없음" 0 "cat $LOG/drift-tobe.md" "!미존재" "searchCompanies\` ← sys01_company\.selectByName"
  chk "029-2 test 식 원형" 0 "cat $LOG/drift-tobe.md" "extrAddTitleYn" "!extraddtitleyn"
  chk "029-3 diff 줄 450자 이하" 0 "awk '/^  / && length(\$0) > 450 {n++} END {print \"long=\" n+0}' $LOG/drift-tobe.md" "^long=0$"
  # 앞 statement 본문 안의 표시가 다음 statement로 번지지 않음
  M3="$LOG/mapper-body"; rm -rf "$M3"; cp -r $MAP "$M3"
  python3 - "$M3/EmpTransInfoMapper.xml" <<'EOF'
import sys, pathlib
p = pathlib.Path(sys.argv[1]); t = p.read_text()
i = t.index('<select id="searchTransInfos"'); j = t.index('</select>', i)
p.write_text(t[:j] + '    <!-- AS-IS foo (IDMS-IC) -->\n    ' + t[j:])
EOF
  chk "029-1 본문 안 표시 안 번짐" 0 "yunhee sql-check --old $OLD --tobe $M3 --only-tobe" "!반영 표시됨" "searchTransInfos\` ← emp00_trans_info\.selectByText"
fi

echo "합계: ✅ $PASS / ❌ $FAIL (전체 $N) · 원문 $LOG"
[ $FAIL = 0 ]

