#!/usr/bin/env bash
# create-virtual-company: 업무분석 가상회사(kova·igo)를 SYS-BZ-0001~0007·0012, ORG-BZ-0001, EMP-BZ-0001, SYS-BZ-0004~0006 순서로 TOBE API에서 만든다.
# 사용: ./tools/create-virtual-company.sh <회사ID> "<회사명>" <사업자번호>   예: kova "(주)코바" 220-81-22222
# 규칙(docs/2-업무분석/README.md): 메뉴 출발지 prod_s1(가장 작은 것), 관리자 admin/1111, 직원 사번=직함(100 사장·201 부장·301 과장·401 사원), 직원 비밀번호 Kalpa1234!
# 먼저 ./tools/db_dump_backup.sh 로 백업하고, 다시 만들려면 ./tools/delete-company-db-data.sh <회사ID> --all
# 환경변수: PORT=8082  SRC=prod_s1
set -euo pipefail
LOC="${1:?회사ID}"; NAME="${2:?회사명}"; BIZNO="${3:?사업자번호}"
PORT="${PORT:-8082}"; SRC="${SRC:-prod_s1}"; STAFF_PW='Kalpa1234!'
[[ "$LOC" =~ ^[a-z0-9]+$ ]] || { echo "[ERROR] 회사ID 형식: $LOC" >&2; exit 2; }
[[ " kalpa kova igo " == *" $LOC "* ]] || { echo "[ERROR] 가상회사만 허용: kalpa kova igo" >&2; exit 2; }

jget() { python3 -c "import sys,json;d=json.load(sys.stdin);print(eval('d'+sys.argv[1]))" "$1"; }
# call <회사서브도메인> <아이디> <비밀번호> METHOD PATH [JSON]
call() {
    local loc="$1" id="$2" pw="$3" m="$4" p="$5" body="${6:-}" b j out
    b="http://${loc}.localhost:${PORT}/AssetERP"; j="$(mktemp)"
    curl -s -m 30 -c "$j" -X POST "$b/api/auth/login" -H 'Content-Type: application/json' \
        -d "{\"username\":\"$id\",\"password\":\"$pw\",\"companyCode\":\"$loc\"}" >/dev/null
    out="$(curl -s -m 120 -b "$j" -X "$m" "$b$p" -H 'Content-Type: application/json' ${body:+-d "$body"})"; rm -f "$j"
    echo "$out" | python3 -c "import sys,json;d=json.load(sys.stdin);sys.exit(0 if d.get('success') else 1)" || { echo "[ERROR] $m $p → $out" >&2; exit 1; }
    echo "$out"
}
kfs() { call admin admin 1111 "$@"; }
co()  { call "$LOC" admin 1111 "$@"; }

SRC_ID="$(yunhee sql "select sys01_company_id from sys01_company where sys01_loc_nm='$SRC'" -o tsv --no-header)"
[[ -n "$SRC_ID" ]] || { echo "[ERROR] 출발지 회사 $SRC 없음" >&2; exit 1; }

echo "==> SYS-BZ-0001 고객사 등록 (${LOC})"
CID="$(kfs POST /api/v1/sys/companies "{\"companyNm\":\"$NAME\",\"locNm\":\"$LOC\",\"emgrcyPasswd\":\"1111\",\"startDate\":\"2020-03-02\",\"bizNo\":\"$BIZNO\",\"leaveMonthCd\":\"12\",\"taxType\":\"3\",\"accountCloseMonth\":\"12\"}" | jget '["data"]["companyId"]')"
kfs PUT "/api/v1/sys/companies/$CID/manage" "{\"companyId\":$CID,\"loginSecureYn\":\"false\",\"companyNm\":\"$NAME\",\"locNm\":\"$LOC\",\"emgrcyPasswd\":\"1111\",\"erpProductCd\":\"S1\",\"contType\":\"가상회사(업무분석)\",\"noticeDate\":\"2026-11-09\",\"assetYn\":\"true\",\"useYn\":\"true\"}" >/dev/null
echo "==> SYS-BZ-0002 관리자 발급"
kfs PUT "/api/v1/sys/companies/$CID/users" '[{"korNm":"관리자","loginId":"admin","decPasswd":"1111","email":"admin@'$LOC'.test","tel1":"010-0000-0000","tel2":"02-000-0000","note":"가상회사","adminYn":"true"}]' >/dev/null
echo "==> SYS-BZ-0007 사원구분 코드복사"
kfs POST /api/v1/sys/code-kinds/29/codes/copy "{\"companyId\":0,\"companyIds\":[$CID]}" >/dev/null
echo "==> SYS-BZ-0003 메뉴 열어 주기 (출발지 $SRC)"
kfs POST /api/v1/sys/company-menus/copy "{\"outPut\":$SRC_ID,\"inPut\":$CID}" >/dev/null

echo "==> ORG-BZ-0001 조직"
ROOT="$(co GET '/api/v1/org/org-codes?baseDate=2026-11-09' | jget '["data"][0]["codeId"]')"
mkorg() { co POST /api/v1/org/org-codes "{\"orgCd\":\"$1\",\"openDate\":\"2020-03-02\",\"openReason\":\"신설\",\"korNm\":\"$2\",\"parentCodeId\":$ROOT,\"levelCd\":\"0020\",\"sortOrder\":\"$3\"}" | jget '["data"]["codeId"]'; }
D1="$(mkorg 10100 경영지원본부 1)"; D2="$(mkorg 10200 운용본부 2)"

echo "==> EMP-BZ-0001 직원 7명 (사번=직함)"
# 사번|이름|조직|직위|직책
EMPS="100|김사장|$ROOT|100|100
201|박부장|$D1|400|230
202|정부장|$D2|400|230
301|김과장|$D1|500|240
302|박과장|$D2|500|240
401|김사원|$D1|650|250
402|최사원|$D2|650|250"
declare -A PID
while IFS='|' read -r no nm org pos title; do
    PID[$no]="$(co POST /api/v1/emp/trans-infos "{\"empNo\":\"$no\",\"korNm\":\"$nm\",\"kindCd\":\"10\",\"hireDate\":\"2020-03-02\",\"mobileTelNo\":\"010-1000-$no\",\"hireCd\":\"10\",\"emailAddr\":\"$no@$LOC.test\",\"titleCd\":\"$title\",\"posCd\":\"$pos\",\"orgCodeId\":$org}" | jget '["data"]["personId"]')"
done <<<"$EMPS"

echo "==> SYS-BZ-0004 권한그룹 '임원' / 0005 메뉴 / 0006 직원 연결"
RID="$(co PUT /api/v1/sys/roles '[{"roleNm":"임원","seq":"1","note":"사장·부장 (가상회사 업무분석)"}]' | jget '["data"][0]["roleId"]')"
MENUS="$(co GET "/api/v1/sys/roles/$RID/menus" | python3 -c '
import sys,json
d=json.load(sys.stdin)["data"]
ids={4000,4100}|{x["menuId"] for x in d if x["parentId"]==4100}
print(json.dumps([{"menuId":i,"roleMenuId":None,"useYn":"true"} for i in sorted(ids)]))')"
co PUT "/api/v1/sys/roles/$RID/menus" "$MENUS" >/dev/null
MID="$(yunhee sql "select sys04_role_id from sys04_role where sys04_company_id=$CID and sys04_role_nm='경영 관리자'" -o tsv --no-header)"
co PUT /api/v1/sys/user-roles "[{\"userId\":${PID[100]},\"roleId\":$RID},{\"userId\":${PID[201]},\"roleId\":$RID},{\"userId\":${PID[202]},\"roleId\":$RID}]" >/dev/null
co PUT /api/v1/sys/user-roles "[{\"userId\":${PID[301]},\"roleId\":$MID},{\"userId\":${PID[302]},\"roleId\":$MID}]" >/dev/null

echo "==> SYS-BZ-0012 직원 비밀번호 설정 ($STAFF_PW)"
for no in "${!PID[@]}"; do
    curl -s -m 30 -X POST "http://${LOC}.localhost:${PORT}/AssetERP/api/auth/password/change" -H 'Content-Type: application/json' \
        -d "{\"companyCode\":\"$LOC\",\"loginId\":\"$no\",\"newPassword\":\"$STAFF_PW\"}" \
        | python3 -c "import sys,json;d=json.load(sys.stdin);sys.exit(0 if d.get('success') else 1)" || { echo "[ERROR] 비밀번호 설정 실패: $no" >&2; exit 1; }
done
echo "==> 완료: $LOC (회사ID $CID). 로그인: admin/1111, 직원 100·201·202·301·302·401·402 / $STAFF_PW"
