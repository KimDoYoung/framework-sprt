ID=12 CASE_REV=1 CAT=drift FAST=0 NEEDS="realsrc"
DESC="원본 변경 감지(drift --all --base PIN~40): 바뀐 화면 목록의 정확성"
# 독립 계산: git diff --name-only 로 바뀐 파일을 직접 구해 (정밀도) 보고된 화면은 그중 하나를 의존 파일로 갖는다
#                                                      (재현율) 바뀐 화면 클래스 파일(client/vi/**/<화면>.java)은 모두 보고된다
chk_drift() {
  python3 -I - "$YH_ONLY" "$REAL_SRC" "$BASE_COMMIT" "$WORK_IDX" <<'PY'
import os, re, subprocess, sys
out, repo, base, idx = sys.argv[1:5]
changed = set(subprocess.run(["git", "-C", repo, "diff", "--name-only", base, "HEAD"], capture_output=True, text=True).stdout.split())
reported = set()
for l in open(out, encoding="utf-8").read().splitlines():
    m = re.match(r"([A-Z][A-Za-z0-9_]*)\s+(\d|\(공유)", l)   # 파일 칸이 "3", "2(공유 4)", "(공유 11)" 중 하나
    if m:
        reported.add(m.group(1))
screens = {os.path.splitext(f)[0] for d, _, fs in os.walk(idx) if d.endswith("screens") for f in fs if f.endswith(".md")}
# 재현율: 바뀐 화면 클래스 파일
want = {os.path.splitext(os.path.basename(p))[0] for p in changed if "/client/vi/" in p and p.endswith(".java")} & screens
missing = sorted(want - reported)
# 정밀도: 보고된 화면(최대 30개 표본)의 의존 파일 중 바뀐 것이 있다
bad = []
for s in sorted(reported)[:30]:
    r = subprocess.run(["yunhee", "analysis", "screen", s, "--section", "source", "--src-index", idx], capture_output=True, text=True).stdout
    deps = set(re.findall(r"^- `([^`]+)`:", r, re.M))
    if deps and not (deps & changed):
        bad.append(s)
if missing: print("보고 누락(재현율):", ", ".join(missing[:10]), f"… 총 {len(missing)}")
if bad: print("바뀐 의존 파일이 없는데 보고됨(정밀도):", ", ".join(bad[:10]))
print(f"changed_files={len(changed)} reported={len(reported)} want={len(want)} missing={len(missing)} bad={len(bad)}")
sys.exit(1 if (missing or bad or not reported) else 0)
PY
}
case_run() {
  BASE_COMMIT=$(git -C "$REAL_SRC" rev-parse "$PIN~40" 2>/dev/null) || skip "원본 저장소에 PIN~40 커밋 없음"
  yh drift --all --base "$BASE_COMMIT" --src "$REAL_SRC" --src-index "$WORK_IDX"
  # 수작업 기준선: 그 구간에서 바뀐 java·xml 의 diff 전체
  local d="$WORK/drift-base-diff.txt"
  git -C "$REAL_SRC" diff "$BASE_COMMIT" HEAD -- '*.java' '*.xml' >"$d" 2>/dev/null
  base_file "$d"
  expect "변경 요약 머리" '기준 대비 변경 [0-9]+개 / 화면 [0-9]+개'
  expect "기준 커밋 범위 표시" '기준 커밋 범위'
  forbid "오류 출력" '\[ERROR\]|Traceback'
  indep "바뀐 화면 파일이 모두 보고되고 보고된 화면은 실제로 바뀜" chk_drift
}
