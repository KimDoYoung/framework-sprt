// E22-3 Pay20_Tab_DeductAdmin(급여기초정보관리 #1279) 3단계(탭 7~9: 과세표준 구간별 기본세율·근로소득 세액공제·기타설정) 화면 확인
// 시험 데이터: 세 표(네 테이블)의 적용일 2099-12-30 — 모두 이 스크립트가 만들고 지운다(적용일 삭제가 행을 함께 지운다).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E22-3.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
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
    // 새 행(목록 맨 아래, 행 번호 = 기존 행 수)에 값을 Tab으로 차례로 넣는다. 첫 편집 열의 편집기가 이미 열려 있다
    const fillNewRow = async (prefix, grid, before, firstCol, values) => {
      const target = grid.locator(`.ag-row[row-index="${before}"]`);
      out[`${prefix}_foundNewRow`] = (await target.count()) === 1;
      out[`${prefix}_firstEditing`] = await cell(target, firstCol).evaluate(el => el.classList.contains('ag-cell-inline-editing'));
      for (let i = 0; i < values.length; i++) {
        await p.keyboard.type(values[i]);
        if (i < values.length - 1) { await p.keyboard.press('Tab'); await wait(250); } else { await p.keyboard.press('Enter'); await wait(400); }
      }
    };
    // 삭제: 선택 없이 → 안내, 시험 행(첫 열 값으로 찾음) 선택 → 확인창 아니오 → 예
    const deleteTestRow = async (prefix, grid, delIdx, firstCol, marker) => {
      await h.btn(pane, /^\s*삭\s*제\s*$/, delIdx).click(); await wait(500);
      out[`${prefix}_msgNoSel`] = await h.msgs(); await wait(2800);
      await bottom(grid);
      const row = grid.locator('.ag-row[row-index]').filter({ hasText: marker }).first();
      out[`${prefix}_foundTestRow`] = (await row.count()) === 1;
      await jsClick(row.locator(`[col-id="${firstCol}"]`).first()); await wait(300);
      await h.btn(pane, /^\s*삭\s*제\s*$/, delIdx).click(); await wait(500);
      out[`${prefix}_confirm`] = await h.confirmText();
      await h.confirmNo();
      await h.btn(pane, /^\s*삭\s*제\s*$/, delIdx).click();
      await h.confirmYes();
      out[`${prefix}_msgDeleted`] = await h.msgs(); await wait(2800);
    };

    // ===== 탭7 과세표준 구간별 기본세율 =====
    {
      await tab('과세표준 구간별 기본세율');
      const dateGrid = gridsVisible().nth(0);
      out.calc_buttons = await h.buttons(pane);
      out.calc_dateHeaders = await h.headers(dateGrid);
      out.calc_datesOpen = await sortedRows(dateGrid);
      out.calc_gridCount = await gridsVisible().count();
      out.calc_headers = await h.headers(gridsVisible().nth(1));
      out.calc_rowsOpen = await h.rows(gridsVisible().nth(1));
      out.calc_grid = await checkGrid(p, pane);
      out.calc_gridOk = gridOk(out.calc_grid);
      await p.screenshot({ path: `${OUT}/E22-3-calc-open.png` });

      await createDate('calc');
      out.calc_datesAfterCreate = await sortedRows(dateGrid);
      if (!(out.calc_datesAfterCreate[0] || '').includes(TEST_DATE)) throw new Error('guard: 시험 적용일이 첫 행이 아님');
      const grid = gridsVisible().nth(1);
      out.calc_rowsAfterCreate = await h.rows(grid);   // 직전 적용일(2023-02-01) 8행 복사

      const before = await h.rows(grid);
      await h.btn(pane, /^\s*등\s*록\s*$/, 1).click(); await wait(600);
      await fillNewRow('calc', grid, before, 'fromAmt', ['987654321012', '987654321099', '1000', '12.5', 'E22-3시험']);
      out.calc_saveLabel = (await h.btn(pane, /저\s*장/).innerText()).replace(/\s/g, '');
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.calc_msgSaved = await h.msgs(); await wait(2800);
      out.calc_rowsAdded = (await h.rows(grid)) - before;
      out.calc_testRow = (await h.rowsText(grid)).filter(t => t.includes('987,654,321,012') || t.includes('987654321012'));
      await p.screenshot({ path: `${OUT}/E22-3-calc-saved.png` });
      await deleteTestRow('calc', grid, 1, 'fromAmt', /987,?654,?321,?012/);
      out.calc_rowsAfterDelete = await h.rows(grid);

      await deleteDate('calc', dateGrid);
    }

    // ===== 탭8 근로소득 세액공제 =====
    {
      await tab('근로소득 세액공제');
      const dateGrid = gridsVisible().nth(0);
      out.ded_buttons = await h.buttons(pane);
      out.ded_dateHeaders = await h.headers(dateGrid);
      out.ded_datesOpen = await sortedRows(dateGrid);
      out.ded_gridCount = await gridsVisible().count();
      out.ded_headers = await h.headers(gridsVisible().nth(1));
      out.ded_limitHeaders = await h.headers(gridsVisible().nth(2));
      out.ded_rowsOpen = await h.rows(gridsVisible().nth(1));
      out.ded_limitRowsOpen = await h.rows(gridsVisible().nth(2));
      out.ded_titles = (await pane.innerText()).includes('세액공제 한도');
      out.ded_grid = await checkGrid(p, pane);
      out.ded_gridOk = gridOk(out.ded_grid);
      await p.screenshot({ path: `${OUT}/E22-3-deduct-open.png` });

      await createDate('ded');
      out.ded_datesAfterCreate = await sortedRows(dateGrid);
      if (!(out.ded_datesAfterCreate[0] || '').includes(TEST_DATE)) throw new Error('guard: 시험 적용일이 첫 행이 아님');
      const grid = gridsVisible().nth(1);
      const limit = gridsVisible().nth(2);
      out.ded_rowsAfterCreate = await h.rows(grid);          // 2
      out.ded_limitRowsAfterCreate = await h.rows(limit);    // 4

      // 세액공제 표: 등록(두 번째 등록 = 세액공제, 세 번째 = 한도)
      const before = await h.rows(grid);
      await h.btn(pane, /^\s*등\s*록\s*$/, 1).click(); await wait(600);
      await fillNewRow('ded', grid, before, 'fromAmt', ['987654321012', '987654321099', '777', '3.5', 'E22-3시험']);
      await h.btn(pane, /저\s*장/, 0).click(); await wait(1800);
      out.ded_msgSaved = await h.msgs(); await wait(2800);
      out.ded_rowsAdded = (await h.rows(grid)) - before;
      await deleteTestRow('ded', grid, 1, 'fromAmt', /987,?654,?321,?012/);
      out.ded_rowsAfterDelete = await h.rows(grid);

      // 한도 표
      const lBefore = await h.rows(limit);
      await h.btn(pane, /^\s*등\s*록\s*$/, 2).click(); await wait(600);
      await fillNewRow('lim', limit, lBefore, 'fromAmt', ['987654321012', '987654321099', '11', '22', '4.5', 'E22-3시험']);
      out.lim_saveLabel = (await h.btn(pane, /저\s*장/, 1).innerText()).replace(/\s/g, '');
      await h.btn(pane, /저\s*장/, 1).click(); await wait(1800);
      out.lim_msgSaved = await h.msgs(); await wait(2800);
      out.lim_rowsAdded = (await h.rows(limit)) - lBefore;
      out.lim_testRow = (await h.rowsText(limit)).filter(t => t.includes('987,654,321,012') || t.includes('987654321012'));
      await p.screenshot({ path: `${OUT}/E22-3-deduct-saved.png` });
      await deleteTestRow('lim', limit, 2, 'fromAmt', /987,?654,?321,?012/);
      out.lim_rowsAfterDelete = await h.rows(limit);

      await deleteDate('ded', dateGrid);
    }

    // ===== 탭9 기타설정 =====
    {
      await tab('기타설정');
      const dateGrid = gridsVisible().nth(0);
      out.oth_buttons = await h.buttons(pane);
      out.oth_dateHeaders = await h.headers(dateGrid);
      out.oth_datesOpen = await sortedRows(dateGrid);
      out.oth_headers = await h.headers(gridsVisible().nth(1));
      out.oth_rowsOpen = await h.rows(gridsVisible().nth(1));
      out.oth_note = (await pane.innerText()).includes('국민연금 상ㆍ하한액 적용예시');
      out.oth_grid = await checkGrid(p, pane);
      out.oth_gridOk = gridOk(out.oth_grid);
      await p.screenshot({ path: `${OUT}/E22-3-other-open.png` });

      await createDate('oth');
      out.oth_datesAfterCreate = await sortedRows(dateGrid);
      if (!(out.oth_datesAfterCreate[0] || '').includes(TEST_DATE)) throw new Error('guard: 시험 적용일이 첫 행이 아님');
      const grid = gridsVisible().nth(1);
      out.oth_rowsAfterCreate = await h.rows(grid);   // 1

      const before = await h.rows(grid);
      await h.btn(pane, /^\s*등\s*록\s*$/, 1).click(); await wait(600);
      await fillNewRow('oth', grid, before, 'hiMaxDiv', ['77', '78', '1000', '500', '2000', '600', '7654321', 'E22-3시험']);
      await h.btn(pane, /저\s*장/).click(); await wait(1800);
      out.oth_msgSaved = await h.msgs(); await wait(2800);
      out.oth_rowsAdded = (await h.rows(grid)) - before;
      out.oth_testRow = (await h.rowsText(grid)).filter(t => t.includes('7,654,321') || t.includes('7654321'));
      await p.screenshot({ path: `${OUT}/E22-3-other-saved.png` });
      await deleteTestRow('oth', grid, 1, 'stdTaxDeduct', /7,?654,?321/);
      out.oth_rowsAfterDelete = await h.rows(grid);

      await deleteDate('oth', dateGrid);
    }
    out.writes = api.writes;
  } catch (e) {
    out.error = String(e);
    await p.screenshot({ path: `${OUT}/E22-3-error.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
