// C05 고객별 문자사용량(Sms02_Tab_TotalCount + Sms02_TabPage_Detail + Sms02_Lookup_History) 화면 확인.
// 조회만 있는 화면이라 데이터를 바꾸지 않는다. admin 회사 메뉴라 admin 테넌트 admin으로 확인한다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더의 상위 node_modules> node tools/screens/C05.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('고객별 문자사용량', { exact: true }).first().click(); await p.waitForTimeout(2500);

    const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').nth(1);
    out.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.useYnLabel = await left.locator('.ant-checkbox-wrapper').allInnerTexts();
    out.useYnChecked = await left.locator('.ant-checkbox-wrapper input').first().isChecked();
    out.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
    out.rows = await countRows(left);
    out.firstRow = await left.locator('.ag-row[row-index="0"]').first().innerText();
    out.firstSelected = await left.locator('.ag-row[row-index="0"].ag-row-selected').count();
    out.yearHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();
    out.rightGridCount = await right.locator('.ag-root-wrapper').count();
    out.yearRows = await countRows(right.locator('.ag-root-wrapper').first());
    out.monthRows = await countRows(right.locator('.ag-root-wrapper').nth(1));
    out.yearSelected = await right.locator('.ag-root-wrapper').first().locator('.ag-row-selected').count();
    out.panelCount = await p.locator('.ant-splitter-panel').count();
    // [Detail E1] 연도 RowClick → 월별 다시 조회
    const yearGrid = right.locator('.ag-root-wrapper').first(), monthGrid = right.locator('.ag-root-wrapper').nth(1);
    out.monthFirstBefore = await monthGrid.locator('.ag-row[row-index="0"]').first().innerText();
    await yearGrid.locator('.ag-row[row-index="2"]').first().click(); await p.waitForTimeout(1200);
    out.yearClicked = await yearGrid.locator('.ag-row-selected').first().innerText();
    out.monthFirstAfter = await monthGrid.locator('.ag-row[row-index="0"]').first().innerText();
    out.monthRowsAfter = await countRows(monthGrid);
    out.leftGrid = await checkGrid(p, left);
    await p.screenshot({ path: `${OUT}/C05-1-main.png` });

    // 사용고객만 보기 해제 → 조회 (useYn=false)
    await left.locator('.ant-checkbox-wrapper').click(); await left.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    out.rowsAllCustomers = await countRows(left);
    await left.locator('.ant-checkbox-wrapper').click(); await left.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);

    // 발신기록 아이콘 → 조회창
    await left.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] span').first().dispatchEvent('click'); await p.waitForTimeout(1500);
    const dlg = p.locator('.ant-modal').filter({ hasText: '발신기록' });
    out.dlgTitle = await dlg.locator('.ant-modal-title').innerText();
    out.dlgDates = await dlg.locator('input[placeholder], .ant-picker input').evaluateAll(els => els.map(e => e.value));
    out.dlgHeaders = await dlg.locator('.ag-header-cell-text').allInnerTexts();
    out.dlgButtons = await dlg.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.dlgRows = await countRows(dlg);
    await p.waitForTimeout(2500);
    out.dlgRowDom = await dlg.locator('.ag-row').evaluateAll(els => els.map(e => ({ i: e.getAttribute('row-index'), h: e.getBoundingClientRect().height, t: e.innerText.slice(0, 30).replace(/\n/g, '|'), top: e.style.transform })));
    await p.screenshot({ path: `${OUT}/C05-2-history.png` });
    // 검색어 Enter → 줄어듦
    await dlg.locator('input[placeholder="내용"]').fill('결재'); await dlg.locator('input[placeholder="내용"]').press('Enter'); await p.waitForTimeout(1200);
    out.dlgRowsSearch = await countRows(dlg);
    await dlg.locator('input[placeholder="내용"]').fill('zzzz없는말'); await dlg.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1200);
    out.dlgRowsNone = await countRows(dlg);
    await dlg.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(600);
    out.dlgClosed = (await p.locator('.ant-modal-wrap:visible').count()) === 0;
  } catch (e) {
    out.fail = String(e).slice(0, 400);
    await p.screenshot({ path: `${OUT}/C05-fail.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
