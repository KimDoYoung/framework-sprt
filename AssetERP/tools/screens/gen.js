// 화면시험 명세(JSON) 러너 — 화면마다 스크립트를 쓰지 않고 명세 10~20줄로 표준 시나리오를 돌린다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/gen.js <명세.json ...|--all-pending> <스크린샷 폴더> [회사]
//   --all-pending: docs/work/*/*-화면시험.json 중 같은 폴더 `{id}-결과확인.md`의 7행이 `대기(일괄)`인 것 전부(한 브라우저·한 로그인)
// 명세 스키마 (모두 선택, 없는 절은 건너뜀):
//   id, menu: [1차, 메뉴이름], api: ['ast/'],            // trackApi 접두사
//   opens: { rows: '조회 전용이면 0이 아닌 기대 판정 정규식/숫자', headers: '정규식', buttons: '정규식' },
//   search: true,                                        // [조회] 후 행 수 > 0 기대
//   deleteNone: true,                                    // 선택 없는 [삭제] 안내가 뜨는지
//   grid: true,                                          // checkGrid (06 항목 7-1)
//   cellCrud: { key: {col:'값'}, cells: [{col, kind:'type'|'pick', value}], required: [{fill: 0..n, msg:'정규식'}],
//               edit: {col, value}, searchText: '시험 행 검색어' },   // 셀 편집 CRUD: 등록→필수안내→저장→수정→삭제(아니오·예)
//   custom: '경로.js'                                    // module.exports = async ({ p, h, scr, grid, out, expect }) => {}  특이 동작만
// 시험 행은 끝(또는 실패)에서 반드시 지운다 — cellCrud.key로 찾아 삭제하며, 찾지 못하면 남은 것이 없는 것으로 본다.
const fs = require('fs'), path = require('path');
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');

const args = process.argv.slice(2);
const pending = args.includes('--all-pending');
const rest = args.filter(a => a !== '--all-pending');
const specs = [];
let OUT, COMPANY = 'admin';
if (pending) {
  [OUT, COMPANY = 'admin'] = rest;
  const root = path.join(__dirname, '../../docs/work');
  for (const d of fs.readdirSync(root)) for (const f of fs.readdirSync(path.join(root, d))) {
    const m = f.match(/^(.+)-화면시험\.json$/); if (!m) continue;
    const res = path.join(root, d, `${m[1]}-결과확인.md`);
    if (fs.existsSync(res) && /대기\(일괄\)/.test(fs.readFileSync(res, 'utf8'))) specs.push(path.join(root, d, f));
  }
} else {
  const n = rest.findIndex(a => !a.endsWith('.json'));
  specs.push(...rest.slice(0, n));
  [OUT, COMPANY = 'admin'] = rest.slice(n);
}

async function runSpec(p, h, file) {
  const spec = JSON.parse(fs.readFileSync(file, 'utf8'));
  const id = spec.id || path.basename(file).replace('-화면시험.json', '');
  const out = {};
  const api = h.trackApi(spec.api || []);
  const scr = h.scr;
  const mark = n => h.expect(`${id} ${n}`, true, true);
  const ex = (n, a, e) => h.expect(`${id} ${n}`, a, e);
  let cleanup = null;
  try {
    await openMenu(p, spec.menu[0], spec.menu[1]); await h.wait(2500);
    const grid = scr().locator('.ag-root-wrapper').first();
    const o = spec.opens || {};
    out.buttons = await h.buttons(scr()); out.headers = await h.headers(grid); out.rowsOpen = await h.rows(grid);
    if (o.buttons) ex('버튼', out.buttons, new RegExp(o.buttons));
    if (o.headers) ex('헤더', out.headers, new RegExp(o.headers));
    if (o.rows !== undefined) ex('열 때 행 수', out.rowsOpen, typeof o.rows === 'number' ? o.rows : new RegExp(o.rows));
    await p.screenshot({ path: `${OUT}/${id}-open.png` });
    if (spec.search) { await h.retrieve(); out.rowsSearch = await h.rows(grid); ex('조회 행 수>0', out.rowsSearch, n => n > 0); }
    if (spec.deleteNone) { await h.btn(scr(), /삭\s*제/).click(); out.msgDeleteNone = await h.msgs(); ex('선택 없는 삭제 안내', out.msgDeleteNone, /선택|없/); await h.wait(2800); }
    if (spec.grid) {
      for (const k of await grid.locator('.ag-row .ag-checkbox-input:checked').all()) await k.uncheck();   // 열 때 첫 행이 체크된 화면(checkGrid 오판 방지)
      out.grid = await checkGrid(p, scr()); ex('그리드 점검', gridOk(out.grid), true); await h.retrieve(); }

    const c = spec.cellCrud;
    if (c) {
      cleanup = async () => {   // 실패해도 시험 행을 지운다
        if (c.searchText) await h.searchFor(c.searchText);
        const i = await h.findRowIdx(grid, c.key); if (i < 0) return;
        await h.checkOnly(grid, i); await h.btn(scr(), /삭\s*제/).click();
        await h.confirmDeleteOne(); await h.confirmYes(); await h.wait(1500);
      };
      const blank = Object.fromEntries(Object.keys(c.key).map(k => [k, '']));
      await h.btn(scr(), /^\s*등\s*록\s*$/).click(); await h.wait(600);
      await p.keyboard.press('Escape'); await h.wait(300);
      const ni = h.need(await h.findRowIdx(grid, blank), '새 행');
      let filled = 0;
      for (const r of c.required || []) {
        for (; filled < r.fill; filled++) { const k = c.cells[filled]; await (k.kind === 'pick' ? h.pick : h.type)(grid, ni, k.col, k.value); }
        await h.btn(scr(), /저\s*장/).click(); ex(`필수 안내(${r.fill})`, await h.msgs(), new RegExp(r.msg)); await h.wait(2800);
      }
      for (; filled < c.cells.length; filled++) { const k = c.cells[filled]; await (k.kind === 'pick' ? h.pick : h.type)(grid, ni, k.col, k.value); }
      await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
      ex('저장 성공 메시지', await h.msgs(), /저장|등록|성공/); await h.wait(2800);
      if (c.searchText) await h.searchFor(c.searchText);
      const ti = h.need(await h.findRowIdx(grid, c.key), '저장된 시험 행');
      out.savedRow = (await h.rowsText(grid))[ti];
      if (c.edit) {
        await h.type(grid, ti, c.edit.col, c.edit.value);
        await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
        ex('수정 메시지', await h.msgs(), /저장|수정|성공/); await h.wait(2800);
        await h.retrieve();
        ex('수정 반영', (await h.rowsText(grid))[h.need(await h.findRowIdx(grid, { ...c.key, [c.edit.col]: c.edit.value }), '수정된 행')].includes(c.edit.value), true);
      }
      const di = h.need(await h.findRowIdx(grid, c.key), '삭제할 시험 행');
      await h.checkOnly(grid, di); await h.btn(scr(), /삭\s*제/).click();
      out.confirm = await h.confirmDeleteOne();
      await h.confirmNo(); const before = await h.rows(grid);
      await h.btn(scr(), /삭\s*제/).click(); await h.confirmYes();
      ex('삭제 메시지', await h.msgs(), /삭제/); await h.wait(2800);
      ex('삭제 후 행 감소', await h.rows(grid), n => n < before);
      cleanup = null;
    }
    if (spec.custom) await require(path.resolve(path.dirname(file), spec.custom))({ p, h, scr, grid, out, expect: ex, api });
    out.writes = api.writes; out.getsN = api.gets.length;
    mark('완료');
  } catch (e) {
    ex('실행 중 예외', e.message.split('\n').filter(l => l.trim()).slice(0, 3).join(' / '), 'no error');   // 원인 줄(waiting for locator …)까지 3줄
    if (cleanup) { try { await cleanup(); } catch (e2) { out.cleanupFailed = e2.message.split('\n')[0]; } }
    try { await p.screenshot({ path: `${OUT}/${id}-fail.png` }); } catch {}
  }
  return out;
}

(async () => {
  if (!specs.length || !OUT) { console.error('사용: gen.js <명세.json ...|--all-pending> <스크린샷 폴더> [회사]'); process.exit(2); }
  fs.mkdirSync(OUT, { recursive: true });
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  try {
    await login(p, COMPANY);
    for (const f of specs) out[path.basename(f)] = await runSpec(p, h, f);
  } finally { await b.close(); }
  process.exitCode = h.report(OUT, out) ? 0 : 1;
})();
