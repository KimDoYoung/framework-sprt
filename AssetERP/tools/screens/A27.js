// A27 특정화면 사용요청(Sys53_Tab_SpecificMenuRequest) 화면 확인. 저장하지 않는다(데이터 변경 없음).
// 사용: NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A27.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'kfstest'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const lastMsg = async () => (await p.locator('.ant-message-notice-content').last().innerText().catch(() => ''));
  try {
    await login(p, COMPANY);
    await openMenu(p, '관리자', '특정화면 사용요청');
    const scr = p.locator('.flexlayout__tab').filter({ hasText: '특정업무구분' }).first();
    out.labels = await scr.locator('.ant-typography').allInnerTexts();
    out.buttons = await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.headers = await scr.locator('.ag-header-cell-text').allInnerTexts();
    // [E0] 열림 → 조회
    await p.waitForTimeout(1200);
    out.rows = await countRows(scr);
    out.firstRow = await scr.locator('.ag-row[row-index="0"] .ag-cell').allInnerTexts();
    out.iconCells = await scr.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').count();
    // 삭제: 선택 없이 → "내용을 선택해주세요"
    await scr.getByRole('button', { name: '삭제' }).click(); await p.waitForTimeout(400);
    out.deleteNoSel = await lastMsg();
    // 결재요청 아이콘: 특정업무 있는 행 → 안내(전자결재 변환 전)
    await scr.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').click(); await p.waitForTimeout(400);
    out.approvalIcon = await lastMsg();
    // 처리상태 20(완료) 행 선택 후 삭제 → 막힘 / 진행중 문서 행 → 막힘
    const n = out.rows;
    out.deleteGuards = [];
    for (let i = 0; i < n; i++) {
      await scr.locator(`.ag-row[row-index="${i}"] .ag-selection-checkbox input`).check().catch(() => {});
      await scr.getByRole('button', { name: '삭제' }).click(); await p.waitForTimeout(400);
      const row = await scr.locator(`.ag-row[row-index="${i}"] .ag-cell`).allInnerTexts();
      const msg = await lastMsg();
      const confirm = await p.locator('.ant-modal-confirm:visible').count();
      if (confirm) await p.locator('.ant-modal-confirm button', { hasText: '아니오' }).click();
      out.deleteGuards.push({ row: row.join('|'), msg, confirm });
      await p.waitForTimeout(300);
    }
    // [E2] 등록 → 신청자·신청일이 채워진 빈 행 (저장 안 함)
    await scr.getByRole('button', { name: '등록' }).click(); await p.waitForTimeout(600);
    out.rowsAfterAdd = await countRows(scr);
    out.newRow = await scr.locator('.ag-row[row-index]').last().locator('.ag-cell').allInnerTexts();
    // [E3] 저장: 변경 없는 빈 행은 저장 안 됨(서버 호출·메시지 없음)
    await scr.getByRole('button', { name: '저장' }).click(); await p.waitForTimeout(500);
    out.saveEmpty = await p.locator('.ant-message-notice-content').count();
    // 조회 → 임시 행 사라짐
    await scr.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1000);
    out.rowsAfterRetrieve = await countRows(scr);
    out.그리드 = await checkGrid(p, scr);
    out.gridOk = gridOk(out.그리드);
    await p.screenshot({ path: OUT + '/A27.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A27-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
