// E19 Rpt10_Tab_FssSubmit(금감원 업무보고서 #1292) 화면 확인
// 시험 보고서 하나(코드 ZT001)를 [등록]으로 만들고 수정 아이콘으로 고친 뒤 [삭제]로 지운다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E19.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['rpt/', 'sys/codes']);
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '금감원 업무보고서');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await h.wait(2500);
    const grid = scr.locator('.ag-root-wrapper').first();
    out.buttons = await h.buttons(scr);
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);
    out.firstRow = (await h.rowsText(grid))[0];
    await p.screenshot({ path: `${OUT}/E19-open.png` });

    // 조회(검색어) + 선택 없는 삭제 안내, 그 뒤 그리드 기본 점검
    const search = scr.locator('input[placeholder="보고서코드"]');
    await search.fill('ga14');
    await h.btn(scr, /^\s*조\s*회\s*$/).click();
    await h.wait(1200);
    out.rowsSearch = await h.rows(grid);
    await search.fill('');
    await h.btn(scr, /^\s*조\s*회\s*$/).click();
    await h.wait(1200);
    await h.btn(scr, /삭\s*제/).click();
    out.msgDeleteNone = await h.msgs(); await h.wait(2800);
    out.grid = await checkGrid(p, scr);
    out.gridOk = gridOk(out.grid);
    await h.btn(scr, /^\s*조\s*회\s*$/).click();
    await h.wait(1200);

    // 등록: 코드 없음 → 저장 안내 / 입력 → 저장
    await h.btn(scr, /^\s*등\s*록\s*$/).click();
    const reg = h.modal('작성요령 및 변경이력 등록');
    await reg.waitFor();
    out.regButtons = await h.buttons(reg);
    await h.btn(reg, /저\s*장/).click();
    out.msgNoCode = await h.msgs(); await h.wait(2800);
    const inputs = reg.locator('input.ant-input');
    await inputs.nth(0).fill('ZT001');
    await inputs.nth(1).fill('시험보고서');
    await reg.locator('.ant-select').first().click();
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').first().click();
    await inputs.nth(2).fill('시험대상');
    await reg.locator('textarea').nth(0).fill('시험 작성요령\n둘째 줄');
    await reg.locator('textarea').nth(1).fill('시험 변경이력');
    await p.screenshot({ path: `${OUT}/E19-reg.png` });
    await h.btn(reg, /저\s*장/).click();
    await h.wait(1800);
    out.regClosed = (await reg.count()) === 0;

    // 찾아서 수정
    await search.fill('ZT001');
    await h.btn(scr, /^\s*조\s*회\s*$/).click();
    await h.wait(1200);
    out.rowsFound = await h.rowsText(grid);
    await h.scrollX(grid, 5000);  // 수정 열은 화면 밖(열 가상화)
    await grid.locator('.ag-row[row-index="0"] [col-id="actionCell"]').first().click();
    await h.scrollX(grid, 0);
    const ed = h.modal('작성요령 및 변경이력 수정');
    await ed.waitFor();
    out.editCode = await ed.locator('input.ant-input').nth(0).inputValue();
    await ed.locator('input.ant-input').nth(1).fill('시험보고서2');
    await h.btn(ed, /저\s*장/).click();
    await h.wait(1800);
    out.rowsAfterUpdate = await h.rowsText(grid);

    // 삭제
    await grid.locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(scr, /삭\s*제/).click();
    out.confirm = await h.confirmText();
    await h.confirmNo();
    await h.btn(scr, /삭\s*제/).click();
    await h.confirmYes();
    out.msgDeleted = await h.msgs(); await h.wait(2800);
    out.rowsAfterDelete = await h.rows(grid);
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E19-err.png` }).catch(() => {});
    out.writes = api.writes;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
