#!/usr/bin/env bash
# yunhee-0.2.5 수정사항체크 — 수정사항 021(analysis ui·sql·method·events·layout, run 실패 메시지, 새 명령 yunhee log) 검증.
# 문서: ~/work/yunhee-cli/docs/수정사항021.md  절차: docs/work/yunhee-0.2.5-수정사항체크.md
#
# 사용 (AssetERP_1 폴더에서. B 절은 Tomcat 배포본(docker t3600-tomcat)이 떠 있어야 함):
#   tools/yunhee-0.2.5-check.sh                 # 전체 (약 1분)
#   tools/yunhee-0.2.5-check.sh A-3 B           # 고른 절만 (A-1 … A-7, B, C)
#   tools/yunhee-0.2.5-check.sh --reindex       # A-5 색인 확인 포함(index-src 다시 실행, 약 2~4분)
# 결과: 항목마다 ✅/❌ 한 줄 + 끝에 합계. 원문 출력은 $LOG 폴더(❌만 열어 본다).
# 데이터를 바꾸지 않는다(GET·정적 분석·임시 폴더 픽스처만). 회귀는 tools/yunhee-018-check.sh로 따로 본다(C-3).
set -uo pipefail
cd "$(dirname "$0")/.."            # AssetERP_1
SRC=${SRC:-$HOME/oms-data/src/Asset-ERP}
JAVA=$SRC/application/src/main/java/myApp
IDX=docs/as-is/src
LOG=${LOG:-.yunhee/0.2.5-check}
rm -rf "$LOG"; mkdir -p "$LOG"; LOG=$(cd "$LOG" && pwd)
FIX=$LOG/fixture; mkdir -p "$FIX"
REINDEX=0; SECTIONS=()
for a in "$@"; do [ "$a" = --reindex ] && REINDEX=1 || SECTIONS+=("$a"); done
want() { [ ${#SECTIONS[@]} -eq 0 ] && return 0; for s in "${SECTIONS[@]}"; do [ "$s" = "$1" ] || [ "$s" = "${1%%-*}" ] && return 0; done; return 1; }

PASS=0; FAIL=0; N=0; LASTF=
# chk <이름> <기대 exit|-> <명령> <정규식…> : 출력에 정규식이 모두 있어야 통과(grep -E). 앞에 !를 붙이면 "없어야 함"
chk() {
  local name=$1 want_rc=$2 cmd=$3; shift 3
  N=$((N+1)); local f="$LOG/$(printf %02d $N)-${name//[^A-Za-z0-9._-]/_}.txt"; LASTF=$f
  bash -c "$cmd" >"$f" 2>&1; local rc=$?
  local ok=1 why=""
  if [ "$want_rc" != - ] && [ "$rc" != "$want_rc" ]; then ok=0; why="exit $rc (기대 $want_rc)"; fi
  for p in "$@"; do
    if [[ $p == !* ]]; then grep -Eq -- "${p:1}" "$f" && { ok=0; why="$why / 있으면 안 됨: ${p:1}"; }
    else grep -Eq -- "$p" "$f" || { ok=0; why="$why / 없음: $p"; }; fi
  done
  if [ $ok = 1 ]; then PASS=$((PASS+1)); echo "✅ $name"; else FAIL=$((FAIL+1)); echo "❌ $name —${why} ($f)"; fi
}
COMMON="-s $SRC --src-index $IDX"
echo "yunhee $(yunhee --version 2>/dev/null | awk '{print $2}') · src=$SRC · log=$LOG"

# ── A-1 analysis ui: TOBE E-id 집합(범위·중복·생략) ──
if want A-1; then
  mkdir -p "$FIX/ui"
  cat > "$FIX/ui/Emp02_TabPage_Others.tsx" <<'EOF'
// [E0] 화면 열림
// [E4] 저장
// [E4] 저장 (같은 E-id 두 번째 주석)
// [E5]~[E9] 콤보 Collapse
{/* [E1]~[E3 생략] 사진 */}
EOF
  chk "A-1 ui 범위·중복·생략 (픽스처)" 0 "yunhee analysis ui Emp00_Tab_TransInfo --tobe $FIX/ui" "\| Emp02_TabPage_Others \| 1/0 \| 10/7 \(생략 3\) \| 0/0 \|"
  chk "A-1 ui 실제 폴더" 0 "yunhee analysis ui Emp00_Tab_TransInfo --tobe frontend/src/pages/emp" "\| Emp02_TabPage_Others \| 1/1 \| 10/7 \(생략 3\) \|"
fi

# ── A-2 analysis sql: DML 테이블·CTE·변경 대상 ──
if want A-2; then
  chk "A-2 sql DML 테이블" 0 "yunhee analysis sql emp02_others.upsert $COMMON" "\*\*테이블\*\*: emp02_others" "\*\*CTE\*\*: upsert" "\*\*변경 대상\*\*: UPDATE emp02_others, INSERT emp02_others" "-o code" "!\*\*테이블\*\*:.*upsert" "!출력 별칭"
  chk "A-2 sql select CTE·중복" 0 "yunhee analysis sql emp00_trans_info.selectByText $COMMON" "\*\*테이블\*\*:.*emp01_person" "\*\*테이블\*\*:.*emp04_add_title" "!\*\*테이블\*\*:.*(\\b|, )org00(,|$)" "!\*\*테이블\*\*:.*(\\b|, )emp00(,|$)" "\*\*CTE\*\*:.*emp00" "\*\*CTE\*\*:.*org00" "ORDER BY" "!변경 대상"
fi

# ── A-3 analysis method (클라이언트): 콜백·분기·값 대입 ──
if want A-3; then
  chk "A-3 method 콜백" 0 "yunhee analysis method Emp02_TabPage_Others.update $COMMON" "editDriver\.flush\(\) \(L161\)" "서비스 emp\.Emp02_Others\.updateOne \(L165\)" "callback: result\.getResult\(0\) \(L176\)" "callback: editDriver\.edit\(empOthersModel\) \(L177\)" "callback: transInfoGrid\.getStore\(\)\.update\(transInfoModel\) \(L182\)"
  chk "A-3 method 분기" 0 "yunhee analysis method Emp02_TabPage_Others.autodecCtzNo $COMMON" "분기: if \(decCtzNo == null\) \(L309\)" "분기: if \(decCtzNo\.length\(\) == 13\) \(L319\)" "genderCode = \"M\" \(L327\)" "genderName\.setValue\(\"남\"\) \(L328\)" "분기: else \(L342\)" "SimpleMessage \"주민등록번호를 형식에 맞게 입력하세요\.\" \(L343\)"
  chk "A-3 method 회귀 (018 A-1)" 0 "yunhee analysis method Emp03_TabPage_Trans.insertRow $COMMON" "사원을 먼저 선택해주세요" "org\.Org00_OrgInfo\.selectByOrgCodeId" "E3"
fi

# ── A-4 analysis method --server: 결과 없음 경고 ──
if want A-4; then
  chk "A-4 server 결과 없음" 0 "yunhee analysis method Emp02_Others.updateOne --server $COMMON" "sqlSession: emp02_others\.upsert \(L45\)" "⚠ 결과 없음"
  chk "A-4 server 결과 있음 회귀" 0 "yunhee analysis method Emp00_TransInfo.selectByText --server $COMMON" "!결과 없음"
fi

# ── A-5 events: 떨어진 반복 호출 유지 ──
if want A-5; then
  chk "A-5 events 반복 호출" 0 "yunhee events $JAVA/client/vi/emp/Emp02_TabPage_Others.java" "update\(\), autodecCtzNo\(\), update\(\)"
  if [ $REINDEX = 1 ]; then
    echo "… index-src 다시 실행"; (cd .. && yunhee index-src "$SRC" -t AssetERP_1/docs/as-is/src >"$LOG/00-index-src.txt" 2>&1) || echo "❌ index-src 실패 ($LOG/00-index-src.txt)"
    chk "A-5 색인 반복 호출" 0 "yunhee analysis screen Emp00_Tab_TransInfo --class Emp02_TabPage_Others --section events" "\[E4\].*update\(\), autodecCtzNo\(\), update\(\)" "\[E9\]"
  else echo "ℹ A-5 색인 확인은 --reindex 때만"; fi
fi

# ── A-6 analysis screen --section layout ──
if want A-6; then
  chk "A-6 layout Others" 0 "yunhee analysis screen Emp00_Tab_TransInfo --class Emp02_TabPage_Others --section layout" \
    "레이아웃 \`getEditor\(\)\` L188-300" "라벨 폭: 100 \(L297\)" "hlc \(Horizontal\): \{image\} 245×315 m30 \| \{layout\} 1×1 m10" "layout \(Vertical\) 7줄, 각 1×auto m20" \
    "row00 \(L251\): 한자명\{chnName\} 350 · 성별\{genderName\} 350 · 우편번호\{zipCode\} 350" \
    "row03 \(L266\): 생년월일\{birthday\} 350 · 병역구분\{militaryName\} 350 · 비고\{note\} 550×150" \
    "row06 \(L279\): 개인메일\{emailOther\} 350 · 가족사항\{familyDscr\} 350" \
    "korAge\(readOnly, disable\), age\(readOnly, disable\), birthday\(readOnly, disable\), genderName\(readOnly, disable\)"
  chk "A-6 layout Person" 0 "yunhee analysis screen Emp00_Tab_TransInfo --class Emp01_TabPage_Person --section layout" \
    "라벨 폭: 100 \(L349\)" "\{layout\} 600×1 m10" \
    "row00 \(L300\): 사원번호\{empNo\} 350 · 입사일\{hireDate\} 270 · \{anchorHire\} auto · 특이사항\{note\} 350×270" \
    "\{blankLabel1\} 350 · 년차\{thYear\} 350" "empNo\(readOnly\), thYear\(disable\), workYear\(disable\)"
  chk "A-6 layout 그리드 화면" 0 "yunhee analysis screen Emp00_Tab_TransInfo --class Emp03_TabPage_Trans --section layout" "레이아웃 없음"
fi

# ── A-7 run: 테스트 실패 message를 XML에서 ──
if want A-7; then
  T=$FIX/run; mkdir -p "$T/build/test-results/test"
  cat > "$T/build/test-results/test/TEST-x.OthersDbTest.xml" <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="x.OthersDbTest" tests="2" failures="1" errors="0" skipped="0">
  <testcase name="ok()" classname="x.OthersDbTest"/>
  <testcase name="기타정보_행이_없으면_INSERT한다()" classname="x.OthersDbTest">
    <failure message="expected: null but was: 202211220747066L" type="org.opentest4j.AssertionFailedError">org.opentest4j.AssertionFailedError: expected: null but was: 202211220747066L
	at x.OthersDbTest.기타정보_행이_없으면_INSERT한다(OthersDbTest.java:72)</failure>
  </testcase>
</testsuite>
EOF
  chk "A-7 run 실패 메시지" - "yunhee run \"bash -c 'cd $T && touch build/test-results/test/TEST-x.OthersDbTest.xml && echo gradle test && exit 1'\"" \
    "OthersDbTest > 기타정보_행이_없으면_INSERT한다\(\) FAILED" "message: expected: null but was: 202211220747066L" "at: OthersDbTest\.java:72" "!Qwen"
fi

# ── B yunhee log / api --log ──
if want B; then
  P=/api/v1/emp/persons/202211220747066/others
  chk "B-1 api trace 표시" 0 "yunhee api GET $P -c kfstest" "trace=[0-9a-f]{16}"
  TRACE=$(grep -Eo 'trace=[0-9a-f]{16}' "$LASTF" | head -1 | cut -d= -f2)
  chk "B-2 api --log" 0 "yunhee api GET $P -c kfstest --log" "GET /api/v1/emp/persons/202211220747066/others → 200" "EmpOthersMapper\.selectOthers" "Total 1" "!970729"
  if [ -n "$TRACE" ]; then
    chk "B-3 log trace" 0 "yunhee log trace $TRACE" "docker:t3600-tomcat" "UTC" "SQL [0-9]+:" "trace $TRACE"
    chk "B-4 log req" 0 "yunhee log req GET /emp/persons/202211220747066/others --last 2" "$TRACE|trace [0-9a-f]{16}"
  else echo "❌ B-3·B-4 건너뜀 — B-1에서 trace를 못 뽑음"; FAIL=$((FAIL+2)); N=$((N+2)); fi

  # 픽스처: 실제 13줄 요청을 바탕으로, 주민번호는 가짜(900101-1234567)
  F=$FIX/log; mkdir -p "$F"
  cat > "$F/AssetERP-backend-info.log" <<'EOF'
2026-10-08 06:33:44.201 [95694936e2a3b376] [-] [-] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.c.m.C.findByCompanyCode - ==>  Preparing: SELECT sys01_company_id AS company_id FROM sys01_company WHERE sys01_loc_nm = ?
2026-10-08 06:33:44.202 [95694936e2a3b376] [-] [-] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.c.m.C.findByCompanyCode - ==> Parameters: admin(String)
2026-10-08 06:33:44.203 [95694936e2a3b376] [-] [-] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.c.m.C.findByCompanyCode - <==      Total: 1
2026-10-08 06:33:44.289 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.e.m.E.selectOthers - ==>  Preparing: SELECT emp02_others_id AS others_id FROM emp01_person LEFT OUTER JOIN emp02_others ON emp02_person_id = emp01_person_id WHERE emp01_person_id = ? AND emp01_company_id = ?
2026-10-08 06:33:44.289 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.e.m.E.selectOthers - ==> Parameters: 202211220747066(Long), 28000(Long)
2026-10-08 06:33:44.292 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.e.m.E.selectOthers - <==      Total: 1
2026-10-08 06:33:44.293 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.e.m.E.upsertOthers - ==>  Preparing: WITH upsert AS ( UPDATE emp02_others SET emp02_person_id = ? , emp02_chn_nm = ? , emp02_ctz_no = to_encrypts(?) WHERE emp02_others_id = ? AND emp02_person_id = ? RETURNING * ) INSERT INTO emp02_others ( emp02_others_id ) SELECT f_create_seq() WHERE NOT EXISTS ( SELECT * FROM upsert )
2026-10-08 06:33:44.297 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.e.m.E.upsertOthers - ==> Parameters: 202211220747066(Long), TEST(String), 900101-1234567(String), 202211220747066(Long), 202211220747066(Long)
2026-10-08 06:33:44.304 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.e.m.E.upsertOthers - <==    Updates: 0
2026-10-08 06:33:44.304 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.e.m.E.selectOthers - ==>  Preparing: SELECT emp02_others_id AS others_id FROM emp01_person LEFT OUTER JOIN emp02_others ON emp02_person_id = emp01_person_id WHERE emp01_person_id = ? AND emp01_company_id = ?
2026-10-08 06:33:44.305 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.e.m.E.selectOthers - ==> Parameters: 202211220747066(Long), 28000(Long)
2026-10-08 06:33:44.307 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] DEBUG k.c.k.a.b.e.m.E.selectOthers - <==      Total: 1
2026-10-08 06:33:44.317 [95694936e2a3b376] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-236] INFO  kr.co.kfs.asseterp.access - PUT /AssetERP_1/api/v1/emp/others 200 117ms
EOF
  cat > "$F/AssetERP-backend-error.log" <<'EOF'
2026-10-08 06:10:01.100 [aaaa000000000001] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-1] WARN  k.c.k.a.c.w.StompAuthChannelInterceptor - WebSocket 목적지 거부 - command: SUBSCRIBE, destination: /topic/presence, user: 101
2026-10-08 06:11:02.200 [aaaa000000000002] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-2] WARN  k.c.k.a.c.w.StompAuthChannelInterceptor - WebSocket 목적지 거부 - command: SUBSCRIBE, destination: /topic/presence, user: 102
2026-10-08 06:12:03.300 [aaaa000000000003] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-3] WARN  k.c.k.a.c.w.StompAuthChannelInterceptor - WebSocket 목적지 거부 - command: SUBSCRIBE, destination: /topic/presence, user: 103
2026-10-08 06:20:00.000 [bbbb000000000001] [admin] [kfstest:admin] [172.18.0.1] [http-nio-8080-exec-4] ERROR k.c.k.a.c.e.GlobalExceptionHandler - 처리되지 않은 오류 (픽스처)
java.lang.IllegalStateException: 픽스처 오류
	at x.Foo.bar(Foo.java:10)
	at x.Foo.baz(Foo.java:20)
Caused by: java.lang.NullPointerException: 픽스처 원인
	at x.Foo.qux(Foo.java:30)
EOF
  chk "B-5 log 파일 픽스처 마스킹" 0 "yunhee log trace 95694936e2a3b376 --file $F/AssetERP-backend-info.log" "file:" "PUT /api/v1/emp/others → 200 \(117ms\)" "upsertOthers" "Updates 0" "\*{6}-\*{7}" "!900101-1234567" "15:33:44 KST"
  chk "B-5 --no-mask" 0 "yunhee log trace 95694936e2a3b376 --file $F/AssetERP-backend-info.log --no-mask" "900101-1234567"
  chk "B-6 log errors 묶기" 0 "yunhee log errors --file $F/AssetERP-backend-error.log --since 100000h" "×\s*3" "StompAuthChannelInterceptor" "NullPointerException"
  chk "B-7 없는 trace" 1 "yunhee log trace 0000000000000000" "로그에 없음"
  chk "B-9 시간 범위 --from/--to" 0 "yunhee log errors --file $F/AssetERP-backend-error.log --tz UTC --from '2026-10-08 15:11' --to '2026-10-08 15:15'" "×\s*2" "!×\s*3" "!NullPointerException" "범위"
  chk "B-9 시작 옵션 둘" 2 "yunhee log errors --since 1h --from 15:00" "하나만"
  chk "B-10 --since-deploy" 0 "yunhee log tail --since-deploy" "배포 [0-9:]+ UTC"
  chk "B-10 --since-run" 0 "yunhee log errors --since-run last" "run [0-9_a-f]+"
  chk "B-8 컨테이너 없음" 2 "YUNHEE_LOG_DOCKER=no-such-container yunhee log tail --source docker --since 5m" "docker" "!Test worker"
fi

# ── C 버전·문서 ──
if want C; then
  chk "C-1 버전 0.2.5" 0 "yunhee --version" "0\.2\.5"
  chk "C-2 changelog 0.2.5" 0 "yunhee changelog --since 0.2.4" "0\.2\.5" "layout" "log"
  chk "C-2 agent-guide 안내" 0 "yunhee agent-guide" "section layout" "yunhee log" "--log"
  echo "ℹ C-3 회귀: tools/yunhee-018-check.sh --reindex 가 ✅ 47 / ❌ 0 인지 따로 돌린다"
fi

echo "합계: ✅ $PASS / ❌ $FAIL (전체 $N) · 원문 $LOG"
[ $FAIL = 0 ]
