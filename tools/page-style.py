#!/usr/bin/env python3
"""화면 파일 → 페이지 스타일 ID(SID) 판별기. 표준 라이브러리만 쓴다 (Python 3.8+).

SID 정의는 docs/page-style.md.  SG · SGP · SGVF · SGEF · SGTP · SGT · TG · GG · CG, 못 고르면 '미분류'.

    page-style.py Fnd01_Tab_FundSearch.tsx        # TOBE (React)  → SID
    page-style.py Fnd01_Tab_FundSearch.java       # AS-IS (GXT)   → SID
    page-style.py --json a.tsx b.java             # 특징·근거까지 JSON 한 줄씩
    page-style.py --all <디렉터리>                # *_Tab_*.tsx / *_Tab_*.java 전부 + SID별 분포
    page-style.py --compare <asis.java> <tobe.tsx>  # 두 SID가 같은지 (같으면 종료코드 0)

종료코드: 0 정상, 1 비교 불일치·선언 불일치, 2 사용법/파일 오류.

판별은 '특징 추출(extract_*)'과 '특징 → SID 규칙(classify)'을 나눠 두었다.
SID 규칙이 바뀌면 classify()만 고친다. 두 언어가 같은 특징 딕셔너리를 만든다:
    search : 조회 툴바(SearchBar / 조회 버튼)가 있는가
    grids  : 이 화면 + 자식(_Grid_/_Page_) 의 그리드 수
    trees  : 트리 수
    edit   : None | 'view'(읽기 전용 폼) | 'edit'(편집 폼)  — 화면 안에 붙은 폼만. 팝업은 popup
    popup  : 편집 팝업(모달/Window)을 여는가
    tabpage: 아래에 탭 영역(*_TabPage_*)이 붙는가
    layout : 'vertical'(위아래) | 'horizontal'(좌우) | 'none'
    top_search : 툴바가 분할 영역 밖(전체 폭)에 있는가
    editable_grid : 그리드를 직접 편집(등록·저장)하는가
"""
import json
import os
import re
import sys

SIDS = ('SG', 'SGP', 'SGVF', 'SGEF', 'SGTP', 'SGT', 'TG', 'GG', 'CG')
UNKNOWN = '미분류'


# ───────────────────────── 공통 ─────────────────────────

def read(path):
    with open(path, encoding='utf-8', errors='replace') as f:
        return f.read()


def strip_comments(text):
    """/* */ 와 // 주석을 지운다 (문자열 안의 '//' 는 드물어 무시)."""
    text = re.sub(r'/\*.*?\*/', ' ', text, flags=re.S)
    return re.sub(r'(?<![:\'"])//[^\n]*', ' ', text)


def sibling(path, name, exts):
    d = os.path.dirname(os.path.abspath(path))
    for e in exts:
        p = os.path.join(d, name + e)
        if os.path.isfile(p):
            return p
    return None


# ───────────────────────── TOBE (tsx) ─────────────────────────

GRID_TAG = re.compile(r'<(?:\w*Grid|\w+_Grid_\w+)\b')
TREE_MARK = re.compile(r'useTreeGrid|<Tree\b|treeData\b')


def count_grids_trees(code):
    """tsx 코드 한 파일의 (그리드 수, 트리 수). 트리 표시가 있으면 그 파일의 그리드 태그는 트리로 센다."""
    n = len(GRID_TAG.findall(code))
    if TREE_MARK.search(code):
        return 0, max(n, 1)
    return n, 0
CHILD_IMPORT = re.compile(r"""from\s+['"]\./(\w+_(?:Edit|TabPage|Page|Grid)_\w+)['"]""")


def tsx_child_features(path):
    """자식 파일(Edit/Page/Grid) 하나를 읽어 (kind, grids, trees, editable) 를 돌려준다."""
    code = strip_comments(read(path))
    base = os.path.basename(path)
    grids, trees = count_grids_trees(code)
    if '_Edit_' in base:
        # 읽기 전용: readOnly 가 여러 곳이고 [저장] 단추가 없다
        if re.search(r'<(?:Modal|Drawer)\b|<\w*Modal\b|<\w*Dialog\b', code) or re.search(r'\bopen\b\s*[:,}]', code) and 'onClose' in code:
            return 'Edit', grids, trees, 'popup'
        view = len(re.findall(r'\breadOnly\b', code)) >= 1 and not re.search(r'type=["\']save["\']', code)
        return 'Edit', grids, trees, ('view' if view else 'edit')
    if '_TabPage_' in base:
        return 'TabPage', 0, 0, None   # 탭 안의 그리드·폼은 이 화면의 구조로 세지 않는다
    if '_Page_' in base:
        return 'Page', grids, trees, None
    return 'Grid', grids, trees, None


def extract_tsx(path):
    raw = read(path)
    declared = None
    m = re.search(r'스타일:\s*([A-Z]{2,4})\b', raw)
    if m:
        declared = m.group(1)
    code = strip_comments(raw)

    g0, t0 = count_grids_trees(code)
    f = {'search': '<SearchBar' in code, 'grids': g0, 'trees': t0,
         'edit': None, 'popup': False, 'tabpage': False, 'layout': 'none', 'top_search': False, 'editable_grid': False, 'children': []}

    sp = re.search(r'<Splitter\b([^>]*)>', code)
    if sp:
        f['layout'] = 'vertical' if re.search(r'layout=["\']vertical["\']', sp.group(1)) else 'horizontal'
        sb = code.find('<SearchBar')
        f['top_search'] = f['search'] and sb < sp.start()
    else:
        f['top_search'] = f['search']

    for name in CHILD_IMPORT.findall(code):
        p = sibling(path, name, ('.tsx',))
        if not p:
            continue
        kind, g, t, edit = tsx_child_features(p)
        f['children'].append(name)
        f['grids'] += g
        f['trees'] += t
        if kind == 'Edit' and edit == 'popup':
            f['popup'] = True
        elif kind == 'TabPage':
            f['tabpage'] = True
        elif kind == 'Edit' and f['edit'] is None:
            f['edit'] = edit
    # 그리드를 직접 편집하는 화면: 이 파일에 [저장] 단추 / 편집 그리드 옵션이 있고 편집 폼은 없다
    f['editable_grid'] = f['edit'] is None and bool(
        re.search(r'<Button\s+type=["\']save["\']', code) or re.search(r'\beditable\s*:\s*true|<EditGrid|<CrudGrid|GridInsertRow', code))
    return f, declared


# ───────────────────────── AS-IS (java) ─────────────────────────

JAVA_GRID = re.compile(r'(?<![\w.])Grid<[^>]*>\s+\w+\s*[=;]')
JAVA_TREE = re.compile(r'(?<![\w.])(?:TreeGrid|Tree)<[^>]*>\s+\w+\s*[=;]')
JAVA_CHILD = re.compile(r'\bnew\s+(\w+_(?:Edit|TabPage|Page|Grid)_\w+)\s*\(')


def java_child_features(path):
    code = strip_comments(read(path))
    base = os.path.basename(path)
    grids = len(JAVA_GRID.findall(code))
    trees = len(JAVA_TREE.findall(code))
    if '_Edit_' in base:
        # 팝업: Window/Dialog 를 상속한다. 읽기 전용 폼: setReadOnly 가 많다 (FundSearch 31개, FundCode 0개)
        if re.search(r'\bclass\s+\w+\s+extends\s+\w*(?:Window|Dialog)\b', code):
            return 'Edit', grids, trees, 'popup'
        view = len(re.findall(r'\.setReadOnly\(\s*true\s*\)', code)) >= 5
        return 'Edit', grids, trees, ('view' if view else 'edit')
    if '_TabPage_' in base:
        return 'TabPage', 0, 0, None
    if '_Page_' in base:
        return 'Page', grids, trees, None
    return 'Grid', grids, trees, None


def extract_java(path):
    code = strip_comments(read(path))
    regions = {r: ('set%sWidget(' % r) in code for r in ('North', 'South', 'West', 'East', 'Center')}
    f = {'search': bool(re.search(r'retrieveButton|"조회"|ColorButtonBar', code)),
         'grids': len(JAVA_GRID.findall(code)),
         'trees': len(JAVA_TREE.findall(code)),
         'edit': None, 'popup': False, 'tabpage': False, 'layout': 'none', 'top_search': False, 'editable_grid': False, 'children': [], 'regions': [r for r, v in regions.items() if v]}

    if regions['South'] and not (regions['West'] or regions['East']):
        f['layout'] = 'vertical'
    elif regions['West'] or regions['East']:
        f['layout'] = 'horizontal'
    # 툴바가 전체 폭: North 영역이 있고 좌우로 나뉜다 (SGT) — 위아래 분할(SGVF·SGEF)은 툴바가 위 영역 안에 있다
    f['top_search'] = f['search'] and regions['North']

    for name in JAVA_CHILD.findall(code):
        p = sibling(path, name, ('.java',))
        if not p:
            continue
        kind, g, t, edit = java_child_features(p)
        f['children'].append(name)
        f['grids'] += g
        f['trees'] += t
        if kind == 'Edit' and edit == 'popup':
            f['popup'] = True
        elif kind == 'TabPage':
            f['tabpage'] = True
        elif kind == 'Edit' and f['edit'] is None:
            f['edit'] = edit
    f['editable_grid'] = f['edit'] is None and bool(
        re.search(r'GridInsertRow|InterfaceGridOperate|GridInlineEditing|GridRowEditing|GridEditing|ColorButtonBar\("저장"\)', code))
    return f, None


# ───────────────────────── 규칙 (SID 정의가 바뀌면 여기만 고친다) ─────────────────────────

def classify(f):
    """특징 → (SID, 근거 문장)."""
    g, t, e = f['grids'], f['trees'], f['edit']
    if e and t == 0 and f['layout'] == 'vertical':
        return ('SGVF' if e == 'view' else 'SGEF'), '위아래 분할 + 그리드 + %s 폼' % ('읽기 전용' if e == 'view' else '편집')
    if f['tabpage'] and g == 1 and t == 0 and f['layout'] == 'vertical':
        return 'SGTP', '위아래 분할 + 그리드 + 아래 탭 영역'
    if e:
        return UNKNOWN, '편집 폼이 있으나 위아래 분할이 아니다 (layout=%s, trees=%d)' % (f['layout'], t)
    if t >= 1 and g >= 1 and f['layout'] == 'horizontal':
        if f['top_search']:
            return 'SGT', '툴바 전체 폭 + 좌우 분할(그리드·트리)'
        return 'TG', '좌우 분할(트리·그리드), 툴바가 전체 폭이 아니다'
    if t >= 1:
        return UNKNOWN, '트리가 있으나 그리드와 좌우 분할이 아니다'
    if g >= 2:
        return 'GG', '그리드 %d개' % g
    if g == 1:
        if f['popup']:
            return 'SGP', '조회 툴바 + 그리드 하나 + 편집 팝업'
        if f['editable_grid']:
            return 'CG', '편집 가능한 그리드 하나'
        if f['search']:
            return 'SG', '조회 툴바 + 그리드 하나'
        return UNKNOWN, '그리드 하나, 조회 툴바 없음'
    return UNKNOWN, '그리드 없음'


# ───────────────────────── 실행 ─────────────────────────

def analyze(path):
    ext = os.path.splitext(path)[1].lower()
    if ext == '.tsx':
        f, declared = extract_tsx(path)
    elif ext == '.java':
        f, declared = extract_java(path)
    else:
        raise ValueError('지원하지 않는 확장자: %s (.tsx / .java)' % path)
    sid, why = classify(f)
    return {'file': os.path.basename(path), 'side': 'TOBE' if ext == '.tsx' else 'AS-IS',
            'sid': sid, 'declared': declared, 'why': why, 'features': f}


def line(r):
    s = '%s  %s  (%s)' % (r['file'], r['sid'], r['why'])
    if r['declared'] and r['declared'] != r['sid']:
        s += '  ⚠ 선언 %s ≠ 판별 %s' % (r['declared'], r['sid'])
    return s


def tab_files(d):
    out = []
    for root, _, names in os.walk(d):
        out += [os.path.join(root, n) for n in names if '_Tab_' in n and n.endswith(('.tsx', '.java'))]
    return sorted(out)


def main(argv):
    args = [a for a in argv if not a.startswith('--')]
    as_json = '--json' in argv
    try:
        if '--compare' in argv:
            if len(args) != 2:
                print('사용법: page-style.py --compare <asis.java> <tobe.tsx>', file=sys.stderr)
                return 2
            a, b = analyze(args[0]), analyze(args[1])
            print(line(a))
            print(line(b))
            same = a['sid'] == b['sid'] and a['sid'] != UNKNOWN
            print('일치' if same else '⚠ 불일치: AS-IS %s / TOBE %s' % (a['sid'], b['sid']))
            return 0 if same else 1
        if '--all' in argv:
            if len(args) != 1 or not os.path.isdir(args[0]):
                print('사용법: page-style.py --all <디렉터리>', file=sys.stderr)
                return 2
            results = [analyze(p) for p in tab_files(args[0])]
            for r in results:
                print(json.dumps(r, ensure_ascii=False) if as_json else line(r))
            dist = {}
            for r in results:
                dist.setdefault(r['sid'], []).append(r['file'])
            print('\n# SID별 분포 (%d개)' % len(results))
            for sid in list(SIDS) + [UNKNOWN]:
                if sid in dist:
                    print('%-6s %3d' % (sid, len(dist[sid])))
            return 1 if any(r['declared'] and r['declared'] != r['sid'] for r in results) else 0
        if not args:
            print(__doc__, file=sys.stderr)
            return 2
        bad = 0
        for p in args:
            r = analyze(p)
            print(json.dumps(r, ensure_ascii=False) if as_json else (r['sid'] if len(args) == 1 and not r['declared'] else line(r)))
            bad |= bool(r['declared'] and r['declared'] != r['sid'])
        return 1 if bad else 0
    except (OSError, ValueError) as e:
        print('오류: %s' % e, file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
