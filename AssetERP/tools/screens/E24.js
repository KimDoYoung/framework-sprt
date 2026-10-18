// E24 Crd10_Tab_ExcelCompanyAdmin(법인카드 업로드 기초자료(관리자) #1352) + Crd11_Lookup_ExcelCodeAdmin 화면 확인
// 시험 행: 카드사 "신한카드"(2000, 비고 "E24시험") 1건을 만들고, 맵핑 창에서 "매출취소금액"(위치 777) 1건을 만들어 고치고 지운 뒤 카드사 행도 지운다.
// 행은 h.findRowIdx(DOM row-index + 셀 글자)로 찾는다 — 기존 행(회사 0의 9개 카드사·맵핑)은 건드리지 않는다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E24.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
const BANK = '신한카드', NOTE = 'E24시험', CODE = '매출취소금액';
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['crd/']);
  const scr = () => p.locator('.flexlayout__tab:visible').last();
  const cell = (grid, idx, col) => grid.locator(`.ag-row[row-index="${idx}"] [col-id="${col}"]`).first();
  const type = async (grid, idx, col, text) => {
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await h.wait(400);
  };
  const pick = async (grid, idx, col, text) => {   // 콤보 셀: 더블클릭 → 목록에서 글자로 고르기
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.locator('.ag-picker-field-wrapper:visible').first().click(); await h.wait(300);
    await p.locator('.ag-popup .ag-list-item').filter({ hasText: new RegExp('^\\s*' + text + '\\s*$') }).first().click(); await h.wait(400);
  };
  // 조회 뒤 첫 행이 선택(체크)돼 있을 수 있다 → 지울 행만 체크한다. 확인창이 "1건"이 아니면 h.confirmDeleteOne()이 아니오를 누르고 중단(기존 행 삭제 사고 방지, E24)
  const checkOnly = async (g, idx) => {
    for (const c of await g.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck();
    await g.locator(`.ag-row[row-index="${idx}"] .ag-checkbox-input`).first().check();
  };
  const need = (i, what) => { if (i < 0) throw new Error('행 못 찾음: ' + what); return i; };
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '법인카드 업로드 기초자료(관리자)');
    await h.wait(2500);
    const grid = scr().locator('.ag-root-wrapper').first();

    // [E0] 열 때 조회
    out.buttons = await h.buttons(scr());
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);
    out.firstRow = (await h.rowsText(grid))[0];
    await p.screenshot({ path: `${OUT}/E24-open.png` });

    // 선택 없는 삭제 안내 (checkGrid 앞)
    await h.btn(scr(), /삭\s*제/).click();
    out.msgDeleteNone = await h.msgs(); await h.wait(2800);
    out.grid = await checkGrid(p, scr());
    out.gridOk = gridOk(out.grid);
    await h.btn(scr(), /^\s*조\s*회\s*$/).click(); await h.wait(1200);

    // [E2] 등록 → 카드사 없이 비고만 → 저장 → 필수 안내
    await h.btn(scr(), /^\s*등\s*록\s*$/).click(); await h.wait(600);
    await p.keyboard.press('Escape'); await h.wait(300);  // 새 행의 콤보 편집기가 열려 있다
    const ni = need(await h.findRowIdx(grid, { bankName: '', note: '' }), '새 행');
    await type(grid, ni, 'note', NOTE);
    await h.btn(scr(), /저\s*장/).click();
    out.msgRequired = await h.msgs(); await h.wait(2800);
    // 카드사 고르기(신한카드 — 이 회사에 아직 없음) → 저장
    await pick(grid, ni, 'bankName', BANK);
    out.saveLabel = (await h.btn(scr(), /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgSaved = await h.msgs(); await h.wait(2800);
    await h.btn(scr(), /^\s*조\s*회\s*$/).click(); await h.wait(1200);
    out.rowsAfterSave = await h.rows(grid);
    await p.screenshot({ path: `${OUT}/E24-saved.png` });

    // 중복 카드사: 새 행에 같은 카드사 → 저장 → 안내 (서버 호출 없음)
    await h.btn(scr(), /^\s*등\s*록\s*$/).click(); await h.wait(600);
    await p.keyboard.press('Escape'); await h.wait(300);  // 새 행의 콤보 편집기가 열려 있다
    const di = need(await h.findRowIdx(grid, { bankName: '', note: '' }), '중복 시험 새 행');
    await pick(grid, di, 'bankName', BANK);
    await h.btn(scr(), /저\s*장/).click();
    out.msgDup = await h.msgs(); await h.wait(2800);
    await h.btn(scr(), /^\s*조\s*회\s*$/).click(); await h.wait(1200);

    // 비고 수정 → 저장
    const ti = need(await h.findRowIdx(grid, { bankName: BANK, note: NOTE }), '시험 행');
    await type(grid, ti, 'note', NOTE + '2');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgUpdated = await h.msgs(); await h.wait(2800);
    await h.btn(scr(), /^\s*조\s*회\s*$/).click(); await h.wait(1200);

    // ── 맵핑 창 (Crd11)
    const mi = need(await h.findRowIdx(grid, { bankName: BANK, note: NOTE + '2' }), '시험 행(맵핑)');
    await cell(grid, mi, 'actionCell').locator('button, .anticon, svg, img, span').first().click().catch(() => cell(grid, mi, 'actionCell').click());
    const mod = h.modal(BANK + ' 매핑');
    await mod.waitFor(); await h.wait(1500);
    const mg = mod.locator('.ag-root-wrapper').first();
    out.mapButtons = await h.buttons(mod);
    out.mapHeaders = await h.headers(mg);
    out.mapRowsOpen = await h.rows(mg);
    await p.screenshot({ path: `${OUT}/E24-map-open.png` });
    await h.btn(mod, /삭\s*제/).click();
    out.mapMsgDeleteNone = await h.msgs(); await h.wait(2800);

    await h.btn(mod, /^\s*등\s*록\s*$/).click(); await h.wait(600);
    // 모달 안에서는 Esc가 창을 닫는다 → Esc 없이, 콤보 편집기가 열린 새 행을 위치 칸이 빈 행으로 찾는다
    const ci = need(await h.findRowIdx(mg, { seq: '' }), '맵핑 새 행');
    await type(mg, ci, 'seq', '777');
    await h.btn(mod, /저\s*장/).click();
    out.mapMsgNoCode = await h.msgs(); await h.wait(2800);
    await pick(mg, ci, 'bankExcelName', CODE);
    await h.btn(mod, /저\s*장/).click(); await h.wait(1800);
    out.mapMsgSaved = await h.msgs(); await h.wait(2800);
    await h.btn(mod, /^\s*조\s*회\s*$/).click(); await h.wait(1200);
    out.mapRowsAfterSave = await h.rows(mg);
    out.mapLast = (await h.rowsText(mg)).filter(r => /777/.test(r));

    const ui = need(await h.findRowIdx(mg, { bankExcelName: CODE, seq: '777' }), '맵핑 시험 행');
    await type(mg, ui, 'seq', '776');
    await h.btn(mod, /저\s*장/).click(); await h.wait(1800);
    out.mapMsgUpdated = await h.msgs(); await h.wait(2800);
    await h.btn(mod, /^\s*조\s*회\s*$/).click(); await h.wait(1200);

    const xi = need(await h.findRowIdx(mg, { bankExcelName: CODE, seq: '776' }), '맵핑 삭제 행');
    await checkOnly(mg, xi);
    await h.btn(mod, /삭\s*제/).click();
    out.mapConfirm = await h.confirmDeleteOne();
    await h.confirmNo();
    out.mapRowsAfterNo = await h.rows(mg);
    await h.btn(mod, /삭\s*제/).click();
    await h.confirmYes();
    out.mapMsgDeleted = await h.msgs(); await h.wait(2800);
    out.mapRowsAfterDelete = await h.rows(mg);
    await h.btn(mod, /닫\s*기/).click(); await h.wait(600);
    out.mapClosed = (await mod.count()) === 0;

    // ── 카드사 시험 행 삭제: 확인 아니오 → 예
    const ei = need(await h.findRowIdx(grid, { bankName: BANK, note: NOTE + '2' }), '카드사 삭제 행');
    await checkOnly(grid, ei);
    await h.btn(scr(), /삭\s*제/).click();
    out.confirm = await h.confirmDeleteOne();
    await h.confirmNo();
    out.rowsAfterNo = await h.rows(grid);
    await h.btn(scr(), /삭\s*제/).click();
    await h.confirmYes();
    out.msgDeleted = await h.msgs(); await h.wait(2800);
    out.rowsAfterDelete = await h.rows(grid);
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E24-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.cleanup = "yunhee sql \"select crd10_excel_company_id from crd10_excel_company where crd10_note like 'E24시험%'\" / \"select crd11_excel_code_id from crd11_excel_code where crd11_seq in (776,777)\" → yunhee api DELETE crd/excel-companies|excel-codes -b '[<ID>]'";
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
