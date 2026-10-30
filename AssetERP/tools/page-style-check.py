#!/usr/bin/env python3
"""page-style 견본 정합 점검 (읽기 전용).

docs/page-style.md 의 SID별 규칙 중 정규식으로 확인할 수 있는 것만 검사한다.
출력: 화면 x 규칙 표. 견본(docs/page-style/{SID}/ 의 Tab 파일)은 기준선이라 전부 통과해야 한다.

사용:
  tools/page-style-check.py                  # 대상 17개 + 견본
  tools/page-style-check.py SGHF SGEF         # 지정한 SID만
  tools/page-style-check.py --only-fail      # 어긋난 칸만
  tools/page-style-check.py --screen Act02_Tab_DepositIoList [SID]   # 화면 하나(SID는 머리 주석 `스타일:`에서 읽는다)
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
    # Fbx01_Tab_Document는 TO가 아니다(SID 미정)
    "TO": ("Org01_Tab_OrgCode", ["Chk01_Tab_ClassTree"]),
    "GO": ("Tdm54_Tab_CheckInsuff", []),
    "SG": ("Tdm01_Tab_Hr", ["Emp50_Tab_TransportExpenseMng", "Pay50_Tab_ExpensePayWrite", "Pay50_Tab_AccountSumList", "Biz01_Tab_CardUserAllocation"]),  # U06: 기존 SG 화면 91개는 일괄 점검하지 않고 다시 건드릴 때 맞춘다(03 원칙 22 ④)
    "GG": ("Est02_Tab_PfResultReport", ["Ast06_Tab_TrTax", "Emp17_Tab_BenefitManager", "Pay50_Tab_ExpenseJournal", "Act02_Tab_CreateJournalBiz", "Pay50_Tab_ExpenseSettle"]),  # U04: 아래 크기는 원본이 300 고정이라 defaultSize는 점검하지 않는다
    "TG": ("Sys06_Tab_Menu", ["Ast01_Tab_ClassTreeIntrinsic"]),  # W01: TG 규칙 추가. 고정 폭 패널(왼쪽 420 vs 견본 오른쪽 600)은 원본 폭을 따르므로 점검하지 않는다
    "GGH": ("Pay50_Tab_ExpensePay", []),  # U08: 좌우 분할 마스터-상세(제안 2026-10-30). 견본 docs/page-style/GGH/
    "GDP": ("Sms02_Tab_TotalCount", ["Sys10_Tab_TotalSize", "Sms03_Tab_SendAdmin", "Ics02_Tab_Manager"]),
    "DSBRD": ("Tdm50_Tab_TotalDashboard", ["Tdm35_Tab_TaskList"]),
    "STP": ("Pay10_Tab_Retire", ["Tdm50_Tab_CheckJob", "Biz01_Tab_EntertmExpenseReport"]),
    "TP": ("Rpt10_Tab_FssOrg", ["Pay31_Tab_InsureApply", "Pay20_Tab_DeductAdmin"]),  # Pay20_Tab_Deduct는 DeductAdmin 껍데기라 제외
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
    "SG": [
        ("Splitter 없음", r"<Splitter\b", False),
        ("바깥 여백 20", r"padding:\s*20\b", True),
        ("안쪽 padding 10", r"padding:\s*10\b", True),
        ("툴바-그리드 gap 8", r"gap:\s*8\b", True),
        ("SearchBar", r"<SearchBar\b", True),
        ("외곽 테두리 없음", BORDER, False),
    ],
    "GG": [
        ("세로 Splitter", r"<Splitter\b[^>]*vertical", True),
        ("위 최소 120", r"min=\{120\}", True),
        ("아래 최소 200", r"min=\{200\}", True),
        ("SearchBar", r"<SearchBar\b", True),
        ("외곽 테두리 없음", BORDER, False),
    ],
    "TG": [
        ("가로 Splitter", r"<Splitter\b(?![^>]*vertical)", True),
        ("왼쪽 최소 300", r"min=\{300\}", True),
        ("패널 테두리 1px #d9d9d9", r"border\s*:\s*['\"]1px solid #d9d9d9", True),
        ("패널 border-box", r"boxSizing\s*:\s*['\"]border-box", True),
        ("useTreeGrid", r"useTreeGrid", True),
        ("트리 이름 열 pinned left", r"pinned\s*:\s*['\"]left", True),
        ("SearchBar 안 씀", r"<SearchBar\b", False),
    ],
    "GGH": [
        ("가로 Splitter", r"<Splitter\b(?![^>]*vertical)", True),
        ("왼쪽 기본 680", r"defaultSize=\{680\}", True),
        ("왼쪽 최대 1000", r"max=\{1000\}", True),
        ("SearchBar", r"<SearchBar\b", True),
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


def screen_main(cls: str, sid: str | None) -> int:
    """변환 중인 화면 하나를 점검한다. SID를 안 주면 머리 주석 `스타일: XXX`에서 읽는다."""
    p = find(cls)
    if p is None:
        print(f"{cls}: 파일 없음")
        return 2
    if sid is None:
        m = re.search(r"스타일:\s*([A-Z]{2,5})\b", p.read_text(encoding="utf-8"))
        sid = m.group(1) if m else None
    if sid is None:
        print(f"{cls}: 머리 주석에 `스타일: XXX` 선언이 없다 (SID를 인자로 주거나 선언을 넣는다)")
        return 2
    if sid not in RULES:
        print(f"{cls}: SID {sid}는 점검 규칙이 없다. docs/page-style.md {sid} 절을 보고 RULES에 규칙을 추가한다 (03 원칙 22)")
        return 2
    res = check(p, sid)
    names = [n for n, _, _ in COMMON] + [n for n, _, _ in RULES[sid]]
    fails = [n for n in names if not res.get(n, False)]
    print(f"## {sid}\n- {cls}: " + ("모두 통과" if not fails else "✗ " + ", ".join(fails)))
    return 1 if fails else 0


def main() -> int:
    args = sys.argv[1:]
    if args and args[0] == "--screen":
        return screen_main(args[1], args[2] if len(args) > 2 else None)
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
