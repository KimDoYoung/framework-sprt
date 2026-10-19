// E28 Act10_Tab_ReprAccount(대표계정관리 #1156) + Act10_Lookup_ReprAccount(대표계정코드 조회창) 화면 확인
// 시험 행: 회사 0에 대표계정코드 "Z9"(대표계정명 "E28시험", 계정속성 자산 → 상대 대표계정 지정·해제) 1건을 만들고 → 수정 → 기초데이터생성으로 고객사(한국펀드서비스)에 복사 → 회사 0의 시험 행을 지운다.
// 복사된 고객사의 Z9 행은 화면에서 지울 수 없다(그 회사로 로그인해야 한다) → 끝난 뒤 `yunhee api -c kfstest DELETE`로 지운다(작업기록·결과확인에 적는다).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E28.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
const CODE = 'Z9', NAME = 'E28시험', CO = '한국펀드';
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['act/']);
  const scr = () => p.locator('.flexlayout__tab:visible').last();
  const need = (i, what) => { if (i < 0) throw new Error('행 못 찾음: ' + what); return i; };
  const cell = (grid, idx, col) => grid.locator(`.ag-row[row-index="${idx}"] [col-id="${col}"]`).first();
  const type = async (grid, idx, col, text) => {
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await h.wait(600);
  };
  const clear = async (grid, idx, col) => {
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); await p.keyboard.press('Enter'); await h.wait(600);
  };
  const pick = async (grid, idx, col, text) => {   // 콤보 셀: 더블클릭 → 목록에서 글자로 고르기
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.locator('.ag-picker-field-wrapper:visible').first().click(); await h.wait(300);
    await p.locator('.ag-popup .ag-list-item').filter({ hasText: new RegExp('^\\s*' + text + '\\s*$') }).first().click(); await h.wait(400);
  };
  // 조회 뒤 첫 행이 체크돼 있다 → 대상 행만 체크한다. 확인창이 "1건"이 아니면 h.confirmDeleteOne()이 아니오를 누르고 중단(기존 행 삭제 사고 방지, E24)
  const checkOnly = async (g, idx) => {
    for (const c of await g.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck();
    await g.locator(`.ag-row[row-index="${idx}"] .ag-checkbox-input`).first().check();
  };
  const retrieve = async () => { await h.btn(scr(), /^\s*조\s*회\s*$/).click(); await h.wait(1500); };
  // 시험 코드 Z9는 코드순 맨 끝이라 가상 스크롤로 DOM에 없다 → 검색어로 좁힌다
  const searchFor = async text => { await scr().locator('.ant-input:not([readonly])').first().fill(text); await retrieve(); };
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '대표계정관리');
    await h.wait(2000);
    const grid = scr().locator('.ag-root-wrapper').first();

    // [E0] 열 때 조회 → 첫 행 선택
    out.buttons = await h.buttons(scr());
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);
    out.firstRow = (await h.rowsText(grid))[0];
    out.firstChecked = await grid.locator('.ag-row[row-index="0"].ag-row-selected').count();
    out.toolbarH = await scr().locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));
    await p.screenshot({ path: `${OUT}/E28-open.png` });

    // 선택 없는 삭제·기초데이터생성 안내
    for (const c of await grid.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck();
    await h.btn(scr(), /삭\s*제/).click(); out.msgDeleteNone = await h.msgs(); await h.wait(2800);
    await h.btn(scr(), /기초데이터생성/).click(); out.msgInitNoCompany = await h.msgs(); await h.wait(2800);
    out.grid = await checkGrid(p, scr());
    out.gridOk = gridOk(out.grid);
    // 초기화 (UX-02): 값만 되돌린다
    const search = scr().locator('.ant-input:not([readonly])').first();
    await search.fill('abc');
    out.resetBtn = await h.btn(scr(), /초\s*기\s*화/).count();
    await h.btn(scr(), /초\s*기\s*화/).click(); await h.wait(400);
    out.searchAfterReset = await search.inputValue();
    await retrieve();

    // [E4] 등록 → 필수 안내 3종 → 저장
    await h.btn(scr(), /^\s*등\s*록\s*$/).click(); await h.wait(600);
    await p.keyboard.press('Escape'); await h.wait(300);   // 새 행의 첫 칸 편집기가 열려 있다
    const ni = need(await h.findRowIdx(grid, { reprAccountCode: '', reprAccountName: '' }), '새 행');
    out.saveDisabledNoChange = await h.saveDisabled(scr());   // 변경이 없으면 저장(0)이 비활성 — 눌러 보지 않는다(30초 대기)
    await type(grid, ni, 'reprAccountCode', CODE);
    await h.btn(scr(), /저\s*장/).click(); out.msgNoName = await h.msgs(); await h.wait(2800);
    await type(grid, ni, 'reprAccountName', NAME);
    await h.btn(scr(), /저\s*장/).click(); out.msgNoAttr = await h.msgs(); await h.wait(2800);
    await pick(grid, ni, 'attributeName', '자산');
    out.saveLabel = (await h.btn(scr(), /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgSaved = await h.msgs(); await h.wait(2800);
    await searchFor(CODE);
    const ti = need(await h.findRowIdx(grid, { reprAccountCode: CODE, reprAccountName: NAME }), '시험 행');
    out.savedRow = (await h.rowsText(grid))[ti];

    // [E10] 상대 대표계정: 글자로 찾기(1300 → 청약금계정) → 지우기 → 없는 글자(조회창이 그 글자로 열림) → [E9] 돋보기로 조회창
    await type(grid, ti, 'tgtReprAccountName', '1300');
    out.tgtByText = (await h.rowsText(grid))[ti];
    await clear(grid, ti, 'tgtReprAccountName');
    out.tgtCleared = (await h.rowsText(grid))[ti];
    await type(grid, ti, 'tgtReprAccountName', 'ZZZZ');
    const lk = h.modal('대표계정코드'); await lk.waitFor(); await h.wait(1500);
    out.lookupSearchPrefilled = await lk.locator('input.ant-input').first().inputValue();
    out.lookupRowsNoMatch = await h.rows(lk.locator('.ag-root-wrapper').first());
    await h.btn(lk, /취\s*소/).click(); await h.wait(500);
    out.lookupClosed = (await lk.count()) === 0;
    await cell(grid, ti, 'tgtReprAccountName').locator('button').click();
    const lk2 = h.modal('대표계정코드'); await lk2.waitFor(); await h.wait(1500);
    out.lookupButtons = await h.buttons(lk2);
    out.lookupHeaders = await h.headers(lk2.locator('.ag-root-wrapper').first());
    out.lookupRows = await h.rows(lk2.locator('.ag-root-wrapper').first());
    out.lookupToolbarH = await lk2.locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));
    await p.screenshot({ path: `${OUT}/E28-lookup.png` });
    await h.btn(lk2, /확\s*인/).click(); out.msgLookupNone = await h.msgs(); await h.wait(2800);
    await lk2.locator('.ag-row[row-index="2"]').dblclick(); await h.wait(800);   // 더블클릭 = 확인
    out.lookupClosed2 = (await lk2.count()) === 0;
    out.tgtByLookup = (await h.rowsText(grid))[ti];
    // 비고 수정 → 저장(n) → 저장
    await type(grid, ti, 'note', NAME + '비고');
    out.saveLabel2 = (await h.btn(scr(), /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgUpdated = await h.msgs(); await h.wait(2800);
    await retrieve();
    out.updatedRow = (await h.rowsText(grid))[need(await h.findRowIdx(grid, { reprAccountCode: CODE, reprAccountName: NAME }), '수정된 시험 행')];

    // [E2][E7] 기초데이터생성: Z9만 체크 → 고객사 다중 선택창 → 칸 "한국펀드서비스(주)" → 복사
    const ci = need(await h.findRowIdx(grid, { reprAccountCode: CODE }), '복사할 행');
    await checkOnly(grid, ci);
    await scr().locator('input.ant-input[readonly]').first().click();
    const mm = h.modal('고객사 찾기'); await mm.waitFor(); await h.wait(1200);
    out.coMultiButtons = await h.buttons(mm);
    await mm.locator('input').first().fill(CO); await p.keyboard.press('Enter'); await h.wait(1200);
    await mm.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(mm, /확\s*인/).click(); await h.wait(600);
    out.companyField = await scr().locator('input.ant-input[readonly]').first().inputValue();
    await h.btn(scr(), /기초데이터생성/).click(); out.msgInit = await h.msgs(); await h.wait(2800);

    // ── 시험 행 삭제: 확인 아니오 → 예
    const di = need(await h.findRowIdx(grid, { reprAccountCode: CODE }), '삭제할 시험 행');
    await checkOnly(grid, di);
    await h.btn(scr(), /삭\s*제/).click();
    out.confirm = await h.confirmDeleteOne();
    await h.confirmNo(); out.rowsAfterNo = await h.rows(grid);
    await h.btn(scr(), /삭\s*제/).click(); await h.confirmYes();
    out.msgDeleted = await h.msgs(); await h.wait(2800);
    out.rowsAfterDelete = await h.rows(grid);
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E28-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.cleanup = "yunhee sql \"select act10_repr_account_id, act10_company_id from act10_repr_account where act10_repr_account_cd='Z9'\" → yunhee api DELETE /api/v1/act/repr-accounts [-c kfstest] -b '[<ID>]'";
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
