ID=06j CASE_REV=1 CAT=SQL FAST=1 NEEDS="db"
DESC="AS-IS SQL 펼치기 JSON(analysis sql -o json, 0.4.0~): 파라미터·테이블이 구조로 나옴"
chk_json_sql() {   # JSON 이고 tables 가 DB에 실제 있음
  python3 -I - "$YH_ONLY" <<'PY'
import json, sys
try:
    d = json.loads(open(sys.argv[1], encoding="utf-8").read())
except ValueError:
    print("JSON 아님"); sys.exit(1)
sys.exit(0 if d.get("params") and d.get("tables") else 1)
PY
}
case_run() {
  yh analysis sql sys27_login_manage.selectByText -o json -s "$SRC" --src-index "$IDX"
  base_file "$(find "$SRC" -path '*mapper/sys27_login_manage.xml' -print -quit)"
  expect "파라미터 키" '"params": \['
  expect "테이블 키" '"tables": \['
  forbid "렌더링 실패" '렌더링 실패|not JSON serializable|Traceback'
  indep "JSON 이고 params·tables 가 비어 있지 않음" chk_json_sql
}
