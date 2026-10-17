// C08 Table Spec,(Model)Properties(Dbm01_Tab_TabComments, #1081) 화면 확인: 열기(조회 안 함) → 조회 → 검색 → 테이블 선택 → 컬럼 → Table Finder 조회창
//   → 버튼줄(XML 생성·Table/Report Print·RD Print) → 주석 편집·저장(서버가 거절하므로 DB는 바뀌지 않음).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C08.js <스크린샷 폴더> [회사]
const { launch, login, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/dbm/')) writes.push(r.method() + ' ' + r.url().split('/api/v1/dbm/')[1].split('?')[0]); });
  try {
    await login(p, COMPANY);
    const item = p.getByText('Table Spec,(Model)Properties', { exact: true }).first();
    for (const g of ['관리자', '09. 기타']) { if (await item.isVisible()) break; await p.getByText(g, { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(2500);
    const scr = p.locator('.flexlayout__tab:visible').last();
    const btn = (root, re) => root.locator('button').filter({ hasText: re }).first();
    const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
    const west = scr.locator('.ant-splitter-panel').first(), east = scr.locator('.ant-splitter-panel').last();
    const rows = root => root.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
    const field = scr.locator('input[placeholder="전체"]');
    out.toolbarButtons = (await scr.locator('.ant-space-item button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).slice(0, 2).join(',');
    out.westHeaders = (await west.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.eastHeaders = (await east.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.eastButtons = (await east.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.rowsOpen = await rows(west).count();                              // [E0] 열 때 조회 안 함 → 0
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);           // [E2]
    out.rowsAll = await rows(west).count();
    await field.fill('emp01_person'); await field.press('Enter'); await wait(1200);
    out.rowsFiltered = await rows(west).count();
    out.firstRow = (await rows(west).first().innerText()).replace(/\s+/g, ' ');
    out.grid = await checkGrid(p, west); out.gridOk = gridOk(out.grid);   // 행 선택 → [E4] 컬럼 조회
    await wait(1200);
    out.colRows = await rows(east).count();
    out.colFirst = (await rows(east).first().innerText()).replace(/\s+/g, ' ');
    // 버튼줄
    await btn(east, /^XML$/).click(); await wait(1200);                    // [E1] 서버 거절 → 오류 + Generating 창
    out.xmlMsg = await msgs();
    out.popupTitle = await p.locator('.ant-modal:visible .ant-modal-title').first().innerText().catch(() => '');
    out.popupText = await p.locator('.ant-modal:visible textarea').inputValue().catch(() => '');
    await p.screenshot({ path: `${OUT}/C08-popup.png` });
    await p.locator('.ant-modal:visible').getByRole('button', { name: /닫기/ }).click(); await wait(500);
    await btn(east, /Table Print/).click(); await wait(500); out.tablePrint = await msgs();
    await btn(east, /Report Print/).click(); await wait(500); out.reportPrint = await msgs();
    const before = writes.length;
    await btn(east, /RD Print/).click(); await wait(400); out.rdPrintWrites = writes.length - before;
    // 컬럼 주석 편집 → Comment Save → 거절
    const cell = east.locator('.ag-row[row-index="0"] .ag-cell[col-id="columnComment"]');
    await cell.dblclick(); await wait(200); await p.keyboard.press('Control+A'); await p.keyboard.type('zzC08'); await p.keyboard.press('Enter'); await wait(300);
    out.saveLabel = (await btn(east, /Comment Save/).innerText()).replace(/\s/g, '');
    await btn(east, /Comment Save/).click(); await wait(1200); out.colSaveMsg = await msgs();
    // Table Finder 조회창
    await field.fill('');
    await scr.locator('.anticon-search').first().click(); await wait(1200);
    const modal = p.locator('.ant-modal:visible').last();
    out.finderTitle = await modal.locator('.ant-modal-title').innerText();
    out.finderHeaders = (await modal.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.finderRows = await rows(modal).count();
    out.finderButtons = (await modal.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    await btn(modal, /^\s*확\s*인\s*$/).click(); await wait(400); out.finderNoSelect = await msgs();   // [E3] 선택 없이 확인
    const nameInput = modal.locator('input.ant-input').first();
    await nameInput.fill('emp01_pers'); await nameInput.press('Enter'); await wait(1200);                // [E1]
    out.finderFiltered = await rows(modal).count();
    await rows(modal).first().locator('.ag-cell[col-id="tableName"]').dblclick(); await wait(800);        // [E5] 더블클릭 = 확인
    out.fieldAfterFinder = await field.inputValue();
    out.finderClosed = (await p.locator('.ant-modal:visible').count()) === 0;
    await scr.locator('.anticon-search').first().click(); await wait(800);
    await btn(p.locator('.ant-modal:visible').last(), /^\s*취\s*소\s*$/).click(); await wait(500);       // [E4]
    out.cancelClosed = (await p.locator('.ant-modal:visible').count()) === 0;
    await p.screenshot({ path: `${OUT}/C08-${COMPANY}.png` });
    out.writes = writes;
  } catch (e) { out.err = e.message.split('\n')[0]; out.writes = writes; await p.screenshot({ path: `${OUT}/C08-err.png` }).catch(() => {}); }
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
