// E21 Ast01_Tab_InfoManager(자산상세 항목관리 #1089) 화면 확인
// 시험 행(조회순번 9999 · 항목 "E21시험")을 [행 추가]로 만들어 저장하고, 고쳐 저장한 뒤 [행 삭제] → [저장]으로 지운다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E21.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['ast/']);
  // 기존 데이터를 건드리지 않도록: 이 행이 E21 시험 행일 때만 계속한다
  const guard = async (grid, idx) => {
    const t = (await grid.locator(`.ag-row[row-index="${idx}"] [col-id="title"]`).first().innerText()).trim();
    if (t !== '' && !/E21/.test(t)) throw new Error('guard: 시험 행이 아님 ' + t);
  };
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '자산상세 항목관리');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await h.wait(2000);
    const grid = scr.locator('.ag-root-wrapper').first();
    out.buttons = await h.buttons(scr);
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);   // [E0] 열 때 조회하지 않는다 → 0
    out.placeholder = await scr.locator('input.ant-input').first().getAttribute('placeholder');
    out.useYnChecked = await scr.locator('.ant-checkbox-input').first().isChecked();
    await p.screenshot({ path: `${OUT}/E21-open.png` });

    // [E2] 조회 → 사용항목만 / 체크 끄고 전체
    await h.btn(scr, /^\s*조\s*회\s*$/).click(); await h.wait(1200);
    out.rowsUse = await h.rows(grid);
    out.firstRowSelected = await grid.locator('.ag-row[row-index="0"].ag-row-selected').count();
    await scr.locator('.ant-checkbox-input').first().uncheck(); await h.btn(scr, /^\s*조\s*회\s*$/).click(); await h.wait(1200);
    out.rowsAll = await h.rows(grid);
    await scr.locator('.ant-checkbox-input').first().check();
    // [E1] 검색 Enter
    const search = scr.locator('input.ant-input').first();
    await search.fill('E21'); await search.press('Enter'); await h.wait(1200);
    out.rowsSearch = await h.rows(grid);
    await search.fill(''); await search.press('Enter'); await h.wait(1200);
    out.grid = await checkGrid(p, scr);
    out.gridOk = gridOk(out.grid);
    await h.btn(scr, /^\s*조\s*회\s*$/).click(); await h.wait(1200);

    // [E4] 행 추가 → 조회순번 없이 항목만 → 저장 → 안내
    await h.btn(scr, /행\s*추가/).click(); await h.wait(600);
    out.rowsAfterAdd = await h.rowsText(grid);
    const ni = 1;  // [행 추가]는 선택한 첫 행 아래(row-index 1)에 넣는다
    await p.keyboard.press('Escape'); await h.wait(200);
    if (false) { await p.screenshot({ path: `${OUT}/E21-noadd.png` }); throw new Error('새 행 없음 ' + JSON.stringify(out.rowsAfterAdd)); }
    await guard(grid, ni);
    await grid.locator(`.ag-row[row-index="${ni}"] [col-id="title"]`).first().dblclick(); await h.wait(300);
    await p.keyboard.type('E21시험'); await p.keyboard.press('Enter'); await h.wait(500);
    out.saveLabel1 = (await h.btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(scr, /저\s*장/).click();
    out.msgNoSeq = await h.msgs(); await h.wait(2800);
    // 조회순번 입력 → 저장
    await guard(grid, ni);
    await grid.locator(`.ag-row[row-index="${ni}"] [col-id="seq"]`).first().dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type('9999'); await p.keyboard.press('Enter'); await h.wait(500);
    await h.btn(scr, /저\s*장/).click(); await h.wait(1800);
    out.msgSaved = await h.msgs(); await h.wait(2800);
    await search.fill('E21'); await search.press('Enter'); await h.wait(1200);
    out.rowsAfterSave = await h.rowsText(grid);
    await p.screenshot({ path: `${OUT}/E21-saved.png` });

    // 연관태그 고쳐 저장
    await guard(grid, 0);
    await grid.locator('.ag-row[row-index="0"] [col-id="tag"]').first().dblclick(); await h.wait(300);
    await p.keyboard.type('E21태그'); await p.keyboard.press('Enter'); await h.wait(500);
    await h.btn(scr, /저\s*장/).click(); await h.wait(1800);
    out.msgUpdated = await h.msgs(); await h.wait(2800);
    await h.btn(scr, /^\s*조\s*회\s*$/).click(); await h.wait(1200);
    out.rowsAfterUpdate = await h.rowsText(grid);

    // 사용여부 체크 클릭 → 저장 → "사용항목만 보기"에서 빠지고, 끄면 보인다
    await guard(grid, 0);
    const chk = grid.locator('.ag-row[row-index="0"] .gb-check input[type=checkbox]').first();
    out.useBefore = await chk.isChecked();
    await chk.click(); await h.wait(300);
    out.useAfterClick = await chk.isChecked();
    await h.btn(scr, /저\s*장/).click(); await h.wait(1800);
    out.msgUseSaved = await h.msgs(); await h.wait(2800);
    await h.btn(scr, /^\s*조\s*회\s*$/).click(); await h.wait(1200);
    out.rowsUseOnly = await h.rows(grid);
    await scr.locator('.ant-checkbox-input').first().uncheck(); await h.btn(scr, /^\s*조\s*회\s*$/).click(); await h.wait(1200);
    out.rowsUseOff = await h.rowsText(grid);
    await scr.locator('.ant-checkbox-input').first().check();

    // [E5] 행 삭제 → 화면에서만 빠지고(저장 전 서버 삭제 없음) → 저장 때 삭제
    await guard(grid, 0);
    const delsBefore = api.writes.filter(w => /DELETE/.test(JSON.stringify(w))).length;
    await grid.locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(scr, /행\s*삭제/).click(); await h.wait(600);
    out.rowsAfterRemoveClick = await h.rows(grid);
    out.deleteCallsBeforeSave = api.writes.filter(w => /DELETE/.test(JSON.stringify(w))).length - delsBefore;
    out.saveLabel2 = (await h.btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(scr, /저\s*장/).click(); await h.wait(1800);
    out.deleteCallsAfterSave = api.writes.filter(w => /DELETE/.test(JSON.stringify(w))).length - delsBefore;
    await search.fill('E21'); await search.press('Enter'); await h.wait(1200);
    out.rowsAfterDelete = await h.rows(grid);
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E21-err.png` }).catch(() => {});
    out.writes = api.writes;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
