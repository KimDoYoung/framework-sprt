// A28 고객별 특정화면 관리(Sys53_Tab_SpecificMenuRequestAdmin) 화면 확인. 저장하지 않는다(데이터 변경 없음 — 저장은 같은 값 PUT으로 API에서 확인).
// admin 회사 메뉴라 admin 테넌트 admin으로 확인한다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더의 상위 node_modules> node tools/screens/A28.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const lastMsg = async () => (await p.locator('.ant-message-notice-content').last().innerText().catch(() => ''));
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('고객별 특정화면 관리', { exact: true }).first().click(); await p.waitForTimeout(2500);

    const scr = p.locator('.flexlayout__tab').filter({ hasText: '특정업무구분' }).first();
    out.labels = await scr.locator('.ant-typography').allInnerTexts();
    out.buttons = await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.headers = await scr.locator('.ag-header-cell-text').allInnerTexts();
    // [E0] 열림 → 조회
    out.rows = await countRows(scr);
    out.firstRow = await scr.locator('.ag-row[row-index="0"] .ag-cell').allInnerTexts();
    out.iconCells = await scr.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').count();
    await p.screenshot({ path: OUT + '/A28-1-main.png' });

    // 문서보기 아이콘 → 안내(전자결재 변환 전)
    await scr.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').click(); await p.waitForTimeout(400);
    out.docIcon = await lastMsg();

    // 셀 편집기: 처리자(text) · 처리일(date) · 처리상태(select) — 열기만 하고 Esc
    out.editors = {};
    for (const col of ['confirmNm', 'confirmDate', 'stateNm']) {
      await scr.locator(`.ag-row[row-index="0"] .ag-cell[col-id="${col}"]`).dblclick(); await p.waitForTimeout(500);
      out.editors[col] = await scr.locator('.ag-popup-editor, .ag-cell-inline-editing, .ant-select-dropdown:visible, .ant-picker-dropdown:visible').count();
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    }

    // [E1] 고객사 콤보 → 한국펀드서비스(주) → 조회
    await scr.locator('.ant-select').first().click(); await p.waitForTimeout(400);
    out.companyOptions = await p.locator('.ant-select-item-option:visible').count();
    await p.locator('.ant-select-item-option:visible').filter({ hasText: '한국펀드서비스' }).first().click(); await p.waitForTimeout(1200);
    out.rowsCompany = await countRows(scr);
    // 구분 콤보 = 완료
    await scr.locator('.ant-select').nth(1).click(); await p.waitForTimeout(400);
    out.stateOptions = await p.locator('.ant-select-item-option:visible').allInnerTexts();
    await p.locator('.ant-select-item-option:visible').filter({ hasText: /^완료$/ }).first().click(); await p.waitForTimeout(300);
    await scr.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1000);
    out.rowsState = await countRows(scr);
    // [E3] 저장: 변경 없으면 서버 호출·메시지 없음
    await scr.getByRole('button', { name: '저장' }).click(); await p.waitForTimeout(500);
    out.saveEmpty = await p.locator('.ant-message-notice-content').count();
    out.그리드 = await checkGrid(p, scr);
    out.gridOk = gridOk(out.그리드);
    await p.screenshot({ path: OUT + '/A28-2-filtered.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A28-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
