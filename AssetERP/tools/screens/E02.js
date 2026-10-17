// E02 법규보고 서식파일 등록(Ics01_Tab_IcsFileUpload #1107 + Ics01_Lookup_IcsFileMultiUpload) 화면 확인.
// 시험 파일 2개(E02시험1.txt·E02시험2.txt, 내용 "E02시험")를 올려 쓰고, 마지막에 삭제 아이콘으로 지운다. 기존 서식파일은 바꾸지 않는다(조회만).
// 실패해서 남으면 마지막 줄 leftover의 fileId를 `yunhee api POST /api/v1/sys/files/<id>/check-delete -p parentId=0` → `DELETE /api/v1/sys/files/<id>`로 지운다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E02.js <스크린샷 폴더> [회사]
const fs = require('fs');
const path = require('path');
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  p.on('request', r => {
    const u = r.url();
    if (!u.includes('/api/v1/ics/') && !u.includes('/api/v1/sys/files')) return;
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(r.method())) writes.push(r.method() + ' ' + pathq);
    else gets.push(pathq);
  });
  let scr;
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) });
  const grid = () => scr.locator('.ag-root-wrapper').first();
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const rowIndexOf = (g, text) => g.evaluate((el, t) => { const r = [...el.querySelectorAll('.ag-row[row-index]')].find(x => x.innerText.includes(t)); return r ? r.getAttribute('row-index') : null; }, text);
  const dir = path.join(OUT, 'files'); fs.mkdirSync(dir, { recursive: true });
  const f1 = path.join(dir, 'E02시험1.txt'); const f2 = path.join(dir, 'E02시험2.txt');
  fs.writeFileSync(f1, 'E02 test 1\n'); fs.writeFileSync(f2, 'E02 test 2\n');
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '법규보고 서식파일 등록');
    scr = p.locator('.flexlayout__tab:visible').last();
    await wait(1000);
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.toolbarH = await scr.locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));   // 한 줄이면 ~32
    out.headers = (await grid().locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.getsOpen = gets.slice();                                   // [E0] form-file-admin?lawType=%&searchText= 1건
    out.rowsOpen = await countRows(grid());
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    out.placeholder = await scr.locator('input[placeholder="내용/서식파일"]').count();

    // [E3][E4] 검색어 + Enter / 조회
    await scr.locator('input[placeholder="내용/서식파일"]').fill('E02없는내용xyz'); await p.keyboard.press('Enter'); await wait(1000);
    out.rowsNoMatch = await countRows(grid());
    await scr.locator('input[placeholder="내용/서식파일"]').fill(''); await btn(scr, /조\s*회/).click(); await wait(1000);
    out.rowsAfterClear = await countRows(grid());

    // UX-02 초기화: 검색어를 넣고 초기화 → 입력이 비고 자동 조회는 없다
    await scr.locator('input[placeholder="내용/서식파일"]').fill('abc'); const gR = gets.length;
    await btn(scr, /초\s*기\s*화/).click(); await wait(600);
    out.resetValue = await scr.locator('input[placeholder="내용/서식파일"]').inputValue(); out.resetGets = gets.length - gR;

    // [E2] 파일업로드 → 서식파일등록 창, [E3 팝업] 법령구분 없이 업로드 → 안내, [E4 팝업] 닫기
    await btn(scr, /파일업로드/).click(); await wait(600);
    const m = modal('서식파일등록');
    out.popupOpen = await m.count();
    out.popupPlaceholders = [await m.locator('input[placeholder="내용작성"]').count(), (await m.locator('.ant-select-selection-placeholder').allInnerTexts()).join('|')];
    out.popupBtns = (await m.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    await btn(m, /업\s*로\s*드/).click(); out.noLawMsg = await msgs();
    await btn(m, /닫\s*기/).click(); await wait(500);
    out.popupClosed = (await modal('서식파일등록').count()) === 0;

    // [E1][E2 팝업] 법령구분·내용을 넣고 파일 2개 올리기 → 닫히고 다시 조회
    await btn(scr, /파일업로드/).click(); await wait(600);
    const m2 = modal('서식파일등록');
    await m2.locator('.ant-select').first().click(); await wait(300);
    out.lawOptions = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts()).join('|');
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').first().click(); await wait(300);
    await m2.locator('input[placeholder="내용작성"]').fill('E02시험');
    const w0 = writes.length;
    const [chooser] = await Promise.all([p.waitForEvent('filechooser'), btn(m2, /업\s*로\s*드/).click()]);
    out.chooserMultiple = chooser.isMultiple();
    await chooser.setFiles([f1, f2]); await wait(2500);
    out.uploadWrites = writes.slice(w0);
    out.popupClosedAfterUpload = (await modal('서식파일등록').count()) === 0;
    out.rowsAfterUpload = await countRows(grid());
    out.uploadMsg = await msgs();

    // [E5][E6] 시험 행의 내용 편집 → 저장(n) → 다시 조회
    const idx = await rowIndexOf(grid(), 'E02시험1.txt');
    out.testRowIdx = idx;
    const noteCell = grid().locator(`.ag-row[row-index="${idx}"] .ag-cell[col-id="note"]`);
    out.noteBefore = (await noteCell.innerText()).trim();
    await noteCell.dblclick(); await wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type('E02수정'); await p.keyboard.press('Enter'); await wait(500);
    out.saveLabel = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    const w1 = writes.length; const g1 = gets.length;
    await btn(scr, /저\s*장/).click(); await wait(2000);
    out.saveWrites = writes.slice(w1); out.saveGets = gets.slice(g1);
    out.noteAfter = (await grid().locator(`.ag-row[row-index="${await rowIndexOf(grid(), 'E02시험1.txt')}"] .ag-cell[col-id="note"]`).innerText()).trim();
    out.saveLabelAfter = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');

    // [E6] 법령구분 셀 콤보: 편집기가 목록(select)으로 열린다
    const lawCell = grid().locator(`.ag-row[row-index="${await rowIndexOf(grid(), 'E02시험1.txt')}"] .ag-cell[col-id="lawName"]`);
    await lawCell.dblclick(); await wait(500);
    out.lawEditor = await p.locator('.ag-popup .ag-select-list, .ag-rich-select, .ag-picker-field-wrapper, select').count();
    await p.keyboard.press('Escape'); await wait(300);

    // 받기 아이콘
    const dIdx = await rowIndexOf(grid(), 'E02시험1.txt');
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }).catch(() => null), grid().locator(`.ag-row[row-index="${dIdx}"] .ag-cell[col-id="actionCellDown"] .anticon`).first().click()]);
    out.download = dl ? dl.suggestedFilename() : null;

    // [E7] 삭제 아이콘 → 확인 → 시험 파일 2개 삭제
    for (const name of ['E02시험1.txt', 'E02시험2.txt']) {
      const i = await rowIndexOf(grid(), name);
      if (i == null) { out.steps['del_' + name] = 'row missing'; continue; }
      const w = writes.length;
      await grid().locator(`.ag-row[row-index="${i}"] .ag-cell[col-id="actionCellDelete"] .anticon`).first().click(); await wait(500);
      if (name === 'E02시험1.txt') out.confirmText = (await p.locator('.ant-modal-confirm-content').innerText()).trim();
      await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(1800);
      out.steps['del_' + name] = writes.slice(w);
    }
    out.rowsEnd = await countRows(grid());
    out.leftover = await grid().evaluate(el => [...el.querySelectorAll('.ag-row[row-index]')].filter(r => r.innerText.includes('E02시험')).length);
    out.writes = writes;
    await p.screenshot({ path: path.join(OUT, 'E02-end.png') });
  } catch (e) {
    out.fail = String(e).slice(0, 400);
    await p.screenshot({ path: path.join(OUT, 'E02-fail.png') }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
