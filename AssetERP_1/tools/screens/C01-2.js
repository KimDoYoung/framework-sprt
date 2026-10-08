// C01-2 기타정보 탭(Emp02_TabPage_Others) 화면 확인. 첫 행 사원의 기타정보를 보고 같은 값으로 저장한다(데이터 그대로 — 호출 쪽에서 md5 대조).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C01-2.js <스크린샷 폴더> [회사]'"
const { chromium } = require('playwright-core');
const [OUT, COMPANY = 'kfstest'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const out = { errs: [], msgs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  const lastMsg = async () => { await p.waitForTimeout(600); const t = await p.locator('.ant-message-notice').allInnerTexts().catch(() => []); out.msgs.push(t.join(' | ')); };
  try {
    await p.goto('http://admin.localhost:8082/AssetERP_1/', { waitUntil: 'networkidle' });
    await p.locator('.ant-select').first().click(); await p.keyboard.type(COMPANY); await p.waitForTimeout(500); await p.keyboard.press('Enter');
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('경영관리', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('사원정보 관리', { exact: true }).first().click(); await p.waitForTimeout(2500);
    const top = p.locator('.ant-splitter-panel').first(), bottom = p.locator('.ant-splitter-panel').last();
    out.selected = await top.locator('.ag-row-selected .ag-cell[col-id="empNo"]').first().innerText().catch(() => '');
    await bottom.locator('.ant-tabs-tab', { hasText: '기타정보' }).click(); await p.waitForTimeout(1500);
    const pane = bottom;
    out.labels = await pane.locator('.ant-typography').allInnerTexts();
    out.buttons = await pane.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.values = await pane.evaluate(el => [...el.querySelectorAll('input, textarea, .ant-select-selection-item')].map(i => i.value ?? i.textContent).filter(v => v));
    out.disabled = await pane.locator('input[disabled]').count();
    await p.screenshot({ path: OUT + '/C01-2.png' });
    await pane.getByRole('button', { name: '저장' }).click(); await lastMsg();
  } catch (e) {
    out.errs.push('SCRIPT: ' + e.message.slice(0, 200));
    await p.screenshot({ path: OUT + '/C01-2-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
