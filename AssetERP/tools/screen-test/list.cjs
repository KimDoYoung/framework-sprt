#!/usr/bin/env node
// list.cjs — 화면 "열기 + 조회" 연기 시험(smoke test)
//
// ⚠ 이 시험이 보는 것은 딱 이것뿐이다: 화면이 뜬다 · 조회 요청이 나간다 · 서버 오류(5xx)·예외·콘솔 오류가 없다.
//   통과해도 "데이터가 맞다 / 업무 규칙이 맞다 / AS-IS 와 같다"는 뜻이 아니다. 첫 번째 시험일 뿐이다.
//   예) 새 화면 9999 를 만들었고 이 시험이 통과했다면 → 화면이 깨지지 않았다는 것까지만 확인된 것이다.
//   이어서 해야 할 시험(README.md 참고): ① yunhee compare 로 AS-IS 조회 결과 대조 ② 저장·삭제 등 쓰기 시험
//   ③ 백엔드 gradle test(업무 로직) ④ 핵심 업무 시나리오.
//
// 사용: node tools/screen-test/list.cjs [옵션]      (AssetERP 폴더에서. 5173 Vite + 8080 백엔드가 떠 있어야 한다)
//   --screen-no=1101[,1282,…]   이 화면(들)만. 생략하거나 --all 이면 그 계정에 보이는 메뉴 전부
//   --company=kfstest           회사코드(= 서브도메인). 기본 kfstest
//   --user=104                  로그인 ID. 기본 104
//   --password=…                비밀번호. 생략하면 환경변수 ASSETERP_TEST_PASSWORD, 그것도 없으면 1111(테스트 계정 공통)
//   --base-url=http://…         주소를 직접 줌(기본 http://<회사코드>.localhost:5173)
//   --out=결과.json             화면별 결과를 JSON 으로 저장
//   --concurrency=4             동시에 여는 탭 수
//   --verbose                   통과한 화면도 한 줄씩 출력
//   -h, --help                  이 도움말
// 판정: PASS · WARN(4xx·콘솔 오류·조회 중 쓰기 요청. 출력/조회용 POST 는 제외 — READ_ONLY_POST) · FAIL(안 열림·페이지 예외·5xx) · SKIP(그 계정에 없는 화면)
// 종료코드: FAIL 이 하나라도 있으면 1, 아니면 0. 조회만 하며 데이터를 바꾸지 않는다.
// 계정: docs/5-테스트/테스트용-회사-계정.md. kfstest/admin 은 사람이 손으로 쓰는 계정이라 로그인이 겹칠 수 있다.
"use strict";
const fs = require("fs");
const { parseArgs } = require("node:util");
const L = require("./lib.cjs");

const { values: o } = parseArgs({
  options: {
    "screen-no": { type: "string" }, all: { type: "boolean" }, company: { type: "string", default: "kfstest" },
    user: { type: "string", default: "104" }, password: { type: "string" }, "base-url": { type: "string" },
    out: { type: "string" }, concurrency: { type: "string", default: "4" }, verbose: { type: "boolean" }, help: { type: "boolean", short: "h" },
  },
});
if (o.help) {
  console.log(fs.readFileSync(__filename, "utf8").split("\n").filter((l) => l.startsWith("//")).slice(0, 21).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}

const base = L.baseUrl(o.company, o["base-url"]);
const password = o.password ?? process.env.ASSETERP_TEST_PASSWORD ?? "1111";
const wanted = o["screen-no"] && !o.all ? o["screen-no"].split(",").map((s) => s.trim()).filter(Boolean) : null;

/** 조회·출력용인데 본문(body)을 실어 보내려고 POST 를 쓰는 요청 — "조회 중 쓰기 요청"으로 세지 않는다.
 *  RD 출력 URL 만들기(/rd/urls, *-rd, rd-print)와 조회 본문을 POST 로 받는 /data. 새로 생기면 여기에 더한다(데이터를 바꾸는 요청은 넣지 않는다). */
const READ_ONLY_POST = /\/api\/v1\/(rd\/urls|.*\/[\w-]*-rd|.*\/rd-print|.*\/data)(\?|$)/;

/** 화면 하나: 새 탭 → 화면 열기 → 조회 버튼 → 요청·오류 수집 */
async function check(ctx, item) {
  const page = await ctx.newPage();
  const r = { no: item.no, cls: item.cls, title: item.title, status: "PASS", notes: [], requests: 0 };
  const api = [], bad = [], writes = [], errs = [];
  page.on("request", (q) => { if (q.url().includes("/api/")) { api.push(q); if (q.method() !== "GET" && !(q.method() === "POST" && READ_ONLY_POST.test(q.url()))) writes.push(`${q.method()} ${q.url().replace(/^.*\/api\//, "/api/")}`); } });
  page.on("response", (s) => { if (s.url().includes("/api/") && s.status() >= 400) bad.push(`${s.status()} ${s.request().method()} ${s.url().replace(/^.*\/api\//, "/api/").slice(0, 90)}`); });
  page.on("pageerror", (e) => errs.push("예외 " + e.message.slice(0, 100)));
  page.on("console", (m) => { if (m.type() === "error" && !/Warning:|favicon|WebSocket|Failed to load resource/.test(m.text())) errs.push("콘솔 " + m.text().slice(0, 100)); });
  try {
    await page.goto(base + "/", { waitUntil: "domcontentloaded" });
    await L.pass(page);
    await page.waitForTimeout(1200); api.length = 0; bad.length = 0; writes.length = 0; errs.length = 0;   // 첫 화면(My Page) 요청은 뺀다
    await L.openMenu(page, item.no);
    await page.waitForTimeout(2500);
    const opened = (await page.getByText(new RegExp(`^${item.no}\\s`)).count()) > 0;
    if (!opened) { r.status = "FAIL"; r.notes.push("탭이 열리지 않음"); }
    const btn = page.getByRole("button", { name: /조\s*회/ });
    if (await btn.count()) {
      await btn.first().click({ timeout: 3000 }).catch(() => r.notes.push("조회 버튼을 누르지 못함"));
      await page.waitForTimeout(1500);
    }
    r.requests = api.length;
  } catch (e) {
    r.status = "FAIL"; r.notes.push(e.message.split("\n")[0].slice(0, 100));
  }
  const fivexx = bad.filter((b) => /^5/.test(b));
  if (errs.some((e) => e.startsWith("예외")) || fivexx.length) r.status = "FAIL";
  else if (r.status === "PASS" && (bad.length || errs.length || writes.length)) r.status = "WARN";
  r.notes.push(...[...new Set(fivexx)], ...[...new Set(bad.filter((b) => !/^5/.test(b)))], ...[...new Set(errs)], ...writes.map((w) => "조회 중 쓰기 요청 " + w));
  await page.close().catch(() => {});
  return r;
}

(async () => {
  if (o.company === "kfstest" && o.user === "admin") console.log("⚠ kfstest/admin 은 사람이 손으로 쓰는 계정이다. 로그인이 겹쳐 세션이 끊길 수 있다.");
  const browser = await L.launch();
  let ctx, home;
  try { ({ ctx, page: home } = await L.login(browser, base, o.user, password)); }
  catch (e) { console.error("[ERROR]", e.message); await browser.close(); process.exit(2); }

  const menus = await L.menus(home);
  await home.close();
  const byNo = new Map(menus.map((m) => [m.no, m]));
  const items = []; const results = [];
  if (wanted) for (const no of wanted) { if (byNo.has(no)) items.push(byNo.get(no)); else { const r = { no, cls: "", title: "", status: "SKIP", notes: [`${o.company}/${o.user} 에게 보이지 않는 화면(메뉴에 없음)`], requests: 0 }; results.push(r); console.log(`SKIP ${no} — ${r.notes[0]}`); } }
  else items.push(...menus);
  console.log(`==> ${o.company}/${o.user} @ ${base} — 보이는 메뉴 ${menus.length}개 중 ${items.length}개 시험 (열기 + 조회만)`);

  let next = 0, done = 0;
  const worker = async () => {
    while (next < items.length) {
      const it = items[next++];
      const r = await check(ctx, it); results.push(r);
      if (o.verbose || r.status !== "PASS") console.log(`${r.status.padEnd(4)} ${r.no} ${r.cls} ${r.title} ${r.notes.length ? "— " + r.notes.join(" ; ") : ""}`.trimEnd());
      else if (++done % 25 === 0) process.stdout.write(`… ${done}\n`);
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, +o.concurrency || 1) }, worker));

  const c = { PASS: 0, WARN: 0, FAIL: 0, SKIP: 0 }; results.forEach((r) => c[r.status]++);
  console.log(`==> 결과: PASS ${c.PASS} · WARN ${c.WARN} · FAIL ${c.FAIL} · SKIP ${c.SKIP}  (총 ${results.length})`);
  console.log("    ※ 열기와 조회만 본 연기 시험이다. 통과가 '데이터·업무 규칙이 맞다'는 뜻은 아니다 → tools/screen-test/README.md 의 다음 시험.");
  if (o.out) { results.sort((a, b) => a.no.localeCompare(b.no)); fs.writeFileSync(o.out, JSON.stringify({ base, company: o.company, user: o.user, at: new Date().toISOString(), counts: c, results }, null, 1)); console.log("    결과 파일:", o.out); }
  await browser.close();
  process.exit(c.FAIL ? 1 : 0);
})().catch((e) => { console.error("[ERROR]", e.message); process.exit(2); });
