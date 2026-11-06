#!/usr/bin/env python3
"""code-health 요약기: raw XML(PMD·CPD·Checkstyle·SpotBugs) + 자체 점검 → docs/5-테스트/정적분석/ 의 md.

직접 쓰지 않고 tools/code-health.sh 가 부른다.
  python3 report.py --root <AssetERP> --raw <raw폴더> --out <정적분석 폴더> [--date YYYY-MM-DD]

출력
  {date}-요약.md          총괄(커밋). 끝에 다음 실행이 증감을 계산할 JSON 주석
  목록/A-기계적.md        파일별로 묶은 기계적 수정 목록 (agent 가 묶어서 고침)
  목록/B-판단.md          항목별 확인이 필요한 것
  목록/C-공통화.md        CPD 중복 → 공통화 후보(점수순)
  목록/참고.md            복잡도·길이 — 고칠 의무 없음
  수정대장.md             사람·agent 가 상태를 적는 대장. 이 스크립트는 '해결' 표시와 새 행 추가 없이 기존 행만 갱신

ID 는 CH-{도구}-{해시8}. 줄 번호가 아니라 (규칙, 파일, 그 줄 내용) 해시라 코드가 위아래로 밀려도 그대로다.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path

# ── 등급 ──────────────────────────────────────────────────────────────────
# A 기계적: 동작이 안 바뀌고 compile 만 확인하면 되는 것
# B 판단:   원인을 보고 고쳐야 하는 것(동작이 바뀔 수 있음 — AS-IS 동작이 정답)
# R 참고:   크기·복잡도. 위치 파악용, 고칠 의무 없음
# C 공통화: CPD 중복 (따로 처리)
RULE_GRADE = {
    # PMD
    "UnusedLocalVariable": "A", "UnusedPrivateField": "A", "UnusedPrivateMethod": "A",
    "UnnecessaryImport": "A", "UnnecessaryFullyQualifiedName": "A",
    "CollapsibleIfStatements": "A", "SimplifyBooleanReturns": "A",
    "SystemPrintln": "A", "AvoidPrintStackTrace": "A",
    "CognitiveComplexity": "R", "NPathComplexity": "R",
    # Checkstyle
    "AvoidStarImport": "A", "TobeComAsseterp": "A",
    "ParameterNumber": "R", "MethodLength": "R", "FileLength": "R",
}
DEFAULT_GRADE = "B"
GRADE_NAME = {"A": "A 기계적", "B": "B 판단", "C": "C 공통화", "R": "참고"}
TOOL_NAME = {"pmd": "PMD", "checkstyle": "Checkstyle", "spotbugs": "SpotBugs", "mapper": "매퍼 SQL",
             "layer": "레이어 규칙", "cpd": "CPD Java", "cpdts": "CPD TS"}
JAVA_ROOT = "backend/src/main/java/"


@dataclass
class Item:
    id: str
    tool: str
    rule: str
    grade: str
    file: str          # AssetERP 기준 상대경로
    line: int
    msg: str
    prio: str = ""     # 높음/보통/낮음
    domain: str = ""


@dataclass
class Dup:
    id: str
    tool: str          # cpd | cpdts
    lines: int
    tokens: int
    locs: list = field(default_factory=list)   # (file, line, endline)
    fragment: str = ""
    domains: list = field(default_factory=list)
    scope: str = ""
    kind: str = ""
    advice: str = ""
    whole: bool = False
    related: list = field(default_factory=list)
    score: int = 0


# ── 공통 ──────────────────────────────────────────────────────────────────
def h8(*parts: str) -> str:
    return hashlib.sha1("|".join(parts).encode()).hexdigest()[:8]


def rel(root: Path, p: str) -> str:
    try:
        return str(Path(p).resolve().relative_to(root))
    except ValueError:
        return p


def domain_of(f: str) -> str:
    m = re.search(r"/asseterp/biz/([^/]+)/", f)
    if m:
        return m.group(1)
    m = re.search(r"/asseterp/common/([^/]+)/", f)
    if m:
        return "common." + m.group(1)
    m = re.match(r"backend/src/main/resources/mapper/(?:.*/)?([A-Z][a-z0-9]+)", f)
    if m:
        return m.group(1).lower()
    m = re.match(r"frontend/src/pages/([^/]+)/", f)
    if m:
        return "fe." + m.group(1)
    m = re.match(r"frontend/src/([^/]+)/", f)
    if m:
        return "fe." + m.group(1)
    return "(기타)"


class Lines:
    """파일 줄 캐시 (ID 해시와 줄 수 계산용)."""
    def __init__(self, root: Path):
        self.root, self.cache = root, {}

    def get(self, f: str) -> list[str]:
        if f not in self.cache:
            try:
                self.cache[f] = (self.root / f).read_text(encoding="utf-8", errors="replace").splitlines()
            except OSError:
                self.cache[f] = []
        return self.cache[f]

    def text(self, f: str, line: int) -> str:
        ls = self.get(f)
        return ls[line - 1].strip() if 0 < line <= len(ls) else ""


def make_ids(items: list[Item], lines: Lines) -> None:
    seen = Counter()
    for it in items:
        # spotbugs 는 (종류, 파일) 묶음이라 줄 내용 대신 파일까지만
        key = (it.tool, it.rule, it.file, "" if it.tool == "spotbugs" else lines.text(it.file, it.line))
        seen[key] += 1
        it.id = f"CH-{it.tool}-{h8(*key, str(seen[key]))}"


def strip_ns(root: ET.Element) -> ET.Element:
    for e in root.iter():
        if "}" in e.tag:
            e.tag = e.tag.split("}", 1)[1]
    return root


def load_xml(p: Path):
    if not p.exists():
        return None
    return strip_ns(ET.parse(p).getroot())


# ── 파서 ──────────────────────────────────────────────────────────────────
def parse_pmd(root: Path, raw: Path, counts: dict) -> list[Item]:
    x = load_xml(raw / "pmd.xml")
    if x is None:
        return []
    out = []
    for f in x.findall("file"):
        fr = rel(root, f.get("name"))
        for v in f.findall("violation"):
            r = v.get("rule")
            out.append(Item("", "pmd", r, RULE_GRADE.get(r, DEFAULT_GRADE), fr, int(v.get("beginline")),
                            " ".join((v.text or "").split()), {"1": "높음", "2": "높음", "3": "보통"}.get(v.get("priority"), "낮음")))
    counts["pmd"] = len(x.findall(".//violation"))
    return out


def parse_checkstyle(root: Path, raw: Path, counts: dict) -> list[Item]:
    x = load_xml(raw / "checkstyle.xml")
    if x is None:
        return []
    out = []
    for f in x.findall("file"):
        fr = rel(root, f.get("name"))
        for e in f.findall("error"):
            src = e.get("source", "")
            if "#" in src:      # id 를 준 모듈(TOBE 규칙): "...RegexpSinglelineCheck#TobeComAsseterp"
                r = src.split("#", 1)[1]
            else:
                r = src.rsplit(".", 1)[-1]
                r = r[:-5] if r.endswith("Check") else r
            out.append(Item("", "checkstyle", r, RULE_GRADE.get(r, DEFAULT_GRADE), fr, int(e.get("line", "0")),
                            e.get("message", ""), "보통"))
    counts["checkstyle"] = len(x.findall(".//error"))
    return out


def parse_spotbugs(root: Path, raw: Path, counts: dict) -> list[Item]:
    """SpotBugs 는 같은 파일의 같은 버그 종류를 한 항목으로 묶는다(전자결재 HTML 처럼 한 파일에 수십 곳이 흔함)."""
    x = load_xml(raw / "spotbugs.xml")
    if x is None:
        return []
    groups: dict = {}
    for b in x.findall("BugInstance"):
        sl = b.find("SourceLine")
        if sl is None or not sl.get("sourcepath"):
            continue
        f = JAVA_ROOT + sl.get("sourcepath")
        line = int(sl.get("start") or 0)
        if line == 0:   # 클래스 단위 버그: 메서드/필드 줄
            for s in b.iter("SourceLine"):
                if s.get("start"):
                    line = int(s.get("start")); break
        key = (b.get("type"), f)
        g = groups.setdefault(key, {"lines": [], "prio": "3", "cat": b.get("category", ""),
                                    "msg": (b.findtext("ShortMessage") or b.findtext("LongMessage") or "").strip()})
        g["lines"].append(line)
        g["prio"] = min(g["prio"], b.get("priority", "3"))
    out = []
    for (typ, f), g in groups.items():
        ls = sorted(set(g["lines"]))
        more = f" — {len(ls)}곳: {', '.join(map(str, ls[:12]))}{' …' if len(ls) > 12 else ''}" if len(ls) > 1 else ""
        out.append(Item("", "spotbugs", typ, "B", f, ls[0], f"[{g['cat']}] {g['msg']}{more}",
                        {"1": "높음", "2": "보통"}.get(g["prio"], "낮음")))
    counts["spotbugs"] = len(x.findall("BugInstance"))
    return out


def scan_mapper(root: Path, lines: Lines) -> list[Item]:
    """MyBatis ${} 치환 — SQL injection 후보. 주석 안의 것과, 같은 파일의 <include><property name=…> 로
    채우는 것(XML 에 박힌 고정값이라 입력이 아님)은 뺀다."""
    out = []
    for p in sorted((root / "backend/src/main/resources/mapper").rglob("*.xml")):
        fr = str(p.relative_to(root))
        text = "\n".join(lines.get(fr))
        props = set(re.findall(r'<property\s+name="(\w+)"', text))
        # 주석을 같은 길이의 공백으로 지워 줄 번호를 유지
        code = re.sub(r"<!--.*?-->", lambda m: re.sub(r"[^\n]", " ", m.group(0)), text, flags=re.S)
        for i, s in enumerate(code.split("\n"), 1):
            for m in re.finditer(r"\$\{([^}]+)\}", s):
                if m.group(1).strip() in props:
                    continue
                out.append(Item("", "mapper", "DollarSubstitution", "B", fr, i,
                                f"${{{m.group(1)}}} 문자열 치환 — 입력값이면 #{{}} 또는 화이트리스트", "보통"))
    return out


LAYER = {"Controller": "controller", "Service": "service", "Mapper": "mapper"}


def scan_layer(root: Path) -> list[Item]:
    """TOBE-Framework: {X}Controller/Service/Mapper 는 controller/service/mapper 패키지에."""
    out = []
    base = root / JAVA_ROOT / "kr/co/kfs/asseterp/biz"
    for p in sorted(base.rglob("*.java")):
        fr = str(p.relative_to(root))
        for suf, pkg in LAYER.items():
            if p.stem.endswith(suf) and p.parent.name != pkg:
                out.append(Item("", "layer", f"{suf}Package", "B", fr, 1,
                                f"{p.stem} 가 {p.parent.name}/ 에 있음 — {pkg}/ 로", "보통"))
    return out


# ── CPD → 공통화 후보 ─────────────────────────────────────────────────────
KINDS = [  # (이름, 정규식, 권고)  — 위에서부터 처음 맞는 것
    ("엑셀", r"\b(Workbook|XSSF|HSSF|Sheet|Cell(Style)?|Row)\b", "엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)"),
    ("PDF·RD 출력", r"HtmlPdfRenderer|\bPdf\w*|\bmrd\b|RdService|\brd\w*Param", "출력 부품(common.pdf / RD 호출) 하나로"),
    ("파일·업로드", r"\bMultipartFile\b|\bFiles\.|InputStream|OutputStream", "파일 저장/읽기 공통 서비스로"),
    ("그리드 CUD 저장", r"(for\s*\(.*\b(rows|list|items|changes|data)\b)|getRowStatus|rowType|\"[CUD]\"", "AS-IS Grid* 저장 흐름(C/U/D 분기 루프) 공통 헬퍼로"),
    ("컨트롤러 반복", r"ApiResponse\.|@(Get|Post|Put|Delete|Patch)Mapping|@RequestParam", "공통 컨트롤러 메서드/인자 해석기로"),
    ("날짜·숫자 포맷", r"DateTimeFormatter|SimpleDateFormat|LocalDate\.parse|BigDecimal|setScale|DecimalFormat|String\.format", "common.util 순수 함수(포맷·파싱·반올림)로"),
    ("변환(Map·DTO)", r"\bMap<|\.get\(\"|Collectors\.|\.stream\(\)", "변환기(정적 팩토리/공통 매퍼)로"),
]


# 종류 → 이미 있는 common 클래스 이름에서 찾을 말 (있으면 "그걸 안 쓰고 새로 짠 것"일 수 있음)
RELATED = {"엑셀": ("Excel", "Xls", "Workbook"), "PDF·RD 출력": ("Pdf", "Rd", "Report"),
           "파일·업로드": ("File", "Upload", "Storage", "Attach"), "날짜·숫자 포맷": ("Date", "Format", "Number", "Util"),
           "변환(Map·DTO)": ("Convert", "Util")}


def ts_kinds():
    return [
        ("그리드 정의", r"columnDefs|ColDef|headerName|field:", "grid-style 의 GridType·gb.* 부품으로"),
        ("API 호출", r"\bapi\w*\.(get|post|put|delete)|axios|fetch\(", "api/ 의 공통 함수로"),
        ("폼·모달", r"<Form|<Modal|Form\.Item|useForm", "components/ 의 공통 폼·모달로"),
        ("상태·훅", r"useState|useEffect|useCallback", "hooks/ 의 공통 훅으로"),
    ]


def common_parts(root: Path) -> list[str]:
    base = root / JAVA_ROOT / "kr/co/kfs/asseterp/common"
    return sorted(p.stem for p in base.rglob("*.java")) if base.exists() else []


def parse_cpd(root: Path, raw: Path, name: str, tool: str, lines: Lines, commons: list[str], counts: dict) -> list[Dup]:
    x = load_xml(raw / name)
    if x is None:
        return []
    kinds = ts_kinds() if tool == "cpdts" else KINDS
    out = []
    for d in x.findall("duplication"):
        locs = [(rel(root, f.get("path")), int(f.get("line")), int(f.get("endline"))) for f in d.findall("file")]
        frag = d.findtext("codefragment") or ""
        n = int(d.get("lines"))
        doms = sorted({domain_of(f) for f, _, _ in locs})
        files = {f for f, _, _ in locs}
        scope = "같은 파일" if len(files) == 1 else ("같은 도메인" if len(doms) == 1 else "도메인 간")
        kind, advice = "기타 로직", "공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)"
        for k, rx, adv in kinds:
            if re.search(rx, frag):
                kind, advice = k, adv
                break
        whole = all(n >= 0.6 * max(1, len(lines.get(f))) for f in files)
        if whole and len(files) > 1:
            kind, advice = "파일 통째 복제", "같은 AS-IS 부품을 도메인마다 복사한 것 — 공통 서비스 하나로 합치고 도메인은 위임"
        related = [c for c in commons if any(k in c for k in RELATED.get(kind, ()))][:5]
        score = n * (len(locs) - 1) * (2 if scope == "도메인 간" else 1)
        did = f"CH-{tool}-{h8(tool, *sorted(files), ' '.join(frag.split()))}"
        out.append(Dup(did, tool, n, int(d.get("tokens")), locs, frag, doms, scope, kind, advice, whole, related, score))
    counts[tool] = len(x.findall("duplication"))
    out.sort(key=lambda d: -d.score)
    return out


# ── 수정대장 ──────────────────────────────────────────────────────────────
LEDGER_HEAD = """# 정적분석 수정대장

code-health 보고서의 ID 중 손댄 것만 적는다(전부 옮기지 않는다). 상태: `대기`·`수정`·`보류(사유)`·`오탐(사유)`.
- `오탐` 행은 다음 보고서에서 빠진다.
- 다음 실행에서 ID 가 사라지면 report.py 가 상태를 `해결 (날짜)` 로 바꾼다.
- agent 에게 부탁할 때: "목록/A-기계적.md 전부 고쳐줘", "CH-cpd-xxxxxxxx 공통화해줘" → 고친 뒤 이 표에 행을 더한다.

| ID | 등급 | 상태 | 메모 |
|:---|:---|:---|:---|
"""


def read_ledger(p: Path) -> list[list[str]]:
    if not p.exists():
        return []
    rows = []
    for s in p.read_text(encoding="utf-8").splitlines():
        if s.startswith("| CH-"):
            c = [x.strip() for x in s.strip().strip("|").split("|")]
            rows.append((c + ["", "", "", ""])[:4])
    return rows


def write_ledger(p: Path, rows: list[list[str]]) -> None:
    p.write_text(LEDGER_HEAD + "".join(f"| {' | '.join(r)} |\n" for r in rows), encoding="utf-8")


# ── 출력 ──────────────────────────────────────────────────────────────────
def loc(f: str, line: int) -> str:
    return f"`{f}:{line}`"


def write_lists(out: Path, items: list[Item], dups: list[Dup], status: dict, date: str) -> None:
    d = out / "목록"
    d.mkdir(parents=True, exist_ok=True)
    st = lambda i: f" **[{status[i]}]**" if i in status else ""

    # A — 파일별
    A = [i for i in items if i.grade == "A"]
    by = defaultdict(list)
    for i in A:
        by[i.file].append(i)
    s = [f"# A 기계적 ({date}, {len(A)}건 / {len(by)}파일)\n",
         "동작이 바뀌지 않는 수정. 파일별로 묶어 고치고 `yunhee run \"./bm.sh compile\"` 만 확인한다.\n"]
    for f in sorted(by):
        s.append(f"\n## `{f}`\n")
        for i in sorted(by[f], key=lambda x: x.line):
            s.append(f"- {i.id}{st(i.id)} :{i.line} `{i.rule}` — {i.msg}\n")
    (d / "A-기계적.md").write_text("".join(s), encoding="utf-8")

    # B — 우선순위·도구별
    B = sorted([i for i in items if i.grade == "B"], key=lambda x: ({"높음": 0, "보통": 1}.get(x.prio, 2), x.tool, x.rule, x.file, x.line))
    s = [f"# B 판단 ({date}, {len(B)}건)\n",
         "원인을 보고 고친다. 동작이 바뀌면 AS-IS 동작과 맞는지 확인(`yunhee api`)하고, 애매하면 사용자에게 묻는다.\n",
         "\n| ID | 우선 | 도구 | 규칙 | 위치 | 내용 |\n|:---|:---|:---|:---|:---|:---|\n"]
    for i in B:
        s.append(f"| {i.id}{st(i.id)} | {i.prio} | {TOOL_NAME[i.tool]} | `{i.rule}` | {loc(i.file, i.line)} | {i.msg.replace('|', '¦')} |\n")
    (d / "B-판단.md").write_text("".join(s), encoding="utf-8")

    # R
    R = sorted([i for i in items if i.grade == "R"], key=lambda x: (x.rule, x.file))
    s = [f"# 참고 ({date}, {len(R)}건)\n", "크기·복잡도. 고칠 의무 없음 — 리팩터링·테스트 우선순위를 정할 때 본다.\n",
         "\n| 규칙 | 위치 | 내용 |\n|:---|:---|:---|\n"]
    for i in R:
        s.append(f"| `{i.rule}` | {loc(i.file, i.line)} | {i.msg.replace('|', '¦')} |\n")
    (d / "참고.md").write_text("".join(s), encoding="utf-8")

    # C
    s = [f"# C 공통화 후보 ({date}, {len(dups)}건)\n",
         "CPD 중복 블록. 점수 = 줄 수 × (출현-1) × (도메인 간이면 2). 한 후보씩, 사용자 승인 뒤 진행:\n",
         "util/공통 서비스 작성 → 쓰는 곳 교체 → `bm.sh compile` → 영향 API 를 `yunhee api` 로 확인.\n"]
    for x in dups:
        s.append(f"\n## {x.id}{st(x.id)} — {x.kind} · {x.scope} · {x.lines}줄×{len(x.locs)}곳 (점수 {x.score})\n\n")
        s.append(f"- 권고: {x.advice}\n")
        s.append(f"- 도메인: {', '.join(x.domains)}\n")
        if x.related:
            s.append(f"- 관련 있을 수 있는 기존 common 부품: {', '.join(x.related)}\n")
        for f, a, b in x.locs:
            s.append(f"- `{f}:{a}-{b}`\n")
        lang = "typescript" if x.tool == "cpdts" else "java"
        frag = "\n".join(x.fragment.strip("\n").splitlines()[:12])
        s.append(f"\n```{lang}\n{frag}\n```\n")
    (d / "C-공통화.md").write_text("".join(s), encoding="utf-8")


def prev_totals(out: Path, me: str) -> tuple[str, dict]:
    files = sorted(p for p in out.glob("*-요약.md") if p.name != me)
    if not files:
        return "", {}
    m = re.search(r"<!-- code-health-totals: (\{.*\}) -->", files[-1].read_text(encoding="utf-8"))
    return (files[-1].name, json.loads(m.group(1))) if m else ("", {})


def write_summary(out: Path, raw: Path, date: str, items: list[Item], dups: list[Dup], fp: int, resolved: int, counts: dict) -> Path:
    name = f"{date}-요약.md"
    pname, prev = prev_totals(out, name)
    tot = Counter(i.grade for i in items)
    tot["C"] = len(dups)
    by_tool = defaultdict(Counter)
    for i in items:
        by_tool[i.tool][i.grade] += 1
    for x in dups:
        by_tool[x.tool]["C"] += 1
    delta = lambda k: (f" ({tot[k] - prev.get(k, 0):+d})" if prev else "")

    s = [f"# 정적분석 요약 {date}\n\n",
         "`tools/code-health.sh` 결과. 자세한 목록은 `목록/`, 손댄 항목의 상태는 `수정대장.md`. 읽는 법은 `README.md`.\n\n",
         f"## 총괄{f' (증감: {pname} 대비)' if pname else ''}\n\n",
         "| 등급 | 건수 | 뜻 | 목록 |\n|:---|---:|:---|:---|\n",
         f"| A 기계적 | {tot['A']}{delta('A')} | 동작 그대로, compile 만 확인 | `목록/A-기계적.md` |\n",
         f"| B 판단 | {tot['B']}{delta('B')} | 원인 확인 후 수정 | `목록/B-판단.md` |\n",
         f"| C 공통화 | {tot['C']}{delta('C')} | 중복 → 공통 부품 후보 | `목록/C-공통화.md` |\n",
         f"| 참고 | {tot['R']}{delta('R')} | 복잡도·크기 | `목록/참고.md` |\n",
         f"\n오탐으로 뺀 것 {fp}건, 이번에 해결로 바뀐 대장 행 {resolved}건.\n",
         "\n## 도구별\n\n| 도구 | A | B | C | 참고 |\n|:---|---:|---:|---:|---:|\n"]
    for t in TOOL_NAME:
        if t in by_tool or t in counts:
            c = by_tool[t]
            s.append(f"| {TOOL_NAME[t]} | {c['A']} | {c['B']} | {c['C']} | {c['R']} |\n")
    skipped = [TOOL_NAME[t] for t in ("pmd", "checkstyle", "spotbugs", "cpd", "cpdts") if t not in counts]
    if skipped:
        s.append(f"\nraw 결과가 없는 도구: {', '.join(skipped)}\n")

    dom = Counter(i.domain for i in items if i.grade in "AB")
    s.append("\n## 도메인별 A+B 상위 15\n\n| 도메인 | 건수 |\n|:---|---:|\n")
    for k, v in dom.most_common(15):
        s.append(f"| {k} | {v} |\n")

    rule = Counter((i.grade, TOOL_NAME[i.tool], i.rule) for i in items if i.grade in "AB")
    s.append("\n## 많이 나온 규칙 상위 15\n\n| 등급 | 도구 | 규칙 | 건수 |\n|:---|:---|:---|---:|\n")
    for (g, t, r), v in rule.most_common(15):
        s.append(f"| {g} | {t} | `{r}` | {v} |\n")

    hi = [i for i in items if i.grade == "B" and i.prio == "높음"]
    s.append(f"\n## B 중 우선 높음 ({len(hi)}건)\n\n")
    if hi:
        s.append("| ID | 도구 | 규칙 | 위치 |\n|:---|:---|:---|:---|\n")
        for i in hi[:40]:
            s.append(f"| {i.id} | {TOOL_NAME[i.tool]} | `{i.rule}` | {loc(i.file, i.line)} |\n")
        if len(hi) > 40:
            s.append(f"\n…외 {len(hi) - 40}건은 `목록/B-판단.md`\n")
    else:
        s.append("없음\n")

    s.append("\n## 공통화 후보 상위 15\n\n| ID | 종류 | 범위 | 줄×곳 | 도메인 |\n|:---|:---|:---|:---|:---|\n")
    for x in dups[:15]:
        s.append(f"| {x.id} | {x.kind} | {x.scope} | {x.lines}×{len(x.locs)} | {', '.join(x.domains)} |\n")
    kc = Counter(x.kind for x in dups)
    s.append("\n종류별: " + ", ".join(f"{k} {v}" for k, v in kc.most_common()) + "\n")

    s.append("\n## agent 에게 부탁하는 법\n\n"
             "- \"정적분석 A 전부 고쳐줘\" → `목록/A-기계적.md` 를 파일별로 고치고 compile\n"
             "- \"CH-spotbugs-xxxxxxxx 봐줘\" → B 항목 하나를 원인부터 확인\n"
             "- \"CH-cpd-xxxxxxxx 공통화해줘\" → C 후보 하나를 공통 부품으로\n"
             "- 고친 뒤 `수정대장.md` 에 행을 더한다. 오탐이면 `오탐(사유)` 로 적으면 다음부터 빠진다.\n")
    s.append("\n## raw 결과 시각\n\n`--only` 로 일부만 돌리면 나머지는 옛 결과다.\n\n| 파일 | 만든 시각 |\n|:---|:---|\n")
    for f in ("pmd.xml", "checkstyle.xml", "spotbugs.xml", "cpd-java.xml", "cpd-ts.xml"):
        rp = raw / f
        when = dt.datetime.fromtimestamp(rp.stat().st_mtime).strftime("%Y-%m-%d %H:%M") if rp.exists() else "없음"
        s.append(f"| `raw/{f}` | {when} |\n")
    s.append(f"\n<!-- code-health-totals: {json.dumps({k: tot[k] for k in 'ABCR'})} -->\n")
    p = out / name
    p.write_text("".join(s), encoding="utf-8")
    return p


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", required=True)
    ap.add_argument("--raw", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--date", default=dt.date.today().isoformat())
    ap.add_argument("--only", default="", help="이번에 돌린 도구 (쉼표). 비면 raw 에 있는 것 전부")
    a = ap.parse_args()
    root, raw, out = Path(a.root).resolve(), Path(a.raw).resolve(), Path(a.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    only = set(filter(None, a.only.split(",")))
    want = lambda t: not only or t in only

    lines, counts = Lines(root), {}
    items: list[Item] = []
    if want("pmd"):
        items += parse_pmd(root, raw, counts)
    if want("checkstyle"):
        items += parse_checkstyle(root, raw, counts)
    if want("spotbugs"):
        items += parse_spotbugs(root, raw, counts)
    if want("rules"):
        items += scan_mapper(root, lines) + scan_layer(root)
    for i in items:
        i.domain = domain_of(i.file)
    make_ids(items, lines)
    commons = common_parts(root)
    dups = []
    if want("cpd"):
        dups += parse_cpd(root, raw, "cpd-java.xml", "cpd", lines, commons, counts)
    if want("cpdts"):
        dups += parse_cpd(root, raw, "cpd-ts.xml", "cpdts", lines, commons, counts)
    dups.sort(key=lambda d: -d.score)

    # 대장: 오탐 제외, 사라진 ID 는 해결
    lp = out / "수정대장.md"
    ledger = read_ledger(lp)
    found = {i.id for i in items} | {d.id for d in dups}
    ran_tools = {i.tool for i in items} | {d.tool for d in dups} | set(counts)
    fp_ids, resolved = set(), 0
    for r in ledger:
        tool = r[0].split("-")[1] if r[0].count("-") >= 2 else ""
        if r[2].startswith("오탐"):
            fp_ids.add(r[0])
        elif r[0] not in found and tool in ran_tools and not r[2].startswith("해결"):
            r[2] = f"해결 ({a.date})"
            resolved += 1
    if ledger or not lp.exists():
        write_ledger(lp, ledger)
    status = {r[0]: r[2] for r in ledger}
    items = [i for i in items if i.id not in fp_ids]
    fp = len(found & fp_ids)
    dups = [d for d in dups if d.id not in fp_ids]

    write_lists(out, items, dups, status, a.date)
    sp = write_summary(out, raw, a.date, items, dups, fp, resolved, counts)

    # 콘솔: 건수 대조 + 요약
    parsed = Counter(i.tool for i in items) + Counter(d.tool for d in dups)
    chk = ", ".join(f"{TOOL_NAME[t]} {counts[t]}→{parsed.get(t, 0)}" for t in counts)
    g = Counter(i.grade for i in items)
    print(f"[대조] raw 건수→보고서 항목 (spotbugs 는 종류·파일 묶음, 오탐 제외): {chk}")
    print(f"[결과] A {g['A']} · B {g['B']} · C {len(dups)} · 참고 {g['R']} · 오탐제외 {fp} · 해결 {resolved}")
    print(f"[요약] {rel(root, str(sp))}")
    print(f"[목록] {rel(root, str(out / '목록'))}/  (A-기계적·B-판단·C-공통화·참고)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
