// E30 Act11_Tab_TrJournalMap(거래유형별 분개맵핑 #1168) + Act11_Grid_TrJournalMap + Ast05_Lookup_TrCode(거래유형 조회창, view) 화면 확인
// 시험 행: 회사 0에 거래맵핑(거래코드 1001, 분개그룹 "Z99999") 1건과 그 분개맵핑 1건을 만들고 → 수정 → 기초데이터생성으로 고객사(한국펀드서비스)에 복사 → 회사 0의 시험 행을 지운다.
// 복사된 고객사의 Z99999 행은 화면에서 지울 수 없다(그 회사로 로그인해야 한다) → 끝난 뒤 `yunhee api -c kfstest DELETE`로 지운다(작업기록·결과확인에 적는다).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E30.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
const GROUP = 'Z99999', CO = '한국펀드';
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  p.setDefaultTimeout(10000);
  const out = { errs };
  const api = h.trackApi(['act/', 'ast/']);
  const scr = () => p.locator('.flexlayout__tab:visible').last();
  const gridMain = () => scr().locator('.ag-root-wrapper').nth(0);
  const gridJnl = () => scr().locator('.ag-root-wrapper').nth(1);
  const need = (i, what) => { if (i < 0) throw new Error('행 못 찾음: ' + what); return i; };
  const cell = (grid, idx, col) => grid.locator(`.ag-row[row-index="${idx}"] [col-id="${col}"]`).first();
  const rowAt = (grid, idx) => grid.locator(`.ag-row[row-index="${idx}"]`).first().innerText().then(t => t.replace(/\s+/g, ' '));
  // 값이 빈 조회창 트리거 셀은 가운데에 돋보기 버튼만 있어 더블클릭이 버튼을 누른다 → 셀 오른쪽 끝을 더블클릭해 편집기를 연다
  const typeAt = async (grid, idx, col, text) => {
    await cell(grid, idx, col).dblclick({ position: { x: 105, y: 12 } }); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await h.wait(900);
  };
  const type = async (grid, idx, col, text) => {
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await h.wait(900);
  };
  const clear = async (grid, idx, col) => {
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); await p.keyboard.press('Enter'); await h.wait(900);
  };
  const pick = async (grid, idx, col, nth) => {   // 콤보 셀: 더블클릭 → 목록에서 nth번째(0부터) 고르기
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.locator('.ag-picker-field-wrapper:visible').first().click(); await h.wait(300);
    out['opts_' + col] = (await p.locator('.ag-popup .ag-list-item').allInnerTexts()).map(t => t.trim()).join('|');
    await p.locator('.ag-popup .ag-list-item').nth(nth).click(); await h.wait(500);
  };
  const checkOnly = async (g, idx) => {
    for (const c of await g.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck();
    await g.locator(`.ag-row[row-index="${idx}"] .ag-checkbox-input`).first().check();
  };
  const uncheckAll = async g => { for (const c of await g.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck(); };
  const retrieve = async () => { await h.btn(scr(), /^\s*조\s*회\s*$/).click(); await h.wait(1800); };
  const searchGroup = async text => { await scr().locator('.ant-input:not([readonly])').nth(1).fill(text); await retrieve(); };
  const btnMain = re => h.btn(scr(), re, 0);
  const btnJnl = re => h.btn(scr(), re, 1);
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '거래유형별 분개맵핑');
    await h.wait(2500);

    // [E0] 열 때 조회 → 첫 행 선택 → 아래 분개맵핑 읽기
    out.buttons = await h.buttons(scr());
    out.headersMain = await h.headers(gridMain());
    out.headersJnl = await h.headers(gridJnl());
    out.rowsMain = await h.rows(gridMain());
    out.firstMain = await rowAt(gridMain(), 0);
    out.firstSelected = await gridMain().locator('.ag-row[row-index="0"].ag-row-selected').count();
    out.rowsJnl = await h.rows(gridJnl());
    out.firstJnl = await rowAt(gridJnl(), 0);
    out.toolbarH = await scr().locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));
    out.halfHeights = [await gridMain().evaluate(el => Math.round(el.getBoundingClientRect().height)), await gridJnl().evaluate(el => Math.round(el.getBoundingClientRect().height))];
    await p.screenshot({ path: `${OUT}/E30-open.png` });

    // [E9] 위 그리드의 다른 행을 누르면 그 분개그룹을 아래에서 읽는다
    await cell(gridMain(), 1, 'trName').click(); await h.wait(1200);
    out.row1 = await rowAt(gridMain(), 1);
    out.rowsJnlAfterRow1 = await h.rows(gridJnl());

    // 선택 없는 삭제·기초데이터생성 안내
    await uncheckAll(gridMain());
    await btnMain(/삭\s*제/).click(); out.msgDeleteNoneMain = await h.msgs(); await h.wait(2800);
    await uncheckAll(gridJnl());
    await btnJnl(/삭\s*제/).click(); out.msgDeleteNoneJnl = await h.msgs(); await h.wait(2800);
    await btnMain(/기초데이터생성/).click(); out.msgInitNoCompany = await h.msgs(); await h.wait(2800);
    out.gridMain = await checkGrid(p, gridMain().locator('xpath=..'));
    out.gridMainOk = gridOk(out.gridMain);
    await h.wait(1500);   // 위 그리드를 눌러 아래가 다시 읽히는 것이 끝난 뒤(다시 읽으면 첫 행이 선택된다 → 체크를 풀고 점검)
    await uncheckAll(gridJnl());
    out.gridJnl = await checkGrid(p, gridJnl().locator('xpath=..'));
    out.gridJnlOk = gridOk(out.gridJnl);
    await retrieve();

    // [E4] 등록 → 거래코드 글자 입력(1001) → 거래유형 조회창이 그 글자로 열림
    await btnMain(/^\s*등\s*록\s*$/).click(); await h.wait(600);
    await p.keyboard.press('Escape'); await h.wait(300);
    const ni = need(await h.findRowIdx(gridMain(), { trCode: '', trName: '', journalGroup: '' }), '새 행');
    out.saveDisabledNoChange = await h.saveDisabled(scr());
    await typeAt(gridMain(), ni, 'trCode', '1001');
    const lk = h.modal('거래유형'); await lk.waitFor(); await h.wait(1500);
    out.lookupSearchPrefilled = await lk.locator('input.ant-input').first().inputValue();
    out.lookupButtons = await h.buttons(lk);
    out.lookupHeaders = await h.headers(lk.locator('.ag-root-wrapper').first());
    out.lookupRows = await h.rows(lk.locator('.ag-root-wrapper').first());
    out.lookupFirst = (await h.rowsText(lk.locator('.ag-root-wrapper').first()))[0];
    out.lookupToolbarH = await lk.locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));
    await p.screenshot({ path: `${OUT}/E30-lookup.png` });
    await h.btn(lk, /확\s*인/).click(); out.msgLookupNone = await h.msgs(); await h.wait(2800);
    // 수령/지급 콤보로 좁히기 → 다시 전체
    await lk.locator('.ag-row[row-index="0"]').dblclick(); await h.wait(800);   // 더블클릭 = 확인
    out.lookupClosed = (await lk.count()) === 0;
    out.newRowAfterPick = await rowAt(gridMain(), ni);

    // [E10] 돋보기로 조회창 → [전체]는 닫기만, 다시 열어 [닫기]
    await cell(gridMain(), ni, 'trCode').locator('button').click();
    const lk2 = h.modal('거래유형'); await lk2.waitFor(); await h.wait(1500);
    out.lookup2SearchEmpty = await lk2.locator('input.ant-input').first().inputValue();
    await h.btn(lk2, /^\s*전\s*체\s*$/).click(); await h.wait(600);
    out.allClosed = (await lk2.count()) === 0;
    out.rowAfterAll = await rowAt(gridMain(), ni);
    await cell(gridMain(), ni, 'trCode').locator('button').click();
    const lk3 = h.modal('거래유형'); await lk3.waitFor(); await h.wait(1200);
    // 수령/지급 콤보 필터
    await lk3.locator('.ant-select').first().click(); await h.wait(300);
    out.rcvPayOpts = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts()).join('|');
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').nth(1).click(); await h.wait(300);
    await h.btn(lk3, /^\s*조\s*회\s*$/).click(); await h.wait(1200);
    out.lookupRowsFiltered = await h.rows(lk3.locator('.ag-root-wrapper').first());
    await h.btn(lk3, /닫\s*기/).click(); await h.wait(500);
    out.closeClosed = (await lk3.count()) === 0;

    // 분개그룹·입출고구분·손익대표계정
    await type(gridMain(), ni, 'journalGroup', GROUP);
    await pick(gridMain(), ni, 'bookIoTypeName', 1);
    await typeAt(gridMain(), ni, 'plReprAccountName', '1300');   // [E14] 글자로 찾아 첫 행 반영
    out.plByText = await rowAt(gridMain(), ni);
    await clear(gridMain(), ni, 'plReprAccountName');          // 지우면 비운다
    out.plCleared = await rowAt(gridMain(), ni);
    await typeAt(gridMain(), ni, 'plReprAccountName', 'ZZZZ');   // 없는 글자 → 조회창이 그 글자로 열림
    const lp = h.modal('대표계정코드'); await lp.waitFor(); await h.wait(1500);
    out.plLookupPrefilled = await lp.locator('input.ant-input').first().inputValue();
    out.plLookupRows = await h.rows(lp.locator('.ag-root-wrapper').first());
    await h.btn(lp, /취\s*소/).click(); await h.wait(500);
    await cell(gridMain(), ni, 'plReprAccountName').locator('button').click();
    const lp2 = h.modal('대표계정코드'); await lp2.waitFor(); await h.wait(1500);
    await lp2.locator('.ag-row[row-index="2"]').dblclick(); await h.wait(800);
    out.plByLookup = await rowAt(gridMain(), ni);
    // 거래코드를 비우면 필수 안내
    await clear(gridMain(), ni, 'trCode');
    out.trCleared = await rowAt(gridMain(), ni);
    await btnMain(/저\s*장/).click(); out.msgNoTr = await h.msgs(); await h.wait(2800);
    await typeAt(gridMain(), ni, 'trCode', '1001');
    const lk4 = h.modal('거래유형'); await lk4.waitFor(); await h.wait(1200);
    await lk4.locator('.ag-row[row-index="0"]').dblclick(); await h.wait(800);
    out.saveLabel = (await btnMain(/저\s*장/).innerText()).replace(/\s/g, '');
    await btnMain(/저\s*장/).click(); await h.wait(1800);
    out.msgSaved = await h.msgs(); await h.wait(2800);
    await searchGroup(GROUP);
    const ti = need(await h.findRowIdx(gridMain(), { trCode: '1001', journalGroup: GROUP }), '시험 행');
    out.savedRow = await rowAt(gridMain(), ti);
    out.rowsJnlTest = await h.rows(gridJnl());

    // ── 분개맵핑(아래): 등록 → 필수 안내 4종 → 저장
    await btnJnl(/^\s*등\s*록\s*$/).click(); await h.wait(600);
    await p.keyboard.press('Escape'); await h.wait(300);
    const ji = need(await h.findRowIdx(gridJnl(), { journalGroup: GROUP, seq: '', reprAccountCode: '' }), '새 분개 행');
    out.newJnlRow = await rowAt(gridJnl(), ji);
    await type(gridJnl(), ji, 'note', 'E30시험');   // 새 행만으로는 변경이 아니라 저장(0)이 비활성 → 비고를 넣어 변경으로 만든다
    await btnJnl(/저\s*장/).click(); out.msgNoSeq = await h.msgs(); await h.wait(2800);
    await type(gridJnl(), ji, 'seq', '1');
    await btnJnl(/저\s*장/).click(); out.msgNoRepr = await h.msgs(); await h.wait(2800);
    await typeAt(gridJnl(), ji, 'reprAccountCode', '1300');   // [E5] 글자로 찾아 반영
    out.jnlReprByText = await rowAt(gridJnl(), ji);
    await btnJnl(/저\s*장/).click(); out.msgNoDrcr = await h.msgs(); await h.wait(2800);
    await pick(gridJnl(), ji, 'drcrTypeName', 0);
    await type(gridJnl(), ji, 'formula', 'amt');
    // 대표계정 조회창: 돋보기 → 취소, 없는 글자 → 그 글자로 열림
    await cell(gridJnl(), ji, 'reprAccountCode').locator('button').click();
    const lj = h.modal('대표계정코드'); await lj.waitFor(); await h.wait(1200);
    out.jnlLookupRows = await h.rows(lj.locator('.ag-root-wrapper').first());
    await h.btn(lj, /취\s*소/).click(); await h.wait(500);
    await typeAt(gridJnl(), ji, 'reprAccountCode', 'ZZZZ');
    const lj2 = h.modal('대표계정코드'); await lj2.waitFor(); await h.wait(1200);
    out.jnlLookupPrefilled = await lj2.locator('input.ant-input').first().inputValue();
    out.jnlLookupRowsNoMatch = await h.rows(lj2.locator('.ag-root-wrapper').first());
    await h.btn(lj2, /취\s*소/).click(); await h.wait(500);
    await cell(gridJnl(), ji, 'reprAccountCode').locator('button').click();
    const lj3 = h.modal('대표계정코드'); await lj3.waitFor(); await h.wait(1200);
    await lj3.locator('.ag-row[row-index="1"]').dblclick(); await h.wait(800);
    out.jnlReprByLookup = await rowAt(gridJnl(), ji);
    out.saveLabelJnl = (await btnJnl(/저\s*장/).innerText()).replace(/\s/g, '');
    await btnJnl(/저\s*장/).click(); await h.wait(1800);
    out.msgJnlSaved = await h.msgs(); await h.wait(2800);
    await cell(gridMain(), ti, 'trName').click(); await h.wait(1200);
    out.rowsJnlAfterSave = await h.rows(gridJnl());
    out.savedJnl = await rowAt(gridJnl(), 0);
    await p.screenshot({ path: `${OUT}/E30-saved.png` });

    // [E2][E7][E8] 기초데이터생성: 시험 행만 체크 → 고객사 다중 선택창 → 복사 (분개맵핑도 함께)
    await checkOnly(gridMain(), ti);
    await scr().locator('input.ant-input[readonly]').first().click();
    const mm = h.modal('고객사 찾기'); await mm.waitFor(); await h.wait(1200);
    await mm.locator('input').first().fill(CO); await p.keyboard.press('Enter'); await h.wait(1200);
    await mm.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(mm, /확\s*인/).click(); await h.wait(600);
    out.companyField = await scr().locator('input.ant-input[readonly]').first().inputValue();
    await btnMain(/기초데이터생성/).click(); out.msgInit = await h.msgs(); await h.wait(2800);

    // ── 시험 행 삭제: 분개맵핑 → 거래맵핑 (확인 아니오 → 예)
    const dj = need(await h.findRowIdx(gridJnl(), { journalGroup: GROUP }), '삭제할 시험 분개 행');
    await checkOnly(gridJnl(), dj);
    await btnJnl(/삭\s*제/).click();
    out.confirmJnl = await h.confirmDeleteOne();
    await h.confirmNo(); out.rowsJnlAfterNo = await h.rows(gridJnl());
    await btnJnl(/삭\s*제/).click(); await h.confirmYes();
    out.msgJnlDeleted = await h.msgs(); await h.wait(2800);
    out.rowsJnlAfterDelete = await h.rows(gridJnl());
    const dm = need(await h.findRowIdx(gridMain(), { trCode: '1001', journalGroup: GROUP }), '삭제할 시험 행');
    await checkOnly(gridMain(), dm);
    await btnMain(/삭\s*제/).click();
    out.confirmMain = await h.confirmDeleteOne();
    await h.confirmYes();
    out.msgDeleted = await h.msgs(); await h.wait(2800);
    out.rowsMainAfterDelete = await h.rows(gridMain());
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E30-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.cleanup = "yunhee sql \"select act11_tr_map_id, act11_company_id from act11_tr_map where act11_journal_group='Z99999'\" / \"select act12_journal_map_id, act12_company_id from act12_journal_map where act12_journal_group='Z99999'\" → yunhee api DELETE /api/v1/act/journal-maps · tr-maps [-c kfstest] -b '[<ID>]'";
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
