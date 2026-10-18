// E22 Pay20_Tab_DeductAdmin(급여기초정보관리 #1279) 1단계(탭 1~3) 화면 확인
// 시험 데이터: 급여항목 "E22시험"(코드 ZZ9), 율 비고 "E22시험"(적용시작일 2099-01-01), 임금계산방법 적용일 2099-12-30 — 모두 이 스크립트가 만들고 지운다.
// 기초데이터생성은 고객사 데이터가 남아 지울 수 없어 응답을 대체한다(DB 테스트 PayBasicDbTest가 실제 동작을 확인).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E22.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const { wait } = h;
  const out = { errs };
  const api = h.trackApi(['pay/']);
  const cell = (r, col) => r.locator(`[col-id="${col}"]`).first();
  // AG Grid는 DOM 순서가 행 순서와 다를 수 있다 — 행번호(앞 숫자) 순으로 정렬해 읽는다
  const sortedRows = async g => (await h.rowsText(g)).sort((a, b) => parseInt(a) - parseInt(b));
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '급여기초정보관리');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2500);
    // 탭 본문은 한 번 연 탭을 숨기기만 하므로(display:none) 버튼·그리드는 보이는 탭 본문 안에서만 찾는다
    const pane = scr.locator('.pay20-pane:visible');
    const gridsVisible = () => pane.locator('.ag-root-wrapper:visible');
    const tab = async name => { await scr.locator('.ant-tabs-tab').filter({ hasText: name }).first().click(); await wait(2000); };
    out.tabs = (await scr.locator('.ant-tabs-tab').allInnerTexts()).join('|');

    // ===== 탭1 지급/공제 항목관리 =====
    {
      const grid = gridsVisible().first();
      out.item_buttons = await h.buttons(pane);
      out.item_headers = await h.headers(grid);
      out.item_rowsOpen = await h.rows(grid);   // [E0] 열 때 조회
      out.item_placeholder = await pane.locator('input.ant-input:visible').first().getAttribute('placeholder');
      out.item_comboText = (await pane.locator('.ant-select-selection-item:visible').first().innerText()).trim();
      await p.screenshot({ path: `${OUT}/E22-item-open.png` });
      // [E1] 항목구분 콤보 → 바로 조회
      const getsBefore = api.gets.length;
      await pane.locator('.ant-select:visible').first().click(); await wait(500);
      const opts = await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts();
      out.item_comboOptions = opts.join('|');
      await p.locator('.ant-select-dropdown:visible .ant-select-item-option').nth(1).click(); await wait(1500);
      out.item_rowsType1 = await h.rows(grid);
      out.item_getAfterCombo = api.gets.slice(getsBefore).join(' ; ');
      await pane.locator('.ant-select:visible').first().click(); await wait(500);
      await p.locator('.ant-select-dropdown:visible .ant-select-item-option').first().click(); await wait(1500);
      // [E2] 검색 Enter
      const search = pane.locator('input.ant-input:visible').first();
      await search.fill('보험'); await search.press('Enter'); await wait(1500);
      out.item_rowsSearch = await h.rows(grid);
      await search.fill(''); await search.press('Enter'); await wait(1500);
      out.item_grid = await checkGrid(p, pane);
      out.item_gridOk = gridOk(out.item_grid);
      await h.btn(pane, /^\s*조\s*회\s*$/).click(); await wait(1500);

      // [E4] 등록 → 새 행(코드 칸이 빈 행)
      await h.btn(pane, /^\s*등\s*록\s*$/).click(); await wait(600);
      const all = grid.locator('.ag-row[row-index]');
      let target = null;
      for (let i = 0, n = await all.count(); i < n; i++) {
        const r = all.nth(i);
        if (!(await cell(r, 'itemCd').innerText()).trim() && !(await cell(r, 'itemName').innerText()).trim()) { target = r; break; }
      }
      out.item_foundNewRow = !!target;
      await cell(target, 'itemTypeName').dblclick(); await wait(400);
      await pane.locator('.ag-picker-field-wrapper:visible').first().click(); await wait(300);
      out.item_typePicks = (await p.locator('.ag-popup .ag-list-item').allInnerTexts()).join('|');
      await p.locator('.ag-popup .ag-list-item').first().click(); await wait(300);
      await cell(target, 'itemCd').dblclick(); await p.keyboard.type('ZZ9'); await p.keyboard.press('Enter');
      await cell(target, 'itemName').dblclick(); await p.keyboard.type('E22시험'); await p.keyboard.press('Enter');
      await cell(target, 'seq').dblclick(); await p.keyboard.type('999'); await p.keyboard.press('Enter');
      await wait(500);
      out.item_saveLabel = (await h.btn(pane, /저\s*장/).innerText()).replace(/\s/g, '');
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.item_msgSaved = await h.msgs(); await wait(2800);
      await search.fill('E22시험'); await search.press('Enter'); await wait(1500);
      out.item_rowsAfterSave = await h.rowsText(grid);
      await p.screenshot({ path: `${OUT}/E22-item-saved.png` });
      // 고쳐 저장 (시험 행일 때만)
      const r0 = grid.locator('.ag-row[row-index="0"]');
      if (!/E22시험/.test(await cell(r0, 'itemName').innerText())) throw new Error('guard: 시험 행이 아님');
      await cell(r0, 'itemName').dblclick(); await p.keyboard.press('Control+A'); await p.keyboard.type('E22시험2'); await p.keyboard.press('Enter'); await wait(400);
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.item_msgUpdated = await h.msgs(); await wait(2800);
      await search.fill('E22시험'); await search.press('Enter'); await wait(1500);
      out.item_rowsAfterUpdate = await h.rowsText(grid);
      // [E6] 삭제: 선택 없이 → 안내 / 선택 → 확인창 아니오 → 예
      await h.btn(pane, /^\s*삭\s*제\s*$/).click(); await wait(500);
      out.item_msgNoSel = await h.msgs(); await wait(2800);
      if (!/E22시험/.test(await cell(grid.locator('.ag-row[row-index="0"]'), 'itemName').innerText())) throw new Error('guard: 시험 행이 아님');
      await h.scrollX(grid, 0);
      await grid.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click({ force: true });
      await h.btn(pane, /^\s*삭\s*제\s*$/).click();
      await wait(500); out.item_confirm = await h.confirmText();
      await h.confirmNo();
      await h.btn(pane, /^\s*삭\s*제\s*$/).click();
      await h.confirmYes();
      out.item_msgDeleted = await h.msgs(); await wait(2800);
      await search.fill('E22시험'); await search.press('Enter'); await wait(1500);
      out.item_rowsAfterDelete = await h.rows(grid);
      await search.fill(''); await search.press('Enter'); await wait(1500);
      out.item_rowsEnd = await h.rows(grid);
    }

    // ===== 탭3 율관리 =====
    {
      await tab('율관리');
      const grid = gridsVisible().first();
      out.rate_buttons = await h.buttons(pane);
      out.rate_headers = await h.headers(grid);
      out.rate_rowsOpen = await h.rows(grid);
      await p.screenshot({ path: `${OUT}/E22-rate-open.png` });
      out.rate_grid = await checkGrid(p, pane);
      out.rate_gridOk = gridOk(out.rate_grid);
      await h.btn(pane, /^\s*조\s*회\s*$/).click(); await wait(1500);
      await pane.locator('.ant-select:visible').first().click(); await wait(500);
      out.rate_comboOptions = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts()).join('|');
      await p.locator('.ant-select-dropdown:visible .ant-select-item-option').nth(1).click(); await wait(1500);
      out.rate_rowsType1 = await h.rows(grid);
      await pane.locator('.ant-select:visible').first().click(); await wait(500);
      await p.locator('.ant-select-dropdown:visible .ant-select-item-option').first().click(); await wait(1500);
      const before = await h.rows(grid);

      await h.btn(pane, /^\s*등\s*록\s*$/).click(); await wait(600);
      const all = grid.locator('.ag-row[row-index]');
      let target = null;
      for (let i = 0, n = await all.count(); i < n; i++) {
        const r = all.nth(i);
        if (!(await cell(r, 'startDate').innerText()).trim() && !(await cell(r, 'note').innerText()).trim()) { target = r; break; }
      }
      out.rate_foundNewRow = !!target;
      if (!target) { out.rate_rowsText = await h.rowsText(grid); await p.screenshot({ path: `${OUT}/E22-rate-add.png` }); throw new Error('새 행 없음'); }
      await cell(target, 'rateName').dblclick(); await wait(400);
      await pane.locator('.ag-picker-field-wrapper:visible').first().click(); await wait(300);
      await p.locator('.ag-popup .ag-list-item').first().click(); await wait(300);
      await cell(target, 'startDate').dblclick(); await wait(300);
      await p.locator('.ag-cell-editor input').first().fill('2099-01-01'); await p.keyboard.press('Enter');
      await cell(target, 'applyRate').dblclick(); await p.keyboard.type('1.23'); await p.keyboard.press('Enter');
      await cell(target, 'note').dblclick(); await p.keyboard.type('E22시험'); await p.keyboard.press('Enter');
      await wait(500);
      out.rate_saveLabel = (await h.btn(pane, /저\s*장/).innerText()).replace(/\s/g, '');
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.rate_msgSaved = await h.msgs(); await wait(2800);
      await h.btn(pane, /^\s*조\s*회\s*$/).click(); await wait(1500);
      out.rate_rowsAfterSave = await h.rowsText(grid);
      await p.screenshot({ path: `${OUT}/E22-rate-saved.png` });
      // 시험 행 찾아 지운다
      const rows2 = grid.locator('.ag-row[row-index]');
      let del = -1;
      for (let i = 0, n = await rows2.count(); i < n; i++) if (/E22시험/.test(await cell(rows2.nth(i), 'note').innerText())) { del = i; break; }
      out.rate_foundTestRow = del;
      if (del < 0) throw new Error('시험 행 못 찾음');
      await h.scrollX(grid, 0);
      // 조회 뒤에도 앞서 누른 선택이 남아 있을 수 있다 — 모두 풀고 시험 행 하나만 고른 것을 확인한 뒤 지운다
      if (await grid.locator('.ag-row-selected').count()) {
        const head = grid.locator('.ag-header-select-all input').first();
        await head.click({ force: true }); await wait(200);
        if (await grid.locator('.ag-row-selected').count()) { await head.click({ force: true }); await wait(200); }
      }
      await grid.locator(`.ag-row[row-index="${del}"] .ag-selection-checkbox input`).first().click({ force: true }); await wait(200);
      out.rate_selectedBeforeDelete = await grid.locator('.ag-row-selected').count();
      if (out.rate_selectedBeforeDelete !== 1) throw new Error('guard: 선택이 시험 행 하나가 아님');
      await h.btn(pane, /^\s*삭\s*제\s*$/).click();
      await wait(500); out.rate_confirm = await h.confirmText();
      await h.confirmYes();
      await h.btn(pane, /^\s*조\s*회\s*$/).click(); await wait(1500);
      out.rate_rowsEnd = await h.rows(grid);
      out.rate_rowsBefore = before;
    }

    // ===== 탭2 임금계산방법 =====
    {
      await tab('임금계산방법');
      const gl = gridsVisible();
      out.formula_gridCount = await gl.count();
      out.formula_buttons = await h.buttons(pane);
      out.formula_headers = [];
      for (let i = 0, n = await gl.count(); i < n; i++) out.formula_headers.push(await h.headers(gl.nth(i)));
      out.formula_rowsOpen = [];
      for (let i = 0, n = await gl.count(); i < n; i++) out.formula_rowsOpen.push(await h.rows(gl.nth(i)));
      out.formula_firstSelected = await gl.first().locator('.ag-row[row-index="0"].ag-row-selected').count();
      out.formula_note = (await pane.locator('text=기초데이터 생성시').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
      await p.screenshot({ path: `${OUT}/E22-formula-open.png` });
      out.formula_grid = await checkGrid(p, pane);

      // [E5] 생성 → 적용일 2099-12-30
      await h.btn(pane, /^\s*생\s*성\s*$/).click(); await wait(800);
      const ins = h.modal('생성');
      out.formula_insertModal = await ins.count();
      await h.btn(ins, /^\s*생\s*성\s*$/).click(); await wait(500);
      out.formula_msgNoDate = await h.msgs(); await wait(2800);
      await ins.locator('input').first().click(); await ins.locator('input').first().fill('2099-12-30'); await p.keyboard.press('Enter'); await wait(300);
      await h.btn(ins, /^\s*생\s*성\s*$/).click(); await wait(2000);
      out.formula_datesAfterCreate = await sortedRows(gl.first());
      out.formula_formRowsNew = await sortedRows(gl.nth(1));
      await p.screenshot({ path: `${OUT}/E22-formula-created.png` });
      // 시험 적용일이 선택돼 있어야 계속한다
      if (!/2099-12-30/.test(out.formula_datesAfterCreate[0] || '')) throw new Error('guard: 시험 적용일이 첫 행이 아님');
      if (!(await gl.first().locator('.ag-row[row-index="0"].ag-row-selected').count())) throw new Error('guard: 시험 적용일이 선택되지 않음');

      // 산출식 고쳐 저장
      const form = gl.nth(1);
      await cell(form.locator('.ag-row[row-index="0"]'), 'formulaForm').dblclick(); await wait(300);
      await p.keyboard.press('Control+A'); await p.keyboard.type('E22산식'); await p.keyboard.press('Enter'); await wait(400);
      out.formula_saveLabel = (await h.btn(pane, /저\s*장/).innerText()).replace(/\s/g, '');
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.formula_msgSaved = await h.msgs(); await wait(2800);
      out.formula_formAfterSave = await sortedRows(form);

      // [E8] 행 추가 → 급여항목 조회창 → 선택 없이 확인 → 안내 → 첫 항목 선택
      const rowsBeforeAdd = await h.rows(form);
      await h.btn(pane, /행\s*추가/).click(); await wait(1500);
      const lk = h.modal('급여항목');
      out.formula_itemLookupRows = await lk.locator('.ag-row[row-index]').count();
      out.formula_itemLookupHeaders = await h.headers(lk.locator('.ag-root-wrapper').first());
      await h.btn(lk, /확\s*인/).click(); await wait(500);
      out.formula_msgNoItem = await h.msgs(); await wait(2800);
      await lk.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
      await h.btn(lk, /확\s*인/).click(); await wait(1200);
      out.formula_rowsAfterAdd = await h.rows(form);
      out.formula_addedLabel = (await h.btn(pane, /저\s*장/).innerText()).replace(/\s/g, '');
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.formula_msgAddSaved = await h.msgs(); await wait(2800);
      out.formula_rowsAfterAddSave = await sortedRows(form);
      out.formula_rowsBeforeAdd = rowsBeforeAdd;

      // [E9] 행 삭제: 마지막 행(방금 추가)
      const n2 = await h.rows(form);
      await form.locator(`.ag-row[row-index="${n2 - 1}"]`).click(); await wait(300);
      await h.btn(pane, /행\s*삭제/).click(); await wait(1800);
      out.formula_msgRowDel = await h.msgs(); await wait(2800);
      out.formula_rowsAfterRowDel = await h.rows(form);

      // [E3] 고객사 조회창 → 한국펀드서비스 → 오른쪽 적용일
      await pane.locator('input[readonly]:visible').first().click(); await wait(1500);
      const cl = h.modal('고객사 찾기');
      await cl.locator('input.ant-input').first().fill('한국펀드'); await cl.locator('input.ant-input').first().press('Enter'); await wait(1500);
      await cl.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
      await h.btn(cl, /확\s*인/).click(); await wait(2000);
      out.formula_company = await pane.locator('input[readonly]:visible').first().inputValue();
      out.formula_eastRows = [await h.rows(gl.nth(2)), await h.rows(gl.nth(3))];
      out.formula_eastFirstSelected = await gl.nth(2).locator('.ag-row[row-index="0"].ag-row-selected').count();
      await p.screenshot({ path: `${OUT}/E22-formula-east.png` });
      // [E11] 기초데이터생성 — 응답 대체
      const mock = await h.mockWrite('**/pay/formulas/basic-data', 6);
      await h.btn(pane, /기초데이터생성/).click(); await wait(1500);
      out.formula_basicDataCalls = mock.calls;
      out.formula_basicDataBody = api.writes.filter(w => /basic-data/.test(w)).join(';');
      await p.unroute('**/pay/formulas/basic-data');

      // [E7] 삭제: 시험 적용일(2099-12-30)만 지운다
      const first = await sortedRows(gl.first());
      if (!/2099-12-30/.test(first[0] || '')) throw new Error('guard: 시험 적용일이 첫 행이 아님');
      await gl.first().locator('.ag-row[row-index="0"]').click(); await wait(800);
      await h.btn(pane, /^\s*삭\s*제\s*$/).click(); await wait(500);
      await wait(500); out.formula_confirm = await h.confirmText();
      await h.confirmNo();
      await h.btn(pane, /^\s*삭\s*제\s*$/).click(); await h.confirmYes();
      out.formula_datesEnd = await sortedRows(gl.first());
      out.formula_formEnd = await h.rows(gl.nth(1));
    }
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E22-err.png` }).catch(() => {});
    out.writes = api.writes;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
