#!/usr/bin/env python3
"""변경반영 문서(docs/3-변경반영/변경반영-대장.md) 만들기 — tools/make-change-docs.sh 가 부른다.

입력: yunhee drift --all --done-only --base baseline -o json 결과(JSON 파일)
하는 일:
  1. 바뀐 AS-IS 파일을 git diff -w 의 hunk 단위로 SQL ID·메서드에 매단다(모델·화면 클래스는 파일 단위)
  2. 화면 색인(서비스 → 서버 메서드 → SQL ID)과 AS-IS 호출(mapperName + ".id", <include refid>,
     클라이언트 "dom.Class.method" 문자열)을 따라 그 단위를 쓰는 완료 화면(화면번호)을 찾는다
  3. TOBE 소스에서 AS-IS 이름을 찾아 대응 후보를 붙인다
  4. 기준선 이후 새로 생긴 파일(NEW)·DB 스크립트(doc/dbSource, DB)를 찾는다
  5. 대장에 이어 붙인다 — 처리한 줄(반영·해당없음·보류·넘김)은 건드리지 않는다
     · 같은 단위가 `대기`로 있으면 커밋·변경 요약·영향 화면만 갱신
     · 처리한 단위가 그 뒤 커밋으로 다시 바뀌었으면 새 줄
yunhee drift-unit / drift-list(수정사항054)가 생기기 전의 임시 도구다.
"""
import argparse, collections, glob, json, os, re, subprocess, sys, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))           # AssetERP
LEDGER = os.path.join(ROOT, 'docs/3-변경반영/변경반영-대장.md')
ASIS = os.path.expanduser(os.environ.get('YUNHEE_ASIS_SRC_DIR', '~/work/IDMS-IC'))
SRC_INDEX = os.path.join(ROOT, 'docs/as-is/src')
BASELINE = os.path.join(ROOT, 'docs/baseline.json')

XML_ID = re.compile(r'<(select|insert|update|delete|sql)\b[^>]*\bid\s*=\s*"([^"]+)"')
NS = re.compile(r'namespace\s*=\s*"([^"]+)"')
METH = re.compile(r'^\s*(public|private|protected|static|final|synchronized|\s)*[\w<>\[\],\s]+\s+(\w+)\s*\([^;]*$')
KIND_ORDER = {'DB': 0, 'SQL': 1, 'LOGIC': 2, 'MODEL': 3, 'UI': 4, 'NEW': 5}


def git(*a):
    return subprocess.run(['git', '-C', ASIS, *a], capture_output=True, text=True).stdout


_show = {}
def show(commit, path):
    k = (commit, path)
    if k not in _show:
        _show[k] = git('show', f'{commit}:{path}').splitlines()
    return _show[k]


def is_method_line(l):
    return bool(re.match(r'^(\t| {4})\S', l) and METH.match(l)
                and not re.search(r'\b(if|for|while|switch|catch|return|new)\b', l.split('(')[0]))


def scan_up(lines, ln, xml):
    for i in range(min(ln, len(lines)) - 1, -1, -1):
        l = lines[i]
        if xml:
            m = XML_ID.search(l)
            if m: return m.group(2)
            if re.search(r'</(select|insert|update|delete|sql)>', l) and i < ln - 1: return None
        else:
            if is_method_line(l): return METH.match(l).group(2)
            if re.match(r'^(\t| {4})}', l) and i < ln - 1: return None
    return None


def scan_down(lines, ln, xml):
    for i in range(ln - 1, min(ln + 40, len(lines))):
        l = lines[i]
        if xml:
            m = XML_ID.search(l)
            if m: return m.group(2)
        elif is_method_line(l):
            return METH.match(l).group(2)
    return None


def unit_at(lines, ln, path):
    if ln - 1 >= len(lines) or not lines[ln - 1].strip():
        return None
    t = lines[ln - 1].strip()
    if path.endswith('.xml'):
        ns = next((NS.search(l).group(1) for l in lines[:40] if NS.search(l)), os.path.basename(path)[:-4])
        n = scan_up(lines, ln, True) or scan_down(lines, ln, True)
        return f'{ns}.{n}' if n else f'{ns}.(머리)'
    cls = os.path.basename(path)[:-5]
    if t.startswith(('import ', 'package ')): return f'{cls}#(import)'
    n = scan_up(lines, ln, False) or (scan_down(lines, ln, False) if t.startswith(('@', '/*', '*', '//')) else None)
    return f'{cls}#{n}' if n else f'{cls}#(필드)'


def kind_of(path):
    if path.endswith('.xml'): return 'SQL'
    if '/server/' in path: return 'LOGIC'
    if '/client/' in path and re.search(r'Model(Properties)?\.java$', path): return 'MODEL'
    if '/client/' in path: return 'UI'
    return 'ETC'


def load_menu():
    menu = {}
    for l in open(os.path.join(SRC_INDEX, 'menus.md')):
        m = re.search(r'\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|[^|]*\|\s*\[`(\w+)`', l)
        if m: menu.setdefault(m.group(3), m.group(2))
    return menu


# ---------------------------------------------------------------- 1. 단위 나누기
def split_units(drift):
    fb = collections.defaultdict(lambda: collections.defaultdict(list))
    for x in drift:
        for f in x['files']:
            if f.get('base_commit'):
                fb[f['path']][f['base_commit']].append(x['screen'])
    units = {}
    for path, bases in fb.items():
        k = kind_of(path)
        if k == 'ETC': continue
        for base, screens in bases.items():
            d = git('diff', '-w', '-U0', base, 'HEAD', '--', path)
            head, old = show('HEAD', path), show(base, path)
            cnt = collections.Counter()
            for m in re.finditer(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', d, re.M):
                os_, oc = int(m.group(1)), int(m.group(2) or 1) if m.group(2) != '0' else 0
                ns_, nc = int(m.group(3)), int(m.group(4) or 1) if m.group(4) != '0' else 0
                for l in range(ns_, ns_ + nc):
                    n = unit_at(head, l, path)
                    if n: cnt[(n, 0)] += 1
                for l in range(os_, os_ + oc):
                    n = unit_at(old, l, path)
                    if n: cnt[(n, 1)] += 1
            if k in ('UI', 'MODEL'):
                nm = os.path.basename(path)[:-5]
                c2 = collections.Counter()
                for (n, ar), v in cnt.items(): c2[(nm, ar)] += v
                cnt = c2
            per = collections.defaultdict(lambda: [0, 0])
            for (n, ar), v in cnt.items(): per[n][ar] += v
            for n, (a, r) in per.items():
                u = units.setdefault((path, n), {'path': path, 'unit': n, 'kind': k, 'add': 0, 'rem': 0, 'cand': set(), 'bases': set()})
                u['add'], u['rem'] = max(u['add'], a), max(u['rem'], r)       # 기준이 여럿이면 가장 큰 것
                u['cand'] |= set(screens); u['bases'].add(base)
    return list(units.values())


# ---------------------------------------------------------------- 2. 쓰는 화면
def build_usage():
    usage = collections.defaultdict(set)
    cls2scr = collections.defaultdict(set)
    for md in glob.glob(os.path.join(SRC_INDEX, '*/screens/*.md')):
        scr = os.path.basename(md)[:-3]
        t = open(md).read()
        for m in re.finditer(r'`(\w+)\.(\w+)\.(\w+)`', t): usage[f'{m.group(2)}#{m.group(3)}'].add(scr)
        for m in re.finditer(r'\[`(\w+)\.(\w+)`\]\(', t): usage[f'{m.group(1)}.{m.group(2)}'].add(scr)
        for m in re.finditer(r'^### (\w+) \(`client/', t, re.M):
            usage[m.group(1)].add(scr); cls2scr[m.group(1)].add(scr)
    app = os.path.join(ASIS, 'application/src/main/java/myApp')
    # 클라이언트 서비스 호출 문자열(new ServiceRequest("…"), 변수에 담은 이름 등)
    for f in glob.glob(os.path.join(app, 'client/**/*.java'), recursive=True):
        c = os.path.basename(f)[:-5]
        if c not in cls2scr: continue
        for m in re.finditer(r'"(\w+)\.(\w+)\.(\w+)"', open(f, errors='ignore').read()):
            usage[f'{m.group(2)}#{m.group(3)}'] |= cls2scr[c]
    refs = collections.defaultdict(set)   # 불리는 것 → 부르는 단위
    for f in glob.glob(os.path.join(app, 'server/**/*.java'), recursive=True):
        t = open(f, errors='ignore').read(); cls = os.path.basename(f)[:-5]
        mn = re.search(r'mapperName\s*=\s*"(\w+)"', t)
        cur = None
        for l in t.splitlines():
            if is_method_line(l):
                cur = f'{cls}#{METH.match(l).group(2)}'; continue
            if not cur: continue
            for m in re.finditer(r'"(\w+\.\w+)"', l): refs[m.group(1)].add(cur)
            for m in re.finditer(r'\b(\w+)\s*\(', l): refs[f'{cls}#{m.group(1)}'].add(cur)
            if mn:
                for m in re.finditer(r'mapperName\s*\+\s*"\.(\w+)"', l): refs[f'{mn.group(1)}.{m.group(1)}'].add(cur)
    for f in glob.glob(os.path.join(app, 'server/**/mapper/*.xml'), recursive=True):
        t = open(f, errors='ignore').read(); m = NS.search(t); ns = m.group(1) if m else os.path.basename(f)[:-4]
        cur = None
        for l in t.splitlines():
            m = XML_ID.search(l)
            if m: cur = f'{ns}.{m.group(2)}'
            for r in re.finditer(r'<include\s+refid\s*=\s*"([\w.]+)"', l):
                rid = r.group(1) if '.' in r.group(1) else f'{ns}.{r.group(1)}'
                if cur: refs[rid].add(cur)
    return usage, refs


def screens_of(unit, usage, refs, depth=0, seen=None):
    seen = seen if seen is not None else set()
    if unit in seen or depth > 3: return set()
    seen.add(unit)
    r = set(usage.get(unit, ()))
    for caller in refs.get(unit, ()):
        if caller != unit: r |= screens_of(caller, usage, refs, depth + 1, seen)
    return r


# ---------------------------------------------------------------- 3. TOBE 대응
def load_tobe():
    tobe = {}
    pats = ['backend/src/main/**/*.java', 'backend/src/main/**/*.xml', 'frontend/src/**/*.tsx', 'frontend/src/**/*.ts']
    for p in pats:
        for f in glob.glob(os.path.join(ROOT, p), recursive=True):
            tobe[f[len(ROOT) + 1:]] = open(f, errors='ignore').read()
    return tobe


def short(p):
    return re.sub(r'^backend/src/main/(java/kr/co/kfs/asseterp/|resources/)', '', p).replace('frontend/src/', '')


def tobe_of(u, tobe):
    n, k = u['unit'], u['kind']
    if k == 'UI': return [p for p in tobe if p.endswith(f'/{n}.tsx')]
    if k == 'MODEL': return []
    if k == 'SQL':
        ns, sid = n.split('.', 1)
        hits = [p for p, t in tobe.items() if p.endswith('.xml') and f'{ns}.{sid}' in t]
        return hits or [p for p, t in tobe.items() if p.endswith('.xml') and re.search(rf'id="{re.escape(sid)}"', t) and ns in t]
    cls, meth = n.split('#')
    hits = [p for p, t in tobe.items() if p.endswith('.java') and (f'{cls}.{meth}' in t or f'{cls}#{meth}' in t)]
    return hits or [p for p, t in tobe.items() if p.endswith('.java') and cls in t and re.search(rf'\b{re.escape(meth)}\b', t)]


# ---------------------------------------------------------------- 대장 줄 만들기
_last = {}
def last_commit(path, bases):
    if path not in _last:
        b = min(bases, key=lambda c: int(git('show', '-s', '--format=%ct', c).strip() or 0))
        o = git('log', '-1', '--format=%h|%ad|%s', '--date=format:%m-%d', f'{b}..HEAD', '--', path).strip()
        _last[path] = o.split('|', 2) if o else ['', '', '']
    return _last[path]


def is_new(u):
    if u['kind'] not in ('SQL', 'LOGIC') or u['rem']: return False
    old = '\n'.join(show(sorted(u['bases'])[0], u['path']))
    sid = u['unit'].split('.', 1)[1] if u['kind'] == 'SQL' else u['unit'].split('#')[1]
    return not re.search(rf'id="{re.escape(sid)}"' if u['kind'] == 'SQL' else rf'\b{re.escape(sid)}\s*\(', old)


def fmt_screens(scrs, menu):
    nums = sorted({menu[s] for s in scrs if s in menu}, key=int)
    if nums: return ' '.join(f'#{m}' for m in nums[:4]) + (f' 외 {len(nums) - 4}' if len(nums) > 4 else '')
    if scrs: return '번호 없음 ' + ', '.join(sorted(scrs)[:2])
    return ''


def unit_rows(drift, menu):
    done = {x['screen'] for x in drift}
    usage, refs = build_usage()
    tobe = load_tobe()
    rows = []
    for u in split_units(drift):
        n, k = u['unit'], u['kind']
        meta = n.endswith(('(머리)', '(import)', '(필드)'))
        used = {s for s in u['cand'] if n in usage.get(s, ()) or s in usage.get(n, ())}
        missed, other = set(), set()
        if k == 'MODEL':
            used = set(u['cand'])
        elif k == 'UI':
            used = set(u['cand']) & usage.get(n, set()) or set(u['cand'])
        elif not meta:
            allscr = screens_of(n, usage, refs)
            found = allscr & done
            missed = found - set(u['cand'])
            used |= found
            other = allscr - done
        hits = tobe_of(u, tobe)
        h, d, subj = last_commit(u['path'], u['bases'])
        file_ = u['path'].split('myApp/')[-1]
        key = f'`{file_}` · `{n.split("#")[-1] if "#" in n else n.split(".", 1)[1]}`' if k in ('SQL', 'LOGIC') else f'`{file_}`'
        scr = fmt_screens(used, menu) or ('(완료 화면 밖) ' + fmt_screens(other, menu) if other else '(못 찾음)')
        note, status = [], '대기'
        if meta: status = '해당없음'; note.append('import·필드·파일 머리만 (자동 판정)')
        if missed: note.append(f'drift가 못 잡음({len(missed)}화면: 색인 파일 목록에 없음)')
        if not used and other: note.append('완료(기준선) 화면에서는 안 씀')
        if not used and not other and not meta: note.append('쓰는 화면을 색인에서 못 찾음 — 확인 필요')
        if k == 'MODEL': note.append('TOBE DTO·TS 타입 필드 확인')
        if k == 'UI' and not hits: note.append('TOBE tsx 없음(미변환 부품?)')
        tier = 0 if (used and status == '대기') else (1 if status == '대기' else 2)
        rows.append(dict(order=(tier, KIND_ORDER[k], file_, n), key=key, hash=h,
                         commit=f'`{h}` {d} {subj[:28].strip()}' if h else '', kind=k,
                         summ=('새로 생김 ' if is_new(u) else '') + f'+{u["add"]} −{u["rem"]}줄', scr=scr,
                         tobe=', '.join(f'`{short(p)}`' for p in hits[:2]) + (f' 외 {len(hits) - 2}' if len(hits) > 2 else ''),
                         status=status, note='; '.join(note)))
    return rows


def new_file_rows(menu, since):
    out = git('log', f'--since={since}', '--name-status', '--format=@%h|%ad|%s', '--date=format:%m-%d')
    tsx = {os.path.basename(f)[:-4] for f in glob.glob(os.path.join(ROOT, 'frontend/src/**/*.tsx'), recursive=True)}
    cur, seen, rows = None, set(), []
    for l in out.splitlines():
        if l.startswith('@'): cur = l[1:].split('|', 2); continue
        m = re.match(r'^([AMD])\t(.+)$', l)
        if not m or not cur: continue
        st, p = m.groups()
        if p in seen: continue
        seen.add(p)
        if st == 'A' and re.search(r'/(client|server)/.*\.(java|xml)$', p) and not re.search(r'Model(Properties)?\.java$', p): k = 'NEW'
        elif p.startswith('doc/dbSource/') or p.endswith('.sql'): k = 'DB'
        else: continue
        c = os.path.basename(p).rsplit('.', 1)[0]; short_p = p.split('myApp/')[-1]
        if k == 'DB':
            summ, tobe, note = ('함수 새로 생김' if st == 'A' else '함수 본문 바뀜'), '(DB)', 'asseterpdb에 반영됐는지 `yunhee sql`로 확인(로컬 DB는 사본)'
        else:
            has = c in tsx
            summ, tobe = '새 파일', ('(같은 이름 tsx 있음)' if has else '')
            note = ('TOBE에 같은 이름 tsx 있음 — 그 안에 반영됐는지 확인' if has else
                    '백업 사본으로 보임' if re.search(r'_(original|new|\d{8})$', c) else '변환목록에 새 ID로 넘길지 판단')
        rows.append(dict(order=(0, KIND_ORDER[k], short_p, ''), key=f'`{short_p}`', hash=cur[0],
                         commit=f'`{cur[0]}` {cur[1]} {cur[2][:28].strip()}', kind=k, summ=summ,
                         scr=f'#{menu[c]}' if c in menu else '번호 없음', tobe=tobe, status='대기', note=note))
    return rows


# ---------------------------------------------------------------- 5. 대장에 이어 붙이기
COLS = ['키', '발견일', 'AS-IS 커밋', '종류', '단위', '변경 요약', '영향 화면', 'TOBE 대응', '확인', '상태', '처리일', '비고']
C = {name: i for i, name in enumerate(COLS)}
DONE_NEEDS_CHECK = '반영'   # 이 상태는 '확인' 칸(테스트 이름·compare 일치 등)이 있어야 한다 — README "반영 완료 조건"


def esc(s): return (s or '').replace('|', '\\|')


def split_row(line):
    cells = re.split(r'(?<!\\)\|', line.strip())[1:-1]
    return [c.strip() for c in cells]


def merge(rows, today, dry):
    text = open(LEDGER).read()
    lines = text.splitlines()
    idx = {}            # 단위 → [(줄 번호, cells)]
    last_no, bad, unchecked = 0, [], []
    for i, l in enumerate(lines):
        if l.startswith('| CH-'):
            c = split_row(l)
            if len(c) != len(COLS): bad.append(l[:12]); continue
            last_no = max(last_no, int(c[C['키']][3:]))
            idx.setdefault(c[C['단위']], []).append((i, c))
            if c[C['상태']] == DONE_NEEDS_CHECK and not c[C['확인']]: unchecked.append(c[C['키']])
    if bad: print(f'⚠ 칸 수가 {len(COLS)}개가 아닌 줄 {len(bad)}건(건너뜀): ' + ', '.join(bad[:5]))
    if unchecked: print(f'⚠ 확인 없이 반영된 줄 {len(unchecked)}건: ' + ', '.join(unchecked[:10]))
    added, updated, same = [], 0, 0
    rows.sort(key=lambda r: r['order'])
    for r in rows:
        key = esc(r['key'])
        prev = idx.get(key, [])
        open_ = [(i, c) for i, c in prev if c[C['상태']] == '대기']
        if open_:
            i, c = open_[-1]
            nc = list(c)
            nc[C['AS-IS 커밋']], nc[C['변경 요약']], nc[C['영향 화면']] = esc(r['commit']), esc(r['summ']), esc(r['scr'])
            if not nc[C['TOBE 대응']]: nc[C['TOBE 대응']] = esc(r['tobe'])
            # 자동으로 쓴 "못 찾음" 비고는 화면을 찾았으면 고친다(사람이 쓴 비고는 그대로)
            lost = '쓰는 화면을 색인에서 못 찾음 — 확인 필요'
            if lost in nc[C['비고']] and not r['scr'].startswith('(못 찾음)'):
                nc[C['비고']] = nc[C['비고']].replace(lost, '완료(기준선) 화면에서는 안 씀' if r['scr'].startswith('(완료 화면 밖)') else '').strip('; ')
            if nc != c:
                lines[i] = '| ' + ' | '.join(nc) + ' |'; updated += 1
            else:
                same += 1
            continue
        if prev and any(r['hash'] and r['hash'] in c[C['AS-IS 커밋']] for _, c in prev):
            same += 1; continue            # 처리한 뒤 새 커밋 없음
        last_no += 1
        cell = {'키': f'CH-{last_no:04d}', '발견일': today, 'AS-IS 커밋': esc(r['commit']), '종류': r['kind'], '단위': key,
                '변경 요약': esc(r['summ']), '영향 화면': esc(r['scr']), 'TOBE 대응': esc(r['tobe']), '확인': '',
                '상태': r['status'], '처리일': '' if r['status'] == '대기' else today, '비고': esc(r['note'])}
        added.append('| ' + ' | '.join(cell[n] for n in COLS) + ' |')
    if added:
        last_row = max((i for i, l in enumerate(lines) if l.startswith('| CH-')), default=None)
        if last_row is None:
            last_row = next(i for i, l in enumerate(lines) if l.startswith('|:---') and i > 0 and lines[i - 1].startswith('| 키 |'))
        lines[last_row + 1:last_row + 1] = added
    if not dry:
        open(LEDGER, 'w').write('\n'.join(lines) + '\n')
    return added, updated, same


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('drift_json')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--since', help='새 파일·DB 스크립트를 찾을 시작일 (기본: 기준선의 가장 이른 기록일)')
    a = ap.parse_args()
    drift = json.load(open(a.drift_json))
    menu = load_menu()
    since = a.since
    if not since:
        bl = json.load(open(BASELINE))
        since = min((v.get('recorded_at') or '9999')[:10] for v in bl.values() if isinstance(v, dict))
    today = datetime.date.today().isoformat()
    rows = unit_rows(drift, menu) + new_file_rows(menu, since)
    added, updated, same = merge(rows, today, a.dry_run)
    c = collections.Counter(split_row(l)[C['종류']] for l in added)
    print(f'단위 {len(rows)}개 → 새 줄 {len(added)} · 대기 줄 갱신 {updated} · 그대로 {same}' + (' (dry-run: 대장에 쓰지 않음)' if a.dry_run else ''))
    if c: print('  새 줄 종류: ' + ', '.join(f'{k} {v}' for k, v in sorted(c.items(), key=lambda kv: KIND_ORDER.get(kv[0], 9))))
    if a.dry_run:
        for l in added[:30]: print('  ' + l)
        if len(added) > 30: print(f'  … {len(added) - 30}줄 더')


if __name__ == '__main__':
    main()
