// E11 책무기술서 재생성(Tdm31_Tab_RoleDescAdmin #1493) 화면 확인.
// 읽기만 한다 — 재생성은 RD 연동이 없어 서버가 거절하므로 DB·파일이 바뀌지 않는다(거절은 실패 메시지로 확인).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E11.js <스크린샷 폴더> [회사]
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
    if (!u.includes('/api/v1/tdm/') && !u.includes('/api/v1/sys/files')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const btn = (scope, re, n = 0) => scope.locator('button').filter({ hasText: re }).nth(n);
  const rows = g => g.locator('.ag-row[row-index]').count();
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '책무기술서 재생성');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2000);
    const grid = scr.locator('.ag-root-wrapper').first();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await grid.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.checkboxes = await scr.locator('.ant-checkbox-wrapper').allInnerTexts();
    out.checked = await scr.locator('.ant-checkbox-wrapper input').evaluateAll(a => a.map(i => i.checked));
    out.dateDisabled = await scr.locator('.ant-picker input').evaluateAll(a => a.map(i => i.disabled));
    out.companyField = await scr.locator('.ant-input-affix-wrapper input').first().inputValue();
    out.searchPlaceholder = await scr.locator('input[placeholder="직책/담당임원"]').count();
    out.rowsOpen = await rows(grid);                         // 열 때 조회하지 않는다
    out.getsOpen = gets.slice();
    await p.screenshot({ path: `${OUT}/E11-open.png` });

    // [E5] 조회 (고객사 ADMIN 기본 → admin 회사에는 책무기술서가 없다)
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsAdmin = await rows(grid); out.getsAdmin = gets.slice(-1);

    // [E2] 고객사 조회창 → 한국펀드서비스
    await scr.locator('.ant-input-affix-wrapper input').first().click(); await wait(1500);
    const lk = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '고객사 찾기' }) }).last();
    await lk.locator('input.ant-input').first().fill('한국펀드'); await lk.locator('input.ant-input').first().press('Enter'); await wait(1500);
    await lk.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
    await lk.locator('button').filter({ hasText: /확\s*인/ }).first().click(); await wait(2000);
    out.companyAfter = await scr.locator('.ant-input-affix-wrapper input').first().inputValue();
    // [E4] 검색어 Enter (빈 검색) / [E5] 조회
    await scr.locator('input[placeholder="직책/담당임원"]').press('Enter'); await wait(1500);
    out.rowsCompanyEnd = await rows(grid); out.getsCompanyEnd = gets.slice(-1);

    // [E3] 상신건만 조회 해제 → 자동 조회
    await scr.locator('.ant-checkbox-wrapper', { hasText: '상신건만 조회' }).click(); await wait(1500);
    out.rowsAll = await rows(grid); out.getsAll = gets.slice(-1);
    out.rowTexts = (await grid.locator('.ag-row[row-index]').allInnerTexts()).slice(0, 3).map(t => t.replace(/\s+/g, ' '));
    await p.screenshot({ path: `${OUT}/E11-all.png` });

    // [E1] 전체보기 해제 → 기간 칸 사용 + 자동 조회
    await scr.locator('.ant-checkbox-wrapper', { hasText: '전체보기' }).click(); await wait(1500);
    out.dateEnabledAfter = await scr.locator('.ant-picker input').evaluateAll(a => a.map(i => !i.disabled));
    out.rowsPeriod = await rows(grid); out.getsPeriod = gets.slice(-1);
    await scr.locator('.ant-checkbox-wrapper', { hasText: '전체보기' }).click(); await wait(1500);
    out.rowsBackAll = await rows(grid);

    // 그리드 기본 점검
    const gc = await checkGrid(p, scr); out.grid = gc; out.gridOk = gridOk(gc);

    // [E6] 선택 없이 재생성 → 안내
    await p.reload({ waitUntil: 'networkidle' }); await wait(2500);
    await openMenu(p, '기초자료', '책무기술서 재생성');
    const scr2 = p.locator('.flexlayout__tab:visible').last(); await wait(1500);
    const grid2 = scr2.locator('.ag-root-wrapper').first();
    await scr2.locator('.ant-input-affix-wrapper input').first().click(); await wait(1500);
    const lk2 = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '고객사 찾기' }) }).last();
    await lk2.locator('input.ant-input').first().fill('한국펀드'); await lk2.locator('input.ant-input').first().press('Enter'); await wait(1500);
    await lk2.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
    await lk2.locator('button').filter({ hasText: /확\s*인/ }).first().click(); await wait(1500);
    await btn(scr2, /^\s*조\s*회\s*$/).click(); await wait(1500);
    await btn(scr2, /재\s*생\s*성/).click(); out.msgNoSelect = await msgs(); await wait(2800);

    // 한 건 선택 → 재생성 → 진행 창 → 서버 거절 → [닫기]
    await grid2.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click({ force: true }); await wait(300);
    await btn(scr2, /재\s*생\s*성/).click(); await wait(2500);
    const dlg = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '파일 재생성' }) }).last();
    out.dlgText = (await dlg.locator('.ant-modal-body').innerText()).replace(/\s+/g, ' ');
    out.dlgCloseEnabled = await dlg.locator('button').filter({ hasText: /닫\s*기/ }).first().isEnabled();
    await p.screenshot({ path: `${OUT}/E11-recreate.png` });
    await dlg.locator('button').filter({ hasText: /닫\s*기/ }).first().click(); await wait(500);
    out.dlgClosed = (await p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '파일 재생성' }) }).count()) === 0;

    // 책무기술서 보기 아이콘 (첨부 없음 → "파일생성실패로인한 RD뷰어호출" + RD 뷰어 없음 안내)
    await grid2.locator('.ag-row[row-index="0"] [aria-label="search"], .ag-row[row-index="0"] button').last().click(); out.msgView = await msgs(); await wait(500);
    out.getsView = gets.slice(-2);
  } catch (e) { out.error = String(e).slice(0, 500); await p.screenshot({ path: `${OUT}/E11-error.png` }).catch(() => {}); }
  out.writes = writes; out.getsAll2 = gets.length;
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
