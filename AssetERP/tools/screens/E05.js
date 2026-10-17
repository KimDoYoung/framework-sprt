// E05 임직원 내부통제 준수리스트(Ics30_Tab_Compliance #1313 + Ics30_Lookup_Insert + Ics33_TabPage_ComplianceAnswer) + E05-1 예외사원 등록(Emp33_Lookup_ExceptBiz) 화면 확인.
// admin 회사(0)의 기준 적용일은 2025-10-01(확정 전)·2024-01-01(확정) 두 개 — 조회·확정 검사·취소는 그대로 두고, 새 기준 적용일 2026-09-01(지난달)을 만들어
// 행 추가·저장·삭제·준수답변·삭제까지 해 본 뒤 지운다. 예외사원 1행도 만들었다가 지운다. 기존 데이터는 바꾸지 않는다.
// 실패해서 남으면 마지막 줄 created를 보고 `yunhee api`로 지운다: DELETE /api/v1/ics/compliances/dates?startDate=… , DELETE /api/v1/emp/except-biz (body [id…]).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E05.js <스크린샷 폴더> [회사]
const path = require('path');
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  const created = { dates: [], except: [] };
  p.on('response', async r => {
    const u = r.url();
    if (!u.includes('/api/v1/ics/compliance') && !u.includes('/api/v1/emp/except-biz') && !u.includes('/api/v1/emp/trans-infos')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
    if (m === 'PUT' && r.ok() && u.includes('/except-biz')) {
      try { for (const d of (await r.json())?.data ?? []) created.except.push(d.exceptBizId); } catch (e) { /* ignore */ }
    }
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const btnN = (scope, re, n) => scope.locator('button').filter({ hasText: re }).nth(n);
  const rowIndexOf = (g, text) => g.evaluate((el, t) => { const r = [...el.querySelectorAll('.ag-row[row-index]')].find(x => x.innerText.includes(t)); return r ? r.getAttribute('row-index') : null; }, text);
  const headers = g => g.locator('.ag-header-cell-text').allInnerTexts().then(a => a.join('|').replace(/\n/g, ' '));
  const confirmBtn = async (yes = true) => { await p.locator('.ant-modal-confirm ' + (yes ? '.ant-btn-primary' : '.ant-btn-default')).click(); await wait(1500); };
  const confirmText = () => p.locator('.ant-modal-confirm:visible .ant-modal-confirm-title, .ant-modal-confirm:visible .ant-modal-confirm-content').allInnerTexts().then(a => a.join(' / ').replace(/\s+/g, ' '));
  const cell = (g, idx, colId) => g.locator(`.ag-row[row-index="${idx}"] .ag-cell[col-id="${colId}"]`);
  const editText = async (g, idx, colId, text) => {
    await wait(400);
    await cell(g, idx, colId).dblclick({ force: true }); await wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await wait(400);
  };
  const editDate = async (g, idx, colId, ymd) => {
    await wait(400);
    await cell(g, idx, colId).dblclick({ force: true }); await wait(300);
    await p.locator('input[type=date]').last().fill(ymd); await p.keyboard.press('Enter'); await wait(400);
  };
  const pickAg = async (g, idx, colId, text) => {
    await wait(400);
    await cell(g, idx, colId).dblclick({ force: true }); await wait(500);
    await p.locator('.ag-cell-inline-editing .ag-picker-field-wrapper').first().click(); await wait(400);
    const item = p.locator('.ag-select-list').getByText(text, { exact: true }).first();
    for (let i = 0; i < 20 && !(await item.count()); i++) { // 가상 목록: 안 그려졌으면 내려 가며 찾는다
      await p.locator('.ag-select-list [class*=viewport], .ag-select-list').first().evaluate((el, n) => { el.scrollTop = n * 60; }, i); await wait(150);
    }
    await item.click(); await wait(500);
  };
  const toggle = async (g, idx, colId) => { await cell(g, idx, colId).locator('input[type=checkbox]').click({ force: true }); await wait(300); };
  const selectRow = async (g, idx) => { await g.locator(`.ag-row[row-index="${idx}"] .ag-selection-checkbox input`).first().click({ force: true }); await wait(300); };
  const enabled = async (scope, re) => !(await btn(scope, re).isDisabled());
  const stepLog = (k, v) => { out.steps[k] = v; };
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '임직원 내부통제 준수리스트');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(1500);
    const dateGrid = () => scr.locator('.ag-root-wrapper').nth(0);
    const formGrid = () => scr.locator('.ag-root-wrapper').nth(1);
    const ansGrid = () => scr.locator('.ag-root-wrapper').nth(2);
    const topBar = scr.locator('button');
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.dateHeaders = await headers(dateGrid());
    out.formHeaders = await headers(formGrid());
    out.ansHeaders = await headers(ansGrid());
    out.getsOpen = gets.slice();                       // [E0] 코드 콤보 + 기준 적용일 + 준수항목 + 준수답변
    out.dateRows = await countRows(dateGrid());
    out.dateFirst = (await dateGrid().locator('.ag-row[row-index="0"]').innerText()).replace(/\s+/g, ' ');
    out.dateSelected = await dateGrid().locator('.ag-row-selected').count();
    out.formRows = await countRows(formGrid());
    out.formFirstSelected = await formGrid().locator('.ag-row[row-index="0"].ag-row-selected').count();
    out.ansTitle = (await scr.getByText(/준수답변$/).first().innerText()).trim();
    out.ansRows = await countRows(ansGrid());
    out.enabledAtOpen = { 삭제: await enabled(scr, /^\s*삭\s*제\s*$/), 행추가: await enabled(scr, /행\s*추가/), 행삭제: await enabled(scr, /행\s*삭제/) };   // 확정 전 날짜라 켜짐
    out.gridDate = await checkGrid(p, dateGrid()); out.gridDateOk = gridOk(out.gridDate);

    // [E1] 확정된 날짜(2024-01-01) 선택 → 버튼 꺼짐
    const fixedIdx = await rowIndexOf(dateGrid(), '2024-01-01');
    await cell(dateGrid(), fixedIdx, 'startDate').click(); await wait(1500);
    out.fixedRows = await countRows(formGrid());
    out.enabledFixed = { 삭제: await enabled(scr, /^\s*삭\s*제\s*$/), 행추가: await enabled(scr, /행\s*추가/), 행삭제: await enabled(scr, /행\s*삭제/), 저장: await enabled(scr, /^\s*저\s*장\s*$/) };
    // [E5] 확정 → 이미 확정된 …  [E7] 확정취소 → 확인 창 → 아니오
    await btn(scr, /^\s*확\s*정\s*$/).click(); out.msgFixedConfirm = await msgs();
    await btn(scr, /확\s*정\s*취\s*소/).click(); await wait(800);
    out.cancelModal = await confirmText();
    await confirmBtn(false);
    // 확정 전 날짜(2025-10-01): 확정취소 → 확정 전 …, 확정 → 확인 창 → 아니오
    const openIdx = await rowIndexOf(dateGrid(), '2025-10-01');
    await cell(dateGrid(), openIdx, 'startDate').click(); await wait(1500);
    await btn(scr, /확\s*정\s*취\s*소/).click(); out.msgNotFixedCancel = await msgs();
    await wait(2500);
    await btn(scr, /^\s*확\s*정\s*$/).click(); await wait(800);
    out.confirmModal = await confirmText();
    await confirmBtn(false);

    // [E4] 등록 → 생성 창: 검사 메시지 2종 → 지난달로 생성
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(1000);
    let ins = modal('생성');
    out.insOpen = await ins.count();
    out.insDefaults = await ins.locator('input').evaluateAll(els => els.map(e => e.value).filter(Boolean));
    out.insSelect = (await ins.locator('.ant-select-selection-item').allInnerTexts()).join('|');
    await ins.locator('input').first().fill('2025');
    await ins.locator('.ant-select').click(); await wait(300);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option', { hasText: /^10월$/ }).click(); await wait(300);
    await btn(ins, /생\s*성/).click(); out.msgDup = await msgs();
    await wait(2800);
    await ins.locator('.ant-select').click(); await wait(300);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option', { hasText: /^5월$/ }).click(); await wait(300);
    await btn(ins, /생\s*성/).click(); out.msgAfter = await msgs();
    await wait(2800);
    await ins.locator('input').first().fill('2026');
    await ins.locator('.ant-select').click(); await wait(300);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option', { hasText: /^9월$/ }).click(); await wait(300);
    const w0 = writes.length;
    await btn(ins, /생\s*성/).click(); await wait(2500);
    created.dates.push('2026-09-01');
    out.createWrites = writes.slice(w0);
    out.insClosed = await modal('생성').count();
    out.dateRowsAfterCreate = await countRows(dateGrid());
    out.dateFirstAfterCreate = (await dateGrid().locator('.ag-row[row-index="0"]').innerText()).replace(/\s+/g, ' ');
    out.formRowsNew = await countRows(formGrid());
    out.ansRowsNew = await countRows(ansGrid());

    // [E11] 행 추가 → 준수항목·내부번호·내용 입력 → [E13] 저장
    await btn(scr, /행\s*추가/).click(); await wait(800);
    const before = await countRows(formGrid());
    const newIdx = await formGrid().evaluate(el => { const r = [...el.querySelectorAll('.ag-row[row-id]')].find(x => Number(x.getAttribute('row-id')) < 0); return r ? r.getAttribute('row-index') : null; });
    out.newFormIdx = newIdx;
    out.saveLabelClean = (await btn(scr, /^\s*저\s*장\s*$/).innerText()).replace(/\s/g, '');
    // 저장 전 준수항목 없이 저장 → 서버 거절 문구
    await editText(formGrid(), newIdx, 'subNum', 'E05T');
    await btn(scr, /^\s*저\s*장\s*$/).click(); out.msgNoType = await msgs();
    await wait(2800);
    await pickAg(formGrid(), newIdx, 'complianceTypeName', '07. 대외활동'); await wait(300);
    out.newTypeCell = (await cell(formGrid(), newIdx, 'complianceTypeName').innerText()).trim();
    // 미사용 처리 시 적용일자 없음 → 안내
    await toggle(formGrid(), newIdx, 'useYn');
    await btn(scr, /^\s*저\s*장\s*$/).click(); out.msgCloseDate = await msgs();
    await wait(2800);
    await toggle(formGrid(), newIdx, 'useYn');
    const w1 = writes.length;
    await btn(scr, /^\s*저\s*장\s*$/).click(); out.msgSaved = await msgs(); await wait(2500);
    out.saveWrites = writes.slice(w1);
    out.formRowsAfterSave = await countRows(formGrid());

    // [E2] 방금 저장한 행 클릭 → 준수답변 (비어 있음) → [E1] 행 추가 → CASE·답변1 → 저장 (답변 없으면 안내)
    const savedIdx = await rowIndexOf(formGrid(), 'E05T');
    await cell(formGrid(), savedIdx, 'subNum').click(); await wait(1200);
    out.ansTitle2 = (await scr.getByText(/준수답변$/).first().innerText()).trim();
    out.ansRows0 = await countRows(ansGrid());
    await btnN(scr, /행\s*추가/, 1).click(); await wait(800);
    const aIdx = await ansGrid().evaluate(el => { const r = [...el.querySelectorAll('.ag-row[row-id]')].find(x => Number(x.getAttribute('row-id')) < 0); return r ? r.getAttribute('row-index') : null; });
    await editText(ansGrid(), aIdx, 'caseNo', '99');
    await btnN(scr, /^\s*저\s*장\s*$/, 1).click(); out.msgNoAnswer = await msgs();
    await wait(2800);
    await pickAg(ansGrid(), aIdx, 'answer1Name', '예'); await wait(300);
    await pickAg(ansGrid(), aIdx, 'answer2Name', '아니오'); await wait(300);
    const w2 = writes.length;
    await btnN(scr, /^\s*저\s*장\s*$/, 1).click(); out.msgAnsSaved = await msgs(); await wait(2500);
    out.ansWrites = writes.slice(w2);
    out.ansRowsAfter = await countRows(ansGrid());
    out.ansCells = (await ansGrid().locator('.ag-row[row-index="0"]').innerText()).replace(/\s+/g, ' ');
    // 행 삭제(체크 → 행 삭제 → 저장)
    await selectRow(ansGrid(), 0);
    await btnN(scr, /행\s*삭제/, 1).click(); await wait(500);
    out.ansRowsAfterRemove = await countRows(ansGrid());
    const w3 = writes.length;
    await btnN(scr, /^\s*저\s*장\s*$/, 1).click(); await wait(2500);
    out.ansDelWrites = writes.slice(w3);

    // 준수항목 행 삭제 → 저장 (작성 기록 없음 → 확인 창 없이 저장)
    const delIdx = await rowIndexOf(formGrid(), 'E05T');
    await selectRow(formGrid(), delIdx);
    out.formSelectedBeforeRemove = await formGrid().locator('.ag-row-selected').count();
    await btnN(scr, /행\s*삭제/, 0).click(); await wait(500);
    out.formRowsAfterRemove = await countRows(formGrid());
    const w4 = writes.length;
    await btnN(scr, /^\s*저\s*장\s*$/, 0).click(); out.msgFormDeleted = await msgs(); await wait(2500);
    out.formDelWrites = writes.slice(w4);
    out.formRowsFinal = await countRows(formGrid());

    // [E9] 삭제 → 확인 창 → 새 기준 적용일 삭제
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(800);
    out.deleteModal = await confirmText();
    const w5 = writes.length;
    await confirmBtn(true);
    out.deleteWrites = writes.slice(w5);
    created.dates.length = 0;
    out.dateRowsFinal = await countRows(dateGrid());

    // [E10] 예외사원 등록 (E05-1)
    await btn(scr, /예외사원\s*등록/).click(); await wait(1500);
    const ex = modal('예외사원 등록');
    out.exOpen = await ex.count();
    out.exButtons = (await ex.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.exHeaders = await headers(ex.locator('.ag-root-wrapper').first());
    out.exRowsOpen = await countRows(ex.locator('.ag-root-wrapper').first());
    out.exGets = gets.filter(g => g.includes('except-biz')).slice(-1);
    out.exGrid = await checkGrid(p, ex); out.exGridOk = gridOk(out.exGrid);
    await btn(ex, /^\s*삭\s*제\s*$/).click(); out.exMsgNoSel = await msgs();
    await wait(2800);
    await btn(ex, /^\s*등\s*록\s*$/).click(); await wait(1500);
    const pick = modal('사원찾기');
    out.pickOpen = await pick.count();
    out.pickOptions = await (async () => { await pick.locator('.ant-select').last().click(); await wait(300); const t = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts()).join('|'); await p.keyboard.press('Escape'); return t; })();
    await wait(800);
    out.pickRows = await countRows(pick.locator('.ag-root-wrapper').first());
    await pick.locator('.ag-row[row-index="0"]').first().dblclick({ force: true }); await wait(1500);
    const exGrid = ex.locator('.ag-root-wrapper').first();
    out.exNewRow = (await exGrid.locator('.ag-row[row-id^="-"]').first().innerText()).replace(/\s+/g, ' ');
    await btn(ex, /저\s*장/).click(); out.exMsgNoStart = await msgs();
    await wait(2800);
    const exIdx = await exGrid.evaluate(el => { const r = [...el.querySelectorAll('.ag-row[row-id]')].find(x => Number(x.getAttribute('row-id')) < 0); return r ? r.getAttribute('row-index') : null; });
    await editDate(exGrid, exIdx, 'startDate', '2026-10-01');
    await editText(exGrid, exIdx, 'reason', 'E05-1 시험');
    const w6 = writes.length;
    await btn(ex, /저\s*장/).click(); out.exMsgSaved = await msgs(); await wait(2500);
    out.exSaveWrites = writes.slice(w6);
    out.exRowsAfterSave = await countRows(exGrid);
    await selectRow(exGrid, await rowIndexOf(exGrid, 'E05-1'));
    await btn(ex, /^\s*삭\s*제\s*$/).click(); await wait(800);
    out.exDeleteModal = await confirmText();
    const w7 = writes.length;
    await confirmBtn(true);
    out.exDeleteWrites = writes.slice(w7);
    out.exRowsFinal = await countRows(exGrid);
    created.except.length = 0;
    await btn(ex, /닫\s*기/).click(); await wait(500);
    out.exClosed = await modal('예외사원 등록').count();
    await p.screenshot({ path: path.join(OUT, 'E05-final.png') });
  } catch (e) {
    out.error = String(e).slice(0, 400);
    try { await p.screenshot({ path: path.join(OUT, 'E05-error.png') }); } catch (e2) { /* ignore */ }
  }
  out.created = created;
  out.errs = errs.slice(0, 6);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
