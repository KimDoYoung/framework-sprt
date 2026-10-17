// E01-1 법규 기한(Sch03_Lookup_Ics + Sch03_Lookup_Short + Sch03_Lookup_Cycle + 탭 7개) 화면 확인.
// 법규관리(관리자 #1012)에서 첫 분류의 첫 법규의 기한 아이콘으로 연다. 시험 기한 3건(기본 기한 선택·일회성·반복주기)을 만들고 마지막에 모두 삭제한다. 기존 기한은 건드리지 않는다.
// 실패해서 남으면 마지막 줄 created의 id를 `yunhee api DELETE /api/v1/sch/deadlines -b '[id,…]'`로 지운다(스크립트도 마지막에 같은 호출을 시도한다).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E01-1.js <스크린샷 폴더> [회사]
const path = require('path');
const { launch, login, openMenu } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const created = [];
  const writes = [];
  p.on('response', async r => {
    const u = r.url();
    if (!u.includes('/api/v1/sch/deadlines')) return;
    const m = r.request().method();
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + decodeURIComponent(u.split('/api/v1/')[1]));
    if (['PUT', 'POST'].includes(m) && r.ok()) {
      try { const j = await r.json(); if (j?.data?.deadlineId) created.push(j.data.deadlineId); } catch (e) { /* ignore */ }
    }
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
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
  const pickOption = async (selectLoc, n = 0) => {
    await selectLoc.click(); await wait(300);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').nth(n).click(); await wait(200);
  };
  const dlgRows = m => countRows(m.locator('.ag-root-wrapper').first());
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '법규관리(관리자)');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(1200);
    await scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-cell[col-id="classTreeCode"]').click(); await wait(1500);
    const law = scr.locator('.ag-root-wrapper').nth(1);
    out.lawRows = await countRows(law);
    await clickIcon(law, 0, 'actionCellDeadline'); await wait(1500);

    // [E0] 열림 → 목록 조회
    let m = modal('법규 기한');
    out.open = await m.count();
    out.btns = (await m.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await m.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.placeholder = (await m.locator('.ant-select-selection-placeholder').allInnerTexts()).join('|');
    const n0 = await dlgRows(m); out.rows0 = n0;
    out.firstRow = (await m.locator('.ag-row[row-index="0"]').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 100);

    // [E2] 기본 기한 선택 없이 [선택] → 안내
    await btn(m, /^\s*선\s*택\s*$/).click(); out.loadNoneMsg = await msgs();
    await m.locator('.ant-select').first().click(); await wait(400);
    out.templateOptions = await p.locator('.ant-select-dropdown:visible .ant-select-item-option').count();
    out.templateFirst = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').first().innerText()).trim();
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').first().click(); await wait(200);
    await btn(m, /^\s*선\s*택\s*$/).click(); await wait(1500);
    out.rowsAfterLoad = await dlgRows(m);
    out.writesLoad = writes.slice();

    // [E4] 일회성조건 → 수시 창
    await btn(m, /일회성조건/).click(); await wait(700);
    let s = modal('수시');
    out.shortOpen = await s.count();
    out.shortTabs = (await s.locator('.ant-tabs-tab').allInnerTexts()).join('|');
    out.shortBtns = (await s.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.shortRadios = await s.locator('.ant-radio-input').count();
    out.shortChecked = await s.locator('.ant-radio-input').evaluateAll(els => els.map(e => e.checked));   // 즉시 선택
    // 지정일(두 번째 라디오) 선택 후 일자 없이 저장 → "일자를 선택하세요"
    await s.locator('.ant-radio-input').nth(1).click({ force: true }); await wait(300);
    await btn(s, /저\s*장/).click(); out.shortNoDateMsg = await msgs();
    await s.locator('.ant-picker input').first().click(); await s.locator('.ant-picker input').first().fill('2026-12-31'); await p.keyboard.press('Enter'); await wait(300);
    const w1 = writes.length;
    await btn(s, /저\s*장/).click(); await wait(1800);
    out.shortSaveWrites = writes.slice(w1);
    out.shortClosed = (await modal('수시').count()) === 0;
    out.rowsAfterShort = await dlgRows(m);

    // [E5] 반복주기조건 → 탭 6개, 적용기간
    await btn(m, /반복주기조건/).click(); await wait(700);
    let c = modal('반복주기');
    out.cycleOpen = await c.count();
    out.cycleTabs = (await c.locator('.ant-tabs-tab').allInnerTexts()).join('|');
    out.cycleActive = (await c.locator('.ant-tabs-tab-active').innerText()).trim();
    out.cycleBtns = (await c.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.periodDefault = await c.locator('.ant-picker input').evaluateAll(els => els.map(e => e.value));
    // 분기 탭: 말일 줄만 켜져 있고(기본), 11번 라디오를 누르면 그 줄이 켜진다
    await c.locator('.ant-tabs-tab', { hasText: '분기' }).click(); await wait(500);
    const pane = c.locator('.ant-tabs-tabpane-active');
    out.q_radios = await pane.locator('.ant-radio-input').evaluateAll(els => els.map(e => e.checked));
    out.q_selectsDisabled0 = await pane.locator('.ant-select').evaluateAll(els => els.map(e => e.classList.contains('ant-select-disabled')));
    await pane.locator('.ant-radio-input').nth(1).click({ force: true }); await wait(300);
    out.q_selectsDisabled11 = await pane.locator('.ant-select').evaluateAll(els => els.map(e => e.classList.contains('ant-select-disabled')));
    out.q_monthOptions = await (async () => { await pane.locator('.ant-select').nth(1).click(); await wait(400); const t = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts()).join('|'); await p.keyboard.press('Escape'); return t; })();
    // 년 탭: 월 콤보 출처가 종류코드 MonthCode
    await c.locator('.ant-tabs-tab', { hasText: '년' }).click(); await wait(500);
    const pane6 = c.locator('.ant-tabs-tabpane-active');
    await pane6.locator('.ant-radio-input').nth(1).click({ force: true }); await wait(300);
    out.y_monthOptions = await (async () => { await pane6.locator('.ant-select').nth(1).click(); await wait(400); const t = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts()).join('|'); await p.keyboard.press('Escape'); return t; })();
    // 주 탭: 요일·영업일 구분을 골라 저장
    await c.locator('.ant-tabs-tab', { hasText: /^\s*주\s*$/ }).click(); await wait(500);
    const pane2 = c.locator('.ant-tabs-tabpane-active');
    await pickOption(pane2.locator('.ant-select').nth(0), 0);
    await pickOption(pane2.locator('.ant-select').nth(1), 1);
    const w2 = writes.length;
    await btn(c, /저\s*장/).click(); await wait(1800);
    out.cycleSaveWrites = writes.slice(w2);
    out.cycleClosed = (await modal('반복주기').count()) === 0;
    out.rowsAfterCycle = await dlgRows(m);

    // 새로 만든 주 행 수정: 수정 아이콘 → 반복주기 창이 "주" 탭으로 열리고 값이 채워져 있다
    const cycId = created[created.length - 1];
    const cycIdx = await m.locator('.ag-root-wrapper').first().evaluate((el, id) => { const r = el.querySelector(`.ag-row[row-id="${id}"]`); return r ? r.getAttribute('row-index') : null; }, String(cycId));
    out.cycRowText = (await m.locator(`.ag-row[row-id="${cycId}"]`).first().innerText()).replace(/\s+/g, ' ').slice(0, 100);
    await clickIcon(m.locator('.ag-root-wrapper').first(), cycIdx, 'actionCell'); await wait(900);
    c = modal('반복주기');
    out.editOpen = await c.count();
    out.editActiveTab = (await c.locator('.ant-tabs-tab-active').innerText()).trim();
    out.editValues = (await c.locator('.ant-tabs-tabpane-active .ant-select-selection-item').allInnerTexts()).join('|');
    out.editPeriod = await c.locator('.ant-picker input').evaluateAll(els => els.map(e => e.value));
    await pickOption(c.locator('.ant-tabs-tabpane-active .ant-select').nth(0), 2);
    const w3 = writes.length;
    await btn(c, /저\s*장/).click(); await wait(1800);
    out.editSaveWrites = writes.slice(w3);
    out.cycRowTextAfter = (await m.locator(`.ag-row[row-id="${cycId}"]`).first().innerText()).replace(/\s+/g, ' ').slice(0, 100);

    // 일회성 행 수정 아이콘 → 수시 창(기존 값)
    const shortId = created[1];
    const shIdx = await m.locator('.ag-root-wrapper').first().evaluate((el, id) => { const r = el.querySelector(`.ag-row[row-id="${id}"]`); return r ? r.getAttribute('row-index') : null; }, String(shortId));
    await clickIcon(m.locator('.ag-root-wrapper').first(), shIdx, 'actionCell'); await wait(900);
    s = modal('수시');
    out.shortEditOpen = await s.count();
    out.shortEditChecked = await s.locator('.ant-radio-input').evaluateAll(els => els.map(e => e.checked));
    out.shortEditDate = await s.locator('.ant-picker input').first().inputValue();
    await btn(s, /닫\s*기/).click(); await wait(400);

    // [E1] 새로고침 아이콘, [E3] 삭제: 시험 행 3건을 하나씩 체크 → 확인 → 삭제
    const g0 = writes.length;
    await m.locator('.anticon-reload').first().dispatchEvent('mousedown'); await wait(800);
    for (const id of created.slice(0, 3)) {
      const row = m.locator(`.ag-row[row-id="${id}"]`).first();
      if (!(await row.count())) { out.steps['missing_' + id] = true; continue; }
      await row.locator('.ag-selection-checkbox input, .ag-checkbox-input').first().click(); await wait(300);
      await btn(m, /^\s*삭\s*제\s*$/).click(); await wait(500);
      if (id === created[0]) out.delConfirm = (await p.locator('.ant-modal-confirm-content').innerText()).trim();
      await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(1500);
    }
    out.deleteWrites = writes.slice(g0);
    out.rowsEnd = await dlgRows(m);

    // [E6] 닫기
    await btn(m, /닫\s*기/).click(); await wait(500);
    out.closed = (await modal('법규 기한').count()) === 0;
    out.created = created;
    out.writes = writes;
    await p.screenshot({ path: path.join(OUT, 'E01-1-end.png') });
  } catch (e) {
    out.fail = String(e).slice(0, 600);
    out.created = created;
    await p.screenshot({ path: path.join(OUT, 'E01-1-fail.png') }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
