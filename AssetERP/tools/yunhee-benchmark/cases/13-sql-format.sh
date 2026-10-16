ID=13 CASE_REV=1 CAT=sql FAST=1 NEEDS="db"
DESC="yunhee sql 출력 형식(-o tsv|json|csv, 0.3.9~): 이스케이프·NULL·행 수가 DB와 맞음"
chk_tsv_escape() {   # E'a\tb' 가 \t 로, |·NULL 이 올바르게
  grep -q $'^a\\\\tb\tp|q\t$' "$YH_ONLY" || { echo "tsv 이스케이프/NULL 불일치"; return 1; }
}
chk_json_count() {   # json 의 count 가 DB(information_schema 아닌 별도 count 쿼리)와 같다
  local want; want=$(_dbcount "select count(*) from sys06_menu")
  python3 -I - "$YH_ONLY" "$want" <<'PY'
import json, re, sys
txt = open(sys.argv[1], encoding="utf-8").read()
m = re.search(r"\[\{.*\}\]", txt, re.S)
d = json.loads(m.group(0)) if m else []
sys.exit(0 if d and str(d[0].get("count")) == sys.argv[2] else 1)
PY
}
case_run() {
  yh sql "select E'a\\tb' x, 'p|q' y, null z" -o tsv
  yh sql "select count(*) from sys06_menu" -o json
  yh sql "select 1 a, 'x,y' b" -o csv
  expect "tsv 머리" '^x	y	z$'
  expect "json 타입(숫자는 숫자)" '"count": [0-9]+\}'
  expect "csv 따옴표" '^1,"x,y"$'
  forbid "오류 출력" '\[ERROR\]|Traceback'
  indep "tsv: 탭 이스케이프(\\t)·| 보존·NULL 빈 칸" chk_tsv_escape
  indep "json count 가 별도 DB 조회와 같음" chk_json_count
}
