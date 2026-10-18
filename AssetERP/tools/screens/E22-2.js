// E22-2 Pay20_Tab_DeductAdmin(급여기초정보관리 #1279) 2단계(탭 4~6: 근로소득 간이세액표·공제표·인적공제금액) 화면 확인
// 시험 데이터: 세 표의 적용일 2099-12-30 — 모두 이 스크립트가 만들고 지운다(적용일 삭제가 두 표의 행을 함께 지운다).
// 엑셀업로드는 FILE 인자의 xlsx(머리글 없이 3행)를 올린다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E22-2.js <스크린샷 폴더> <엑셀 파일> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, FILE, COMPANY = 'admin'] = process.argv.slice(2);
const TEST_DATE = '2099-12-30';
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const { wait } = h;
  const out = { errs };
  const api = h.trackApi(['pay/']);
  const cell = (r, col) => r.locator(`[col-id="${col}"]`).first();
  // 새 행은 맨 아래에 붙고 AG Grid는 화면 밖 행을 그리지 않는다 — 시험 행을 누르기 전에 맨 아래로 민다
  const bottom = g => g.evaluate(root => { for (const el of root.querySelectorAll('[class*="viewport"]')) if (el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight; }).then(() => p.waitForTimeout(600));
  // 맨 아래 행은 가로 스크롤바가 클릭을 가로채므로 마우스 이벤트를 셀에 직접 보낸다
  const jsClick = loc => loc.evaluate(el => { for (const t of ['mousedown', 'mouseup', 'click']) el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window })); });
  const sortedRows = async g => (await h.rowsText(g)).sort((a, b) => parseInt(a) - parseInt(b));
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '급여기초정보관리');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2500);
    const pane = scr.locator('.pay20-pane:visible');
    const gridsVisible = () => pane.locator('.ag-root-wrapper:visible');
    const tab = async name => { await scr.locator('.ant-tabs-tab').filter({ hasText: name }).first().click(); await wait(2000); };

    // 적용일 생성 팝업: 빈 칸 → 안내, 날짜 입력 → 생성
    const createDate = async prefix => {
      await h.btn(pane, /^\s*등\s*록\s*$/).first().click(); await wait(600);
      const ins = h.modal('생성');
      out[`${prefix}_popupTitle`] = await ins.locator('.ant-modal-title').innerText();
      out[`${prefix}_popupButtons`] = await h.buttons(ins);
      await ins.locator('button').filter({ hasText: /^\s*생\s*성\s*$/ }).click(); await wait(500);
      out[`${prefix}_msgNoDate`] = await h.msgs(); await wait(2800);
      await ins.locator('input').first().click(); await ins.locator('input').first().fill(TEST_DATE); await p.keyboard.press('Enter'); await wait(300);
      await ins.locator('button').filter({ hasText: /^\s*생\s*성\s*$/ }).click(); await wait(2000);
    };
    // 적용일 삭제: 시험 적용일이 첫 행일 때만 — 확인창 아니오 → 예
    const deleteDate = async (prefix, dateGrid) => {
      const first = await sortedRows(dateGrid);
      if (!first[0] || !first[0].includes(TEST_DATE)) throw new Error('guard: 시험 적용일이 첫 행이 아님');
      await h.btn(pane, /^\s*삭\s*제\s*$/).first().click(); await wait(500);
      out[`${prefix}_dateConfirm`] = await h.confirmText();
      await h.confirmNo();
      out[`${prefix}_datesAfterNo`] = (await sortedRows(dateGrid)).length;
      await h.btn(pane, /^\s*삭\s*제\s*$/).first().click();
      await h.confirmYes();
      out[`${prefix}_datesAfterDelete`] = await sortedRows(dateGrid);
    };

    // ===== 탭4 근로소득 간이세액표 =====
    {
      await tab('근로소득 간이세액표');
      const dateGrid = gridsVisible().nth(0);
      out.tax_buttons = await h.buttons(pane);
      out.tax_dateHeaders = await h.headers(dateGrid);
      out.tax_datesOpen = await sortedRows(dateGrid);
      out.tax_gridCount = await gridsVisible().count();
      out.tax_headers = await h.headers(gridsVisible().nth(1));
      out.tax_otherHeaders = await h.headers(gridsVisible().nth(2));
      out.tax_rowsOpen = await h.rows(gridsVisible().nth(1));
      out.tax_otherRowsOpen = await h.rows(gridsVisible().nth(2));
      out.tax_grid = await checkGrid(p, pane);
      out.tax_gridOk = gridOk(out.tax_grid);
      await p.screenshot({ path: `${OUT}/E22-2-tax-open.png` });

      // [E2] 등록 → 적용일 2099-12-30 생성(직전 적용일의 천만원 초과 표 복사)
      await createDate('tax');
      out.tax_datesAfterCreate = await sortedRows(dateGrid);
      if (!(out.tax_datesAfterCreate[0] || '').includes(TEST_DATE)) throw new Error('guard: 시험 적용일이 첫 행이 아님');
      out.tax_otherRowsAfterCreate = await h.rows(gridsVisible().nth(2));
      out.tax_rowsAfterCreate = await h.rows(gridsVisible().nth(1));   // 천만원 이하는 복사하지 않는다 → 0

      // 천만원 초과: 등록 → 초과/이하 입력 → 저장
      const other = gridsVisible().nth(2);
      const before = await h.rows(other);
      const regBtn = h.btn(pane, /^\s*등\s*록\s*$/, 1);
      out.tax_otherButtons = await h.buttons(pane.locator('.ant-splitter-panel').last());
      await regBtn.click(); await wait(600);
      let target = null;
      const all = other.locator('.ag-row[row-index]');
      for (let i = 0, n = await all.count(); i < n; i++) {
        const r = all.nth(i);
        if (!(await cell(r, 'fromAmt').innerText()).trim() && !(await cell(r, 'toAmt').innerText()).trim()) { target = r; break; }
      }
      out.tax_foundNewRow = !!target;
      // 새 행은 첫 편집 열(초과)의 편집기가 이미 열려 있다 — 아래 칸이 화면 밖이라 클릭 대신 Tab으로 옮긴다
      out.tax_firstEditing = await cell(target, 'fromAmt').evaluate(el => el.classList.contains('ag-cell-inline-editing'));
      await p.keyboard.type('99999'); await p.keyboard.press('Tab'); await wait(250);
      await p.keyboard.type('999999'); await p.keyboard.press('Tab'); await wait(250);
      await p.keyboard.type('12.5'); await p.keyboard.press('Tab'); await wait(250); await p.keyboard.press('Tab'); await wait(250); await p.keyboard.press('Tab'); await wait(250);
      await p.keyboard.type('E22-2시험'); await p.keyboard.press('Enter'); await wait(400);
      out.tax_saveLabel = (await h.btn(pane, /저\s*장/).innerText()).replace(/\s/g, '');
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.tax_msgSaved = await h.msgs(); await wait(2800);
      out.tax_otherRowsAfterSave = await h.rows(other);
      out.tax_otherAdded = (await h.rows(other)) - before;
      // 삭제: 선택 없이 → 안내, 시험 행 선택 → 확인창 아니오 → 예
      await h.btn(pane, /^\s*삭\s*제\s*$/, 1).click(); await wait(500);
      out.tax_otherMsgNoSel = await h.msgs(); await wait(2800);
      await bottom(other);
      const testRow = other.locator('.ag-row[row-index]').filter({ hasText: 'E22-2시험' }).first();   // 비고 열은 가로 가상화로 안 그려질 수 있어 초과 금액으로 찾는다
      await jsClick(testRow.locator('[col-id="note"]').first()); await wait(300);
      await h.btn(pane, /^\s*삭\s*제\s*$/, 1).click(); await wait(500);
      out.tax_otherConfirm = await h.confirmText();
      await h.confirmNo();
      await h.btn(pane, /^\s*삭\s*제\s*$/, 1).click();
      await h.confirmYes();
      out.tax_otherMsgDeleted = await h.msgs(); await wait(2800);
      out.tax_otherRowsAfterDelete = await h.rows(other);

      // [E2] 엑셀업로드: 천만원 이하 표를 비우고 파일 선택창 → 업로드 → 3행
      const [chooser] = await Promise.all([
        p.waitForEvent('filechooser'),
        h.btn(pane, /엑셀업로드/).click(),
      ]);
      await chooser.setFiles(FILE); await wait(2500);
      out.tax_rowsAfterExcel = await sortedRows(gridsVisible().nth(1));
      await p.screenshot({ path: `${OUT}/E22-2-tax-excel.png` });
      // [E3] 금액 검색: 1015 → 두 번째 행(1010 이상 1020 미만)만
      const search = pane.locator('.ant-input-number input:visible').first();
      await search.fill('1015'); await search.press('Enter'); await wait(1500);
      out.tax_rowsSearch = await sortedRows(gridsVisible().nth(1));
      await search.fill(''); await search.press('Enter'); await wait(1500);
      out.tax_rowsSearchCleared = await h.rows(gridsVisible().nth(1));
      await h.btn(pane, /^\s*조\s*회\s*$/, 1).click(); await wait(1200);

      await deleteDate('tax', dateGrid);
    }

    // ===== 탭5 근로소득 공제표 =====
    {
      await tab('근로소득 공제표');
      const dateGrid = gridsVisible().nth(0);
      out.ded_buttons = await h.buttons(pane);
      out.ded_dateHeaders = await h.headers(dateGrid);
      out.ded_datesOpen = await sortedRows(dateGrid);
      out.ded_headers = await h.headers(gridsVisible().nth(1));
      out.ded_rowsOpen = await h.rows(gridsVisible().nth(1));
      const limit = pane.locator('.ant-input-number input:visible').first();
      out.ded_limitOpen = await limit.inputValue();
      out.ded_grid = await checkGrid(p, pane);
      out.ded_gridOk = gridOk(out.ded_grid);
      await p.screenshot({ path: `${OUT}/E22-2-deduct-open.png` });

      await createDate('ded');
      out.ded_datesAfterCreate = await sortedRows(dateGrid);
      if (!(out.ded_datesAfterCreate[0] || '').includes(TEST_DATE)) throw new Error('guard: 시험 적용일이 첫 행이 아님');
      out.ded_rowsAfterCreate = await h.rows(gridsVisible().nth(1));
      out.ded_limitAfterCreate = await limit.inputValue();

      // 공제한도만 바꿔 저장 → 다시 읽어도 유지
      out.ded_saveDisabledBefore = await h.saveDisabled(pane);
      await limit.fill('12345'); await limit.press('Tab'); await wait(300);
      out.ded_saveLabelLimit = (await h.btn(pane, /저\s*장/).innerText()).replace(/\s/g, '');
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.ded_limitAfterSave = await limit.inputValue();
      out.ded_msgSavedLimit = await h.msgs(); await wait(2800);

      // 공제표 행 추가
      const grid = gridsVisible().nth(1);
      const before = await h.rows(grid);
      await h.btn(pane, /^\s*등\s*록\s*$/, 1).click(); await wait(600);
      let target = null;
      const all = grid.locator('.ag-row[row-index]');
      for (let i = 0, n = await all.count(); i < n; i++) {
        const r = all.nth(i);
        if (!(await cell(r, 'fromAmt').innerText()).trim() && !(await cell(r, 'note').innerText()).trim()) { target = r; break; }
      }
      out.ded_foundNewRow = !!target;
      out.ded_firstEditing = await cell(target, 'fromAmt').evaluate(el => el.classList.contains('ag-cell-inline-editing'));
      await p.keyboard.type('777'); await p.keyboard.press('Tab'); await wait(250); await p.keyboard.press('Tab'); await wait(250); await p.keyboard.press('Tab'); await wait(250);
      await p.keyboard.type('3.5'); await p.keyboard.press('Tab'); await wait(250);
      await p.keyboard.type('E22-2시험'); await p.keyboard.press('Enter'); await wait(400);
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.ded_msgSaved = await h.msgs(); await wait(2800);
      out.ded_rowsAdded = (await h.rows(grid)) - before;
      out.ded_limitStill = await limit.inputValue();
      // 삭제
      await h.btn(pane, /^\s*삭\s*제\s*$/, 1).click(); await wait(500);
      out.ded_msgNoSel = await h.msgs(); await wait(2800);
      await bottom(grid);
      await grid.locator('.ag-row[row-index]').filter({ hasText: 'E22-2시험' }).first().locator('[col-id="note"]').first().evaluate(el => { for (const t of ['mousedown', 'mouseup', 'click']) el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window })); }); await wait(300);
      await h.btn(pane, /^\s*삭\s*제\s*$/, 1).click(); await wait(500);
      out.ded_confirm = await h.confirmText();
      await h.confirmNo();
      await h.btn(pane, /^\s*삭\s*제\s*$/, 1).click();
      await h.confirmYes();
      out.ded_rowsAfterDelete = await h.rows(grid);

      await deleteDate('ded', dateGrid);
    }

    // ===== 탭6 인적공제금액 =====
    {
      await tab('인적공제금액');
      const dateGrid = gridsVisible().nth(0);
      out.per_buttons = await h.buttons(pane);
      out.per_dateHeaders = await h.headers(dateGrid);
      out.per_datesOpen = await sortedRows(dateGrid);
      out.per_headers = await h.headers(gridsVisible().nth(1));
      out.per_rowsOpen = await h.rows(gridsVisible().nth(1));
      out.per_grid = await checkGrid(p, pane);
      out.per_gridOk = gridOk(out.per_grid);
      await p.screenshot({ path: `${OUT}/E22-2-person-open.png` });

      await createDate('per');
      out.per_datesAfterCreate = await sortedRows(dateGrid);
      if (!(out.per_datesAfterCreate[0] || '').includes(TEST_DATE)) throw new Error('guard: 시험 적용일이 첫 행이 아님');
      const grid = gridsVisible().nth(1);
      out.per_rowsAfterCreate = await h.rows(grid);

      const before = await h.rows(grid);
      await h.btn(pane, /^\s*등\s*록\s*$/, 1).click(); await wait(600);
      // 새 행은 목록 맨 아래(행 번호 = 기존 행 수) — 구분 칸은 편집기가 열려 있어 글자로는 못 찾는다
      const target = grid.locator(`.ag-row[row-index="${before}"]`);
      out.per_foundNewRow = (await target.count()) === 1;
      out.per_firstEditing = await cell(target, 'personDeductName').evaluate(el => el.classList.contains('ag-cell-inline-editing'));
      await pane.locator('.ag-picker-field-wrapper:visible').first().click(); await wait(300);
      out.per_picks = (await p.locator('.ag-popup .ag-list-item').allInnerTexts()).join('|');
      await p.locator('.ag-popup .ag-list-item').nth(2).click(); await wait(300);
      await p.keyboard.press('Tab'); await wait(250);
      await p.keyboard.type('1234567'); await p.keyboard.press('Tab'); await wait(250);
      await p.keyboard.type('E22-2시험'); await p.keyboard.press('Enter'); await wait(400);
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.per_msgSaved = await h.msgs(); await wait(2800);
      out.per_rowsAdded = (await h.rows(grid)) - before;
      out.per_testRow = (await h.rowsText(grid)).filter(t => t.includes('E22-2시험'));
      await p.screenshot({ path: `${OUT}/E22-2-person-saved.png` });
      await h.btn(pane, /^\s*삭\s*제\s*$/, 1).click(); await wait(500);
      out.per_msgNoSel = await h.msgs(); await wait(2800);
      await bottom(grid);
      await grid.locator('.ag-row[row-index]').filter({ hasText: 'E22-2시험' }).first().locator('[col-id="note"]').first().evaluate(el => { for (const t of ['mousedown', 'mouseup', 'click']) el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window })); }); await wait(300);
      await h.btn(pane, /^\s*삭\s*제\s*$/, 1).click(); await wait(500);
      out.per_confirm = await h.confirmText();
      await h.confirmNo();
      await h.btn(pane, /^\s*삭\s*제\s*$/, 1).click();
      await h.confirmYes();
      out.per_rowsAfterDelete = await h.rows(grid);

      await deleteDate('per', dateGrid);
    }
    out.writes = api.writes;
  } catch (e) {
    out.error = String(e);
    await p.screenshot({ path: `${OUT}/E22-2-error.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
