// E07 일일점검내역 관리(관리자)(Chk02_Tab_DailyListAdmin #1245 + Chk02_Edit_DailyList + Chk01_Lookup_ClassTree) 화면 확인.
// 시험 점검내역 1개(E07시험)와 시험 분류 1개(E07시험분류)를 만들고 수정·삭제까지 해 본 뒤 지운다. 기존 데이터는 열어 보기만 한다(저장 안 함). 점검내역복사는 고객사 창을 열었다 닫기만 한다(다른 회사에 쓰지 않는다).
// 실패해서 남으면 마지막 줄 created를 보고 `yunhee api DELETE /api/v1/chk/daily-lists -b '[id]'`, `yunhee api DELETE /api/v1/chk/class-trees/{id}`로 지운다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E07.js <스크린샷 폴더> [회사]
const path = require('path');
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  const created = { daily: [], tree: [] };
  p.on('response', async r => {
    const u = r.url();
    if (!u.includes('/api/v1/chk/') && !u.includes('/api/v1/sys/companies')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
    if (m === 'POST' && r.ok()) {
      try {
        const id = (await r.json())?.data;
        if (u.includes('/chk/daily-lists') && !u.endsWith('/copy')) created.daily.push(id?.dailyListId);
        if (u.includes('/chk/class-trees')) created.tree.push(id?.classTreeId);
      } catch (e) { /* ignore */ }
    }
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const rowIndexOf = (g, text) => g.evaluate((el, t) => { const r = [...el.querySelectorAll('.ag-row[row-index]')].find(x => x.innerText.includes(t)); return r ? r.getAttribute('row-index') : null; }, text);
  const confirmYes = async () => { await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(2000); };
  const confirmNo = async () => { await p.locator('.ant-modal-confirm .ant-btn-default').click(); await wait(500); };
  const confirmText = () => p.locator('.ant-modal-confirm:visible .ant-modal-confirm-title, .ant-modal-confirm:visible .ant-modal-confirm-content').allInnerTexts().then(a => a.join(' / ').replace(/\s+/g, ' '));
  const cell = (g, idx, colId) => g.locator(`.ag-row[row-index="${idx}"] .ag-cell[col-id="${colId}"]`);
  const rowText = async (g, text) => { const i = await rowIndexOf(g, text); return i == null ? null : (await g.locator(`.ag-row[row-index="${i}"]`).innerText()).replace(/\s+/g, ' '); };
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '일일점검내역 관리(관리자)');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2000);
    const grid = scr.locator('.ag-root-wrapper').first();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await grid.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.getsOpen = gets.slice();
    out.classInput = await scr.locator('input[readonly]').first().inputValue();
    out.useSelect = (await scr.locator('.ant-select-selection-item').allInnerTexts()).join('|');
    out.placeholder = await scr.locator('input[placeholder]').first().getAttribute('placeholder');
    out.rowsOpen = await countRows(grid);
    out.rowFirst = (await grid.locator('.ag-row[row-index="0"]').innerText()).replace(/\s+/g, ' ');

    // [E5] 선택 0건이어도 삭제는 묻는다 → [아니오]
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(600);
    out.delAsk0 = await confirmText();
    await confirmNo();
    // [E6] 선택 없이 점검내역복사 → 안내
    await btn(scr, /점검내역복사/).click(); out.msgCopyNoSel = await msgs();
    await wait(2800);
    // 한 행 선택 → 고객사 창이 열린다 → [취소]
    await grid.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().check(); await wait(300);
    await btn(scr, /점검내역복사/).click(); await wait(1200);
    const cm = modal('고객사');
    out.companyOpen = await cm.count();
    out.companyRows = await cm.locator('.ag-row[row-index]').count();
    await btn(cm, /취\s*소/).click(); await wait(500);
    await grid.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().uncheck(); await wait(300);

    // [E1] 분류칸 → 조회창(open 모드)
    await scr.locator('input[readonly]').first().click(); await wait(1200);
    let lk = modal(/^분류$/);
    out.lkOpenCount = await lk.count();
    out.lkOpenBtns = (await lk.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.lkOpenHeaders = (await lk.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.lkOpenRows = await countRows(lk.locator('.ag-root-wrapper').first());
    out.lkOpenFirst = (await lk.locator('.ag-row[row-index="0"]').innerText()).replace(/\s+/g, ' ');
    out.lkOpenWidth = await lk.locator('.ant-modal-content').evaluate(el => Math.round(el.getBoundingClientRect().width));
    // 선택 없이 [확인] → 안내
    await btn(lk, /^\s*확\s*인\s*$/).click(); out.lkMsgNoSel = await msgs();
    await wait(2800);
    // 첫 행 더블클릭 → 분류 교체
    await cell(lk.locator('.ag-root-wrapper').first(), 0, 'classTreeName').dblclick(); await wait(600);
    out.classInputAfterDbl = await scr.locator('input[readonly]').first().inputValue();
    // 다시 열어 [전체] → 기준 분류로 되돌림
    await scr.locator('input[readonly]').first().click(); await wait(1000);
    lk = modal(/^분류$/);
    await btn(lk, /^\s*전\s*체\s*$/).click(); await wait(500);
    out.classInputAfterAll = await scr.locator('input[readonly]').first().inputValue();

    // [E4] 등록 → 편집 창: 분류 없이 저장 → 안내, 분류 고르고 내용 없이 저장 → 안내
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(800);
    let ed = modal('일일점검내역 생성/수정');
    out.newOpen = await ed.count();
    out.newUseYn = (await ed.locator('.ant-select-selection-item').allInnerTexts()).join('|');
    await btn(ed, /저\s*장/).click(); out.msgNoClass = await msgs();
    await wait(2800);
    // 분류칸 → 조회창(edit 모드): [등록][조회]·[확인][닫기], 전체 없음, 수정 칸 있음
    await ed.locator('input[readonly]').first().click(); await wait(1200);
    lk = modal(/^분류$/);
    out.lkEditBtns = (await lk.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.lkEditHeaders = (await lk.locator('.ant-modal-content .ag-header-cell-text').allInnerTexts()).join('|');
    out.lkEditWidth = await lk.locator('.ant-modal-content').evaluate(el => Math.round(el.getBoundingClientRect().width));
    // 분류 신규등록(조회창 [등록]) → 저장 → 목록에 나타남
    await btn(lk, /^\s*등\s*록\s*$/).click(); await wait(800);
    let te = modal('분류 신규등록');
    out.treeNewOpen = await te.count();
    await te.locator('input[type=text], input:not([type])').first().fill('E07시험분류');
    await te.locator('.ant-input-number input').fill('99');
    const w0 = writes.length;
    await btn(te, /저\s*장/).click(); await wait(2500);
    out.createTreeWrites = writes.slice(w0);
    const lkGrid = lk.locator('.ag-root-wrapper').first();
    out.lkRowsAfterCreate = await countRows(lkGrid);
    out.lkTestRow = await rowText(lkGrid, 'E07시험분류');
    out.lkSelectedAfterCreate = await lkGrid.locator('.ag-row-selected').count();
    // 시험 분류를 [확인]으로 고른다
    await btn(lk, /^\s*확\s*인\s*$/).click(); await wait(600);
    out.editClassAfterPick = await ed.locator('input[readonly]').first().inputValue();
    await btn(ed, /저\s*장/).click(); out.msgNoContent = await msgs();
    await wait(2800);
    await ed.locator('textarea').first().fill('E07시험 점검내용');
    await ed.locator('textarea').nth(1).fill('E07시험 설명');
    await ed.locator('input:not([readonly]):not([type=search]):not([role])').nth(0).fill('09:00');
    await ed.locator('.ant-input-number input').fill('999');
    const w1 = writes.length;
    await btn(ed, /저\s*장/).click(); await wait(2500);
    out.createDailyWrites = writes.slice(w1);
    out.rowsAfterCreate = await countRows(grid);
    out.createdRow = await rowText(grid, 'E07시험 점검내용');   // 맨 위에 들어간다

    // 수정: 수정 칸 → 설명 바꿔 저장
    const ri = await rowIndexOf(grid, 'E07시험 점검내용');
    out.createdIdx = ri;
    await cell(grid, ri, 'actionCell').locator('.anticon').click(); await wait(800);
    ed = modal('일일점검내역 생성/수정');
    out.editValues = await ed.locator('input, textarea').evaluateAll(els => els.map(e => (e.value || '').slice(0, 20)));
    await ed.locator('textarea').nth(1).fill('E07 수정됨');
    const w2 = writes.length;
    await btn(ed, /저\s*장/).click(); await wait(2500);
    out.updateWrites = writes.slice(w2);
    out.rowAfterEdit = await rowText(grid, 'E07시험 점검내용');
    // 조회 조건: 검색어
    await scr.locator('input[placeholder]').first().fill('E07시험');
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1800);
    out.rowsSearch = await countRows(grid);
    await scr.locator('.ant-select').nth(0).click(); await wait(300);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option', { hasText: '미사용' }).click(); await wait(300);
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1800);
    out.rowsSearchUnused = await countRows(grid);
    await scr.locator('.ant-select').nth(0).click(); await wait(300);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option', { hasText: '전체' }).click(); await wait(300);
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1800);
    out.rowsSearchAll = await countRows(grid);

    // 삭제: 시험 점검내역 체크 → [삭제] → [예]
    const di = await rowIndexOf(grid, 'E07시험 점검내용');
    await grid.locator(`.ag-row[row-index="${di}"] .ag-selection-checkbox input`).first().check(); await wait(300);
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(600);
    out.delAsk1 = await confirmText();
    const w3 = writes.length;
    await confirmYes();
    out.deleteWrites = writes.slice(w3);
    await scr.locator('input[placeholder]').first().fill('');
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1800);
    out.rowsFinal = await countRows(grid);
    out.testLeft = await rowText(grid, 'E07시험 점검내용');

    // 시험 분류 지우기: 일일점검내역 등록 창 → 분류칸(edit 모드) → 수정 칸 → 삭제
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(800);
    ed = modal('일일점검내역 생성/수정');
    await ed.locator('input[readonly]').first().click(); await wait(1200);
    lk = modal(/^분류$/);
    const lkg = lk.locator('.ag-root-wrapper').first();
    const ti = await rowIndexOf(lkg, 'E07시험분류');
    await cell(lkg, ti, 'actionCell').locator('.anticon').dispatchEvent('click'); await wait(800);
    te = modal('분류 수정');
    await btn(te, /삭\s*제/).click(); await wait(600);
    out.delTreeAsk = await confirmText();
    const w4 = writes.length;
    await confirmYes();
    out.deleteTreeWrites = writes.slice(w4);
    out.lkTestRowAfterDel = await rowText(lkg, 'E07시험분류');
    await btn(lk, /닫\s*기/).click(); await wait(400);
    await btn(ed, /닫\s*기/).click(); await wait(400);
    created.daily.length = 0; created.tree.length = 0;
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    await p.screenshot({ path: path.join(OUT, 'E07-final.png') });
  } catch (e) {
    out.error = String(e).slice(0, 400);
    try { await p.screenshot({ path: path.join(OUT, 'E07-error.png') }); } catch (e2) { /* ignore */ }
  }
  out.created = created;
  out.errs = errs.slice(0, 6);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
