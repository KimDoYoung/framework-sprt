// E14 책무진행 상태(Tdm50_Tab_DutyProgressAdmin #1511) 화면 확인.
// 조회마다 DB 함수 f_recon_tdm이 sys99_print의 사용자 몫 행을 지우고 다시 만든다(AS-IS 그대로) — 끝나면 이 행은 정리 스크립트(사람)가 지운다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E14.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  p.on('response', r => {
    const u = r.url();
    if (!u.includes('/api/v1/tdm/')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const btn = (scope, re, n = 0) => scope.locator('button').filter({ hasText: re }).nth(n);
  const rows = g => g.evaluate(e => new Set([...e.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '책무진행 상태');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2000);
    const grid = scr.locator('.ag-root-wrapper').first();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.groupHeaders = (await grid.locator('.ag-header-group-cell-label').allInnerTexts()).join('|');
    out.headers = (await grid.locator('.ag-header-cell-text').allInnerTexts()).map(t => t.replace(/\s+/g, ' ')).join('|');
    out.pinnedLeftCols = await grid.locator('.ag-pinned-left-header .ag-header-cell-text').count();
    out.companyField = await scr.locator('.ant-input-affix-wrapper input').first().inputValue();
    out.yearMonth = [await scr.locator('input.ant-input').first().inputValue(), await scr.locator('.ant-select-selection-item').first().innerText()];
    out.rowsOpen = await rows(grid);                         // 열 때 조회하지 않는다
    out.writesOpen = writes.slice();
    await p.screenshot({ path: `${OUT}/E14-open.png` });

    // [E1] 조회 → insertReconTdm(POST) + selectByWindowClassName(GET)
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(3000);
    out.rowsQuery = await rows(grid); out.writesQuery = writes.slice(-1); out.getsQuery = gets.slice(-1);
    out.rowTexts = (await grid.locator('.ag-row[row-index]').allInnerTexts()).slice(0, 2).map(t => t.replace(/\s+/g, ' '));
    await p.screenshot({ path: `${OUT}/E14-query.png` });

    // QuickMoveField ◀ → 한 달 전으로 곧바로 조회, 월별 헤더가 기준월부터 다시 붙는다
    const monthBefore = await scr.locator('.ant-select-selection-item').first().innerText();
    await scr.locator('a', { hasText: '◀' }).first().dispatchEvent('mousedown'); await wait(3000);
    out.monthMoved = [monthBefore, await scr.locator('.ant-select-selection-item').first().innerText()];
    out.writesPrev = writes.slice(-1);
    await grid.locator('.ag-body-horizontal-scroll-viewport').evaluate(e => { e.scrollLeft = 3000; }); await wait(800);
    out.monthHeaders = (await grid.locator('.ag-header-group-cell-label').allInnerTexts()).join('|') +
      ' | ' + (await grid.locator('.ag-header-cell-text').allInnerTexts()).filter(t => /^\d+월$/.test(t.trim())).join(',');
    await p.screenshot({ path: `${OUT}/E14-months.png` });
    await grid.locator('.ag-body-horizontal-scroll-viewport').evaluate(e => { e.scrollLeft = 0; });
    // ▶ 두 번 → 다음 달(연 경계는 12월→1월)
    await scr.locator('a', { hasText: '▶' }).first().dispatchEvent('mousedown'); await wait(2500);
    out.monthNext = await scr.locator('.ant-select-selection-item').first().innerText(); out.writesNext = writes.slice(-1);

    // [E2] 고객사 조회창 → 한국펀드서비스, 고르면 바로 조회
    await scr.locator('.ant-input-affix-wrapper input').first().click(); await wait(1500);
    const lk = p.locator('.ant-modal:visible').last();
    out.lookupTitle = await lk.locator('.ant-modal-title').innerText();
    await lk.locator('input.ant-input').first().fill('한국펀드'); await lk.locator('input.ant-input').first().press('Enter'); await wait(1500);
    await lk.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
    await lk.locator('button').filter({ hasText: /확\s*인/ }).first().click(); await wait(3000);
    out.companyAfter = await scr.locator('.ant-input-affix-wrapper input').first().inputValue();
    out.rowsCompany = await rows(grid); out.writesCompany = writes.slice(-1);
    await p.screenshot({ path: `${OUT}/E14-company.png` });

    const gc = await checkGrid(p, scr); out.grid = gc; out.gridOk = gridOk(gc);
  } catch (e) { out.error = String(e).slice(0, 500); await p.screenshot({ path: `${OUT}/E14-error.png` }).catch(() => {}); }
  out.writes = writes; out.getsTotal = gets.length;
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
