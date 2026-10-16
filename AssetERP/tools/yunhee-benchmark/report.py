#!/usr/bin/env python3
"""yunhee-benchmark 리포트: summary / run-md / history / compare.

results.tsv 열: ts host yunhee src suite_rev case case_rev cat base_tok yh_tok ratio secs llm r_ok r_total p_ok p_total score note
(추가만 한다. 같은 버전을 여러 번 돌리면 줄이 쌓이고, 비교는 case+case_rev 별 최신 줄을 쓴다.)
"""
import csv
import sys
from collections import defaultdict

COLS = "ts host yunhee src suite_rev case case_rev cat base_tok yh_tok ratio secs llm r_ok r_total p_ok p_total score note".split()


def num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def read_rows(path, header=True):
    rows = []
    with open(path, encoding="utf-8", newline="") as f:
        rd = csv.reader(f, delimiter="\t")
        for i, r in enumerate(rd):
            if header and i == 0 and r and r[0] == "ts":
                continue
            if not r:
                continue
            r = (r + [""] * len(COLS))[: len(COLS)]
            rows.append(dict(zip(COLS, r)))
    return rows


def avg(vals):
    vals = [v for v in vals if v is not None]
    return sum(vals) / len(vals) if vals else None


def fmt(v, kind="f2"):
    if v is None:
        return "-"
    if kind == "pct":
        return f"{v * 100:.1f}%"
    return f"{v:.4f}"


def totals(rows):
    """토큰: base 합 / yh 합 (기준선이 있는 시나리오만). 점수: 시나리오 평균."""
    b = sum(num(r["base_tok"]) or 0 for r in rows if (num(r["base_tok"]) or 0) > 0)
    y = sum(num(r["yh_tok"]) or 0 for r in rows if (num(r["base_tok"]) or 0) > 0)
    ratio = (y / b) if b > 0 else None
    score = avg([num(r["score"]) for r in rows])
    rok = sum(num(r["r_ok"]) or 0 for r in rows)
    rtot = sum(num(r["r_total"]) or 0 for r in rows)
    pok = sum(num(r["p_ok"]) or 0 for r in rows)
    ptot = sum(num(r["p_total"]) or 0 for r in rows)
    return b, y, ratio, score, (rok / rtot if rtot else None), (pok / ptot if ptot else None)


def summary_lines(rows):
    out = []
    b, y, ratio, score, rec, prec = totals(rows)
    saving = (1 - ratio) if ratio is not None else None
    out.append("")
    out.append(
        f"토큰: 수작업 기준선 {int(b):,} → yunhee {int(y):,} (비율 {fmt(ratio)} · 절감 {fmt(saving, 'pct')}) · 시나리오 {len(rows)}개"
    )
    out.append(f"정확성: 평균 {fmt(score, 'pct')} (재현율 {fmt(rec, 'pct')} · 정밀도 {fmt(prec, 'pct')})")
    cats = defaultdict(list)
    for r in rows:
        cats[r["cat"]].append(r)
    parts = [f"{c} {fmt(avg([num(x['score']) for x in rs]), 'pct')}" for c, rs in cats.items()]
    out.append("범주별 점수: " + " · ".join(parts))
    bad = [f"{r['case']}({r['note']})" for r in rows if r["note"]]
    if bad:
        out.append("❌ " + " / ".join(bad))
    return out


def cmd_summary(path):
    rows = read_rows(path, header=False)
    if not rows:
        print("\n실행된 시나리오가 없다")
        return
    print("\n".join(summary_lines(rows)))


def cmd_run_md(path, ver, host, pin, results):
    rows = read_rows(path, header=False)
    ts = rows[0]["ts"] if rows else ""
    print(f"# yunhee {ver} 벤치마크 — {ts} ({host}, PIN {pin[:7]})\n")
    print("| 시나리오 | rev | 범주 | 기준선 토큰 | yunhee 토큰 | 비율 | 초 | 점수 | 이전 대비 | 비고 |")
    print("|:---|---:|:---|---:|---:|---:|---:|---:|:---|:---|")
    # 직전 기록(이 실행을 뺀 최신, case_rev 같은 것)
    prev = {}
    try:
        for r in read_rows(results):
            if (r["ts"], r["host"]) != (ts, host):
                prev[(r["case"], r["case_rev"])] = r
    except FileNotFoundError:
        pass
    for r in rows:
        p = prev.get((r["case"], r["case_rev"]))
        diff = ""
        if p:
            dr = (num(r["ratio"]) or 0) - (num(p["ratio"]) or 0) if num(r["ratio"]) is not None and num(p["ratio"]) is not None else None
            ds = (num(r["score"]) or 0) - (num(p["score"]) or 0) if num(r["score"]) is not None and num(p["score"]) is not None else None
            bits = []
            if dr is not None and abs(dr) >= 0.005:
                bits.append(f"비율 {'▲' if dr > 0 else '▼'}{abs(dr):.2f}")
            if ds is not None and abs(ds) >= 0.005:
                bits.append(f"점수 {'▲' if ds > 0 else '▼'}{abs(ds) * 100:.0f}p")
            diff = f"{p['yunhee']} 대비 " + (", ".join(bits) if bits else "같음")
        print(
            f"| {r['case']} | {r['case_rev']} | {r['cat']} | {r['base_tok']} | {r['yh_tok']} | {r['ratio']} | {r['secs']} | {r['score']} | {diff} | {r['note']} |"
        )
    print("\n" + "\n".join(summary_lines(rows)).strip())


def latest_by_version(rows):
    """(yunhee, case, case_rev) → 최신 줄"""
    d = {}
    for r in rows:
        d[(r["yunhee"], r["case"], r["case_rev"])] = r  # 파일은 추가 순서 = 시간 순서
    return d


def vkey(v):
    return tuple(int(x) if x.isdigit() else 0 for x in v.split("."))


def cmd_history(path):
    try:
        rows = read_rows(path)
    except FileNotFoundError:
        print("결과가 아직 없다 (tools/yunhee-benchmark.sh 를 먼저 실행)")
        return
    d = latest_by_version(rows)
    by_ver = defaultdict(list)
    for (ver, case, rev), r in d.items():
        by_ver[ver].append(r)
    print(f"{'yunhee':8} {'시나리오':>6} {'기준선→yunhee 토큰':>22} {'비율':>6} {'절감':>5} {'정확성':>6}  마지막 실행")
    for ver in sorted(by_ver, key=vkey):
        rs = by_ver[ver]
        b, y, ratio, score, _, _ = totals(rs)
        sav = (1 - ratio) if ratio is not None else None
        last = max(r["ts"] for r in rs)
        print(f"{ver:8} {len(rs):>6} {f'{int(b):,} → {int(y):,}':>22} {fmt(ratio):>6} {fmt(sav, 'pct'):>5} {fmt(score, 'pct'):>6}  {last}")
    print("\n※ 시나리오 구성이 버전마다 다르면(추가·rev 변경) 합계를 바로 비교하지 말고 --compare 를 쓴다")


def cmd_compare(path, a, b):
    rows = read_rows(path)
    d = latest_by_version(rows)
    keys = sorted({(c, rv) for (v, c, rv) in d if v in (a, b)})
    print(f"{'시나리오':8} {'rev':>3} | {a+' 비율':>10} {b+' 비율':>10} {'Δ':>6} | {a+' 점수':>10} {b+' 점수':>10} {'Δ':>6}")
    n = 0
    for c, rv in keys:
        ra, rb = d.get((a, c, rv)), d.get((b, c, rv))
        if not (ra and rb):
            continue
        n += 1
        xa, xb = num(ra["ratio"]), num(rb["ratio"])
        sa, sb = num(ra["score"]), num(rb["score"])
        dx = f"{xb - xa:+.2f}" if xa is not None and xb is not None else "-"
        ds = f"{(sb - sa) * 100:+.0f}p" if sa is not None and sb is not None else "-"
        print(f"{c:8} {rv:>3} | {fmt(xa):>10} {fmt(xb):>10} {dx:>6} | {fmt(sa, 'pct'):>10} {fmt(sb, 'pct'):>10} {ds:>6}")
    only = sorted({c for (v, c, rv) in d if v in (a, b)} - {c for c, rv in keys if d.get((a, c, rv)) and d.get((b, c, rv))})
    if only:
        print(f"\n비교 불가(한쪽에만 있거나 case_rev가 다름): {', '.join(only)}")
    if n == 0:
        print("두 버전에 같은 case_rev 시나리오가 없다")


def main(argv):
    cmd = argv[1] if len(argv) > 1 else ""
    if cmd == "summary":
        cmd_summary(argv[2])
    elif cmd == "run-md":
        cmd_run_md(argv[2], argv[3], argv[4], argv[5], argv[6])
    elif cmd == "history":
        cmd_history(argv[2])
    elif cmd == "compare":
        cmd_compare(argv[2], argv[3], argv[4])
    else:
        print(__doc__)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
