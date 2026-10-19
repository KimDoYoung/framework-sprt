// E27 Act01_Tab_AccountCode(계정코드 관리 #1114) + Act01_Edit_AccountCode·Act01_Lookup_Parent·Act01_Lookup_PrintYn·Act01_Lookup_CopyAdmin 화면 확인
// 시험 행: 계정코드 ZZ9E27(회사 0)과 이익제공 연결정보 2건을 만들고 → 수정 → 출력설정 창에서 고치고 → 연결정보·계정을 지운다.
// 행은 h.findRowIdx(DOM row-index + 셀 글자)로 찾는다. 기존 계정(회사 0의 907개)은 건드리지 않는다.
// [출력정보 및 사용여부 설정]은 고객사(회사 ID ≠ 0) 화면에만 나온다. 계정과목 관리 메뉴(#1250)가 열린 고객사 계정이 없어(kfstest는 권한 없음)
// 파트 B는 /api/auth/me 응답의 companyId만 바꿔 고객사 모드로 연다 — 서버는 admin 회사로 처리한다(결과확인에 적는다).
// 계정과목복사 실행은 화면에서 하지 않는다(다른 회사 데이터를 쓰므로 DB 롤백 테스트 ActAccountCodeDbTest로 확인).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E27.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
const CODE = 'ZZ9E27', NAME = 'E27시험';
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['act/']);
  const scr = () => p.locator('.flexlayout__tab:visible').last();
  const need = (i, what) => { if (i < 0) throw new Error('행 못 찾음: ' + what); return i; };
  // 편집창 필드: 라벨 글자 뒤 칸
  const field = (mod, label) => mod.locator(`xpath=.//span[contains(@class,'ant-typography') and normalize-space(.)='${label}']/following-sibling::div[1]`);
  const pickFirst = async (box, text) => {   // antd Select: 열고 (글자가 있으면 그 항목, 없으면 첫 항목) 고르기
    await box.locator('.ant-select').first().click(); await h.wait(500);
    const opt = p.locator('.ant-select-dropdown:visible .ant-select-item-option');
    await (text ? opt.filter({ hasText: text }).first() : opt.first()).click(); await h.wait(400);
  };
  const search = async (text) => {
    const input = scr().locator('input[placeholder="계정코드/계정과목/계정영문명"]');
    await input.fill(text);
    await h.btn(scr(), /^\s*조\s*회\s*$/).click(); await h.wait(1800);
  };
  const openByMenu = async () => { await openMenu(p, '기초자료', '계정코드 관리'); await h.wait(2000); };
  try {
    await login(p, COMPANY);
    await openByMenu();
    const grid = scr().locator('.ag-root-wrapper').first();

    // ── 파트 A: 관리자 회사 화면 ──────────────────────────────────────
    // [E0] 열 때 자동 조회 없음
    out.buttons = await h.buttons(scr());
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);
    out.toolbarH = await scr().locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));
    await p.screenshot({ path: `${OUT}/E27-open.png` });

    // [E4] 선택 없는 삭제 안내
    await h.btn(scr(), /삭\s*제/).click();
    out.msgDeleteNone = await h.msgs(); await h.wait(2800);

    // [E2] 조회 → 첫 행 선택
    await h.btn(scr(), /^\s*조\s*회\s*$/).click(); await h.wait(2500);
    out.rowsAfterRetrieve = await h.rows(grid);
    out.firstRow = (await h.rowsText(grid))[0];
    out.firstSelected = await grid.locator('.ag-row[row-index="0"].ag-row-selected').count();
    out.grid = await checkGrid(p, scr());
    out.gridOk = gridOk(out.grid);
    // 초기화 (UX-02): 값만 되돌리고 조회는 하지 않는다
    await scr().locator('input[placeholder="계정코드/계정과목/계정영문명"]').fill('abc');
    const resetBtn = h.btn(scr(), /초\s*기\s*화/);
    out.resetBtn = await resetBtn.count();
    await resetBtn.click(); await h.wait(500);
    out.searchAfterReset = await scr().locator('input[placeholder="계정코드/계정과목/계정영문명"]').inputValue();

    // [E3] 생성 → 필수 검사 4종
    await h.btn(scr(), /생\s*성/).click();
    const mod = h.modal('계정코드'); await mod.waitFor(); await h.wait(1000);
    out.editButtons = await h.buttons(mod);
    out.editRowsOpen = await h.rows(mod.locator('.ag-root-wrapper').first());
    await p.screenshot({ path: `${OUT}/E27-edit-new.png` });
    await h.btn(mod, /저\s*장/).click(); out.msgNoCode = await h.msgs(); await h.wait(2800);
    await field(mod, '계정코드').locator('input').fill(CODE);
    await h.btn(mod, /저\s*장/).click(); out.msgNoName = await h.msgs(); await h.wait(2800);
    await field(mod, '계정과목').locator('input').fill(NAME);
    await h.btn(mod, /저\s*장/).click(); out.msgNoAttr = await h.msgs(); await h.wait(2800);
    await pickFirst(field(mod, '계정속성'));
    await h.btn(mod, /저\s*장/).click(); out.msgNoDrcr = await h.msgs(); await h.wait(2800);
    await pickFirst(field(mod, '차대구분'));
    await field(mod, '정렬코드').locator('input').fill('ZZ9');
    await field(mod, '계정과목(출력용)').locator('input').fill(NAME + '2');
    await field(mod, '출력여부').locator('input[type=checkbox]').check();
    await field(mod, '사용여부').locator('input[type=checkbox]').check();

    // [E5] 상위계정 조회창
    await field(mod, '상위계정').locator('input').click();
    const par = h.modal('상위계정'); await par.waitFor(); await h.wait(1800);
    out.parentButtons = await h.buttons(par);
    out.parentHeaders = await h.headers(par.locator('.ag-root-wrapper').first());
    out.parentRows = await h.rows(par.locator('.ag-root-wrapper').first());
    out.parentToolbarH = await par.locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));
    await p.screenshot({ path: `${OUT}/E27-parent.png` });
    await h.btn(par, /확\s*인/).click(); await h.wait(500);   // 선택 없이 확인 → 아무 것도 안 한다
    out.parentOpenAfterEmptyOk = (await par.count()) > 0;
    await par.locator('.ag-row[row-index="1"]').dblclick(); await h.wait(800);   // 더블클릭 = 확인
    out.parentClosed = (await par.count()) === 0;
    out.parentValue = await field(mod, '상위계정').locator('input').inputValue();

    // [E7] 이익제공(수령) 연결 2건 추가 (계정코드를 직접 넣었으므로 저장 전에도 추가된다), [E6] 목적 → 내용
    await h.btn(mod, /^\s*선\s*택\s*$/).click(); out.msgNoPurpose = await h.msgs(); await h.wait(2800);
    const prov = field(mod, '이익제공(수령)');
    await pickFirst(prov.locator('.ant-select').nth(0).locator('xpath=..'));   // 목적
    await h.btn(mod, /^\s*선\s*택\s*$/).click(); out.msgNoContent = await h.msgs(); await h.wait(2800);
    const contentBox = prov.locator('.ant-select').nth(1).locator('xpath=..');
    await pickFirst(contentBox);
    await h.btn(mod, /^\s*선\s*택\s*$/).click(); await h.wait(1500);
    await pickFirst(contentBox);   // 다른 내용
    await prov.locator('.ant-select').nth(1).click(); await h.wait(400);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').nth(1).click(); await h.wait(300);
    await h.btn(mod, /^\s*선\s*택\s*$/).click(); await h.wait(1500);
    const lg = mod.locator('.ag-root-wrapper').first();
    out.linkRows = await h.rowsText(lg);
    // ▲▼: 둘째 행을 위로
    // 행번호 열로 비교한다(DOM 순서는 애니메이션 중 바뀐다)
    const named = rows => Object.fromEntries(rows.map(t => [t.match(/^\d+/)[0], t.replace(/^\d+\s/, '').replace(/[▲▼\s]+$/g, '')]));
    const before = named(await h.rowsText(lg));
    await lg.locator('.ag-row[row-index="1"] [col-id="up"] button').click(); await h.wait(1200);
    const after = named(await h.rowsText(lg));
    out.linkMoved = after['1'] === before['2'] && after['2'] === before['1'] ? 'moved' : { before, after };
    await p.screenshot({ path: `${OUT}/E27-edit-links.png` });

    // 연결 삭제: 선택 없음 안내 → 한 건 체크 → 아니오 → 예
    for (const c of await lg.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck();
    await h.btn(mod, /^\s*삭\s*제\s*$/).click(); out.msgLinkDeleteNone = await h.msgs(); await h.wait(2800);
    await lg.locator('.ag-row[row-index="1"] .ag-checkbox-input').first().check();
    await h.btn(mod, /^\s*삭\s*제\s*$/).click(); out.linkConfirm = await h.confirmText();
    await h.confirmNo(); out.linkRowsAfterNo = await h.rows(lg);
    await h.btn(mod, /^\s*삭\s*제\s*$/).click(); await h.confirmYes();
    out.linkRowsAfterDelete = await h.rows(lg);

    // 저장 → 창이 닫히고 목록을 다시 읽는다
    await h.btn(mod, /저\s*장/).click(); await h.wait(2500);
    out.editClosedAfterSave = (await mod.count()) === 0;
    await search(CODE);
    const ti = need(await h.findRowIdx(grid, { accountCode: CODE }), '시험 계정');
    out.savedRow = (await h.rowsText(grid))[0];

    // 수정 아이콘 → 같은 값으로 열림, 이름 수정 → 저장
    await grid.locator(`.ag-row[row-index="${ti}"] [col-id="actionCell"] button`).click();
    const mod2 = h.modal('계정코드'); await mod2.waitFor(); await h.wait(1500);
    out.editValues = { code: await field(mod2, '계정코드').locator('input').inputValue(), name: await field(mod2, '계정과목').locator('input').inputValue(), parent: await field(mod2, '상위계정').locator('input').inputValue() };
    out.editLinkRows = await h.rows(mod2.locator('.ag-root-wrapper').first());
    // 남은 연결정보는 계정을 지워도 남는다(원본 동작) → 수정 창에서 지운다
    const lg2 = mod2.locator('.ag-root-wrapper').first();
    for (const c of await lg2.locator('.ag-row .ag-checkbox-input').all()) await c.check();
    await h.btn(mod2, /^\s*삭\s*제\s*$/).click(); await h.confirmYes();
    out.editLinkRowsAfterDelete = await h.rows(lg2);
    await field(mod2, '계정과목').locator('input').fill(NAME + '수정');
    await h.btn(mod2, /저\s*장/).click(); await h.wait(2500);
    await search(CODE);
    out.updatedRow = (await h.rowsText(grid))[0];

    // ── 파트 B: 고객사 모드 [출력정보 및 사용여부 설정] (me 응답의 companyId만 28000으로) ──
    await p.route('**/api/auth/me', async route => {
      const res = await route.fetch(); const body = await res.json();
      const fix = o => { if (o && typeof o === 'object') { for (const k of Object.keys(o)) { if (k === 'companyId') o[k] = 28000; else fix(o[k]); } } };
      fix(body.data); await route.fulfill({ response: res, json: body });
    });
    await p.reload({ waitUntil: 'networkidle' }); await h.wait(2500);
    await openByMenu();
    out.custButtons = await h.buttons(scr());
    await search(CODE);
    await h.btn(scr(), /출력정보/).click();
    const pm = h.modal('출력정보 및 사용여부 변경'); await pm.waitFor(); await h.wait(2000);
    const pg = pm.locator('.ag-root-wrapper').first();
    out.printButtons = await h.buttons(pm);
    out.printHeaders = await h.headers(pg);
    out.printSearch = await pm.locator('input[placeholder="계정코드/계정과목"]').inputValue();   // 메인의 검색어를 이어받는다
    out.printRows = await h.rowsText(pg);
    out.printToolbarH = await pm.locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));
    await p.screenshot({ path: `${OUT}/E27-print.png` });
    out.printSaveDisabled = await h.saveDisabled(pm);
    const pi = need(await h.findRowIdx(pg, { accountCode: CODE }), '출력설정 시험 행');
    out.printGrid = await checkGrid(p, pm);
    await pg.locator(`.ag-row[row-index="${pi}"] [col-id="accountName2"]`).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(NAME + '출력'); await p.keyboard.press('Enter'); await h.wait(400);
    out.printSaveLabel = (await h.btn(pm, /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(pm, /저\s*장/).click(); out.msgPrintSaved = await h.msgs(); await h.wait(2800);
    await h.btn(pm, /조건\s*초기화/).click(); await h.wait(400);
    out.printSearchAfterInit = await pm.locator('input[placeholder="계정코드/계정과목"]').inputValue();
    await h.btn(pm, /닫\s*기/).click(); await h.wait(500);
    out.printClosed = (await pm.count()) === 0;
    await p.unroute('**/api/auth/me');

    // ── 파트 C: 관리자 화면 복귀 → 계정과목복사 창 (실행하지 않음) ──
    await p.reload({ waitUntil: 'networkidle' }); await h.wait(2500);
    await openByMenu();
    out.adminButtons = await h.buttons(scr());
    await h.btn(scr(), /계정과목복사/).click();
    const cm = h.modal('고객사별 계정과목 반영'); await cm.waitFor(); await h.wait(2500);
    out.copyButtons = await h.buttons(cm);
    out.copyStd = await cm.locator('input[readonly]').first().inputValue();
    const grids = cm.locator('.ag-root-wrapper');
    out.copyTreeHeaders = await h.headers(grids.nth(0));
    out.copyTreeRowsTop = (await h.rowsText(grids.nth(0))).slice(0, 3);
    out.copyCompanyHeaders = await h.headers(grids.nth(1));
    out.copyCompanyRows = await h.rows(grids.nth(1));
    await p.screenshot({ path: `${OUT}/E27-copy.png` });
    await h.btn(cm, /계정과목복사/).click(); out.copyMsgNoAccount = await h.msgs(); await h.wait(2800);
    // 찾기: 시험 계정 이름 → 펼쳐지고 선택 (사용 계정만 트리에 나온다 — 시험 계정은 상위가 있고 사용=true)
    const tr = grids.nth(0);
    await cm.locator('input.ant-input:not([readonly])').first().fill('배당금수익');
    await h.btn(cm, /^\s*찾\s*기\s*$/).click(); await h.wait(1200);
    out.copyFound = { rows: await h.rows(tr), selected: await tr.locator('.ag-row-selected').count() };
    await h.btn(cm, /계정과목복사/).click(); out.copyMsgNoCompany = await h.msgs(); await h.wait(2800);
    await h.btn(cm, /닫\s*기/).click(); await h.wait(500);
    out.copyClosed = (await cm.count()) === 0;

    // ── 시험 계정 삭제: 선택 → 아니오 → 예 ──
    await search(CODE);
    const di = need(await h.findRowIdx(grid, { accountCode: CODE }), '삭제할 시험 계정');
    await grid.locator(`.ag-row[row-index="${di}"] .ag-checkbox-input`).first().check();
    await h.btn(scr(), /삭\s*제/).click();
    out.confirm = await h.confirmText();
    await h.confirmNo(); out.rowsAfterNo = await h.rows(grid);
    await h.btn(scr(), /삭\s*제/).click(); await h.confirmYes();
    out.rowsAfterDelete = await h.rows(grid);
    out.writes = api.writes;
    // 엑셀: 받기 (파일명)
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), h.btn(scr(), /엑셀다운로드/).click()]);
    out.excelName = dl.suggestedFilename();
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E27-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.cleanup = "yunhee sql \"select act01_account_code_id from act01_account_code where act01_account_cd='ZZ9E27'\" / \"select act14_link_id from act14_link where act14_account_cd='ZZ9E27'\" → yunhee api DELETE act/links|act/account-codes -b '[<ID>]'";
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
