// C01-6 겸직발령(Emp04_TabPage_AddTitle + Emp04_Edit_AddTitle)·교육사항(Emp19_TabPage_education) 화면 확인.
// 저장·삭제는 서버로 보내지 않는다(데이터 그대로): 팝업은 필수 검사 메시지까지만, 삭제 확인창은 아니오.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C01-6.js <스크린샷 폴더> [회사] [검색어]'"
const { chromium } = require('playwright-core');
const [OUT, COMPANY = 'kfstest', SEARCH = '천영임'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const out = { errs: [], msgs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const lastMsg = async () => { await p.waitForTimeout(500); const t = await p.locator('.ant-message-notice').last().innerText().catch(() => ''); out.msgs.push(t); await p.waitForTimeout(2600); };
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
    out.selected = await top.locator('.ag-row-selected .ag-cell[col-id="korNm"]').first().innerText().catch(() => '');

    // 겸직발령
    await bottom.locator('.ant-tabs-tab', { hasText: '겸직발령' }).click(); await p.waitForTimeout(1500);
    const pane = bottom;
    out.addTitle = {
      buttons: await pane.locator('button').filter({ hasText: /^(조회|등록|삭제)$/ }).allInnerTexts(),
      headers: await pane.locator('.ag-header-cell-text').allInnerTexts(),
      rows: await countRows(pane),
      first: await pane.locator('.ag-row[row-index="0"] .ag-cell').allInnerTexts().catch(() => []),
    };
    await p.screenshot({ path: OUT + '/C01-6-addTitle.png' });
    // [수정] 셀 → 팝업에 행 값
    await pane.locator('.ag-row[row-index="0"] [col-id="actionCell"] button[aria-label="수정"]').first().click(); await p.waitForTimeout(1200);
    const dlg = p.locator('.ant-modal').last();
    out.edit = {
      title: await dlg.locator('.ant-modal-title').innerText(),
      labels: await dlg.locator('.ant-typography').allInnerTexts(),
      values: await dlg.evaluate(el => [...el.querySelectorAll('input, textarea, .ant-select-selection-item')].map(i => i.value ?? i.textContent).filter(v => v)),
      buttons: await dlg.locator('.ant-modal-footer button').allInnerTexts(),
    };
    await p.screenshot({ path: OUT + '/C01-6-edit.png' });
    await dlg.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(600);
    // [등록] → 빈 팝업(시작일자 오늘) → 저장: 직책 필수
    await pane.locator('button').filter({ hasText: /^등록$/ }).click(); await p.waitForTimeout(1000);
    const dlg2 = p.locator('.ant-modal').last();
    out.insertStart = await dlg2.locator('.ant-picker input').first().inputValue();
    await dlg2.getByRole('button', { name: '저장' }).click(); await lastMsg();
    await dlg2.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(600);
    // [삭제] → 확인창 문구 → 아니오
    await pane.getByRole('button', { name: '삭제' }).click(); await p.waitForTimeout(600);
    out.confirm = await p.locator('.ant-modal-confirm').innerText().catch(() => '');
    await p.locator('.ant-modal-confirm').getByRole('button', { name: '아니오' }).click(); await p.waitForTimeout(600);

    // 교육사항
    await bottom.locator('.ant-tabs-tab', { hasText: '교육사항' }).click(); await p.waitForTimeout(1500);
    const pane2 = bottom;
    out.education = {
      buttons: await pane2.locator('button').filter({ hasText: /\S/ }).allInnerTexts(),
      label: await pane2.locator('.ant-typography').first().innerText(),
      headers: await pane2.locator('.ag-header-cell-text').allInnerTexts(),
      rows: await countRows(pane2),
    };
    await pane2.getByRole('button', { name: '일괄등록' }).click(); await lastMsg();
    // 등록(임시 행) → 일괄등록: 행 미선택이면 선택 문구, 선택하면 "저장 후 가능"
    await pane2.locator('button').filter({ hasText: /^등록$/ }).click(); await p.waitForTimeout(600);
    await p.keyboard.press('Escape');
    await pane2.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().check({ force: true }).catch(() => {});
    await pane2.getByRole('button', { name: '일괄등록' }).click(); await lastMsg();
    await p.screenshot({ path: OUT + '/C01-6-education.png' });
    // 조회로 임시 행 버리기
    await pane2.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1000);
    out.education.rowsAfter = await countRows(pane2);
  } catch (e) {
    out.errs.push('SCRIPT: ' + e.message.slice(0, 200));
    await p.screenshot({ path: OUT + '/C01-6-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
