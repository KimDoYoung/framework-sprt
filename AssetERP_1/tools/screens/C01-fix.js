// C01 하단 탭 공통 수정(2026-10-12 사용자 지적) 확인: 헤더 정렬 없음, 체크박스(행 선택·addBoolean) 동작, 날짜 칸 폭, 급여공제 2단.
// 저장하지 않는다(체크 후 조회로 버림).
// 사용: NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C01-fix.js <스크린샷 폴더> [회사] [검색어]
const { chromium } = require('playwright-core');
const [OUT, COMPANY = 'kfstest', SEARCH = '천영임'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const out = { errs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  try {
    await p.goto('http://admin.localhost:8082/AssetERP_1/', { waitUntil: 'networkidle' });
    await p.locator('.ant-select').first().click(); await p.keyboard.type(COMPANY); await p.waitForTimeout(500); await p.keyboard.press('Enter');
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('경영관리', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('사원정보 관리', { exact: true }).first().click(); await p.waitForTimeout(2500);
    const top = p.locator('.ant-splitter-panel').first(), bottom = p.locator('.ant-splitter-panel').last();
    out.datePickerWidth = await top.locator('.ant-picker').first().evaluate(el => el.getBoundingClientRect().width);
    // 정렬: 목록 헤더 클릭 → 정렬 표시 없음
    await top.locator('.ag-header-cell[col-id="korNm"]').click(); await p.waitForTimeout(400);
    out.sortIcons = await p.locator('.ag-header-cell.ag-header-cell-sorted-asc, .ag-header-cell.ag-header-cell-sorted-desc').count();
    await top.locator('input[style*="width: 120px"]').first().fill(SEARCH);
    await top.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    out.splitterPanels = await p.locator('.ant-splitter-panel').count();
    // 급여공제: 안쪽 분할 없음
    await bottom.locator('.ant-tabs-tab', { hasText: '급여공제' }).click(); await p.waitForTimeout(1500);
    out.splitterPanelsDeduct = await p.locator('.ant-splitter-panel').count();
    await p.screenshot({ path: OUT + '/C01-fix-deduct.png' });
    // 경력사항·일반발령: 행 선택 체크박스, addBoolean 체크박스
    for (const tab of ['경력사항', '일반발령']) {
      await bottom.locator('.ant-tabs-tab', { hasText: tab }).click(); await p.waitForTimeout(1500);
      const r = { rows: await bottom.locator('.ag-center-cols-container .ag-row').count() };
      const sel = bottom.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first();
      if (await sel.count()) { await sel.click({ force: true }); await p.waitForTimeout(300); r.selected = await bottom.locator('.ag-row-selected').count(); }
      const chk = bottom.locator('.ag-row[row-index="0"] .gb-check input[type=checkbox]').first();
      if (await chk.count()) {
        const before = await chk.isChecked();
        await chk.click(); await p.waitForTimeout(300);
        r.boolBefore = before; r.boolToggled = (await chk.isChecked()) !== before;
      }
      await p.screenshot({ path: OUT + `/C01-fix-${tab}.png` });
      await bottom.getByRole('button', { name: '조회' }).first().click(); await p.waitForTimeout(1000);
      r.afterRetrieve = await bottom.locator('.ag-row[row-index="0"] .gb-check input[type=checkbox]').first().isChecked().catch(() => null);
      out[tab] = r;
    }
  } catch (e) {
    out.errs.push('SCRIPT: ' + e.message.slice(0, 200));
    await p.screenshot({ path: OUT + '/C01-fix-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
