// E29 Ast05_Tab_TrCodeAdmin(거래유형 등록(관리자) #1165) + Ast15_Lookup_TrCodeWindow·Ast15_Page_TrCodeWindow(화면별 거래유형 등록) + Sys06_Lookup_SearchMenu(화면 찾기) + Sys40_Lookup_Bookmark(북마크) 화면 확인
// 시험 행: 파트 A 회사 0에 거래코드 "Z9"(거래명 "E29시험") 1건 → 수정 → 지움. 파트 B 한국펀드서비스(28000)에 화면 "Ast05_Tab_TrCodeAdmin"을 등록 → 거래코드 둘을 지정 → 저장 → 다시 비워 저장 → 화면 행을 지움.
// 파트 C는 /api/auth/me 응답의 companyId·userId만 바꿔 일반 사용자 모드로 열고, 화면 찾기 응답에 북마크 칸을 채워 별·북마크 창 동작을 본다(북마크는 admin 사용자 몫으로 만들었다 지움).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E29.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
const CODE = 'Z9', NAME = 'E29시험', CO = '한국펀드', CLASS = 'Ast05_Tab_TrCodeAdmin';
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['ast/', 'sys/menu-search', 'sys/bookmarks']);
  const scr = () => p.locator('.flexlayout__tab:visible').last();
  const need = (i, what) => { if (i < 0) throw new Error('행 못 찾음: ' + what); return i; };
  const cell = (grid, idx, col) => grid.locator(`.ag-row[row-index="${idx}"] [col-id="${col}"]`).first();
  const type = async (grid, idx, col, text) => {
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await h.wait(600);
  };
  const pick = async (grid, idx, col, text) => {   // 콤보 셀: 더블클릭 → 목록에서 글자로 고르기
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.locator('.ag-picker-field-wrapper:visible').first().click(); await h.wait(300);
    await p.locator('.ag-popup .ag-list-item').filter({ hasText: new RegExp('^\\s*' + text + '\\s*$') }).first().click(); await h.wait(400);
  };
  const checkOnly = async (g, idx) => {
    for (const c of await g.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck();
    await g.locator(`.ag-row[row-index="${idx}"] .ag-checkbox-input`).first().check();
  };
  const retrieve = async () => { await h.btn(scr(), /^\s*조\s*회\s*$/).click(); await h.wait(1500); };
  const searchFor = async text => { await scr().locator('.ant-input:not([readonly])').first().fill(text); await retrieve(); };
  // AG Grid 행 끌기는 마우스 이벤트 — 첫 행을 다른 그리드 위로 끌어 놓는다
  const drag = async (fromGrid, fromIdx, toBox) => {
    const src = fromGrid.locator(`.ag-row[row-index="${fromIdx}"] [col-id="trName"]`).first();
    const sb = await src.boundingBox(); const tb = await toBox.boundingBox();
    await p.mouse.move(sb.x + 20, sb.y + sb.height / 2); await p.mouse.down();
    await p.mouse.move(sb.x + 40, sb.y + sb.height / 2 + 5, { steps: 4 });
    await p.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 12 }); await h.wait(200);
    await p.mouse.up(); await h.wait(600);
  };
  const pickCompany = async (host, nameLike) => {   // 고객사 찾기(단일): 검색 → 첫 행 → 확인
    const m = h.modal('고객사 찾기'); await m.waitFor(); await h.wait(1200);
    await m.locator('input').first().fill(nameLike); await p.keyboard.press('Enter'); await h.wait(1200);
    await m.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(m, /확\s*인/).click(); await h.wait(800);
  };
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '거래유형 등록(관리자)');
    await h.wait(2000);
    const grid = scr().locator('.ag-root-wrapper').first();

    // ── 파트 A: 메인 [E0] 열 때 조회 → 첫 행 선택 ──
    out.buttons = await h.buttons(scr());
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);
    out.firstRow = (await h.rowsText(grid))[0];
    out.firstChecked = await grid.locator('.ag-row[row-index="0"].ag-row-selected').count();
    out.toolbarH = await scr().locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));
    await p.screenshot({ path: `${OUT}/E29-open.png` });
    out.useYnChecked = await scr().locator('.ant-checkbox-input').first().isChecked();
    for (const c of await grid.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck();
    out.grid = await checkGrid(p, scr());
    out.gridOk = gridOk(out.grid);
    await retrieve();
    // 선택 없는 기초데이터생성 안내
    await h.btn(scr(), /기초데이터생성/).click(); out.msgInitNoCompany = await h.msgs(); await h.wait(2800);

    // [E4] 등록 → 필수 안내 3종 → 저장 → 중복 코드 안내
    await h.btn(scr(), /^\s*등\s*록\s*$/).click(); await h.wait(600);
    await p.keyboard.press('Escape'); await h.wait(300);
    const ni = need(await h.findRowIdx(grid, { trCode: '', trName: '' }), '새 행');
    out.saveDisabledNoChange = await h.saveDisabled(scr());
    await type(grid, ni, 'trCode', CODE);
    await h.btn(scr(), /저\s*장/).click(); out.msgNoName = await h.msgs(); await h.wait(2800);
    await type(grid, ni, 'trName', NAME);
    await h.btn(scr(), /저\s*장/).click(); out.msgNoRcvPay = await h.msgs(); await h.wait(2800);
    await pick(grid, ni, 'rcvPayName', '수령');
    await pick(grid, ni, 'trOccTypeName', '거래');
    out.newRowChecks = await h.rowsText(grid).then(a => a[ni]);
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgSaved = await h.msgs(); await h.wait(2800);
    await searchFor(CODE);
    const ti = need(await h.findRowIdx(grid, { trCode: CODE, trName: NAME }), '시험 행');
    out.savedRow = (await h.rowsText(grid))[ti];
    // 같은 코드를 또 넣으면 "동일한 거래코드가 존재합니다"
    await h.btn(scr(), /^\s*등\s*록\s*$/).click(); await h.wait(600);
    await p.keyboard.press('Escape'); await h.wait(300);
    const di2 = need(await h.findRowIdx(grid, { trCode: '', trName: '' }), '중복 시험 행');
    await type(grid, di2, 'trCode', CODE); await type(grid, di2, 'trName', 'dup');
    await pick(grid, di2, 'rcvPayName', '수령');
    await h.btn(scr(), /저\s*장/).click(); out.msgDup = await h.msgs(); await h.wait(2800);
    await searchFor(CODE);   // 저장 안 된 중복 행을 버린다
    // 수정: 비고 → 저장(n) → 저장
    const ti2 = need(await h.findRowIdx(grid, { trCode: CODE, trName: NAME }), '시험 행');
    await type(grid, ti2, 'note', NAME + '비고');
    out.saveLabel = (await h.btn(scr(), /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgUpdated = await h.msgs(); await h.wait(2800);
    await retrieve();
    out.updatedRow = (await h.rowsText(grid))[need(await h.findRowIdx(grid, { trCode: CODE, trName: NAME }), '수정된 시험 행')];
    // [E7] 고객사 다중 선택창: 칸에 글자가 들어가는지만 본다 (복사 실행은 DB 테스트)
    await scr().locator('input.ant-input[readonly]').first().click();
    const mm = h.modal('고객사 찾기'); await mm.waitFor(); await h.wait(1200);
    await mm.locator('input').first().fill(CO); await p.keyboard.press('Enter'); await h.wait(1200);
    await mm.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(mm, /확\s*인/).click(); await h.wait(600);
    out.companyField = await scr().locator('input.ant-input[readonly]').first().inputValue();

    // 시험 행 삭제: 아니오 → 예
    const di = need(await h.findRowIdx(grid, { trCode: CODE }), '삭제할 시험 행');
    await checkOnly(grid, di);
    await h.btn(scr(), /삭\s*제/).click();
    out.confirm = await h.confirmDeleteOne();
    await h.confirmNo(); out.rowsAfterNo = await h.rows(grid);
    await h.btn(scr(), /삭\s*제/).click(); await h.confirmYes();
    out.msgDeleted = await h.msgs(); await h.wait(2800);
    out.rowsAfterDelete = await h.rows(grid);

    // ── 파트 B: [화면별 거래유형 등록] 조회창 ──
    await h.btn(scr(), /화면별 거래유형 등록/).click();
    const lk = h.modal('화면별 거래유형 등록'); await lk.waitFor(); await h.wait(1500);
    out.lkButtons = await h.buttons(lk);
    out.lkPlaceholder = await lk.locator('input[placeholder="운용사 선택"]').count();
    await p.screenshot({ path: `${OUT}/E29-window-open.png` });
    await h.btn(lk, /^\s*조\s*회\s*$/).click(); out.msgNoCompany = await h.msgs(); await h.wait(2800);
    await h.btn(lk, /^\s*등\s*록\s*$/).click(); out.msgNoCompany2 = await h.msgs(); await h.wait(2800);
    await lk.locator('input[placeholder="운용사 선택"]').click();
    await pickCompany(lk, CO);
    out.lkCompany = await lk.locator('input[placeholder="운용사 선택"]').inputValue();
    await h.btn(lk, /^\s*조\s*회\s*$/).click(); await h.wait(1800);
    const wg = lk.locator('.ag-root-wrapper').first();
    out.lkHeaders = await h.headers(wg);
    out.lkRows = await h.rows(wg);
    out.lkFirstSelected = await wg.locator('.ag-row.ag-row-selected').count();
    const pageGrids = lk.locator('.ag-root-wrapper');
    out.pageGridCount = await pageGrids.count();
    out.pageHeaders = [await h.headers(pageGrids.nth(1)), await h.headers(pageGrids.nth(2))];
    out.pageRowsL0 = await h.rows(pageGrids.nth(1)); out.pageRowsR0 = await h.rows(pageGrids.nth(2));
    out.pageButtons = await h.buttons(lk);
    await p.screenshot({ path: `${OUT}/E29-window-page.png` });

    // [E4] 등록 → 화면 찾기(관리자)
    await h.btn(lk, /^\s*등\s*록\s*$/).click();
    const sm = h.modal('화면찾기'); await sm.waitFor(); await h.wait(1500);
    out.smTitle = await sm.locator('.ant-modal-title').innerText();
    out.smButtons = await h.buttons(sm);
    out.smHeaders = await h.headers(sm.locator('.ag-root-wrapper').first());
    out.smRows = await h.rows(sm.locator('.ag-root-wrapper').first());
    await h.btn(sm, /확\s*인|닫\s*기/).first().isVisible();
    await sm.locator('input.ant-input').first().fill('TrCodeAdmin'); await p.keyboard.press('Enter'); await h.wait(1200);
    out.smSearchRows = await h.rowsText(sm.locator('.ag-root-wrapper').first());
    await sm.locator('.ag-row[row-index="0"]').dblclick(); await h.wait(1800);
    out.smClosed = (await sm.count()) === 0;
    await h.btn(lk, /^\s*조\s*회\s*$/).click(); await h.wait(1500);
    const wi = need(await h.findRowIdx(wg, { windowClassName: CLASS }), '등록한 화면 행');
    await wg.locator(`.ag-row[row-index="${wi}"]`).click(); await h.wait(1500);
    out.afterAddRows = await h.rows(wg);
    out.pageRowsL1 = await h.rows(pageGrids.nth(1)); out.pageRowsR1 = await h.rows(pageGrids.nth(2));

    // 오른쪽 → 왼쪽 끌기 두 번 → 저장 → 다시 읽어 왼쪽 2행
    const leftBox = lk.locator('.ag-root-wrapper').nth(1), rightBox = lk.locator('.ag-root-wrapper').nth(2);
    await drag(rightBox, 0, leftBox); await drag(rightBox, 0, leftBox);
    out.dragRowsL = await h.rows(pageGrids.nth(1)); out.dragRowsR = await h.rows(pageGrids.nth(2));
    // 찾기: 글자가 든 행을 모두 고른다
    const inputs = lk.locator('input.ant-input');
    await inputs.nth(await inputs.count() - 1).fill('1'); await h.btn(lk, /찾\s*기/).click(); await h.wait(500);
    out.searchSelectedL = await pageGrids.nth(1).locator('.ag-row.ag-row-selected').count();
    out.searchSelectedR = await pageGrids.nth(2).locator('.ag-row.ag-row-selected').count();
    await h.btn(lk, /^\s*저\s*장\s*$/).click(); await h.wait(1800);
    await wg.locator(`.ag-row[row-index="${wi}"]`).click(); await h.wait(1500);
    out.savedRowsL = await h.rows(pageGrids.nth(1)); out.savedRowsR = await h.rows(pageGrids.nth(2));
    // 왼쪽 → 오른쪽으로 모두 되돌리고 저장 (지정을 비운다)
    for (let i = 0; i < 5 && (await h.rows(pageGrids.nth(1))) > 0; i++) await drag(pageGrids.nth(1), 0, rightBox);
    await h.btn(lk, /^\s*저\s*장\s*$/).click(); await h.wait(1800);
    await wg.locator(`.ag-row[row-index="${wi}"]`).click(); await h.wait(1500);
    out.clearedRowsL = await h.rows(pageGrids.nth(1));
    // 화면 행 삭제: 확인 아니오 → 예
    await h.btn(lk, /^\s*삭\s*제\s*$/).click(); await h.wait(600); out.confirmWindow = await h.confirmText();
    await h.confirmNo(); out.rowsAfterNoW = await h.rows(wg);
    await h.btn(lk, /^\s*삭\s*제\s*$/).click(); await h.confirmYes();
    out.rowsAfterDeleteW = await h.rows(wg);
    await p.keyboard.press('Escape'); await h.wait(500);
    out.lkClosed = (await lk.count()) === 0;

    // ── 파트 C: 일반 사용자 모드(me의 companyId·userId만) — 화면 찾기 1300폭·북마크 별·북마크 창 ──
    await p.route('**/api/auth/me', async route => {
      const res = await route.fetch(); const body = await res.json();
      const fix = o => { if (o && typeof o === 'object') { for (const k of Object.keys(o)) { if (k === 'companyId') o[k] = 28000; else if (k === 'userId') o[k] = 29037; else fix(o[k]); } } };
      fix(body.data); await route.fulfill({ response: res, json: body });
    });
    // 화면 찾기 응답에 일반 사용자 열(화면경로·북마크)을 채운다 — 서버는 admin 토큰이라 관리자 SQL로 답한다
    await p.route('**/api/v1/sys/menu-search*', async route => {
      const res = await route.fetch(); const body = await res.json();
      body.data = (body.data || []).slice(0, 30).map((r, i) => ({ ...r, parentPathNm: (r.menuFullNm || '').replace(/[^/]*$/, ''), bookmark: i === 0 ? 1 : null }));
      await route.fulfill({ response: res, json: body });
    });
    await p.reload({ waitUntil: 'networkidle' }); await h.wait(2500);
    await openMenu(p, '기초자료', '거래유형 등록(관리자)'); await h.wait(2000);
    await h.btn(scr(), /화면별 거래유형 등록/).click();
    const lk2 = h.modal('화면별 거래유형 등록'); await lk2.waitFor(); await h.wait(2000);
    out.custLkCompanyInput = await lk2.locator('input[placeholder="운용사 선택"]').count();
    out.custLkRows = await h.rows(lk2.locator('.ag-root-wrapper').first());
    await h.btn(lk2, /^\s*등\s*록\s*$/).click();
    const sm2 = h.modal('화면찾기'); await sm2.waitFor(); await h.wait(1500);
    out.custSmTitle = await sm2.locator('.ant-modal-title').innerText();
    out.custSmButtons = await h.buttons(sm2);
    out.custSmHeaders = await h.headers(sm2.locator('.ag-root-wrapper').first());
    out.custSmCheckbox = await sm2.locator('.ant-checkbox-input').isChecked();
    await p.screenshot({ path: `${OUT}/E29-searchmenu.png` });
    // 별 아이콘: 첫 행은 북마크됨(채움), 나머지는 빈 별. 둘째 행 별을 누르면 POST bookmarks/menus/{id} 후 다시 읽는다
    out.starFilled = await sm2.locator('.ag-row[row-index="0"] .anticon-star').count();
    const w0 = api.writes.length;
    await sm2.locator('.ag-row[row-index="1"] [col-id="actionCell"] .anticon').click(); await h.wait(1500);
    out.bookmarkWrites = api.writes.slice(w0);
    const menuId1 = await sm2.evaluate(() => null);
    // 북마크 창
    await h.btn(sm2, /북마크/).click();
    const bm = h.modal('북마크 목록(그룹설정)'); await bm.waitFor(); await h.wait(1500);
    out.bmButtons = await h.buttons(bm);
    out.bmHeaders = await h.headers(bm.locator('.ag-root-wrapper').first());
    out.bmNote = await bm.locator('span', { hasText: '가나다' }).first().innerText();
    out.bmSaveDisabled = await h.saveDisabled(bm);
    await h.btn(bm, /전체삭제/).click(); out.bmConfirm = await h.confirmText(); await h.confirmNo();
    await p.screenshot({ path: `${OUT}/E29-bookmark.png` });
    await h.btn(bm, /닫\s*기/).click(); await h.wait(800);
    out.bmClosed = (await bm.count()) === 0;
    await h.btn(sm2, /닫\s*기/).click(); await h.wait(500);
    await p.unroute('**/api/v1/sys/menu-search*');
    await p.unroute('**/api/auth/me');
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E29-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.cleanup = "yunhee sql \"select ast05_tr_code_id from ast05_tr_code where ast05_tr_cd='Z9'\" → yunhee api DELETE /api/v1/ast/tr-codes -b '[<ID>]'; yunhee sql \"select * from ast15_tr_code_window where ast15_window_class_nm='Ast05_Tab_TrCodeAdmin' and ast15_company_id=28000\"; yunhee sql \"select * from sys40_bookmark where sys40_company_id=0\"";
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
