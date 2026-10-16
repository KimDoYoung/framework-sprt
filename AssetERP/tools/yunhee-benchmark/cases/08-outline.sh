ID=08 CASE_REV=1 CAT=TOBE FAST=1 NEEDS=""
DESC="TOBE 코드 위치(outline): Evaluation 서비스·컨트롤러·매퍼 3파일"
T=$ROOT/backend/src/main/java/kr/co/kfs/asseterp/biz/emp
FILES=("$T/service/EmpEvaluationService.java" "$T/controller/EmpEvaluationController.java" "$T/mapper/EmpEvaluationMapper.java")
# outline 의 "L  29: …updateEvaluations(" 줄 번호가 실제 파일의 그 줄과 같은지 (이름이 그 줄에 있는지)
chk_outline_lines() {
  python3 -I - "$YH_ONLY" "${FILES[@]}" <<'PY'
import re, sys
out = open(sys.argv[1], encoding="utf-8").read().splitlines()
files = {f.rsplit("/", 1)[1]: open(f, encoding="utf-8").read().splitlines() for f in sys.argv[2:]}
cur, bad, n = None, 0, 0
for l in out:
    m = re.match(r"// (\S+\.java)", l)
    if m:
        cur = m.group(1)
        continue
    m = re.match(r"L\s+(\d+): (.*)", l)
    if not (m and cur in files):
        continue
    ln, sig = int(m.group(1)), m.group(2).strip()
    if sig.startswith("@"):
        continue
    name = re.search(r"(\w+)\s*\(", sig)
    name = name.group(1) if name else (re.search(r"(?:class|interface|record)\s+(\w+)", sig) or [None, None])[1]
    if not name:
        continue
    n += 1
    if name not in files[cur][ln - 1]:
        print(f"줄 불일치 {cur}:{ln} {name}")
        bad += 1
sys.exit(0 if bad == 0 and n > 0 else 1)
PY
}
case_run() {
  for f in "${FILES[@]}"; do yh outline "$f"; done
  base_file "${FILES[@]}"
  expect "서비스 메서드" 'getEvaluations'
  expect "저장 메서드" 'updateEvaluations'
  expect "컨트롤러 파일 머리" '// EmpEvaluationController\.java'
  forbid "오류 출력" '\[ERROR\]|Traceback'
  indep "outline 줄 번호가 실제 파일과 맞음" chk_outline_lines
}
