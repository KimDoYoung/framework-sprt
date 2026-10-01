#!/usr/bin/env python3
"""
src-index.py - AS-IS AssetERP(GWT/GXT) 소스에서 화면 → 서비스 → SQL → 테이블 호출 경로 색인을 만든다.

AS-IS 호출 구조:
  메뉴(sys06_menu.sys06_class_nm) → MenuOpener.createTab() → 화면 클래스 (client/vi/{도메인}/*_Tab_*)
  → new ServiceRequest("emp.Emp01_Person.selectByText")
  → ServiceBrokerImpl가 리플렉션으로 myApp.server.emp.Emp01_Person#selectByText(SqlSession, ServiceRequest, ServiceResult) 호출
  → sqlSession.selectList(mapperName + ".selectByText")  (mapperName = "emp01_person")
  → server/{도메인}/mapper/*.xml 의 <select id="selectByText"> (namespace="emp01_person")

화면 하나를 변환할 때 전체 소스를 읽지 않고, 이 색인에서 필요한 파일·SQL만 골라 읽기 위한 것이다.

입력:
  src_root        AS-IS 소스 루트 (예: ~/oms-data/src/Asset-ERP, ~/workspace26/Asset-OMS).
                  application/src/main/java 아래에서 client/와 server/를 가진 앱 패키지(myApp, myOms)를 찾는다
  --menus FILE    메뉴 TSV (메뉴번호, 메뉴경로, 클래스명, 사용여부). 없으면 메뉴 이름 없이 MenuOpener 기준으로만 만든다
                  생성 SQL은 docs/as-is/src/README.md 참고
  --db-index DIR  dbml-index.py 출력 폴더 (기본 docs/as-is/db). 있으면 SQL에서 테이블·DB 함수를 정확히 찾고 링크를 건다

출력 (기본 docs/as-is/src/). 한 번에 필요한 것만 읽도록 작은 파일로 나눈다:
  README.md                       사용법, 도메인별 통계
  menus.md                        메뉴 → 화면 파일
  {도메인}/README.md              도메인 목차 (화면, 컴포넌트, 서버 클래스, 매퍼)
  {도메인}/screens/{화면}.md      화면 하나: 함께 쓰는 클래스, 서비스 → 서버 → SQL ID, 테이블, UI(위젯·그리드·이벤트·메서드 줄 범위)
  {도메인}/components/{클래스}.md 컴포넌트 (다른 도메인에서도 쓰는 클래스, 예: 전자결재 문서 편집). 화면은 여기까지만 링크
  {도메인}/services/{클래스}.md   서버 클래스 하나: 메서드별 SQL ID, 호출하는 클라이언트 클래스
  {도메인}/sql/{namespace}.md     매퍼 하나: SQL별 종류, 줄, 테이블, DB 함수, 사용하는 서버 메서드
  unresolved.md                   정적으로 해석하지 못한 호출 (문자열 조합 등)

사용법:
  python3 tools/src-index.py ~/oms-data/src/Asset-ERP --menus docs/as-is/menus.tsv
  python3 tools/src-index.py ~/workspace26/Asset-OMS
  출력 폴더는 실행할 때마다 비우고 다시 만든다. 메뉴 TSV는 출력 폴더 밖에 둔다.
"""
import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = REPO_ROOT / "docs" / "as-is" / "src"
DEFAULT_DB_INDEX = REPO_ROOT / "docs" / "as-is" / "db"
JAVA_REL = Path("application/src/main/java")

COMMON_DOMAIN = "_common"   # client/vi 밖 (service, utils, grid ...)
VIEW_DOMAIN = "_view"      # DB 색인 views.md의 뷰 (테이블처럼 취급)
VI_ROOT_DOMAIN = "_frame"   # 프레임: client/vi 바로 아래, OMS는 client/app (MainFrame, LoginPage ...)

SQL_CALL_RE = re.compile(r"\bsqlSession\s*\.\s*(selectList|selectOne|selectMap|selectCursor|insert|update|delete)\s*\(")
SERVICE_REQ_RE = re.compile(r"\bnew\s+ServiceRequest\s*\(")
# OMS: service.retrieve("tgt.Tgt01_Model.selectByCondition"), updater.update(store, "tgt.Tgt01_Model.save", ...) 처럼
# 헬퍼에 서비스 키를 문자열로 바로 넘긴다. 도메인이 server/{도메인}에 있을 때만 서비스 키로 본다
SERVICE_KEY_LITERAL_RE = re.compile(r'"([a-z]\w*)\.([A-Z]\w*)\.(\w+)"')
# 메서드 선언 후보: 이름(파라미터) [throws ...] {  - 앞부분(반환형·수식어)은 find_methods에서 확인한다
METHOD_HEAD_RE = re.compile(r"\b(\w+)\s*\(([^()]*)\)\s*(?:throws\s+[\w.,\s]+?)?\s*\{")
NOT_METHOD = {"if", "for", "while", "switch", "catch", "synchronized", "return", "new", "else", "try", "do"}
ASSIGN_RE = re.compile(r"(?<![\w.])(\w+)\s*=(?!=)\s*([^;]+);")
MENU_OPENER_RE = re.compile(
    r'"([^"]+)"\s*\.equals\(\s*className\s*\)\s*\)\s*\{\s*return[^;]*?(?:GWT\.create\(\s*([\w.]+)\.class|new\s+([\w.]+)\s*\()')
# OMS: TAB_REGISTRY.put("키", () -> (Widget) GWT.create(myOms.client.vi.sys.Sys01_Tab_Company.class));
MENU_REGISTRY_RE = re.compile(
    r'\.put\(\s*"([^"]+)"\s*,\s*\(\s*\)\s*->[^;]*?(?:GWT\.create\(\s*([\w.]+)\.class|new\s+([\w.]+)\s*\()')
STATEMENT_RE = re.compile(r"<(select|insert|update|delete|sql)\b[^>]*?\bid\s*=\s*\"([^\"]+)\"[^>]*>", re.I)
INCLUDE_RE = re.compile(r"<include\s+refid\s*=\s*\"([^\"]+)\"", re.I)
CTE_RE = re.compile(r"\b(\w+)\s+as\s*\(", re.I)  # WITH x AS ( - 테이블이 아니다
TABLE_KEYWORD_RE = re.compile(r"\b(?:from|join|into|update)\s+([a-z_][a-z0-9_]*)", re.I)


# ---------------------------------------------------------------- Java 전처리

def strip_java(text):
    """(주석 제거본, 주석+문자열 제거본). 줄 번호가 유지되도록 지운 자리는 공백으로 채운다."""
    no_comment, bare = [], []
    i, n = 0, len(text)
    while i < n:
        c = text[i]
        if text.startswith("//", i):
            j = text.find("\n", i)
            j = n if j < 0 else j
            no_comment.append(" " * (j - i)); bare.append(" " * (j - i)); i = j
        elif text.startswith("/*", i):
            j = text.find("*/", i + 2)
            j = n if j < 0 else j + 2
            blank = re.sub(r"[^\n]", " ", text[i:j])
            no_comment.append(blank); bare.append(blank); i = j
        elif c in "\"'":
            j = i + 1
            while j < n and text[j] != c and text[j] != "\n":
                j += 2 if text[j] == "\\" else 1
            j = min(j + 1, n)
            no_comment.append(text[i:j]); bare.append(c + " " * (j - i - 2) + c if j - i >= 2 else text[i:j]); i = j
        else:
            no_comment.append(c); bare.append(c); i += 1
    return "".join(no_comment), "".join(bare)


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def call_argument(text, open_paren):
    """'(' 다음부터 최상위 ',' 또는 ')' 전까지의 첫 번째 인자"""
    depth, i, in_str = 0, open_paren + 1, None
    while i < len(text):
        c = text[i]
        if in_str:
            if c == "\\":
                i += 2
                continue
            if c == in_str:
                in_str = None
        elif c in "\"'":
            in_str = c
        elif c in "([{":
            depth += 1
        elif c in ")]}":
            if depth == 0:
                return text[open_paren + 1:i].strip()
            depth -= 1
        elif c == "," and depth == 0:
            return text[open_paren + 1:i].strip()
        i += 1
    return text[open_paren + 1:].strip()


def split_plus(expr):
    parts, depth, cur, in_str = [], 0, [], None
    for idx, c in enumerate(expr):
        if in_str:
            cur.append(c)
            if c == in_str and expr[idx - 1] != "\\":
                in_str = None
            continue
        if c in "\"'":
            in_str = c
        elif c in "([":
            depth += 1
        elif c in ")]":
            depth -= 1
        if c == "+" and depth == 0:
            parts.append("".join(cur).strip()); cur = []
        else:
            cur.append(c)
    parts.append("".join(cur).strip())
    return parts


_assign_cache = {}


def assignments(scope):
    """코드 조각의 '변수 = 식;' 목록 (변수 → [식]). 같은 코드는 한 번만 스캔한다."""
    key = id(scope)
    cached = _assign_cache.get(key)
    if cached is None or cached[0] is not scope:
        found = defaultdict(list)
        for m in ASSIGN_RE.finditer(scope):
            found[m.group(1)].append(m.group(2))
        cached = (scope, found)
        _assign_cache[key] = cached
    return cached[1]


def eval_string(expr, scopes, depth=0):
    """문자열 식을 정적으로 계산한다. 가능한 값 집합, 못 하면 None.
    scopes: 변수를 찾을 코드 목록 (메서드 본문 → 클래스 전체 순)"""
    if depth > 4:
        return None
    values = {""}
    for part in split_plus(expr):
        part = part.strip().strip("()").strip()
        if re.fullmatch(r'"(?:[^"\\]|\\.)*"', part):
            vals = {part[1:-1]}
        else:
            name = re.fullmatch(r"(?:this\.)?(\w+)", part)
            if not name:
                return None
            vals = None
            for scope in scopes:
                found = set()
                for rhs in assignments(scope).get(name.group(1), ()):
                    v = eval_string(rhs, scopes, depth + 1)
                    if v:
                        found |= v
                # String sql = ""; if (...) sql = "update"; 처럼 빈 문자열은 초기값일 뿐이므로 다른 값이 있으면 뺀다
                if len(found) > 1:
                    found.discard("")
                if found:
                    vals = found
                    break
            if not vals:
                return None
        values = {a + b for a in values for b in vals}
        if len(values) > 20:
            return None
    return values


# ---------------------------------------------------------------- 소스 파싱

def paren_end(text, open_paren):
    """'(' 위치에서 짝이 맞는 ')' 위치 (문자열 안의 괄호는 무시)"""
    depth, i, in_str = 0, open_paren, None
    while i < len(text):
        c = text[i]
        if in_str:
            if c == "\\":
                i += 2
                continue
            if c == in_str:
                in_str = None
        elif c in "\"'":
            in_str = c
        elif c in "([{":
            depth += 1
        elif c in ")]}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return len(text) - 1


def split_args(args):
    """최상위 ',' 기준으로 인자를 나눈다"""
    out, depth, cur, in_str, i = [], 0, [], None, 0
    while i < len(args):
        c = args[i]
        if in_str:
            if c == "\\":
                cur.append(args[i:i + 2]); i += 2
                continue
            if c == in_str:
                in_str = None
        elif c in "\"'":
            in_str = c
        elif c in "([{<":
            depth += 1
        elif c in ")]}>":
            depth -= 1
        elif c == "," and depth == 0:
            out.append("".join(cur).strip()); cur = []; i += 1
            continue
        cur.append(c); i += 1
    if "".join(cur).strip():
        out.append("".join(cur).strip())
    return out


# ── 화면 UI 정적 추출 (GXT 위젯·그리드·이벤트·메서드). LLM 없이 소스 패턴만 본다 ──
UI_NEW_RE = re.compile(r"(?<![\w.])(\w+)\s*=\s*new\s+(\w+)\s*(?:<[^>]*>)?\s*\(")
UI_WIDGET_CLS_RE = re.compile(r"Button$|Field$|ComboBox|CheckBox$|TextArea$|Radio$|^Grid$|^TreeGrid$|^Grid<|Page_|Tab_|Lookup_|Edit_|Popup_|Tree_")
UI_HANDLER_RE = re.compile(r"(?<![\w.])((?:this\.)?[\w.()]+?)\.add(\w+)Handler\s*\(")
UI_REGION_RE = re.compile(r"\bset(West|Center|North|South|East)Widget\s*\(")
UI_PARAM_RE = re.compile(r"\.addParam\s*\(")
UI_MSG_RE = re.compile(r"(SimpleMessage\.\w+|new\s+ConfirmBox|Info\.display|Window\.alert|new\s+MessageBox|new\s+AlertMessageBox)\s*\(")
UI_LOGIN_RE = re.compile(r"\bLoginUser\.(\w+)\s*\(")
UI_STR_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')
UI_BUILDER_CALL_RE = re.compile(r"(?<![\w.])(\w+)\.(add\w+|setChecked|getTreeGrid|getGrid|setRowNumHidden|setDoubleClickEdit)\s*\(")


def _short(expr, n=40):
    expr = re.sub(r"\s+", " ", expr).strip()
    return expr if len(expr) <= n else expr[:n - 1] + "…"


def _strings(expr):
    return UI_STR_RE.findall(expr)


def ui_lines(cls):
    """클래스 하나의 UI 요약 줄 (화면 파일 '## UI' 절). 모델·Properties는 없다"""
    text = cls.path.read_text(encoding="utf-8", errors="replace")
    code, bare = strip_java(text)
    methods = find_methods(bare)
    meth_names = {m[0] for m in methods}
    total = text.count("\n") + 1

    # 위젯: var = new Class(args)
    widgets = {}
    for m in UI_NEW_RE.finditer(code):
        var, klass = m.group(1), m.group(2)
        close = paren_end(code, m.end() - 1)
        args = code[m.end():close]
        widgets.setdefault(var, (klass, args))
    builders = {v for v, (k, _) in widgets.items() if k == "GridBuilder"}
    # 필드 (grid = this.buildGrid() 처럼 new가 아닌 것 포함) — 이벤트에서 부르는 대상
    members = set(widgets) | set(re.findall(r"(?:private|protected|public)\s+(?:final\s+)?[\w<>,\s]+?\s+(\w+)\s*[=;]", code))

    def label(var):
        var = var.replace("this.", "")
        w = widgets.get(var)
        if not w:
            return var
        s = _strings(w[1])
        if w[0].endswith("Button") and s:
            return f"{var}[{s[0]}]"
        return var

    out = [f"### {cls.name} (`{cls.rel}`, {total}줄)", ""]

    regions = []
    for m in UI_REGION_RE.finditer(code):
        arg = split_args(code[m.end():paren_end(code, m.end() - 1)])
        if arg:
            regions.append(f"{m.group(1).lower()}={arg[0].replace('this.', '')}")
    if regions:
        out.append("- 레이아웃: " + ", ".join(regions))

    # 툴바: ButtonBar·ToolBar 변수에 add한 순서
    for bar in [v for v, (k, _) in widgets.items() if k in ("ButtonBar", "ToolBar", "ColorButtonBar")]:
        items = []
        for m in re.finditer(rf"(?<![\w.]){bar}\.add\s*\(", code):
            arg = split_args(code[m.end():paren_end(code, m.end() - 1)])
            if not arg:
                continue
            a = arg[0].replace("this.", "")
            s = _strings(a)
            if a.startswith("new LabelToolItem") or a.startswith("new FieldLabel"):
                # 첫 문자열이 라벨 (setHtmlCheckBoxStyle("라벨", "색상") 같은 뒤 인자는 스타일)
                if s and s[0].strip():
                    items.append(f"{s[0].strip()}:")
                inner = re.match(r"new FieldLabel\s*\(\s*(\w+)", a)
                if inner:
                    items.append(f"{{{inner.group(1)}}}")
            elif a in widgets and widgets[a][0].endswith("Button"):
                items.append(f"[{_strings(widgets[a][1])[0] if _strings(widgets[a][1]) else a}]")
            elif re.fullmatch(r"\w+", a):
                items.append(f"{{{a}}}")
        if items:
            out.append(f"- 툴바 `{bar}`: " + " ".join(items))

    # 입력 위젯 (버튼·그리드·바 제외)
    fields = []
    for var, (klass, args) in widgets.items():
        if klass.endswith("Button") or klass in ("GridBuilder", "ButtonBar", "ToolBar", "ColorButtonBar", "ContentPanel",
                                                  "VerticalLayoutContainer", "HorizontalLayoutContainer", "FieldLabel",
                                                  "BorderLayoutData", "VerticalLayoutData", "HorizontalLayoutData", "Margins",
                                                  "ServiceRequest", "ServiceCall", "ArrayList", "HashMap"):
            continue
        if not UI_WIDGET_CLS_RE.search(klass) or klass.startswith("Grid"):
            continue
        desc = f"`{var}` {klass}"
        s = [x for x in _strings(args) if x.strip()]
        if s:
            desc += "(" + ", ".join(f'"{x}"' for x in s) + ")"
        empty = re.search(rf"(?<![\w.]){var}\.setEmptyText\s*\(\s*\"([^\"]*)\"", code)
        if empty:
            desc += f' 빈칸="{empty.group(1)}"'
        fields.append(desc)
    if fields:
        out.append("- 입력·하위 화면: " + ", ".join(fields))
    buttons = [label(v) for v, (k, _) in widgets.items() if k.endswith("Button") and k != "DialogButton"]
    if buttons:
        out.append("- 버튼: " + ", ".join(buttons))

    # 그리드: GridBuilder를 쓰는 메서드마다
    for name, decl, start, end, _pub, _params in methods:
        body = code[start:end]
        cols, flags = [], []
        for m in UI_BUILDER_CALL_RE.finditer(body):
            if m.group(1) not in builders:
                continue
            op = m.group(2)
            args = split_args(body[m.end():paren_end(body, m.end() - 1)])
            if op == "setChecked":
                flags.append("체크박스" + ("(다중)" if args and "MULTI" in args[0] else ""))
            elif op == "getTreeGrid":
                flags.append("트리")
            elif op == "setRowNumHidden":
                flags.append("행번호숨김")
            elif op == "setDoubleClickEdit":
                flags.append("더블클릭편집")
            elif op.startswith("add") and args:
                fld = re.search(r"\.(\w+)\s*\(\s*\)", args[0])
                fld = fld.group(1) if fld else _short(args[0], 20)
                width = args[1] if len(args) > 1 else ""
                head = _strings(args[2])[0] if len(args) > 2 and _strings(args[2]) else ""
                edit = ""
                if len(args) > 3:
                    em = re.match(r"new\s+(\w+)", args[3])
                    edit = f" 편집:{em.group(1) if em else _short(args[3], 20)}"
                kind = op[3:] or "Text"
                cols.append(f"{fld} {width} \"{head}\" {kind}{edit}")
        if cols:
            target = [v for v, (k, a) in widgets.items()]  # 필드 초기화 `grid = this.buildGrid()`
            holder = re.search(rf"(\w+)\s*=\s*(?:this\.)?{name}\s*\(\s*\)", code)
            hdr = f"- 그리드 `{holder.group(1) if holder else name}` ({name}()"
            hdr += (", " + ", ".join(flags) if flags else "") + "):"
            out.append(hdr)
            out += [f"  - {c}" for c in cols]

    # 이벤트: widget.addXxxHandler(...) → 본문에서 부르는 메서드
    events, handler_spans = [], []
    for m in UI_HANDLER_RE.finditer(code):
        close = paren_end(code, m.end() - 1)
        handler_spans.append((m.end(), close))
        body = code[m.end():close]
        calls = []
        for c in re.finditer(r"(?<![\w])((?:\w+\.)?)(\w+)\s*\(", body):
            recv, fn = c.group(1), c.group(2)
            if recv in ("", "this.") and fn in meth_names:
                calls.append(f"{fn}()")
            elif recv and recv[:-1] in members and not fn.startswith(("get", "set", "is", "add")):
                calls.append(f"{recv}{fn}()")
        src = re.sub(r"\.getSelectionModel\(\)", "", m.group(1)).replace("this.", "")
        if calls:
            events.append(f"{label(src)}.{m.group(2)} → {', '.join(dict.fromkeys(calls))}")
    if events:
        out.append("- 이벤트: " + "; ".join(dict.fromkeys(events)))

    # 메서드: 줄 범위, 서비스(파라미터), 부르는 메서드, 메시지, 세션
    mlines = []
    for name, decl, start, end, _pub, params in methods:
        body = code[start:end]
        if name == cls.name and not body.strip("{} \n\t"):
            continue
        parts = []
        svcs = [s.group(0)[1:-1] for s in SERVICE_KEY_LITERAL_RE.finditer(body)]
        prms = []
        for p in UI_PARAM_RE.finditer(body):
            a = split_args(body[p.end():paren_end(body, p.end() - 1)])
            if len(a) >= 2:
                prms.append(f"{_strings(a[0])[0] if _strings(a[0]) else a[0]}={_short(a[1], 30)}")
        if svcs:
            parts.append("서비스 " + ", ".join(f"`{s}`" for s in dict.fromkeys(svcs))
                         + (f" ({', '.join(dict.fromkeys(prms))})" if prms else ""))
        # 이벤트 핸들러 안의 호출은 '이벤트'에 있으므로 빼고, 메서드가 직접 부르는 것만 (생성자의 최초 조회 여부가 보이게)
        own = list(bare[start:end])
        for hs, he in handler_spans:
            for i in range(max(hs, start), min(he, end)):
                own[i - start] = " "
        calls = [c.group(1) for c in re.finditer(r"(?<![\w.])(?:this\.)?(\w+)\s*\(", "".join(own))
                 if c.group(1) in meth_names and c.group(1) != name]
        if calls:
            parts.append("→ " + ", ".join(f"{c}()" for c in dict.fromkeys(calls)))
        msgs = []
        for mm in UI_MSG_RE.finditer(body):
            s = [x for x in _strings(body[mm.end():paren_end(body, mm.end() - 1)]) if x.strip()]
            if s:
                msgs.append(" / ".join(s))
        if msgs:
            parts.append("메시지 " + ", ".join(f'"{x}"' for x in dict.fromkeys(msgs)))
        login = sorted({l.group(1) for l in UI_LOGIN_RE.finditer(body)})
        if login:
            parts.append("세션 " + ", ".join(login))
        a, b = line_of(code, decl), line_of(code, end)
        mlines.append(f"  - `{name}({_short(params, 30)})` L{a}-{b}" + (": " + "; ".join(parts) if parts else ""))
    if mlines:
        out.append("- 메서드:")
        out += mlines
    out.append("")
    return out


class ClientClass:
    def __init__(self, name, rel, domain, is_model):
        self.name, self.rel, self.domain, self.is_model = name, rel, domain, is_model
        self.path = None
        self.services = []      # (service key, line)
        self.unresolved = []    # (expr, line)
        self.refs = set()       # 참조하는 vi 클래스 이름


class ServerMethod:
    def __init__(self, cls, name, line, is_service):
        self.cls, self.name, self.line, self.is_service = cls, name, line, is_service
        self.sql_ids = set()
        self.unresolved = []    # (expr, line)
        self.calls = set()      # 같은 클래스의 다른 메서드
        self.cross = set()      # 다른 서버 클래스 (simple name)

    @property
    def key(self):
        return f"{self.cls.key}.{self.name}"


class ServerClass:
    def __init__(self, key, rel, domain):
        self.key, self.rel, self.domain = key, rel, domain
        self.methods = {}


class Statement:
    def __init__(self, ns, sid, kind, rel, line, domain):
        self.ns, self.sid, self.kind, self.rel, self.line, self.domain = ns, sid, kind, rel, line, domain
        self.tables, self.functions, self.includes, self.ctes = set(), set(), [], set()

    @property
    def key(self):
        return f"{self.ns}.{self.sid}"


def client_domain(rel):
    parts = rel.parts  # client/vi/emp/...
    if len(parts) >= 3 and parts[1] == "vi":
        return parts[2] if len(parts) >= 4 else VI_ROOT_DOMAIN
    if len(parts) == 3 and parts[1] == "app":
        return VI_ROOT_DOMAIN
    return COMMON_DOMAIN


def parse_client(app):
    classes = {}
    server_domains = {d.name for d in (app / "server").iterdir() if d.is_dir()}
    for path in sorted((app / "client").rglob("*.java")):
        rel = path.relative_to(app)
        no_comment, bare = strip_java(path.read_text(encoding="utf-8", errors="replace"))
        cls = ClientClass(path.stem, rel, client_domain(rel), "model" in rel.parts or path.stem.endswith("Properties"))
        cls.path = path
        for m in SERVICE_REQ_RE.finditer(no_comment):
            arg = call_argument(no_comment, m.end() - 1)
            line = line_of(no_comment, m.start())
            if not arg:
                continue  # new ServiceRequest() 후 setServiceName(...) - 아래에서 처리
            vals = eval_string(arg, [no_comment])
            if vals:
                cls.services += [(v, line) for v in sorted(vals)]
            else:
                cls.unresolved.append((arg, line))
        for m in re.finditer(r"\.setServiceName\s*\(", no_comment):
            arg = call_argument(no_comment, m.end() - 1)
            vals = eval_string(arg, [no_comment])
            line = line_of(no_comment, m.start())
            if vals:
                cls.services += [(v, line) for v in sorted(vals)]
            else:
                cls.unresolved.append((arg, line))
        found = {v for v, _ in cls.services}
        for m in SERVICE_KEY_LITERAL_RE.finditer(no_comment):
            key = m.group(0)[1:-1]
            if m.group(1) in server_domains and key not in found:
                found.add(key)
                cls.services.append((key, line_of(no_comment, m.start())))
        cls._bare = bare
        classes.setdefault(cls.name, []).append(cls)
    # vi 클래스 간 참조 (모델·Properties 제외)
    vi_names = {name for name, items in classes.items() if any(c.domain != COMMON_DOMAIN and not c.is_model for c in items)}
    for items in classes.values():
        for cls in items:
            tokens = set(re.findall(r"\b[A-Z]\w+\b", cls._bare))
            cls.refs = (tokens & vi_names) - {cls.name}
            del cls._bare
    return classes


def find_methods(bare):
    """클래스 본문의 메서드 (이름, 선언 위치, 본문 시작, 본문 끝, public 여부, 파라미터)"""
    methods = []
    for m in METHOD_HEAD_RE.finditer(bare):
        name = m.group(1)
        if name in NOT_METHOD:
            continue
        # 선언문 앞부분: 직전 ; { } 이후. 반환형이 있어야 하고 호출·생성자 호출(new X(){)은 제외
        prefix_start = max(bare.rfind(";", 0, m.start()), bare.rfind("{", 0, m.start()), bare.rfind("}", 0, m.start())) + 1
        prefix = bare[prefix_start:m.start()].split()
        if not prefix or prefix[-1] in NOT_METHOD or "=" in "".join(prefix) or prefix[-1].endswith((".", "(", ",")):
            continue
        modifiers = set(prefix)
        start = m.end() - 1
        depth, i = 0, start
        while i < len(bare):
            if bare[i] == "{":
                depth += 1
            elif bare[i] == "}":
                depth -= 1
                if depth == 0:
                    break
            i += 1
        methods.append((name, m.start(1), start, i, "public" in modifiers, m.group(2)))
    # 다른 메서드 안에 잡힌 것(익명 클래스 등)은 바깥 메서드에 합친다
    methods.sort(key=lambda x: x[2])
    top, end = [], -1
    for meth in methods:
        if meth[2] > end:
            top.append(meth)
            end = meth[3]
    return top


def parse_server(app):
    classes = {}
    server_dir = app / "server"
    for path in sorted(server_dir.rglob("*.java")):
        rel = path.relative_to(app)
        pkg = path.relative_to(server_dir).with_suffix("")
        key = ".".join(pkg.parts)
        domain = pkg.parts[0] if len(pkg.parts) > 1 else COMMON_DOMAIN
        no_comment, bare = strip_java(path.read_text(encoding="utf-8", errors="replace"))
        cls = ServerClass(key, rel, domain)
        for name, name_pos, body_start, body_end, is_public, params in find_methods(bare):
            is_service = is_public and "SqlSession" in params and "ServiceRequest" in params and "ServiceResult" in params
            meth = ServerMethod(cls, name, line_of(bare, name_pos), is_service)
            body = no_comment[body_start:body_end + 1]
            body_bare = bare[body_start:body_end + 1]
            for m in SQL_CALL_RE.finditer(body):
                arg = call_argument(body, m.end() - 1)
                vals = eval_string(arg, [body, no_comment])
                if vals:
                    meth.sql_ids |= vals
                else:
                    meth.unresolved.append((arg, line_of(no_comment, body_start + m.start())))
            meth._body_bare = body_bare
            cls.methods.setdefault(name, meth)
        names = set(cls.methods)
        for meth in cls.methods.values():
            called = set(re.findall(r"(?<![\w.])(\w+)\s*\(", meth._body_bare)) & names
            meth.calls = called - {meth.name}
            meth._tokens = set(re.findall(r"\b[A-Z]\w+\b", meth._body_bare))
            del meth._body_bare
        classes[key] = cls
    simple = {c.key.split(".")[-1] for c in classes.values()}
    for cls in classes.values():
        for meth in cls.methods.values():
            meth.cross = (meth._tokens & simple) - {cls.key.split(".")[-1]}
            del meth._tokens
    return classes


def all_sql_ids(meth, seen=None):
    """같은 클래스 안에서 호출하는 메서드까지 포함한 SQL ID"""
    seen = seen or set()
    if meth.name in seen:
        return set()
    seen.add(meth.name)
    ids = set(meth.sql_ids)
    for name in meth.calls:
        ids |= all_sql_ids(meth.cls.methods[name], seen)
    return ids


def strip_sql(text):
    text = re.sub(r"<!--.*?-->", lambda m: re.sub(r"[^\n]", " ", m.group(0)), text, flags=re.S)
    text = re.sub(r"/\*.*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), text, flags=re.S)
    return re.sub(r"--[^\n]*", "", text)


def parse_mappers(app, known_tables, known_functions, known_columns=frozenset()):
    statements = {}
    for path in sorted(app.rglob("*.xml")):
        raw = path.read_text(encoding="utf-8", errors="replace")
        ns = re.search(r"<mapper\s+namespace\s*=\s*\"([^\"]+)\"", raw)
        if not ns:
            continue
        rel = path.relative_to(app)
        domain = rel.parts[1] if len(rel.parts) > 2 and rel.parts[0] == "server" else COMMON_DOMAIN
        text = strip_sql(raw)
        for m in STATEMENT_RE.finditer(text):
            kind = m.group(1).lower()
            end = text.find(f"</{m.group(1)}>", m.end())
            body = text[m.end(): end if end > 0 else len(text)]
            st = Statement(ns.group(1), m.group(2), kind, rel, line_of(text, m.start()), domain)
            sql = re.sub(r"<[^>]+>", " ", body)
            # FROM/JOIN 추정은 DB 색인이 있어도 합친다 - 색인(asseterpdb)에 없는 테이블을 table_link에서 표시하기 위해
            st.ctes = {c.lower() for c in CTE_RE.findall(sql)}
            st.tables = {t.lower() for t in TABLE_KEYWORD_RE.findall(sql)
                         if re.match(r"[a-z]+\d", t.lower()) and t.lower() not in known_functions | known_columns}
            if known_tables:
                st.tables |= {t for t in re.findall(r"\b[a-z_][a-z0-9_]*\b", sql.lower()) if t in known_tables}
            if known_functions:
                st.functions = {f for f in re.findall(r"\b([a-z_][a-z0-9_]*)\s*\(", sql.lower()) if f in known_functions}
            st.includes = INCLUDE_RE.findall(body)
            statements[st.key] = st
    # <include refid>의 테이블·함수 합치기
    def resolve(st, seen):
        for ref in st.includes:
            target = statements.get(ref) or statements.get(f"{st.ns}.{ref}")
            if target and target.key not in seen:
                seen.add(target.key)
                resolve(target, seen)
                st.tables |= target.tables
                st.functions |= target.functions
                st.ctes |= target.ctes
    for st in statements.values():
        resolve(st, {st.key})
    for st in statements.values():
        st.tables -= st.ctes  # WITH x AS ( 의 x는 테이블이 아니다 (include한 <sql>에 정의된 것 포함)
    return statements


def parse_menu_opener(app):
    path = next((p for p in (app / "client" / "vi" / "MenuOpener.java", app / "client" / "app" / "MenuOpener.java") if p.is_file()), None)
    if not path:
        return {}
    no_comment, _ = strip_java(path.read_text(encoding="utf-8", errors="replace"))
    matches = [*MENU_OPENER_RE.finditer(no_comment), *MENU_REGISTRY_RE.finditer(no_comment)]
    return {m.group(1): (m.group(2) or m.group(3)).split(".")[-1] for m in matches}


def load_menus(path):
    menus = []
    if not path:
        return menus
    for line in Path(path).read_text(encoding="utf-8").splitlines():
        cols = line.split("\t")
        if len(cols) >= 3 and cols[2]:
            menus.append({"no": cols[0], "path": cols[1], "key": cols[2], "use": cols[3] if len(cols) > 3 else ""})
    return menus


def load_db_index(db_dir):
    tables, functions, columns = {}, set(), set()
    if not db_dir or not Path(db_dir).is_dir():
        return tables, functions, columns
    for f in (Path(db_dir) / "tables").glob("*.md"):
        text = f.read_text(encoding="utf-8")
        for name in re.findall(r"^\| `([^`]+)` \|", text, re.M):
            tables[name] = f.stem
        columns |= set(re.findall(r'^\s+"(\w+)" "', text, re.M))
    views = Path(db_dir) / "views.md"
    if views.is_file():
        for name in re.findall(r"^## \w+\.(\w+)", views.read_text(encoding="utf-8"), re.M):
            tables[name] = VIEW_DOMAIN
    readme = Path(db_dir) / "functions" / "README.md"
    if readme.is_file():
        functions = set(re.findall(r"^\| \[`([^`]+)`\]", readme.read_text(encoding="utf-8"), re.M))
    return tables, functions, columns


# ---------------------------------------------------------------- 출력

class Index:
    def __init__(self, app, client, server, statements, opener, menus, tables, db_rel):
        self.app, self.client, self.server, self.statements = app, client, server, statements
        self.opener, self.menus, self.tables, self.db_rel = opener, menus, tables, db_rel
        self.screen_names = set(opener.values())
        # 서비스 키 → 서버 메서드
        self.service_methods = {}
        for cls in server.values():
            for meth in cls.methods.values():
                if meth.is_service:
                    self.service_methods[meth.key] = meth
        # 역참조: 서비스 → 호출하는 클라이언트 클래스, SQL → 서버 메서드
        self.service_callers = defaultdict(set)
        for items in client.values():
            for c in items:
                for key, _ in c.services:
                    self.service_callers[key].add(c.name)
        self.sql_users = defaultdict(set)
        for meth in self.service_methods.values():
            for sid in all_sql_ids(meth):
                self.sql_users[sid].add(meth.key)
        self.ns_domain = {}
        for st in statements.values():
            self.ns_domain.setdefault(st.ns, st.domain)
        # 컴포넌트: 다른 도메인에서 참조하는 vi 클래스 (예: 전자결재 문서 편집 Apr01_Edit_ApprDoc)
        self.used_by_domains = defaultdict(set)
        for items in client.values():
            for c in items:
                for ref in c.refs:
                    target = self.client_class(ref)
                    if (target and self.is_vi(target) and target.domain != c.domain and self.is_vi(c)
                            and VI_ROOT_DOMAIN not in (c.domain, target.domain)):
                        self.used_by_domains[ref].add(c.domain)
        # 프레임 클래스(LoginPage, MainFrame, MyPage ...): 서비스를 호출하거나 업무 화면 클래스를 여는 것은 화면처럼 파일을 만든다
        self.frame_names = {c.name for items in client.values() for c in items
                            if c.domain == VI_ROOT_DOMAIN and not c.is_model
                            and (c.services or any(self.is_vi(t) and t.domain != VI_ROOT_DOMAIN
                                                   for t in map(self.client_class, c.refs) if t))}
        self.screen_names |= self.frame_names
        self.component_names = {n for n in self.used_by_domains if n not in self.screen_names}

    def client_class(self, name):
        items = self.client.get(name, [])
        return items[0] if items else None

    @staticmethod
    def is_vi(cls):
        return cls.domain != COMMON_DOMAIN and not cls.is_model

    def is_unit(self, name):
        return name in self.screen_names or name in self.component_names

    def closure(self, start):
        """단위(화면·컴포넌트)에서 도달하는 같은 도메인 vi 클래스.
        다른 단위는 따라가지 않고 linked로 돌려준다 (각자 자기 파일이 있다)."""
        seen, stack, linked, visited = [], [start], set(), {start}
        in_frame = start in self.frame_names  # 업무 화면에서는 프레임 클래스(LoginUser 등)를 따라가지 않는다
        while stack:
            cls = self.client_class(stack.pop())
            if not cls:
                continue
            seen.append(cls)
            for ref in sorted(cls.refs):
                if ref in visited:
                    continue
                visited.add(ref)
                target = self.client_class(ref)
                if not target or not self.is_vi(target) or (target.domain == VI_ROOT_DOMAIN and not in_frame):
                    continue
                if self.is_unit(ref):
                    linked.add(ref)
                else:
                    stack.append(ref)
        return seen, linked

    # 출력 파일 경로 (출력 폴더 기준)
    def unit_path(self, name):
        cls = self.client_class(name)
        kind = "screens" if name in self.screen_names else "components"
        return f"{cls.domain}/{kind}/{name}.md"

    @staticmethod
    def service_path(server_cls):
        name = server_cls.key.split(".", 1)[1] if "." in server_cls.key else server_cls.key
        return f"{server_cls.domain}/services/{name}.md"

    def sql_path(self, ns):
        return f"{self.ns_domain.get(ns, COMMON_DOMAIN)}/sql/{ns}.md"

    def table_link(self, table, up):
        dom = self.tables.get(table)
        if self.tables and not dom:
            return f"`{table}` ⚠DB없음"
        if not dom or not self.db_rel:
            return f"`{table}`"
        doc = "views.md" if dom == VIEW_DOMAIN else f"tables/{dom}.md"
        return f"[`{table}`]({up}{self.db_rel}/{doc})"

    def sql_link(self, sid, up):
        st = self.statements.get(sid)
        if not st:
            return f"`{sid}`(없음)"
        return f"[`{sid}`]({up}{self.sql_path(st.ns)})"


def md_cell(v):
    return str(v).replace("|", "\\|").replace("\n", " ")


def write(out, rel, lines):
    path = out / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_unit(idx, out, name, menus_by_key, keys_by_class):
    """화면·컴포넌트 하나의 파일: 함께 쓰는 클래스, 연결 단위, 서비스 → 서버 → SQL, 테이블"""
    up = "../../"
    cls = idx.client_class(name)
    classes, linked = idx.closure(name)
    is_screen = name in idx.screen_names
    kind = "프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)" if name in idx.frame_names else "화면" if is_screen else "컴포넌트 (다른 도메인에서도 쓰는 클래스)"
    lines = [f"# {name}", "", f"- 종류: {kind}"]
    for key in keys_by_class.get(name, []):
        for m in menus_by_key.get(key, []):
            lines.append(f"- 메뉴: {m['path']} (#{m['no']}{'' if m['use'] == 'true' else ', 미사용'})")
        if key != name:
            lines.append(f"- 메뉴 키: `{key}`")
    if not is_screen:
        lines.append("- 사용 도메인: " + ", ".join(f"`{d}`" for d in sorted(idx.used_by_domains[name])))
    lines.append(f"- 파일: `{cls.rel}`")
    others = [c for c in classes if c is not cls]
    if others:
        lines.append(f"- 함께 쓰는 클래스 {len(others)}개:")
        lines += [f"  - `{c.name}` `{c.rel}`" for c in others]
    if linked:
        lines.append("- 연결 화면·컴포넌트 (각 파일 참고): " + ", ".join(
            f"[`{n}`]({up}{idx.unit_path(n)})" for n in sorted(linked)))

    calls = defaultdict(set)
    for c in classes:
        for skey, line in c.services:
            calls[skey].add(f"{c.name}:{line}")
    tables, functions = set(), set()
    if calls:
        lines += ["", "## 서비스", "", "| 서비스 | 호출 위치 | 서버 | SQL ID |", "|:---|:---|:---|:---|"]
        for skey in sorted(calls):
            meth = idx.service_methods.get(skey)
            if meth:
                ids = sorted(all_sql_ids(meth))
                for sid in ids:
                    st = idx.statements.get(sid)
                    if st:
                        tables |= st.tables
                        functions |= st.functions
                server = f"[`{meth.cls.rel.name}:{meth.line}`]({up}{idx.service_path(meth.cls)})"
                sql = ", ".join(idx.sql_link(i, up) for i in ids) or "-"
            else:
                server, sql = "**(없음)**", "-"
            lines.append(f"| `{skey}` | {', '.join(sorted(calls[skey]))} | {server} | {md_cell(sql)} |")
    if tables:
        lines += ["", "## 테이블", "", ", ".join(idx.table_link(t, up) for t in sorted(tables))]
    if functions:
        lines += ["", "## DB 함수", "", ", ".join(f"`{f}`" for f in sorted(functions))]
    unresolved = [(c.name, e, l) for c in classes for e, l in c.unresolved]
    if unresolved:
        lines += ["", "## 해석 못 한 서비스 호출", ""] + [f"- `{n}:{l}` `{md_cell(e)}`" for n, e, l in unresolved]
    ui = [c for c in classes if idx.is_vi(c) and c.path]
    if ui:
        lines += ["", "## UI", "", "GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.", ""]
        for c in ui:
            lines += ui_lines(c)
    write(out, idx.unit_path(name), lines)
    return len(others), len(calls)


def write_services(idx, out, cls):
    up = "../../"
    services = sorted((m for m in cls.methods.values() if m.is_service), key=lambda m: m.line)
    lines = [f"# {cls.key}", "", f"`{cls.rel}`", "",
             "서비스 키 `" + cls.key + ".{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.", "",
             "| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |", "|:---|---:|:---|:---|:---|"]
    for m in services:
        ids = ", ".join(idx.sql_link(i, up) for i in sorted(all_sql_ids(m))) or "-"
        callers = ", ".join(f"`{c}`" for c in sorted(idx.service_callers.get(m.key, []))) or "-"
        cross = ", ".join(f"`{c}`" for c in sorted(m.cross))
        lines.append(f"| `{m.name}` | {m.line} | {ids} | {callers} | {cross} |")
    write(out, idx.service_path(cls), lines)
    return len(services)


def write_sql(idx, out, ns, items):
    up = "../../"
    lines = [f"# {ns}", "", f"`{items[0].rel}`", "", "테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.", "",
             "| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |", "|:---|:---|---:|:---|:---|:---|"]
    for s in sorted(items, key=lambda s: s.line):
        tables = ", ".join(idx.table_link(t, up) for t in sorted(s.tables)) or "-"
        funcs = ", ".join(f"`{f}`" for f in sorted(s.functions))
        users = ", ".join(f"`{u}`" for u in sorted(idx.sql_users.get(s.key, []))) or ("" if s.kind == "sql" else "-")
        lines.append(f"| `{s.sid}` | {s.kind} | {s.line} | {tables} | {funcs} | {users} |")
    write(out, idx.sql_path(ns), lines)


def write_domains(idx, out):
    menus_by_key = defaultdict(list)
    for m in idx.menus:
        menus_by_key[m["key"]].append(m)
    keys_by_class = defaultdict(list)
    for key, name in idx.opener.items():
        keys_by_class[name].append(key)

    dom_units = defaultdict(list)
    for name in sorted(idx.screen_names | idx.component_names):
        cls = idx.client_class(name)
        if cls and idx.is_vi(cls):
            n_classes, n_services = write_unit(idx, out, name, menus_by_key, keys_by_class)
            dom_units[cls.domain].append((name, n_classes, n_services))
    dom_services = defaultdict(list)
    for cls in sorted(idx.server.values(), key=lambda c: c.key):
        if any(m.is_service for m in cls.methods.values()):
            dom_services[cls.domain].append((cls, write_services(idx, out, cls)))
    dom_sql = defaultdict(list)
    by_ns = defaultdict(list)
    for st in idx.statements.values():
        by_ns[st.ns].append(st)
    for ns, items in sorted(by_ns.items()):
        write_sql(idx, out, ns, items)
        dom_sql[idx.ns_domain[ns]].append((ns, items))

    stats = {}
    for dom in sorted(set(dom_units) | set(dom_services) | set(dom_sql)):
        units = dom_units.get(dom, [])
        screens = [u for u in units if u[0] in idx.screen_names]
        comps = [u for u in units if u[0] not in idx.screen_names]
        lines = [f"# 도메인: {dom}", "",
                 f"화면 {len(screens)}개, 컴포넌트 {len(comps)}개, 서버 클래스 {len(dom_services.get(dom, []))}개, 매퍼 {len(dom_sql.get(dom, []))}개.", ""]
        if screens:
            lines += ["## 화면", "", "| 화면 | 메뉴 | 클래스 | 서비스 |", "|:---|:---|---:|---:|"]
            for name, n_cls, n_svc in screens:
                menu = "; ".join(m["path"] for k in keys_by_class.get(name, []) for m in menus_by_key.get(k, [])) or "-"
                lines.append(f"| [`{name}`](screens/{name}.md) | {md_cell(menu)} | {n_cls + 1} | {n_svc} |")
            lines.append("")
        if comps:
            lines += ["## 컴포넌트", "", "다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.", "",
                      "| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |", "|:---|:---|---:|---:|"]
            for name, n_cls, n_svc in comps:
                lines.append(f"| [`{name}`](components/{name}.md) | {', '.join(sorted(idx.used_by_domains[name]))} | {n_cls + 1} | {n_svc} |")
            lines.append("")
        if dom_services.get(dom):
            lines += ["## 서버 클래스", "", "| 클래스 | 서비스 메서드 |", "|:---|---:|"]
            for cls, n in dom_services[dom]:
                lines.append(f"| [`{cls.key}`](../{idx.service_path(cls)}) | {n} |")
            lines.append("")
        if dom_sql.get(dom):
            lines += ["## 매퍼", "", "| namespace | SQL 수 |", "|:---|---:|"]
            for ns, items in dom_sql[dom]:
                lines.append(f"| [`{ns}`](sql/{ns}.md) | {len(items)} |")
            lines.append("")
        orphans = []
        reached = set()
        for name, _, _ in units:
            reached |= {c.name for c in idx.closure(name)[0]}
        for items in idx.client.values():
            for c in items:
                if c.domain == dom and idx.is_vi(c) and c.name not in reached and c.services:
                    orphans.append(c)
        if orphans:
            lines += ["## 화면·컴포넌트에서 도달하지 않는 클래스", "",
                      "메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.", "",
                      "| 클래스 | 파일 | 서비스 |", "|:---|:---|:---|"]
            for c in sorted(orphans, key=lambda c: c.name):
                lines.append(f"| `{c.name}` | `{c.rel}` | {', '.join(sorted({f'`{s}`' for s, _ in c.services}))} |")
        write(out, f"{dom}/README.md", lines)
        stats[dom] = {"screens": len(screens), "components": len(comps),
                      "server_classes": len(dom_services.get(dom, [])), "mappers": len(dom_sql.get(dom, [])),
                      "sql": sum(len(i) for _, i in dom_sql.get(dom, []))}
    return stats


def write_menus(idx, out):
    lines = ["# 메뉴 → 화면", ""]
    if idx.menus:
        lines += ["`sys06_menu` 기준. 클래스가 MenuOpener에 없으면 '(MenuOpener 없음)'.", "",
                  "| 메뉴 | # | 사용 | 화면 |", "|:---|:---|:---|:---|"]
        for m in idx.menus:
            name = idx.opener.get(m["key"], "")
            cls = idx.client_class(name)
            target = f"[`{name}`]({idx.unit_path(name)})" if cls and idx.is_vi(cls) else f"`{m['key']}` (MenuOpener 없음)"
            lines.append(f"| {md_cell(m['path'])} | {m['no']} | {m['use']} | {target} |")
    else:
        lines += ["메뉴 TSV 없이 만들어 MenuOpener 기준으로만 적는다.", "", "| 메뉴 키 | 화면 |", "|:---|:---|"]
        for key, name in sorted(idx.opener.items()):
            cls = idx.client_class(name)
            lines.append(f"| `{key}` | " + (f"[`{name}`]({idx.unit_path(name)})" if cls and idx.is_vi(cls) else f"`{name}` (파일 없음)") + " |")
    write(out, "menus.md", lines)


def write_unresolved(idx, out):
    lines = ["# 정적으로 해석하지 못한 호출", "",
             "문자열을 실행 시점에 조합하는 경우. 필요하면 해당 위치를 직접 읽는다.", "",
             "## 클라이언트 서비스 호출", "", "| 클래스 | 줄 | 식 |", "|:---|---:|:---|"]
    for items in sorted(idx.client.values(), key=lambda x: x[0].name):
        for c in items:
            for expr, line in c.unresolved:
                lines.append(f"| `{c.rel}` | {line} | `{md_cell(expr)}` |")
    lines += ["", "## 서버 SQL 호출", "", "| 메서드 | 줄 | 식 |", "|:---|---:|:---|"]
    for cls in sorted(idx.server.values(), key=lambda c: c.key):
        for m in cls.methods.values():
            for expr, line in m.unresolved:
                lines.append(f"| `{m.key}` | {line} | `{md_cell(expr)}` |")
    missing_service = sorted({s for s in idx.service_callers if s not in idx.service_methods and s != "getSeq"})
    lines += ["", "## 서버 메서드가 없는 서비스 키", "", "클래스·메서드 이름이 바뀌었거나 삭제된 경우.", ""]
    lines += [f"- `{s}` ← " + ", ".join(f"`{c}`" for c in sorted(idx.service_callers[s])) for s in missing_service] or ["- 없음"]
    missing_sql = sorted({sid for m in idx.service_methods.values() for sid in all_sql_ids(m) if sid not in idx.statements})
    lines += ["", "## 매퍼에 없는 SQL ID", ""]
    lines += [f"- `{s}` ← " + ", ".join(f"`{u}`" for u in sorted(idx.sql_users[s])) for s in missing_sql] or ["- 없음"]
    write(out, "unresolved.md", lines)
    return len(missing_service), len(missing_sql)


def write_readme(idx, out, src_root, stats, menus_path, missing):
    n_client = sum(len(v) for v in idx.client.values())
    n_unres_client = sum(len(c.unresolved) for v in idx.client.values() for c in v)
    n_unres_server = sum(len(m.unresolved) for c in idx.server.values() for m in c.methods.values())
    lines = ["# AS-IS 소스 호출 경로 색인", "",
             "`tools/src-index.py`가 생성했다. 직접 수정하지 말고 스크립트를 다시 실행한다.", "",
             "## 원본", "",
             f"- 소스: `{src_root}` (파일 경로는 `{idx.app.relative_to(src_root).as_posix()}/` 기준)",
             f"- 메뉴: `{menus_path or '(없음 - MenuOpener 기준)'}`",
             f"- DB 색인: `{idx.db_rel or '(없음)'}`", "",
             "## 읽는 방법 (화면 하나 변환할 때)", "",
             "1. [menus.md](menus.md)에서 메뉴로 화면 파일(`{도메인}/screens/{화면}.md`)을 찾는다.",
             "2. 화면 파일에서 함께 쓰는 클래스, 서비스 → 서버 메서드 → SQL ID, 테이블을 본다.",
             "   다른 화면·컴포넌트(예: 전자결재 문서 편집)는 링크만 있으니 필요할 때만 연다.",
             "3. 링크를 따라 필요한 것만 연다: 서버 `{도메인}/services/{클래스}.md`, SQL `{도메인}/sql/{namespace}.md`(파일·줄), 테이블은 DB 색인.",
             "4. 실제 코드는 소스 경로의 해당 파일·줄만 연다.", "",
             "## 통계", "",
             f"- 클라이언트 클래스 {n_client}개, 메뉴 화면 {len(idx.screen_names) - len(idx.frame_names)}개, 프레임 {len(idx.frame_names)}개([_frame](_frame/README.md)), 컴포넌트 {len(idx.component_names)}개, "
             f"서버 서비스 메서드 {len(idx.service_methods)}개, 매퍼 SQL {len(idx.statements)}개",
             f"- 해석 못 한 호출: 클라이언트 {n_unres_client}건, 서버 {n_unres_server}건, 서버 메서드 없는 서비스 키 {missing[0]}개, "
             f"매퍼에 없는 SQL ID {missing[1]}개 → [unresolved.md](unresolved.md)", "",
             "| 도메인 | 화면 | 컴포넌트 | 서버 클래스 | 매퍼 | SQL |", "|:---|---:|---:|---:|---:|---:|"]
    for dom, s in sorted(stats.items()):
        lines.append(f"| [`{dom}`]({dom}/README.md) | {s['screens']} | {s['components']} | {s['server_classes']} | {s['mappers']} | {s['sql']} |")
    lines += ["", "## 메뉴 TSV 만들기", "",
              "```bash",
              "psql -h localhost -U kdy987 -d asseterpdb -AtF $'\\t' -c \"",
              "WITH RECURSIVE t AS (",
              "  SELECT sys06_menu_id id, sys06_menu_nm::text path, sys06_seq::text sort FROM sys06_menu WHERE sys06_parent_id = 0",
              "  UNION ALL",
              "  SELECT m.sys06_menu_id, t.path || ' > ' || m.sys06_menu_nm, t.sort || '.' || coalesce(m.sys06_seq,'')",
              "  FROM sys06_menu m JOIN t ON m.sys06_parent_id = t.id)",
              "SELECT coalesce(m.sys06_menu_no,''), t.path, m.sys06_class_nm, coalesce(m.sys06_use_yn,'')",
              "FROM t JOIN sys06_menu m ON m.sys06_menu_id = t.id",
              "WHERE coalesce(m.sys06_class_nm,'') <> '' ORDER BY t.sort\" > docs/as-is/menus.tsv",
              "```"]
    write(out, "README.md", lines)


def clean_generated(out):
    """이전 출력 삭제: 출력 폴더 아래 .md와 빈 폴더만 지운다."""
    if not out.is_dir():
        return
    for f in out.rglob("*.md"):
        f.unlink()
    for d in sorted((p for p in out.rglob("*") if p.is_dir()), key=lambda p: len(p.parts), reverse=True):
        if not any(d.iterdir()):
            d.rmdir()


def find_app(src_root):
    """앱 패키지 폴더(client/와 server/를 가진 폴더): AssetERP는 myApp, OMS는 myOms"""
    def is_app(d):
        return (d / "client").is_dir() and (d / "server").is_dir()
    if is_app(src_root):
        return src_root
    java = src_root / JAVA_REL
    found = [d for d in sorted(java.iterdir()) if d.is_dir() and is_app(d)] if java.is_dir() else []
    if len(found) != 1:
        sys.exit(f"[ERROR] {java} 아래에서 client/와 server/를 가진 앱 패키지를 하나로 정하지 못했습니다: "
                 f"{[d.name for d in found] or '없음'}. AS-IS 소스 루트를 확인하세요.")
    print(f"[INFO] 앱 패키지: {found[0].relative_to(src_root)}")
    return found[0]


def main():
    parser = argparse.ArgumentParser(description="AS-IS 소스의 화면 → 서비스 → SQL → 테이블 호출 경로 색인을 만든다.")
    parser.add_argument("src_root", help="AS-IS 소스 루트 (예: ~/oms-data/src/Asset-ERP)")
    parser.add_argument("-o", "--out", default=str(DEFAULT_OUT), help=f"출력 폴더 (기본: {DEFAULT_OUT.relative_to(REPO_ROOT)})")
    parser.add_argument("--menus", help="메뉴 TSV (메뉴번호, 메뉴경로, 클래스명, 사용여부)")
    parser.add_argument("--db-index", default=str(DEFAULT_DB_INDEX), help="dbml-index.py 출력 폴더 (없으면 테이블을 FROM/JOIN으로 추정)")
    args = parser.parse_args()

    src_root = Path(args.src_root).expanduser()
    app = find_app(src_root)
    if args.menus and not Path(args.menus).is_file():
        sys.exit(f"[ERROR] 메뉴 TSV가 없습니다: {args.menus}")

    out = Path(args.out)
    tables, functions, columns = load_db_index(args.db_index)
    db_rel = None
    if tables:
        db_rel = Path(__import__("os").path.relpath(Path(args.db_index).resolve(), out.resolve())).as_posix()
    else:
        print(f"[WARN] DB 색인이 없습니다({args.db_index}). 테이블은 FROM/JOIN으로 추정합니다.")

    client = parse_client(app)
    server = parse_server(app)
    statements = parse_mappers(app, tables, functions, columns)
    idx = Index(app, client, server, statements, parse_menu_opener(app), load_menus(args.menus), tables, db_rel)

    out.mkdir(parents=True, exist_ok=True)
    clean_generated(out)
    stats = write_domains(idx, out)
    write_menus(idx, out)
    missing = write_unresolved(idx, out)
    write_readme(idx, out, src_root, stats, args.menus, missing)

    print(f"[INFO] 출력: {out}")
    print(f"[INFO] 클라이언트 {sum(len(v) for v in client.values())}개, 메뉴 화면 {len(idx.screen_names) - len(idx.frame_names)}개, 프레임 {len(idx.frame_names)}개, 컴포넌트 {len(idx.component_names)}개, "
          f"서비스 메서드 {len(idx.service_methods)}개, 매퍼 SQL {len(statements)}개, 도메인 {len(stats)}개")
    print(f"[INFO] 서버 메서드 없는 서비스 키 {missing[0]}개, 매퍼에 없는 SQL ID {missing[1]}개 (unresolved.md)")


if __name__ == "__main__":
    main()
