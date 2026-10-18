// E23 Pay34_Tab_WorkTimeConfig(근로시간기준관리 #1489) 화면 확인
// 시험 행(일일법정근로시간 77 · 적용시작일 2099-01-01)을 [등록]으로 만들어 저장·수정하고 [삭제]로 지운다. 기존 행(회사 0)은 건드리지 않는다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E23.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['pay/work-times']);
  const scr = () => p.locator('.flexlayout__tab:visible').last();
  const search = () => h.btn(scr(), /^\s*조\s*회\s*$/).click().then(() => h.wait(1200));
  const cell = (grid, idx, col) => grid.locator(`.ag-row[row-index="${idx}"] [col-id="${col}"]`).first();
  const edit = async (grid, idx, col, text) => {
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await h.wait(400);
  };
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '근로시간기준관리');
    await h.wait(2500);
    const grid = scr().locator('.ag-root-wrapper').first();

    // [E0] 열 때 조회
    out.buttons = await h.buttons(scr());
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);
    out.firstRow = (await h.rowsText(grid))[0];
    await p.screenshot({ path: `${OUT}/E23-open.png` });

    // 선택 없는 삭제 안내 (checkGrid 앞)
    await h.btn(scr(), /삭\s*제/).click();
    out.msgDeleteNone = await h.msgs(); await h.wait(2800);

    out.grid = await checkGrid(p, scr());
    out.gridOk = gridOk(out.grid);
    await search();

    // [E1] 조회, [E2] 등록 → 시험 값 입력 → [E3] 저장
    const before = await h.rows(grid);
    await h.btn(scr(), /^\s*등\s*록\s*$/).click(); await h.wait(600);
    const rows = await h.rowsText(grid);
    out.rowsAfterAdd = rows;
    const ni = await h.findRowIdx(grid, { dayWorkHours: '', startDate: '' });
    if (ni < 0) throw new Error('새 행 없음 ' + JSON.stringify(rows));
    await p.keyboard.press('Escape'); await h.wait(200);
    await cell(grid, ni, 'startDate').dblclick(); await h.wait(300);
    await p.locator('.ag-cell-editor input').first().fill('2099-01-01'); await p.keyboard.press('Enter'); await h.wait(400);
    await edit(grid, ni, 'dayWorkHours', '77');
    await edit(grid, ni, 'weekMaxAddHours', '11');
    await edit(grid, ni, 'ntStartTime', '22:00');
    await edit(grid, ni, 'ntEndTime', '06:00');
    await edit(grid, ni, 'otMultRate', '1.5');
    out.saveLabel = (await h.btn(scr(), /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgSaved = await h.msgs(); await h.wait(2800);
    await search();
    out.rowsAfterSave = await h.rowsText(grid);
    out.rowsBeforeAfter = [before, await h.rows(grid)];
    await p.screenshot({ path: `${OUT}/E23-saved.png` });

    // 수정: 야간 배수
    const ti = await h.findRowIdx(grid, { dayWorkHours: '77', startDate: '2099-01-01' });
    if (ti < 0) throw new Error('시험 행 못 찾음');
    await edit(grid, ti, 'ntMultRate', '2.5');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgUpdated = await h.msgs(); await h.wait(2800);
    await search();
    out.rowsAfterUpdate = (await h.rowsText(grid)).filter(r => /\b77\b/.test(r));

    // 삭제: 확인 아니오 → 예
    const di = await h.findRowIdx(grid, { dayWorkHours: '77', startDate: '2099-01-01' });
    if (di < 0) throw new Error('시험 행 못 찾음(삭제)');
    await grid.locator(`.ag-row[row-index="${di}"] .ag-checkbox-input`).first().check();
    await h.btn(scr(), /삭\s*제/).click();
    out.confirm = await h.confirmText();
    await h.confirmNo();
    out.rowsAfterNo = await h.rows(grid);
    await h.btn(scr(), /삭\s*제/).click();
    await h.confirmYes();
    out.msgDeleted = await h.msgs(); await h.wait(2800);
    out.rowsAfterDelete = await h.rows(grid);
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E23-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.cleanup = "yunhee sql \"select pay34_work_time_config_id from pay34_work_time_config where pay34_day_work_hours = 77\" → yunhee api DELETE pay/work-times -b '[<ID>]'";
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
