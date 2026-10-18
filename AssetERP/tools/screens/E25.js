// E25 Emp55_Tab_benefitInfoManager(복리후생비 코드관리 #1373) + Act01_Lookup_AccountCode(계정코드 조회창) + Sys01_Lookup_Company(MULTI) 화면 확인
// 시험 행: 왼쪽(회사 0)에 복리후생비 코드 "ZZ9"(신청 A21 → A22, 계정은 조회창에서 "현금") 1건, 오른쪽(고객사 "한채투")에 "ZZ8" 1건,
// 기초데이터생성으로 ZZ9를 한채투에 복사한 1건 — 모두 그 세션 안에 지운다. 기존 행(회사 0의 6건·한채투 5건)은 건드리지 않는다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E25.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
const CO = '한채투';
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['emp/benefit-infos', 'act/']);
  const scr = () => p.locator('.flexlayout__tab:visible').last();
  const L = () => scr().locator('.ant-splitter-panel').nth(0);
  const R = () => scr().locator('.ant-splitter-panel').nth(1);
  const gridOf = panel => panel.locator('.ag-root-wrapper').first();
  const cell = (grid, idx, col) => grid.locator(`.ag-row[row-index="${idx}"] [col-id="${col}"]`).first();
  const type = async (grid, idx, col, text) => {
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await h.wait(400);
  };
  const uncheckAll = async g => { for (const c of await g.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck(); };
  // 조회 뒤 첫 행이 체크돼 있을 수 있다 → 지울 행만 체크한다. 확인창이 "1건"이 아니면 h.confirmDeleteOne()이 아니오를 누르고 중단(기존 행 삭제 사고 방지)
  const checkOnly = async (g, idx) => {
    await uncheckAll(g);
    await g.locator(`.ag-row[row-index="${idx}"] .ag-checkbox-input`).first().check();
  };
  const need = (i, what) => { if (i < 0) throw new Error('행 못 찾음: ' + what); return i; };
  const search = async (panel) => { await h.btn(panel, /^\s*조\s*회\s*$/).click(); await h.wait(1200); };
  const deleteRow = async (panel, g, cells, key) => {
    const i = need(await h.findRowIdx(g, cells), key);
    await checkOnly(g, i);
    await h.btn(panel, /삭\s*제/).click();
    out[key + 'Confirm'] = await h.confirmDeleteOne();
    await h.confirmNo();
    await h.btn(panel, /삭\s*제/).click();
    await h.confirmYes();
    out[key + 'Msg'] = await h.msgs(); await h.wait(2800);
  };
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '복리후생비 코드관리');
    await h.wait(2500);
    const lg = gridOf(L()), rg = gridOf(R());

    // [E0] 열 때 왼쪽만 조회
    out.leftButtons = await h.buttons(L());
    out.rightButtons = await h.buttons(R());
    out.leftHeaders = await h.headers(lg);
    out.rightHeaders = await h.headers(rg);
    out.leftRowsOpen = await h.rows(lg);
    out.rightRowsOpen = await h.rows(rg);
    out.leftFirst = (await h.rowsText(lg))[0];
    await p.screenshot({ path: `${OUT}/E25-open.png` });

    // 선택 없는 삭제·기초데이터생성 안내
    await uncheckAll(lg);
    await h.btn(L(), /삭\s*제/).click();
    out.msgDeleteNone = await h.msgs(); await h.wait(2800);
    await h.btn(L(), /기초데이터생성/).click();
    out.msgInitNone = await h.msgs(); await h.wait(2800);
    out.gridLeft = await checkGrid(p, L());
    out.gridOk = gridOk(out.gridLeft);
    await search(L());

    // 고객사 없이 오른쪽 조회·등록·저장 → 안내
    await h.btn(R(), /^\s*조\s*회\s*$/).click(); out.msgRightSearchNone = await h.msgs(); await h.wait(2800);
    await h.btn(R(), /^\s*등\s*록\s*$/).click(); out.msgRightInsertNone = await h.msgs(); await h.wait(2800);

    // ── 왼쪽: 등록 → 계정코드 조회창 → 저장
    await h.btn(L(), /^\s*등\s*록\s*$/).click(); await h.wait(600);
    const ni = need(await h.findRowIdx(lg, { benefitCode: '', issueLinkCode: '' }), '새 행');
    await type(lg, ni, 'benefitCode', 'ZZ9');
    await type(lg, ni, 'issueLinkCode', 'A21');
    await type(lg, ni, 'expenseLinkCode', 'A46');
    await cell(lg, ni, 'accountCode').locator('button').first().click();
    const am = h.modal('계정코드');
    await am.waitFor(); await h.wait(1500);
    const ag = am.locator('.ag-root-wrapper').first();
    out.acctButtons = await h.buttons(am);
    out.acctHeaders = await h.headers(ag);
    out.acctRowsOpen = await h.rows(ag);
    await p.screenshot({ path: `${OUT}/E25-account.png` });
    await h.btn(am, /확\s*인/).click(); out.msgAcctNone = await h.msgs(); await h.wait(2800);
    // 계정속성 콤보 → 부채 / 검색어 → 현금
    await am.locator('.ant-select').first().click(); await h.wait(300);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').filter({ hasText: /^부채$/ }).first().click(); await h.wait(1200);
    out.acctRowsDebt = await h.rows(ag);
    await am.locator('.ant-select').first().click(); await h.wait(300);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').filter({ hasText: /^전체$/ }).first().click(); await h.wait(1200);
    await am.locator('input[type=text], input:not([type])').last().fill('현금'); await p.keyboard.press('Enter'); await h.wait(1200);
    out.acctRowsCash = await h.rows(ag);
    out.acctCashFirst = (await h.rowsText(ag))[0];
    await ag.locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(am, /확\s*인/).click(); await h.wait(800);
    out.acctClosed = (await am.count()) === 0;
    out.acctCell = (await cell(lg, ni, 'accountCode').innerText()).trim() + ' / ' + (await cell(lg, ni, 'accountName').innerText()).trim();
    out.saveLabel = (await h.btn(L(), /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(L(), /저\s*장/).click(); await h.wait(1800);
    out.msgSaved = await h.msgs(); await h.wait(2800);
    await search(L());
    out.leftRowsAfterSave = await h.rows(lg);
    out.savedRow = (await h.rowsText(lg)).filter(t => /ZZ9/.test(t));
    await p.screenshot({ path: `${OUT}/E25-saved.png` });

    // 수정: 신청코드 A21 → A22
    const ti = need(await h.findRowIdx(lg, { benefitCode: 'ZZ9', issueLinkCode: 'A21' }), '시험 행');
    await type(lg, ti, 'issueLinkCode', 'A22');
    await h.btn(L(), /저\s*장/).click(); await h.wait(1800);
    out.msgUpdated = await h.msgs(); await h.wait(2800);
    await search(L());
    out.updatedRow = (await h.rowsText(lg)).filter(t => /ZZ9/.test(t));

    // ── 오른쪽: 고객사 고르기
    await R().locator('input[readonly]').first().click();
    const cm = h.modal('고객사 찾기');
    await cm.waitFor(); await h.wait(1200);
    out.coSingleButtons = await h.buttons(cm);
    await cm.locator('input').first().fill(CO); await p.keyboard.press('Enter'); await h.wait(1200);
    const cg = cm.locator('.ag-root-wrapper').first();
    out.coRows = await h.rows(cg);
    await cg.locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(cm, /확\s*인/).click(); await h.wait(1800);
    out.coName = await R().locator('input[readonly]').first().inputValue();
    out.rightRowsPicked = await h.rows(rg);
    await p.screenshot({ path: `${OUT}/E25-right.png` });

    // 오른쪽: 등록 → 저장 → 삭제
    await h.btn(R(), /^\s*등\s*록\s*$/).click(); await h.wait(600);
    const ri = need(await h.findRowIdx(rg, { benefitCode: '', issueLinkCode: '' }), '오른쪽 새 행');
    await type(rg, ri, 'benefitCode', 'ZZ8');
    await h.btn(R(), /저\s*장/).click(); await h.wait(1800);
    out.msgRightSaved = await h.msgs(); await h.wait(2800);
    await search(R());
    out.rightRowsAfterSave = await h.rows(rg);
    await deleteRow(R(), rg, { benefitCode: 'ZZ8' }, 'rightZZ8');
    out.rightRowsAfterDelete = await h.rows(rg);

    // ── 기초데이터생성: ZZ9를 고객사(다중 선택창)로 복사
    const ci = need(await h.findRowIdx(lg, { benefitCode: 'ZZ9' }), '복사할 행');
    await checkOnly(lg, ci);
    await h.btn(L(), /기초데이터생성/).click();
    const mm = h.modal('고객사 찾기');
    await mm.waitFor(); await h.wait(1200);
    out.coMultiButtons = await h.buttons(mm);
    await mm.locator('input').first().fill(CO); await p.keyboard.press('Enter'); await h.wait(1200);
    await mm.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(mm, /확\s*인/).click();
    out.msgInit = await h.msgs(); await h.wait(2800);
    await search(R());
    out.rightRowsAfterCopy = await h.rows(rg);
    await deleteRow(R(), rg, { benefitCode: 'ZZ9' }, 'rightZZ9');

    // ── 왼쪽 시험 행 삭제
    await deleteRow(L(), lg, { benefitCode: 'ZZ9' }, 'leftZZ9');
    out.leftRowsAfterDelete = await h.rows(lg);
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E25-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.cleanup = "yunhee sql \"select emp55_benefit_info_id, emp55_company_id from emp55_benefit_info where emp55_benefit_cd in ('ZZ8','ZZ9')\" → yunhee api DELETE /api/v1/emp/benefit-infos [-p companyId=<회사>] -b '[<ID>]'";
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
