#!/usr/bin/env python3
"""page-style 견본 정합 점검 (읽기 전용).

docs/page-style.md 의 SID별 규칙 중 정규식으로 확인할 수 있는 것만 검사한다.
출력: 화면 x 규칙 표. 견본(docs/page-style/{SID}/ 의 Tab 파일)은 기준선이라 전부 통과해야 한다.

사용:
  tools/page-style-check.py                  # 대상 17개 + 견본
  tools/page-style-check.py SGHF SGEF         # 지정한 SID만
  tools/page-style-check.py --only-fail      # 어긋난 칸만
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "frontend/src/pages"
SAMPLES = ROOT / "docs/page-style"

# SID -> (견본 클래스, [맞출 화면 클래스])
TARGETS = {
    "SGHF": ("Biz01_Tab_Card", ["Biz01_Tab_Other", "Biz01_Tab_CardContents", "Biz01_Tab_CardSimple",
                                "Biz01_Tab_OtherSimple", "Biz01_Tab_CardContentsSimple"]),
    "SGEF": ("Sys90_Tab_AfterService", ["Sys90_Tab_AfterServiceAdmin", "Ics20_Tab_RevisionHistory",
                                      "Ics20_Tab_RevisionHistoryAdmin"]),
    "TO": ("Org01_Tab_OrgCode", ["Chk01_Tab_ClassTree"])  # Fbx01_Tab_Document는 TO가 아니다(SID 미정),
    "GO": ("Tdm54_Tab_CheckInsuff", ["Sms02_Tab_TotalCount", "Sys10_Tab_TotalSize"]),
    "GDP": ("Sms02_Tab_TotalCount", ["Sys10_Tab_TotalSize", "Sms03_Tab_SendAdmin", "Ics02_Tab_Manager"]),
    "DSBRD": ("Tdm50_Tab_TotalDashboard", ["Tdm35_Tab_TaskList"]),
    "STP": ("Pay10_Tab_Retire", ["Tdm50_Tab_CheckJob"]),
    "TP": ("Rpt10_Tab_FssOrg", ["Pay31_Tab_InsureApply", "Pay20_Tab_DeductAdmin"])  # Pay20_Tab_Deduct는 DeductAdmin 껍데기라 제외,
}

BORDER = r"border\s*:\s*['\"]1px solid"
# (규칙 이름, 정규식, 있어야 하면 True / 없어야 하면 False)
COMMON = [
    ("스타일 선언", None, None),  # 특수 처리
    ("바깥 padding 20", r"padding\s*:\s*(?:20\b|['\"]20px)", True),
    ("배경 #fff", r"background\s*:\s*['\"]#fff", True),
]
RULES = {
    "SGHF": [
        ("가로 Splitter", r"<Splitter\b(?![^>]*vertical)", True),
        ("왼쪽 최소 600", r"min=\{600\}", True),
        ("오른쪽 기본 420", r"defaultSize=\{420\}", True),
        ("외곽 테두리 없음", BORDER, False),
        ("SearchBar", r"<SearchBar\b", True),
    ],
    "SGEF": [
        ("세로 Splitter", r"<Splitter\b[^>]*vertical", True),
        ("위 최소 200", r"min=\{200\}", True),
        ("여백 20 20 8", r"20px 20px 8px|20,\s*20,\s*8|'20 20 8'", True),
        ("SearchBar", r"<SearchBar\b", True),
        ("외곽 테두리 없음", BORDER, False),
    ],
    "TO": [
        ("Splitter 없음", r"<Splitter\b", False),
        ("useTreeGrid", r"useTreeGrid", True),
        ("툴바 Space wrap", r"<Space\b[^>]*wrap", True),
        ("외곽 테두리 없음", BORDER, False),
    ],
    "GO": [
        ("SearchBar 안 씀", r"<SearchBar\b", False),
        ("조건 줄 고정 높이 없음", r"height\s*:\s*50\b", False),
        ("조건 줄 padding 0 10 8", r"0 10px 8px", True),
        ("외곽 테두리 없음", BORDER, False),
        ("초기화 버튼", r"초기화", True),
    ],
    "GDP": [
        ("가로 Splitter", r"<Splitter\b(?![^>]*vertical)", True),
        ("SearchBar 안 씀", r"<SearchBar\b", False),
        ("오른쪽 padding 0", r"20px 20px 20px 0", True),
        ("외곽 테두리 없음", BORDER, False),
    ],
    "DSBRD": [
        # 탭이 없는 변형(Tdm35)도 있어 PageTabs는 필수가 아니다. antd Tabs만 막는다.
        ("antd Tabs 안 씀", r"<Tabs\b", False),
        ("외곽 테두리 없음", BORDER, False),
    ],
    "STP": [
        ("PageTabs", r"<PageTabs\b", True),
        ("antd Tabs 안 씀", r"<Tabs\b", False),
        # 조건 줄은 SearchBar 또는 직접 만든 줄(Tdm50_Tab_CheckJob)이라 필수로 확인하지 않는다.
        # 테두리: 견본이 탭 아래 내용 영역의 얇은 테두리를 남기므로 정규식으로 가를 수 없어 점검하지 않는다(눈으로 확인).
    ],
    "TP": [
        ("PageTabs", r"<PageTabs\b", True),
        ("antd Tabs 안 씀", r"<Tabs\b", False),
        ("툴바 없음", r"<SearchBar\b", False),
        ("외곽 테두리 없음", BORDER, False),
    ],
}


def find(cls: str) -> Path | None:
    for p in PAGES.glob(f"*/{cls}.tsx"):
        return p
    return None


def check(path: Path, sid: str) -> dict[str, bool]:
    raw = path.read_text(encoding="utf-8")
    code = re.sub(r"/\*.*?\*/|(?<!:)//[^\n]*", "", raw, flags=re.S)
    res: dict[str, bool] = {}
    m = re.search(r"스타일:\s*([A-Z]{2,5})\b", raw)
    res["스타일 선언"] = bool(m and m.group(1) == sid)
    for name, rx, want in COMMON[1:]:
        res[name] = bool(re.search(rx, code)) == want
    for name, rx, want in RULES[sid]:
        res[name] = bool(re.search(rx, code)) == want
    return res


def main() -> int:
    args = sys.argv[1:]
    only_fail = "--only-fail" in args
    sids = [a for a in args if not a.startswith("--")] or list(TARGETS)
    bad_total = 0
    for sid in sids:
        sample, screens = TARGETS[sid]
        rows = [("견본 " + sample, SAMPLES / sid / f"{sample}.tsx")] + [(c, find(c)) for c in screens]
        names = [n for n, _, _ in COMMON] + [n for n, _, _ in RULES[sid]]
        print(f"\n## {sid}")
        for label, p in rows:
            if p is None or not p.exists():
                print(f"- {label}: 파일 없음")
                continue
            res = check(p, sid)
            fails = [n for n in names if not res.get(n, False)]
            if label.startswith("견본"):
                tag = "기준선 OK" if not fails else "기준선 실패(규칙 보정 필요): " + ", ".join(fails)
                print(f"- {label}: {tag}")
                continue
            bad_total += len(fails)
            if fails or not only_fail:
                print(f"- {label}: " + ("모두 통과" if not fails else "✗ " + ", ".join(fails)))
    print(f"\n불일치 합계: {bad_total}")
    return 1 if bad_total else 0


if __name__ == "__main__":
    sys.exit(main())
