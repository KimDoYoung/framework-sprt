ID=01c CASE_REV=1 CAT=분석 FAST=1 NEEDS=""
DESC="화면 구성 JSON(analysis screen --list -o json, 0.4.0~): 원본 줄 수·버튼·연결 구분"
# 0.4.0 미만에서는 -o json 이 없어 ❌로 기록된다(추세에서 기능 도입 시점이 보인다)
chk_json_lines() {   # lines_src 가 소스 파일 줄 수(wc -l)와 ±1 이내, 버튼은 소스 직접 생성 수 이상
  python3 -I - "$YH_ONLY" "$SRC" <<'PY'
import json, os, re, sys
txt = open(sys.argv[1], encoding="utf-8").read()
src = sys.argv[2]
try:
    d = json.loads(txt)
except ValueError:
    print("JSON 아님"); sys.exit(1)
bad = 0
if d["total"]["buttons"] != 2:   # 합계는 연결·다른 도메인 클래스 제외(Emp00_Lookup_SelectSingle 6개를 뺀 값)
    print("합계 버튼 불일치:", d["total"]["buttons"]); bad += 1
for c in d["classes"]:
    p = None
    for root, _, fs in os.walk(src):
        if c["name"] + ".java" in fs:
            p = os.path.join(root, c["name"] + ".java"); break
    if not p:
        print("소스에 없음:", c["name"]); bad += 1; continue
    raw = open(p, "rb").read()
    n = raw.count(b"\n") + (0 if raw.endswith(b"\n") or not raw else 1)
    if abs(c["lines_src"] - n) > 1:
        print(f"줄(원본) 불일치 {c['name']}: yunhee={c['lines_src']} 파일={n}"); bad += 1
    direct = len(re.findall(rb"new ColorButtonBar\(", raw))
    if c["buttons"] < direct:
        print(f"버튼 누락 의심 {c['name']}: {c['buttons']} < {direct}"); bad += 1
sys.exit(1 if bad else 0)
PY
}
case_run() {
  yh analysis screen Sys27_Tab_LoginManage --list -o json --src-index "$IDX"
  base_screen Sys27_Tab_LoginManage
  expect "화면 이름 키" '"screen": "Sys27_Tab_LoginManage"'
  expect "연결 클래스 구분" '"linked": true'
  forbid "오류 출력" '\[ERROR\]|Traceback|렌더링 실패'
  indep "lines_src = 파일 줄 수(±1), 버튼 ≥ 직접 생성 수" chk_json_lines
}
