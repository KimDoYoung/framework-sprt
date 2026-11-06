#!/usr/bin/env bash
# code-health: TOBE 소스 정적분석을 한 번에 돌려 docs/5-테스트/정적분석/ 에 보고서를 떨군다.
# 변환 중에는 돌리지 않는다 — 여러 화면을 변환한 뒤 몰아서 돌린다. backend/build.gradle 은 건드리지 않는다(init script).
# 사용: yunhee run -t 1800 "./tools/code-health.sh [옵션]"   (AssetERP 폴더에서. SpotBugs 포함 전체 약 3분)
#   (옵션 없음)          backend 전부: PMD · Checkstyle · SpotBugs+FindSecBugs · CPD(중복) · 자체 규칙(매퍼 ${}·레이어)
#   --front              + frontend/src TypeScript 중복(CPD)
#   --only a,b           그 도구만 다시 돌림: pmd checkstyle spotbugs cpd cpdts (보고서는 raw/ 의 나머지 옛 결과와 합침)
#   --min-tokens N       CPD 최소 토큰(기본 100. 작을수록 작은 중복까지)
#   --report-only        분석은 건너뛰고 raw/ 로 보고서만 다시 만든다(report.py 를 고친 뒤)
# 결과: docs/5-테스트/정적분석/{날짜}-요약.md, 목록/{A-기계적,B-판단,C-공통화,참고}.md, 수정대장.md, raw/(gitignore)
# 읽는 법·agent 에게 수정 맡기는 법: docs/5-테스트/정적분석/README.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOL="$ROOT/tools/code-health"
OUT="$ROOT/docs/5-테스트/정적분석"
RAW="$OUT/raw"

FRONT=0 ONLY="" MIN_TOKENS=100 REPORT_ONLY=0
while [[ $# -gt 0 ]]; do
    case "$1" in
        --front) FRONT=1 ;;
        --only) ONLY="$2"; shift ;;
        --min-tokens) MIN_TOKENS="$2"; shift ;;
        --report-only) REPORT_ONLY=1 ;;
        -h|--help) sed -n '2,11p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) echo "모르는 옵션: $1 (--help)" >&2; exit 2 ;;
    esac
    shift
done

# 돌릴 도구
if [[ -z "$ONLY" ]]; then
    ONLY="pmd,checkstyle,spotbugs,cpd,rules"
    [[ $FRONT == 1 ]] && ONLY="$ONLY,cpdts"
fi
has() { [[ ",$ONLY," == *",$1,"* ]]; }

TASKS=()
has pmd        && TASKS+=(pmdMain)
has checkstyle && TASKS+=(checkstyleMain)
has spotbugs   && TASKS+=(spotbugsMain)
has cpd        && TASKS+=(cpdJava)
has cpdts      && TASKS+=(cpdTs)

if [[ $REPORT_ONLY == 0 && ${#TASKS[@]} -gt 0 ]]; then
    GRADLE=gradle
    [[ -f "$ROOT/backend/gradlew" ]] && GRADLE="$ROOT/backend/gradlew"
    command -v "$GRADLE" >/dev/null || { echo "[ERROR] gradle 이 없습니다." >&2; exit 1; }
    mkdir -p "$RAW"
    # 이번에 돌리는 도구의 옛 raw 는 지운다(실패했는데 옛 결과로 보고서가 나오지 않게)
    for t in "${TASKS[@]}"; do
        case $t in
            pmdMain) rm -f "$RAW/pmd.xml" ;; checkstyleMain) rm -f "$RAW/checkstyle.xml" ;;
            spotbugsMain) rm -f "$RAW/spotbugs.xml" "$RAW/spotbugs.html" ;;
            cpdJava) rm -f "$RAW/cpd-java.xml" ;; cpdTs) rm -f "$RAW/cpd-ts.xml" ;;
        esac
    done
    echo "==> 분석: ${TASKS[*]}"
    # 분석 태스크만 --rerun (compileJava 는 평소처럼 증분). 전체 출력은 raw/gradle.log
    ARGS=()
    for t in "${TASKS[@]}"; do ARGS+=("$t" --rerun); done
    (cd "$ROOT/backend" && "$GRADLE" --init-script "$TOOL/analysis.gradle" -q \
        -PchOut="$RAW" -PchMinTokens="$MIN_TOKENS" -PchFrontDir="$ROOT/frontend/src" \
        compileJava "${ARGS[@]}") >"$RAW/gradle.log" 2>&1 || { tail -30 "$RAW/gradle.log" >&2; echo "[ERROR] gradle 실패 — $RAW/gradle.log" >&2; exit 1; }
    missing=()
    has pmd        && [[ ! -s "$RAW/pmd.xml" ]]        && missing+=(pmd)
    has checkstyle && [[ ! -s "$RAW/checkstyle.xml" ]] && missing+=(checkstyle)
    # SpotBugs 는 분석 중 예외가 나도 빈 xml 을 만들고 성공한다 → 로그로 판단
    has spotbugs   && { [[ ! -s "$RAW/spotbugs.xml" ]] || grep -qE 'AnalysisException|NoClassDefFoundError' "$RAW/gradle.log"; } && missing+=(spotbugs)
    has cpd        && [[ ! -s "$RAW/cpd-java.xml" ]]   && missing+=(cpd)
    has cpdts      && [[ ! -s "$RAW/cpd-ts.xml" ]]     && missing+=(cpdts)
    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "[ERROR] 결과가 안 나온 도구: ${missing[*]} — $RAW/gradle.log 를 본다" >&2
        exit 1
    fi
fi

echo "==> 보고서"
# 보고서는 이번에 돌린 것만이 아니라 raw/ 의 최신 결과 전부로 만든다(--only 로 일부만 돌려도 목록이 비지 않게)
python3 "$TOOL/report.py" --root "$ROOT" --raw "$RAW" --out "$OUT"
