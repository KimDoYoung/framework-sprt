#!/usr/bin/env python3
"""
sql-check.py - AS-IS MyBatis 매퍼 SQL이 대상 DB(asseterpdb)에서 그대로 도는지 EXPLAIN으로 확인한다.

매퍼 XML의 SQL을 하나씩 실행 가능한 SQL로 펼쳐서 읽기 전용 트랜잭션 안에서 EXPLAIN만 한다(실행하지 않음, INSERT/UPDATE/DELETE 포함).
"없는 컬럼/테이블/함수" 오류는 스키마 차이, 나머지 오류는 펼치기 한계(동적 SQL, NULL 타입 추론)로 보고 따로 적는다.

동적 SQL 펼치기 규칙:
  <include refid>  참조한 <sql> 조각으로 바꾼다 (namespace 생략 시 같은 매퍼)
  <choose>         PostgreSQL 분기(test에 isPostgreSql)가 있으면 그것, 없으면 첫 <when>, <when>이 없으면 <otherwise>
  <if>             test에 isTibero면 빼고 나머지는 내용을 넣는다
  <foreach>        NULL
  <bind>, <selectKey>  뺀다
  #{...} → NULL,  IN ${...} → IN (1),  ${...} → 1

분류:
  스키마 차이   없는 테이블/뷰/컬럼/함수/타입 (그 DB로 옮기려면 SQL이나 DB를 고쳐야 함)
  DB 환경 차이  collation 등 DB 설치 설정 (예: COLLATE "ko_KR.utf8")
  펼치기 한계   이 스크립트가 동적 SQL을 실제와 다르게 펼친 경우 (오류 위치를 보고 직접 판단)

입력:
  src_root        AS-IS 소스 루트 (src-index.py와 같음, 예: ~/workspace26/Asset-OMS)
  --src-index DIR src-index.py 출력 (기본 docs/as-is/src). 있으면 오류 SQL을 쓰는 화면을 함께 적는다
  -o FILE         출력 (기본 docs/as-is/sql-check.md)

DB 접속은 psql 기본값/환경변수(PGHOST, PGUSER, PGPASSWORD ...)를 쓴다. 기본 DB는 asseterpdb.

사용법:
  PGPASSWORD=... python3 tools/sql-check.py ~/workspace26/Asset-OMS
"""
import argparse
import os
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = REPO_ROOT / "docs" / "as-is" / "sql-check.md"
DEFAULT_SRC_INDEX = REPO_ROOT / "docs" / "as-is" / "src"
JAVA_REL = Path("application/src/main/java")

STATEMENT_TAGS = ("select", "insert", "update", "delete", "sql")
ENV_ERROR_RE = re.compile(r'collation "[^"]+" for encoding "[^"]+" does not exist', re.I)
SCHEMA_ERROR_RE = re.compile(
    r'(column|relation|function|type|schema) (?:"?[\w.]+"?\s*\(.*?\)|"[^"]+"|\S+) does not exist|missing FROM-clause entry for table "[^"]+"',
    re.I)


def find_app(src_root):
    """src-index.py와 같은 규칙: client/와 server/를 가진 앱 패키지 폴더"""
    def is_app(d):
        return (d / "client").is_dir() and (d / "server").is_dir()
    if is_app(src_root):
        return src_root
    java = src_root / JAVA_REL
    found = [d for d in sorted(java.iterdir()) if d.is_dir() and is_app(d)] if java.is_dir() else []
    if len(found) != 1:
        sys.exit(f"[ERROR] {java} 아래에서 앱 패키지를 하나로 정하지 못했습니다: {[d.name for d in found] or '없음'}")
    return found[0]


# ---------------------------------------------------------------- 매퍼 읽기

class Node:
    """아주 작은 XML 트리 (MyBatis 매퍼는 SQL 텍스트와 태그가 섞여 있어 ElementTree보다 이쪽이 단순하다)"""
    def __init__(self, tag, attrs, children):
        self.tag, self.attrs, self.children = tag, attrs, children


TOKEN_RE = re.compile(r"<!\[CDATA\[(.*?)\]\]>|<!--.*?-->|<(/?)(\w+)([^>]*?)(/?)>|([^<]+)", re.S)
ATTR_RE = re.compile(r'(\w+)\s*=\s*"([^"]*)"')


def parse_xml(text):
    root = Node("root", {}, [])
    stack = [root]
    for m in TOKEN_RE.finditer(text):
        cdata, closing, tag, attrs, selfclose, chars = m.groups()
        if cdata is not None:
            stack[-1].children.append(cdata)
        elif chars is not None:
            stack[-1].children.append(chars)
        elif tag:
            if closing:
                while len(stack) > 1 and stack[-1].tag != tag:
                    stack.pop()
                if len(stack) > 1:
                    stack.pop()
            else:
                node = Node(tag, dict(ATTR_RE.findall(attrs)), [])
                stack[-1].children.append(node)
                if not selfclose:
                    stack.append(node)
    return root


def unescape(s):
    return s.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&").replace("&quot;", '"').replace("&#160;", " ")


class Statement:
    def __init__(self, ns, sid, kind, node, rel, line):
        self.ns, self.sid, self.kind, self.node, self.rel, self.line = ns, sid, kind, node, rel, line

    @property
    def key(self):
        return f"{self.ns}.{self.sid}"


def load_statements(app):
    statements = {}
    for path in sorted(app.rglob("*.xml")):
        raw = path.read_text(encoding="utf-8", errors="replace")
        ns = re.search(r"<mapper\s+namespace\s*=\s*\"([^\"]+)\"", raw)
        if not ns:
            continue
        root = parse_xml(raw)
        mapper = next((c for c in root.children if isinstance(c, Node) and c.tag == "mapper"), None)
        if not mapper:
            continue
        for child in mapper.children:
            if isinstance(child, Node) and child.tag in STATEMENT_TAGS and "id" in child.attrs:
                pos = re.search(rf'<{child.tag}\b[^>]*\bid\s*=\s*"{re.escape(child.attrs["id"])}"', raw)
                line = raw.count("\n", 0, pos.start()) + 1 if pos else 0
                st = Statement(ns.group(1), child.attrs["id"], child.tag, child, path.relative_to(app), line)
                statements[st.key] = st
    return statements


# ---------------------------------------------------------------- 펼치기

def render(node, ns, statements, seen=()):
    out = []
    for c in node.children:
        if isinstance(c, str):
            out.append(unescape(c))
            continue
        tag, test = c.tag, c.attrs.get("test", "")
        if tag in ("bind", "selectKey"):
            continue
        if tag == "include":
            ref = c.attrs.get("refid", "")
            # <sql id="common.orgCodeDown">처럼 id 자체에 점이 있는 조각도 있어 id로도 찾는다
            target = statements.get(ref) or statements.get(f"{ns}.{ref}") \
                or next((t for t in statements.values() if t.sid == ref), None)
            if target and target.key not in seen:
                out.append(render(target.node, target.ns, statements, seen + (target.key,)))
            else:
                out.append(f" /* include {ref} 없음 */ ")
        elif tag == "choose":
            whens = [w for w in c.children if isinstance(w, Node) and w.tag == "when"]
            other = next((w for w in c.children if isinstance(w, Node) and w.tag == "otherwise"), None)
            pick = next((w for w in whens if "isPostgreSql" in w.attrs.get("test", "")), None) \
                or next((w for w in whens if "isTibero" not in w.attrs.get("test", "")), None) or other
            if pick:
                out.append(render(pick, ns, statements, seen))
        elif tag == "if":
            if "isTibero" not in test:
                out.append(render(c, ns, statements, seen))
        elif tag == "foreach":
            out.append(" NULL ")
        elif tag in ("where", "set", "trim"):
            body = render(c, ns, statements, seen)
            if tag == "where":
                body = " WHERE 1=1 " + re.sub(r"^\s*(AND|OR)\b", " AND ", body, flags=re.I) if body.strip() else ""
            elif tag == "set":
                body = " SET " + body.strip().rstrip(",")
            else:
                prefix = c.attrs.get("prefix", "")
                overrides = [o.strip() for o in c.attrs.get("suffixOverrides", "").split("|") if o.strip()]
                body = body.strip()
                for o in overrides:
                    if body.upper().endswith(o.upper()):
                        body = body[: -len(o)]
                body = f" {prefix} {body} {c.attrs.get('suffix', '')} "
            out.append(body)
        else:
            out.append(render(c, ns, statements, seen))
    return "".join(out)


def to_sql(st, statements):
    sql = render(st.node, st.ns, statements, (st.key,))
    sql = re.sub(r"#\{[^}]*\}", "NULL", sql)
    sql = re.sub(r"(?i)\bin\s*\$\{[^}]*\}", "IN (1)", sql)
    sql = re.sub(r"(?i)\bin\s+NULL\b", "IN (NULL)", sql)
    sql = re.sub(r"\$\{[^}]*\}", "1", sql)
    return sql.strip().rstrip(";")


# ---------------------------------------------------------------- 실행

def explain(sql, db):
    script = f"BEGIN READ ONLY;\nSET statement_timeout = '10s';\nEXPLAIN {sql};\nROLLBACK;\n"
    env = {**os.environ, "LC_MESSAGES": "C", "PGOPTIONS": "-c lc_messages=C"}  # 오류 분류·LINE 위치를 영문 메시지로 읽는다
    res = subprocess.run(["psql", "-X", "-q", "-v", "ON_ERROR_STOP=1", "-d", db, "-f", "-"],
                         input=script, capture_output=True, text=True, env=env)
    if res.returncode == 0:
        return None
    lines = res.stderr.splitlines()
    idx = next((i for i, l in enumerate(lines) if "ERROR" in l or "오류" in l), None)
    if idx is None:
        return res.stderr.strip()
    err = re.sub(r"^psql:<stdin>:\d+:\s*", "", lines[idx]).strip()
    # LINE n: ...오류 위치... (펼치기 한계를 판단할 때 필요)
    near = next((l.strip() for l in lines[idx + 1: idx + 2] if l.strip().startswith("LINE")), "")
    return f"{err} — {near[:160]}" if near else err


def screens_using(src_index, keys):
    """src-index.py 화면 파일에서 SQL ID를 쓰는 화면"""
    result = defaultdict(set)
    if not src_index or not Path(src_index).is_dir():
        return result
    for f in Path(src_index).glob("*/screens/*.md"):
        text = f.read_text(encoding="utf-8")
        for key in keys:
            if f"`{key}`" in text:
                result[key].add(f.stem)
    return result


def md_cell(v):
    return str(v).replace("|", "\\|").replace("\n", " ")


def main():
    parser = argparse.ArgumentParser(description="AS-IS 매퍼 SQL을 대상 DB에서 EXPLAIN으로 확인한다.")
    parser.add_argument("src_root", help="AS-IS 소스 루트 (예: ~/workspace26/Asset-OMS)")
    parser.add_argument("-o", "--out", default=str(DEFAULT_OUT), help=f"출력 파일 (기본: {DEFAULT_OUT.relative_to(REPO_ROOT)})")
    parser.add_argument("--db", default="asseterpdb", help="대상 DB 이름 (기본 asseterpdb)")
    parser.add_argument("--src-index", default=str(DEFAULT_SRC_INDEX), help="src-index.py 출력 폴더 (화면 연결용)")
    args = parser.parse_args()

    src_root = Path(args.src_root).expanduser()
    app = find_app(src_root)
    statements = load_statements(app)
    targets = [s for s in statements.values() if s.kind != "sql"]
    print(f"[INFO] 앱 패키지 {app.relative_to(src_root) if app != src_root else '.'}, SQL {len(targets)}개 확인 중 ...")

    ok, schema, env, other = [], [], [], []
    for i, st in enumerate(sorted(targets, key=lambda s: s.key), 1):
        err = explain(to_sql(st, statements), args.db)
        if err is None:
            ok.append(st)
        elif SCHEMA_ERROR_RE.search(err):
            schema.append((st, err))
        elif ENV_ERROR_RE.search(err):
            env.append((st, err))
        else:
            other.append((st, err))
        if i % 50 == 0:
            print(f"[INFO] {i}/{len(targets)}")

    used_by = screens_using(args.src_index, [s.key for s, _ in schema + env + other])
    missing = defaultdict(list)
    for st, err in schema:
        m = SCHEMA_ERROR_RE.search(err)
        missing[m.group(0)].append(st)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    lines = ["# 매퍼 SQL ↔ DB 정합성 (EXPLAIN)", "",
             "`tools/sql-check.py`가 생성했다. 직접 수정하지 말고 스크립트를 다시 실행한다.", "",
             f"- 소스: `{src_root}` (`{app.relative_to(src_root).as_posix() if app != src_root else '.'}`)",
             f"- DB: `{args.db}`",
             f"- SQL {len(targets)}개(`<sql>` 조각 제외): **통과 {len(ok)}**, **스키마 차이 {len(schema)}**, DB 환경 차이 {len(env)}, 펼치기 한계·기타 {len(other)}", "",
             "통과는 \"그 DB에 그 SQL이 쓰는 테이블·컬럼·함수가 모두 있다\"는 뜻이다(결과 정합성까지 보장하지 않음).", ""]
    lines += ["## 없는 DB 객체", "", "| 오류 | SQL 수 | SQL |", "|:---|---:|:---|"]
    for msg, sts in sorted(missing.items(), key=lambda x: -len(x[1])):
        lines.append(f"| `{md_cell(msg)}` | {len(sts)} | " + ", ".join(f"`{s.key}`" for s in sts) + " |")
    for title, rows in (("스키마 차이", schema), ("DB 환경 차이", env), ("펼치기 한계·기타 (직접 확인 필요)", other)):
        lines += ["", f"## {title}", "", "| SQL | 파일:줄 | 화면 | 오류 |", "|:---|:---|:---|:---|"]
        for st, err in sorted(rows, key=lambda x: x[0].key):
            screens = ", ".join(sorted(used_by.get(st.key, []))) or "-"
            lines.append(f"| `{st.key}` | `{st.rel}:{st.line}` | {screens} | {md_cell(err)} |")
    affected = defaultdict(list)
    for st, _ in schema:
        for scr in used_by.get(st.key, []):
            affected[scr].append(st.key)
    lines += ["", "## 스키마 차이가 있는 화면", "", "| 화면 | SQL |", "|:---|:---|"]
    for scr, keys in sorted(affected.items()):
        lines.append(f"| `{scr}` | " + ", ".join(f"`{k}`" for k in sorted(keys)) + " |")
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"[INFO] 출력: {out}")
    print(f"[INFO] 통과 {len(ok)}, 스키마 차이 {len(schema)}, DB 환경 차이 {len(env)}, 펼치기 한계·기타 {len(other)}, 영향 화면 {len(affected)}개")


if __name__ == "__main__":
    main()
