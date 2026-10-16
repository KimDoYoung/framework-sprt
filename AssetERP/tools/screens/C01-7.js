// C01-7 연관파일(Emp18_TabPage_RelateFile) 화면 확인.
// 시험 행을 만들고(등록 = 행 추가 + 바로 저장) 상세설명 저장 → 파일 올리기·받기 → 삭제(파일 판정 3 → 파일 삭제 → 행 삭제)까지 하고 지운다.
// 실패해도 cleanup: 비고가 '내용을 입력해주세요'·'c017test'인 시험 행을 화면에서 지운다(파일은 남을 수 있으니 결과의 cleanup 칸을 본다).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C01-7.js <스크린샷 폴더> [검색어]'"
const fs = require('fs');
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, SEARCH = '천영임'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, msgs: [] };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const lastMsg = async () => { await p.waitForTimeout(700); const t = await p.locator('.ant-message-notice').last().innerText().catch(() => ''); out.msgs.push(t); await p.waitForTimeout(2600); return t; };
  let pane;
  const rowWithNote = note => pane.locator('.ag-row').filter({ has: p.locator('.ag-cell[col-id="note"]', { hasText: new RegExp('^' + note + '$') }) }).first();
  const rowIndexOf = async loc => loc.getAttribute('row-index');
  const cell = async (rowLoc, colId) => {
    const idx = await rowIndexOf(rowLoc);
    return pane.locator(`.ag-row[row-index="${idx}"] .ag-cell[col-id="${colId}"]`).first();
  };
  const deleteRow = async rowLoc => {
    const idx = await rowIndexOf(rowLoc);
    await pane.locator(`.ag-row[row-index="${idx}"] .ag-selection-checkbox input`).first().check({ force: true });
    await pane.getByRole('button', { name: '삭제' }).click(); await p.waitForTimeout(600);
    const confirm = await p.locator('.ant-modal-confirm').innerText().catch(() => '');
    await p.locator('.ant-modal-confirm').getByRole('button', { name: '예' }).click();
    return confirm;
  };
  try {
    await login(p);
    await openMenu(p, '경영관리', '사원정보 관리');
    const top = p.locator('.ant-splitter-panel').first();
    pane = p.locator('.ant-splitter-panel').last();
    await top.locator('input[style*="width: 120px"]').first().fill(SEARCH);
    await top.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    out.selected = await top.locator('.ag-row-selected .ag-cell[col-id="korNm"]').first().innerText().catch(() => '');

    await pane.locator('.ant-tabs-tab', { hasText: '연관파일' }).click(); await p.waitForTimeout(1500);
    out.screen = {
      label: await pane.locator('.ant-typography').first().innerText(),
      buttons: await pane.locator('button').filter({ hasText: /^(조회|등록|삭제|저장)$/ }).allInnerTexts(),
      headers: await pane.locator('.ag-header-cell-text').allInnerTexts(),
      rows: await countRows(pane),
    };

    // [E2] 등록 → 새 행 + 바로 저장
    await pane.locator('button').filter({ hasText: /^등록$/ }).click();
    out.insertMsg = await lastMsg();
    const r = rowWithNote('내용을 입력해주세요');
    out.insertRow = await r.count();
    out.rowsAfterInsert = await countRows(pane);
    out.grid = await checkGrid(p, pane);
    out.gridOk = gridOk(out.grid);

    // 다운로드: 파일 없음
    await (await cell(r, 'actionCell02')).locator('button').click();
    out.noFileMsg = await lastMsg();

    // [E4] 상세설명 편집 → 저장
    await (await cell(r, 'note')).dblclick(); await p.waitForTimeout(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type('c017test'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    await pane.getByRole('button', { name: '저장' }).click();
    out.saveMsg = await lastMsg();
    const r2 = rowWithNote('c017test');

    // [E7] 업로드 → [E6] 다시 조회 → 파일명·용량
    fs.writeFileSync(OUT + '/c017-첨부.txt', 'C01-7 연관파일 시험 ' + 'x'.repeat(3000));
    const [fc] = await Promise.all([p.waitForEvent('filechooser', { timeout: 5000 }), (await cell(r2, 'actionCell01')).locator('button').click()]);
    await fc.setFiles(OUT + '/c017-첨부.txt'); await p.waitForTimeout(2000);
    out.afterUpload = await r2.locator('.ag-cell').allInnerTexts().catch(() => []);
    await p.screenshot({ path: OUT + '/C01-7-uploaded.png' });

    // 다운로드 → 같은 이름·내용
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 5000 }), (await cell(r2, 'actionCell02')).locator('button').click()]);
    out.downloadName = dl.suggestedFilename();
    out.downloadSame = fs.readFileSync(await dl.path(), 'utf8') === fs.readFileSync(OUT + '/c017-첨부.txt', 'utf8');

    // [E3]·[E8] 삭제 → 확인 → 파일 판정·파일 삭제 → 행 삭제
    out.deleteConfirm = await deleteRow(r2);
    out.deleteMsg = await lastMsg();
    out.rowsAfterDelete = await countRows(pane);
    await pane.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1200);
    out.rowsAfterRetrieve = await countRows(pane);
  } catch (e) {
    errs.push('SCRIPT: ' + e.message.slice(0, 200));
    await p.screenshot({ path: OUT + '/C01-7-last.png' }).catch(() => {});
  }
  // cleanup: 남은 시험 행 지우기
  out.cleanup = 0;
  for (const note of ['내용을 입력해주세요', 'c017test']) {
    try {
      while (pane && await rowWithNote(note).count()) { await deleteRow(rowWithNote(note)); await p.waitForTimeout(1500); out.cleanup++; }
    } catch (e) { errs.push('CLEANUP: ' + e.message.slice(0, 120)); break; }
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
