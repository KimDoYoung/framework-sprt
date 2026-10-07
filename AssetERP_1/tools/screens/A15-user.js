// A15 고객별 관리자 탭(Sys02_Tab_User) + 권한설정 조회창(Sys82_Lookup_UserMenu) 화면 확인. 저장·삭제는 누르지 않는다(데이터 그대로).
// 사용: NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A15-user.js <스크린샷 폴더> [회사 서브도메인]
const { chromium } = require('playwright-core');
const [OUT, COMPANY = 'kfstest'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const out = { errs: [], msgs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  const lastMsg = async () => (await p.locator('.ant-message-notice').allInnerTexts()).pop() ?? '';
  try {
    await p.goto('http://admin.localhost:8082/AssetERP_1/', { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('고객별 시스템정보 관리', { exact: true }).first().click(); await p.waitForTimeout(2000);
    await p.locator('.ag-row', { hasText: COMPANY }).first().locator('.ag-cell[col-id="companyNm"]').click(); await p.waitForTimeout(800);
    await p.locator('.ant-tabs-tab', { hasText: '고객별 관리자' }).click(); await p.waitForTimeout(1500);
    const tab = p.locator('.ant-splitter-panel').last();
    out.buttons = await tab.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.headers = await tab.locator('.ag-header-cell-text').allInnerTexts();
    const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
    out.rows = await countRows(tab);
    // 전체권한 관리자 → 막힘, 아닌 관리자 → 조회창
    for (let i = 0; i < out.rows; i++) {
      const r = tab.locator(`.ag-row[row-index="${i}"]`);
      await tab.locator('.ag-body-horizontal-scroll-viewport').last().evaluate(el => { el.scrollLeft = 2000; }); await p.waitForTimeout(300);
      const full = await r.locator('.ag-cell[col-id="adminYn"] input').isChecked();
      await r.locator('.ag-cell[col-id="actionMenu"] button').first().click(); await p.waitForTimeout(1200);
      if (full) { out.msgs.push('전체권한: ' + await lastMsg()); continue; }
      const lk = p.locator('.ant-modal').filter({ hasText: '매뉴권한' });
      out.lookupButtons = await lk.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
      out.lookupHeaders = await lk.locator('.ag-header-cell-text').allInnerTexts();
      const visible = () => countRows(lk);
      out.treeTop = await visible();
      await lk.getByRole('button', { name: '펼치기' }).click(); await p.waitForTimeout(800);
      out.treeExpanded = await visible();
      await lk.getByRole('button', { name: '감추기' }).click(); await p.waitForTimeout(500);
      out.treeCollapsed = await visible();
      await lk.locator('input').first().fill('권한'); await lk.locator('input').first().press('Enter'); await p.waitForTimeout(800);
      out.searchSelected = await lk.locator('.ag-row-selected').count();
      out.searchVisible = await visible();
      // 권한 칸 클릭 → 그 행과 자손 값이 바뀐다 (저장하지 않음)
      const first = lk.locator('.ag-row[row-index="0"]');
      out.toggleBefore = await first.locator('.ag-cell[col-id="useYn"] input').isChecked();
      await first.locator('.ag-cell[col-id="useYn"]').click(); await p.waitForTimeout(600);
      out.toggleAfter = await first.locator('.ag-cell[col-id="useYn"] input').isChecked();
      out.visibleAfterClick = await visible();
      await p.screenshot({ path: OUT + '/A15-user-menu.png' });
      await lk.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(400);
    }
    await p.screenshot({ path: OUT + '/A15-user.png' });
  } catch (e) {
    console.error(e.message); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A15-user-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
