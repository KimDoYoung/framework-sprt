// E04 내부통제 체크리스트(관리자)(Ics10_Tab_ChecklistAdmin #1232 + Ics10_Edit_Checklist + Ics21_Lookup_CheckList + Ics23_TabPage_CheckList + Ics01_Lookup_SelectMulti "deadline" + Sch05_Page_RelateIcs + Ics01_Lookup_Info) 화면 확인.
// 시험 대분류 1개·중분류 1개(E04시험…)와 시험 체크리스트 1개(연관 내부통제 1건)를 만들고 마지막에 삭제 버튼·아이콘으로 모두 지운다. 기존 데이터는 바꾸지 않는다(조회만).
// 실패해서 남으면 마지막 줄 created를 보고 `yunhee api`로 지운다: DELETE /api/v1/sch/relate-ics → DELETE /api/v1/ics/checklists → DELETE /api/v1/ics/checklist-classes/m → /l (body [id…]).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E04.js <스크린샷 폴더> [회사]
const path = require('path');
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  const created = { l: [], m: [], c: [], r: [] };
  p.on('response', async r => {
    const u = r.url();
    if (!u.includes('/api/v1/ics/checklist') && !u.includes('/api/v1/sch/relate-ics') && !u.includes('/api/v1/ics/laws/with-deadlines') && !u.includes('/api/v1/sch/deadlines')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq); else gets.push(pathq);
    if (m === 'PUT' && r.ok()) {
      try {
        const j = await r.json();
        const d = j?.data;
        if (u.includes('/checklists')) created.c.push(d?.checklistId);
      } catch (e) { /* ignore */ }
    }
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const rowIndexOf = (g, text) => g.evaluate((el, t) => { const r = [...el.querySelectorAll('.ag-row[row-index]')].find(x => x.innerText.includes(t)); return r ? r.getAttribute('row-index') : null; }, text);
  const confirmYes = async () => { await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(1500); };
  const clickIcon = async (gridLoc, idx, colId) => {
    const vp = gridLoc.locator('.ag-body-horizontal-scroll-viewport');
    await vp.evaluate(el => { el.scrollLeft = 0; });
    await wait(250);
    for (let i = 0; i < 14; i++) {
      const c = gridLoc.locator(`.ag-row[row-index="${idx}"] .ag-cell[col-id="${colId}"] .anticon`);
      if (await c.count()) { await c.first().dispatchEvent('click'); return; }
      await vp.evaluate(el => { el.scrollLeft += 400; });
      await wait(250);
    }
    throw new Error('icon not found: ' + colId);
  };
  const editCell = async (gridLoc, idx, colId, text) => {
    const cell = gridLoc.locator(`.ag-row[row-index="${idx}"] .ag-cell[col-id="${colId}"]`);
    await wait(500);
    await cell.dblclick({ force: true }); await wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await wait(400);
  };
  const pickOpt = async (selectLoc, n = 0, text) => {
    await selectLoc.click(); await wait(300);
    const opts = p.locator('.ant-select-dropdown:visible .ant-select-item-option');
    if (text) await opts.filter({ hasText: text }).first().click(); else await opts.nth(n).click();
    await wait(300);
  };
  const dlgGrid = (m, i = 0) => m.locator('.ag-root-wrapper').nth(i);
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '내부통제 체크리스트(관리자)');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(1500);
    const grid = () => scr.locator('.ag-root-wrapper').first();
    const relate = () => scr.locator('.ag-root-wrapper').nth(1);
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.toolbarH = await scr.locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));
    out.placeholder = await scr.locator('input[placeholder="대분류/중분류/체크내용/근거"]').count();
    out.headers = (await grid().locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.relateHeaders = (await relate().locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.getsOpen = gets.slice();                                   // [E0] l-codes(+m-codes), 조회는 없다
    out.rowsOpen = await countRows(grid());
    out.selectValues = (await scr.locator('.ant-select-selection-item').allInnerTexts()).join('|');   // 전체|전체|전체

    // [E6] 조회 → 52행, 그리드 점검
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsRetrieve = await countRows(grid());
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);

    // [E2] 대분류 선택 → 중분류 "전체"·조회, [E3] 중분류 선택, [E4] 사용여부
    const g1 = gets.length;
    await pickOpt(scr.locator('.ant-select').nth(0), 0);   // 전체 옵션이 첫 줄이라 두 번째
    await pickOpt(scr.locator('.ant-select').nth(0), 1); await wait(1200);
    out.lSelected = (await scr.locator('.ant-select-selection-item').nth(0).innerText()).trim();
    out.getsOnL = gets.slice(g1);
    out.rowsAfterL = await countRows(grid());
    out.mOptions = await (async () => { await scr.locator('.ant-select').nth(1).click(); await wait(300); const t = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts()).length; await p.keyboard.press('Escape'); return t; })();
    await pickOpt(scr.locator('.ant-select').nth(1), 1); await wait(1200);
    out.rowsAfterM = await countRows(grid());
    await pickOpt(scr.locator('.ant-select').nth(2), 0, '미사용'); await wait(1200);
    out.rowsUnused = await countRows(grid());
    out.getsUnused = gets.slice(-1);
    await pickOpt(scr.locator('.ant-select').nth(0), 0, '전체'); await wait(800);
    await pickOpt(scr.locator('.ant-select').nth(2), 0, '전체'); await wait(1000);
    // [E5] 검색어 Enter
    await scr.locator('input[placeholder="대분류/중분류/체크내용/근거"]').fill('E04없는검색어xyz'); await p.keyboard.press('Enter'); await wait(1200);
    out.rowsNoMatch = await countRows(grid());
    await scr.locator('input[placeholder="대분류/중분류/체크내용/근거"]').fill(''); await p.keyboard.press('Enter'); await wait(1200);
    out.rowsBack = await countRows(grid());

    // [E1] 행 클릭 → 연관 내부통제 (연관이 있는 체크리스트를 찾는다)
    let relRows = 0;
    const total = await countRows(grid());
    for (let i = 0; i < Math.min(total, 40) && relRows === 0; i++) {
      await grid().locator(`.ag-row[row-index="${i}"] .ag-cell[col-id="content"]`).click().catch(() => undefined); await wait(500);
      relRows = await countRows(relate());
    }
    out.relateRows = relRows;
    out.getsOnClick = gets.slice(-1);
    if (relRows > 0) {
      out.relateFirst = (await relate().locator('.ag-row[row-index="0"]').innerText()).replace(/\s+/g, ' ').slice(0, 120);
      // 상세보기 아이콘 → 법규 정보 창
      await clickIcon(relate(), 0, 'actionCell'); await wait(1500);
      const info = modal('법규');
      out.infoOpen = await info.count();
      out.infoLabels = (await info.locator('strong, .ant-typography-strong').allInnerTexts()).join('|');
      out.infoValues = await info.locator('input, textarea').evaluateAll(els => els.map(e => e.value.slice(0, 30)));
      out.infoFileRows = await countRows(dlgGrid(info));
      out.infoBtns = (await info.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
      await btn(info, /닫\s*기/).click(); await wait(500);
    }

    // [E9] 분류관리 → 대분류·중분류 시험 데이터
    await btn(scr, /분류관리/).click(); await wait(1500);
    let cm = modal('분류관리');
    out.classOpen = await cm.count();
    out.classBtns = (await cm.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.classLHeaders = (await dlgGrid(cm, 0).locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.classMHeaders = (await dlgGrid(cm, 1).locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.classLRows = await countRows(dlgGrid(cm, 0));
    out.classMRowsBefore = await countRows(dlgGrid(cm, 1));
    // 중분류 등록은 대분류를 고르기 전에는 안내
    await cm.locator('button').filter({ hasText: /^\s*등\s*록\s*$/ }).nth(1).click(); out.mNoParentMsg = await msgs();
    // 대분류 등록 → 이름·순서 입력 → 저장
    await cm.locator('button').filter({ hasText: /^\s*등\s*록\s*$/ }).first().click(); await wait(800);
    const lIdx = await dlgGrid(cm, 0).evaluate(el => { const rs = [...el.querySelectorAll('.ag-row[row-index]')]; return rs.length ? String(Math.max(...rs.map(r => Number(r.getAttribute('row-index'))))) : null; });
    const newL = (await dlgGrid(cm, 0).evaluate(el => [...el.querySelectorAll('.ag-row[row-id]')].map(r => r.getAttribute('row-id')).filter(id => Number(id) < 0)))[0];
    out.newLRowId = newL;
    const newLIdx = await dlgGrid(cm, 0).evaluate((el, id) => el.querySelector(`.ag-row[row-id="${id}"]`)?.getAttribute('row-index'), newL);
    await editCell(dlgGrid(cm, 0), newLIdx, 'checklistLClassName', 'E04시험대분류');
    await editCell(dlgGrid(cm, 0), newLIdx, 'seq', '97');
    out.saveLabel = (await cm.locator('button').filter({ hasText: /저\s*장/ }).first().innerText()).replace(/\s/g, '');
    // 사용종료일 없이 사용여부 해제 → 안내
    const w0 = writes.length;
    await cm.locator('button').filter({ hasText: /저\s*장/ }).first().click(); await wait(2000);
    out.lSaveWrites = writes.slice(w0);
    out.classLRowsAfterSave = await countRows(dlgGrid(cm, 0));
    const savedLIdx = await rowIndexOf(dlgGrid(cm, 0), 'E04시험대분류');
    out.savedLIdx = savedLIdx;
    const savedLId = await dlgGrid(cm, 0).evaluate((el, i) => el.querySelector(`.ag-row[row-index="${i}"]`)?.getAttribute('row-id'), savedLIdx);
    created.l.push(savedLId);
    // 그 행 선택 → 중분류 조회 → 중분류 등록·저장
    await dlgGrid(cm, 0).locator(`.ag-row[row-index="${savedLIdx}"] .ag-selection-checkbox input, .ag-row[row-index="${savedLIdx}"] .ag-checkbox-input`).first().click(); await wait(1200);
    out.mRowsOfNewL = await countRows(dlgGrid(cm, 1));
    await cm.locator('button').filter({ hasText: /^\s*등\s*록\s*$/ }).nth(1).click(); await wait(800);
    const newM = (await dlgGrid(cm, 1).evaluate(el => [...el.querySelectorAll('.ag-row[row-id]')].map(r => r.getAttribute('row-id')).filter(id => Number(id) < 0)))[0];
    const newMIdx = await dlgGrid(cm, 1).evaluate((el, id) => el.querySelector(`.ag-row[row-id="${id}"]`)?.getAttribute('row-index'), newM);
    await editCell(dlgGrid(cm, 1), newMIdx, 'checklistMClassName', 'E04시험중분류');
    await editCell(dlgGrid(cm, 1), newMIdx, 'seq', '1');
    const w1 = writes.length;
    await cm.locator('button').filter({ hasText: /저\s*장/ }).nth(1).click(); await wait(2000);
    out.mSaveWrites = writes.slice(w1);
    out.mRowsAfterSave = await countRows(dlgGrid(cm, 1));
    const savedMIdx = await rowIndexOf(dlgGrid(cm, 1), 'E04시험중분류');
    created.m.push(await dlgGrid(cm, 1).evaluate((el, i) => el.querySelector(`.ag-row[row-index="${i}"]`)?.getAttribute('row-id'), savedMIdx));
    // 저장 검증: 순서를 비운 변경 → 메시지
    await editCell(dlgGrid(cm, 1), savedMIdx, 'checklistMClassName', 'E04시험중분류2');
    await cm.locator('button').filter({ hasText: /저\s*장/ }).nth(1).click(); await wait(1800);
    out.mRenamed = (await rowIndexOf(dlgGrid(cm, 1), 'E04시험중분류2')) != null;
    await btn(cm, /^\s*닫\s*기\s*$/).click(); await wait(1000);
    out.classClosed = (await modal('분류관리').count()) === 0;
    out.getsAfterClass = gets.slice(-3);                           // 닫으면 대분류 콤보를 다시 읽는다 (l-codes)

    // [E7] 등록 → Edit 창: 필수 검사, 대분류·중분류·내용 저장
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(1200);
    let em = modal('내부통제 체크리스트 생성/수정');
    out.editOpen = await em.count();
    out.editBtns = (await em.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.editLabels = (await em.locator('strong, .ant-typography-strong').allInnerTexts()).join('|');
    out.editPlaceholders = (await em.locator('.ant-select-selection-placeholder').allInnerTexts()).join('|');
    out.editUseChecked = await em.locator('.ant-checkbox-input').evaluate(el => el.checked);
    await btn(em, /저\s*장/).click(); out.editNoMMsg = await msgs();                    // 중분류는 필수선택 항목입니다
    await pickOpt(em.locator('.ant-select').nth(0), 0, 'E04시험대분류'); await wait(800);
    out.mOptionsInEdit = (await (async () => { await em.locator('.ant-select').nth(1).click(); await wait(300); const t = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts()).join('|'); await p.keyboard.press('Escape'); return t; })());
    await pickOpt(em.locator('.ant-select').nth(1), 0); await wait(300);
    await btn(em, /저\s*장/).click(); out.editNoContentMsg = await msgs();               // 체크대상은 필수입력 항목입니다
    await em.locator('textarea').nth(0).fill('E04시험 체크대상');
    await em.locator('textarea').nth(1).fill('E04시험 근거');
    await em.locator('input.ant-input-number-input').fill('7');
    // 행 추가 → 법규 분류 조회창("deadline"): 확인만 → 안내, 법규 체크 → 확인 → 연관 내부통제에 추가
    await btn(em, /행\s*추가/).click(); await wait(1500);
    const sm = modal('법규 분류');
    out.lookupOpen = await sm.count();
    await btn(sm, /^\s*확\s*인\s*$/).click(); out.lookupNoneMsg = await msgs();
    await sm.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-selection-checkbox input, .ag-row[row-index="0"] .ag-checkbox-input').first().click(); await wait(300);
    out.lookupFirst = (await sm.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-cell[col-id="classTreeName"]').first().innerText()).trim();
    const w2 = writes.length; const g2 = gets.length;
    await btn(sm, /^\s*확\s*인\s*$/).click(); await wait(2000);
    out.lookupWrites = writes.slice(w2);
    out.lookupGets = gets.slice(g2);
    out.lookupClosed = (await modal('법규 분류').count()) === 0;
    out.edRelateRows = await countRows(dlgGrid(em, 0));
    // 행 삭제(선택 없이) → 변화 없음, 행 클릭 후 삭제
    await dlgGrid(em, 0).locator('.ag-row[row-index="0"] .ag-cell[col-id="icsClassTreeFullName"]').click(); await wait(300);
    const w3 = writes.length;
    await btn(em, /행\s*삭\s*제/).click(); await wait(1500);
    out.edRelateDelWrites = writes.slice(w3);
    out.edRelateRowsAfterDel = await countRows(dlgGrid(em, 0));
    // 다시 추가한 뒤 저장
    await btn(em, /행\s*추가/).click(); await wait(1200);
    const sm2 = modal('법규 분류');
    await sm2.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-selection-checkbox input, .ag-row[row-index="0"] .ag-checkbox-input').first().click(); await wait(300);
    await btn(sm2, /^\s*확\s*인\s*$/).click(); await wait(2000);
    const w4 = writes.length;
    await btn(em, /저\s*장/).click(); await wait(2000);
    out.editSaveWrites = writes.slice(w4);
    out.editClosed = (await modal('내부통제 체크리스트 생성/수정').count()) === 0;
    const cIdx = await rowIndexOf(grid(), 'E04시험 체크대상');
    out.newRowIdx = cIdx;
    out.newRowText = cIdx == null ? null : (await grid().locator(`.ag-row[row-index="${cIdx}"]`).first().innerText()).replace(/\s+/g, ' ').slice(0, 120);

    // 수정 아이콘 → 값이 채워져 열린다, 저장
    if (cIdx != null) {
      await clickIcon(grid(), cIdx, 'actionCell'); await wait(1500);
      em = modal('내부통제 체크리스트 생성/수정');
      out.editValues = await em.locator('textarea').evaluateAll(els => els.map(e => e.value));
      out.editSelects = (await em.locator('.ant-select-selection-item').allInnerTexts()).join('|');
      out.editRelateRows = await countRows(dlgGrid(em, 0));
      out.editSeq = await em.locator('input.ant-input-number-input').inputValue();
      await em.locator('textarea').nth(0).fill('E04시험 체크대상수정');
      const w5 = writes.length;
      await btn(em, /저\s*장/).click(); await wait(2000);
      out.editUpdateWrites = writes.slice(w5);
      out.updatedText = (await rowIndexOf(grid(), 'E04시험 체크대상수정')) != null;
    }

    // [E8] 삭제: 시험 체크리스트 체크 → 확인 창 → 삭제 (연관 내부통제는 원본처럼 남으므로 먼저 지운다)
    const dIdx = await rowIndexOf(grid(), 'E04시험 체크대상수정');
    if (dIdx != null) {
      await grid().locator(`.ag-row[row-index="${dIdx}"] .ag-cell[col-id="content"]`).click(); await wait(800);
      // 연관 내부통제는 체크리스트를 지워도 원본처럼 남으므로 편집 창에서 모두 먼저 지운다
      await clickIcon(grid(), dIdx, 'actionCell'); await wait(1500);
      em = modal('내부통제 체크리스트 생성/수정');
      for (let k = 0; k < 6 && (await countRows(dlgGrid(em, 0))) > 0; k++) {
        await dlgGrid(em, 0).locator('.ag-row[row-index="0"] .ag-cell[col-id="icsClassTreeFullName"]').click(); await wait(300);
        await btn(em, /행\s*삭\s*제/).click(); await wait(1500);
      }
      out.relateLeft = await countRows(dlgGrid(em, 0));
      await btn(em, /닫\s*기/).click(); await wait(600);
      await grid().locator(`.ag-row[row-index="${dIdx}"] .ag-selection-checkbox input, .ag-row[row-index="${dIdx}"] .ag-checkbox-input`).first().click(); await wait(300);
      const w6 = writes.length;
      await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(500);
      out.delConfirm = (await p.locator('.ant-modal-confirm-content').innerText()).trim();
      await confirmYes();
      out.delWrites = writes.slice(w6);
    }
    out.leftoverChecklist = await grid().evaluate(el => [...el.querySelectorAll('.ag-row[row-index]')].filter(r => r.innerText.includes('E04시험')).length);

    // 시험 분류 삭제: 분류관리 창에서 중분류 → 대분류 순서
    await btn(scr, /분류관리/).click(); await wait(1500);
    cm = modal('분류관리');
    const lI = await rowIndexOf(dlgGrid(cm, 0), 'E04시험대분류');
    await dlgGrid(cm, 0).locator(`.ag-row[row-index="${lI}"] .ag-selection-checkbox input, .ag-row[row-index="${lI}"] .ag-checkbox-input`).first().click(); await wait(2500);
    out.finalLSelected = await dlgGrid(cm, 0).evaluate(el => [...el.querySelectorAll('.ag-row-selected')].map(r => r.innerText.replace(/\s+/g, ' ')));
    out.finalMRows = await dlgGrid(cm, 1).evaluate(el => [...el.querySelectorAll('.ag-row[row-index]')].map(r => r.innerText.replace(/\s+/g, ' ')));
    const mI = await rowIndexOf(dlgGrid(cm, 1), 'E04시험중분류');
    await dlgGrid(cm, 1).locator(`.ag-row[row-index="${mI}"] .ag-selection-checkbox input, .ag-row[row-index="${mI}"] .ag-checkbox-input`).first().click(); await wait(300);
    const w7 = writes.length;
    await cm.locator('button').filter({ hasText: /^\s*삭\s*제\s*$/ }).nth(1).click(); await wait(800);
    out.mDelConfirm = (await p.locator('.ant-modal-confirm-content').innerText()).trim();
    await confirmYes();
    out.mDelWrites = writes.slice(w7);
    const w8 = writes.length;
    await cm.locator('button').filter({ hasText: /^\s*삭\s*제\s*$/ }).first().click(); await wait(800);
    await confirmYes();
    out.lDelWrites = writes.slice(w8);
    out.classLRowsEnd = await countRows(dlgGrid(cm, 0));
    out.leftoverClass = await dlgGrid(cm, 0).evaluate(el => [...el.querySelectorAll('.ag-row[row-index]')].filter(r => r.innerText.includes('E04시험')).length);
    await btn(cm, /^\s*닫\s*기\s*$/).click(); await wait(800);
    out.writes = writes;
    out.created = created;
    await p.screenshot({ path: path.join(OUT, 'E04-end.png') });
  } catch (e) {
    out.fail = String(e).slice(0, 700);
    out.created = created;
    await p.screenshot({ path: path.join(OUT, 'E04-fail.png') }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
