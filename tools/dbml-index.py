#!/usr/bin/env python3
"""
dbml-index.py - AS-IS DB 스키마 문서(DBML markdown)를 도메인별 작은 파일로 나눠 색인을 만든다.

AS-IS 스키마 문서 하나가 수 MB라 한 번에 읽을 수 없으므로, 화면 변환 시 필요한 도메인/함수만 읽을 수 있게 쪼갠다.

입력: DBML markdown (섹션: ## DBML, ## Views, ## Functions, ## Procedures, ## Sequences, ## Triggers)
출력 (기본 docs/as-is/db/):
  README.md              원본 정보, 도메인별 테이블 수, 시퀀스
  tables/{domain}.md     테이블 요약 목록 + DBML. 도메인 = 테이블명 앞 영문 접두어 (emp01_person → emp)
  tables/_backup.md      백업 테이블 (*bak*, *_back, *_backup)
  tables/_etc.md         접두어 규칙을 따르지 않는 테이블
  views.md               뷰 정의
  functions/README.md    함수·프로시저 색인 (이름, 인자, 반환형, 줄 수)
  functions/{name}.md    함수·프로시저 본문 (오버로드는 한 파일). 트리거 함수(RETURNS trigger)는 제외
                         pgcrypto encrypt()/decrypt()의 키 문자열은 '***'로 가린다
  triggers.md            트리거 목록

사용법:
  python3 tools/dbml-index.py .yunhee/asseterp-dbml.md
  python3 tools/dbml-index.py .yunhee/asseterp-dbml.md -o docs/asis-db
"""
import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = REPO_ROOT / "docs" / "as-is" / "db"

BACKUP_DOMAIN = "_backup"
ETC_DOMAIN = "_etc"

TABLE_RE = re.compile(r'^Table "public"\."([^"]+)" \{$', re.M)
NOTE_RE = re.compile(r"^  Note: '((?:[^'\\]|\\.)*)'", re.M)
COLUMN_RE = re.compile(r'^  "[^"]+" ', re.M)
ROUTINE_HEAD_RE = re.compile(r"^### public\.([A-Za-z0-9_]+)\((.*)\)\s*$")
# pgcrypto encrypt()/decrypt()의 키 문자열을 가린다. 비밀번호 복호화 키가 문서에 남지 않게 한다
# 키는 암호 방식 인자('aes', 'bf', 'aes-cbc/pad:pkcs' 등) 바로 앞의 문자열 리터럴이다: encrypt(data, '키', 'aes')
CRYPTO_KEY_RE = re.compile(r"'[^']*'(\s*,\s*'(?:aes|bf)[^']*'\s*\))", re.I)
MASKED_KEY = "'***'"


def split_sections(text):
    """'## 제목' 단위로 나눈다. 첫 섹션 앞부분(머리말)은 '_header' 키로 둔다."""
    parts = re.split(r"^## ", text, flags=re.M)
    sections = {"_header": parts[0]}
    for part in parts[1:]:
        title, _, body = part.partition("\n")
        sections[title.strip()] = body
    return sections


def table_domain(name):
    if re.search(r"bak|_back$|_backup$", name):
        return BACKUP_DOMAIN
    m = re.match(r"([a-z]+)\d", name)
    return m.group(1) if m else ETC_DOMAIN


def parse_tables(dbml_section):
    """DBML 섹션에서 Table 블록을 (이름, 블록 원문) 목록으로 뽑는다. 블록은 첫 열의 '}'로 끝난다."""
    tables = []
    for m in TABLE_RE.finditer(dbml_section):
        end = dbml_section.index("\n}\n", m.start()) + 2
        tables.append((m.group(1), dbml_section[m.start():end]))
    return tables


def table_summary(block):
    note = NOTE_RE.search(block)
    return (note.group(1).replace("\\'", "'") if note else ""), len(COLUMN_RE.findall(block))


def parse_subsections(section):
    """'### 이름' 단위 블록 목록 (제목 줄, 본문)"""
    blocks = []
    for part in re.split(r"^### ", section, flags=re.M)[1:]:
        head, _, body = part.partition("\n")
        blocks.append((head.strip(), body.strip("\n")))
    return blocks


def mask_secrets(body):
    return CRYPTO_KEY_RE.sub(lambda m: MASKED_KEY + m.group(1), body)


def routine_info(kind, head, body):
    body = mask_secrets(body)
    m = ROUTINE_HEAD_RE.match("### " + head)
    name, args = (m.group(1), m.group(2)) if m else (head, "")
    returns = re.search(r"^\s*RETURNS (.+)$", body, re.M)
    return {
        "kind": kind,
        "name": name,
        "args": args,
        "returns": returns.group(1).strip() if returns else ("-" if kind == "PROCEDURE" else "?"),
        "lines": body.count("\n") + 1,
        "head": head,
        "body": body,
    }


def md_cell(value):
    return value.replace("|", "\\|").replace("\n", " ")


def clean_generated(out):
    for sub in ("tables", "functions"):
        d = out / sub
        if d.is_dir():
            for f in d.glob("*.md"):
                f.unlink()
    for f in ("README.md", "views.md", "triggers.md"):
        (out / f).unlink(missing_ok=True)


def write_tables(out, tables):
    by_domain = defaultdict(list)
    for name, block in tables:
        by_domain[table_domain(name)].append((name, block))

    (out / "tables").mkdir(parents=True, exist_ok=True)
    for domain, items in sorted(by_domain.items()):
        items.sort()
        lines = [f"# 테이블: {domain}", "", f"{len(items)}개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.", "",
                 "| 테이블 | 설명 | 컬럼 수 |", "|:---|:---|---:|"]
        for name, block in items:
            note, cols = table_summary(block)
            lines.append(f"| `{name}` | {md_cell(note)} | {cols} |")
        lines += ["", "## DBML", "", "```dbml"]
        lines += [block.rstrip("\n") + "\n" for _, block in items]
        lines.append("```")
        (out / "tables" / f"{domain}.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return by_domain


def write_views(out, views):
    lines = ["# 뷰", "", f"{len(views)}개.", ""]
    for head, body in views:
        lines += [f"## {head}", "", mask_secrets(body), ""]
    (out / "views.md").write_text("\n".join(lines), encoding="utf-8")


def write_routines(out, routines, trigger_fn_count):
    fdir = out / "functions"
    fdir.mkdir(parents=True, exist_ok=True)
    by_name = defaultdict(list)
    for r in routines:
        by_name[r["name"]].append(r)

    for name, items in by_name.items():
        lines = [f"# {name}", ""]
        for r in items:
            lines += [f"## {r['kind']} {r['head']}", "", f"- 반환: `{r['returns']}`", f"- 줄 수: {r['lines']}", "", r["body"], ""]
        (fdir / f"{name}.md").write_text("\n".join(lines), encoding="utf-8")

    lines = ["# 함수·프로시저 색인", "",
             f"함수 {sum(1 for r in routines if r['kind'] == 'FUNCTION')}개, 프로시저 {sum(1 for r in routines if r['kind'] == 'PROCEDURE')}개. "
             f"트리거 함수(`RETURNS trigger`, 주로 `*_backup()`) {trigger_fn_count}개는 제외했다 (`../triggers.md` 참고).", "",
             "본문은 `functions/{이름}.md`. 오버로드는 같은 파일에 있다.", "",
             "| 이름 | 종류 | 인자 | 반환 | 줄 수 |", "|:---|:---|:---|:---|---:|"]
    for r in sorted(routines, key=lambda r: (r["name"], r["args"])):
        lines.append(f"| [`{r['name']}`]({r['name']}.md) | {r['kind']} | {md_cell(r['args'])} | {md_cell(r['returns'])} | {r['lines']} |")
    (fdir / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_triggers(out, triggers_section):
    body = triggers_section.strip("\n")
    count = len(re.findall(r"^CREATE TRIGGER", body, re.M))
    text = "\n".join(["# 트리거", "", f"{count}개. 대부분 변경 이력을 `*_back`/`*bak*` 테이블에 남기는 `*_backup()` 함수 호출이다.", "", body, ""])
    (out / "triggers.md").write_text(text, encoding="utf-8")


def write_readme(out, source, header, by_domain, views, routines, sequences):
    meta = [line for line in header.splitlines() if line.startswith("- ")]
    domains = sorted(by_domain.items(), key=lambda kv: (kv[0].startswith("_"), kv[0]))
    lines = ["# AS-IS DB 스키마 색인", "",
             f"`tools/dbml-index.py`가 `{source}`에서 생성했다. 직접 수정하지 말고 스크립트를 다시 실행한다.", "",
             "## 원본", "", *meta, "",
             "## 읽는 방법", "",
             "- 테이블: `tables/{도메인}.md` — 도메인은 테이블명 접두어 (`emp01_person` → `emp`). 맨 위 요약 표로 먼저 찾는다.",
             "- 함수: `functions/README.md` 색인에서 찾고 `functions/{이름}.md`만 읽는다.",
             "- 뷰: `views.md`, 트리거: `triggers.md`",
             "- FK(ref)는 DB에 없다. 테이블 간 관계는 AS-IS 매퍼 SQL에서 확인한다.", "",
             "## 도메인별 테이블", "",
             "| 도메인 | 테이블 수 | 파일 |", "|:---|---:|:---|"]
    for domain, items in domains:
        lines.append(f"| `{domain}` | {len(items)} | [tables/{domain}.md](tables/{domain}.md) |")
    lines += ["", "## 그 밖의 객체", "",
              f"- 뷰 {len(views)}개: [views.md](views.md) ({', '.join('`' + h.removeprefix('public.') + '`' for h, _ in views)})",
              f"- 함수·프로시저 {len(routines)}개: [functions/README.md](functions/README.md)",
              "- 트리거: [triggers.md](triggers.md)", "",
              "## 시퀀스", "", sequences.strip("\n"), ""]
    (out / "README.md").write_text("\n".join(lines), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="AS-IS DBML markdown을 도메인별 색인 파일로 나눈다.")
    parser.add_argument("dbml", help="DBML markdown 파일 (예: .yunhee/asseterp-dbml.md)")
    parser.add_argument("-o", "--out", default=str(DEFAULT_OUT), help=f"출력 폴더 (기본: {DEFAULT_OUT.relative_to(REPO_ROOT)})")
    args = parser.parse_args()

    source = Path(args.dbml)
    if not source.is_file():
        sys.exit(f"[ERROR] 파일이 없습니다: {source}")
    sections = split_sections(source.read_text(encoding="utf-8"))
    for required in ("DBML", "Functions"):
        if required not in sections:
            sys.exit(f"[ERROR] '## {required}' 섹션이 없습니다. DBML markdown 형식이 맞는지 확인하세요.")

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    clean_generated(out)

    tables = parse_tables(sections["DBML"])
    views = parse_subsections(sections.get("Views", ""))
    functions = [routine_info("FUNCTION", h, b) for h, b in parse_subsections(sections["Functions"])]
    procedures = [routine_info("PROCEDURE", h, b) for h, b in parse_subsections(sections.get("Procedures", ""))]
    trigger_fns = [r for r in functions if r["returns"] == "trigger"]
    routines = [r for r in functions if r["returns"] != "trigger"] + procedures

    by_domain = write_tables(out, tables)
    write_views(out, views)
    write_routines(out, routines, len(trigger_fns))
    write_triggers(out, sections.get("Triggers", ""))
    try:
        source_label = source.resolve().relative_to(REPO_ROOT)
    except ValueError:
        source_label = source
    write_readme(out, source_label, sections["_header"], by_domain, views, routines, sections.get("Sequences", ""))

    print(f"[INFO] 출력: {out}")
    print(f"[INFO] 테이블 {len(tables)}개 → 도메인 {len(by_domain)}개 파일")
    print(f"[INFO] 뷰 {len(views)}개, 함수·프로시저 {len(routines)}개 (트리거 함수 {len(trigger_fns)}개 제외)")


if __name__ == "__main__":
    main()
