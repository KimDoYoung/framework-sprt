// 행 추가 동작(AS-IS GridInsertRow + GridUpdate) 확인 — 교육사항 탭.
// ① 등록 → 저장: 아무것도 고치지 않은 새 행은 저장되지 않는다(메시지 없음) ② 등록 → 교육내용 입력 → 저장: 저장된다 → 체크 삭제로 지운다.
// 사용: NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C01-addrow.js <스크린샷 폴더> [회사] [검색어]
const { chromium } = require('playwright-core');
const [OUT, COMPANY = 'kfstest', SEARCH = '천영임'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const out = { errs: [], msgs: [], puts: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  p.on('request', r => { if (r.url().includes('/emp/educations') && r.method() !== 'GET') out.puts.push(r.method() + ' ' + (r.postData() || '').slice(0, 120)); });
  const msg = async () => { await p.waitForTimeout(700); out.msgs.push((await p.locator('.ant-message-notice').allInnerTexts().catch(() => [])).join(' | ')); await p.waitForTimeout(2600); };
  try {
    await p.goto('http://admin.localhost:8082/AssetERP/', { waitUntil: 'networkidle' });
    await p.locator('.ant-select').first().click(); await p.keyboard.type(COMPANY); await p.waitForTimeout(500); await p.keyboard.press('Enter');
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('경영관리', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('사원정보 관리', { exact: true }).first().click(); await p.waitForTimeout(2500);
    const top = p.locator('.ant-splitter-panel').first(), bottom = p.locator('.ant-splitter-panel').last();
    await top.locator('input[style*="width: 120px"]').first().fill(SEARCH);
    await top.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    await bottom.locator('.ant-tabs-tab', { hasText: '교육사항' }).click(); await p.waitForTimeout(1500);
    const btn = name => bottom.locator('button').filter({ hasText: new RegExp('^' + name + '$') });
    const rows = () => bottom.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
    out.rows0 = await rows();
    // ①
    await btn('등록').click(); await p.waitForTimeout(500); await p.keyboard.press('Escape');
    out.rowsAdded = await rows();
    await btn('저장').click(); await msg();
    await btn('조회').click(); await p.waitForTimeout(1200);
    out.rowsAfterBlankSave = await rows();
    // ②
    await btn('등록').click(); await p.waitForTimeout(500); await p.keyboard.press('Escape');
    await bottom.locator('.ag-row[row-index="0"] [col-id="content"]').first().dblclick(); await p.waitForTimeout(300);
    await p.keyboard.type('C01-행추가시험'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    await btn('저장').click(); await msg();
    await btn('조회').click(); await p.waitForTimeout(1200);
    out.rowsAfterSave = await rows();
    out.content = await bottom.locator('.ag-row[row-index="0"] [col-id="content"]').first().innerText().catch(() => '');
    // 지우기
    await bottom.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().check({ force: true });
    await btn('삭제').click(); await p.waitForTimeout(500);
    await p.locator('.ant-modal-confirm .ant-btn-primary, .ant-modal-confirm button:has-text("예"), .ant-modal-confirm button:has-text("확인")').first().click(); await p.waitForTimeout(1200);
    out.rowsEnd = await rows();
  } catch (e) {
    out.errs.push('SCRIPT: ' + e.message.slice(0, 200));
    await p.screenshot({ path: OUT + '/C01-addrow-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
