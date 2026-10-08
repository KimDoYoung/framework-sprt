#!/usr/bin/env bash
# yunhee 수정사항 018(`yunhee analysis`, MyBatis 펼치기 통합, 작은 것 C-1~C-5) 검증.
# 문서: ~/work/yunhee-cli/docs/수정사항018.md  절차: docs/work/yunhee-018-검증.md
#
# 사용 (AssetERP_1 폴더에서, Tomcat 배포본이 떠 있어야 함 — 기대값을 TOBE API로 다시 센다):
#   tools/yunhee-018-check.sh                 # 전체 (C-3 gradle test 포함, 약 1분)
#   tools/yunhee-018-check.sh A-2 B           # 고른 절만 (A-0 A-1 … A-9 B C-1 … C-5)
#   tools/yunhee-018-check.sh --reindex A-3   # A-3·A-9: index-src를 다시 돌린 뒤 확인(색인 md를 다시 씀, git-ignored)
# 결과: 항목마다 ✅/❌ 한 줄 + 끝에 합계. 각 명령의 원문 출력은 $LOG 폴더에 남는다(❌만 열어 본다).
# 데이터를 바꾸지 않는다(조회·EXPLAIN·롤백 테스트만).
set -uo pipefail
cd "$(dirname "$0")/.."            # AssetERP_1
SRC=${SRC:-$HOME/oms-data/src/Asset-ERP}
IDX=docs/as-is/src
LOG=${LOG:-.yunhee/018-check}
mkdir -p "$LOG"; LOG=$(cd "$LOG" && pwd)
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

if [ $REINDEX = 1 ]; then
  echo "… index-src 다시 실행"; (cd .. && yunhee index-src "$SRC" -t AssetERP_1/docs/as-is/src >"$LOG/00-index-src.txt" 2>&1) || echo "❌ index-src 실패 ($LOG/00-index-src.txt)"
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
  chk "A-5 --list 26개 82·176·18" 0 "yunhee analysis screen Emp00_Tab_TransInfo $COMMON --list" "82" "176" "18" "Emp03_TabPage_Trans"
  chk "A-5 Emp03_TabPage_Trans events E0~E12" 0 "yunhee analysis screen Emp00_Tab_TransInfo $COMMON --class Emp03_TabPage_Trans --section events" "\[E0\]" "\[E12\]" "!\[E13\]"
  chk "A-5 services --class Emp03_Edit_Person" 0 "yunhee analysis screen Emp00_Tab_TransInfo $COMMON --section services --class Emp03_Edit_Person" "emp\.Emp00_TransInfo\.update" "!emp\.Emp03_Trans\.update"
fi

# ── A-6 ui ──
if want A-6; then
  chk "A-6 단계 합계 14·45·2 / 6·18·1 / 62·113·15" 0 "yunhee analysis ui Emp00_Tab_TransInfo $COMMON --done Emp00_Tab_TransInfo,Emp03_Edit_Person,Emp01_TabPage_Person,Emp03_TabPage_Trans,Emp00_Current_TransInfoModel --later '2단계=Emp02_Lookup_HireDate,Emp03_Lookup_Grade,Emp02_TabPage_Others'" "14" "45" "62" "113" "82" "176"
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
  chk "C-4 frontend 실행이 AssetERP_1 runs에 보임" 0 "yunhee runs" "tsc" "frontend"
fi
if want C-5; then
  chk "C-5 outline 경로 여러 개" 0 "yunhee outline frontend/src/pages/sys/Sys05_Tab_UserRole.tsx frontend/src/pages/sys/Sys05_Page_UserRole.tsx" "Sys05_Tab_UserRole" "Sys05_Page_UserRole"
fi

echo "합계: ✅ $PASS / ❌ $FAIL (전체 $N) · 원문 $LOG"
[ $FAIL = 0 ]
