// A15-4 고객별 시스템정보 관리 > 특정매뉴 권한 탭(Sys50) + 팝업(Sys51 사원권한·Sys52 문서권한·Sys54 요청이력/참고내용) + 조회창(매뉴찾기·사원찾기) 화면 확인.
// admin 회사 admin, 회사 = 한국펀드서비스(주)(28000). 시험 행은 모두 스크립트가 지운다(03 원칙 2). **[일괄 권한설정]은 눌러 확인창까지만 가지 않는다**
// (저장 전 변경이 있어 "저장 후 이용해주세요"로 막히는 것만 본다 — 실제로 실행하면 그 회사·업무의 사원권한이 모두 바뀐다).
// 파일 첨부(등록·받기)는 B10 뒤라 안내 메시지만 본다.
// 사용: yunhee run "bash -c 'NODE_PATH=/home/kdy987/.npm/_npx/e41f203b7505f1fb/node_modules node tools/screens/A15-4.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, msgs: [] };
  const msg = async () => { await p.waitForTimeout(900); const t = (await p.locator('.ant-message-notice').allInnerTexts()).join('|'); out.msgs.push(t); return t; };
  const panel = p.locator('.ant-splitter-panel').last();
  const modal = title => p.locator('.ant-modal', { has: p.locator('.ant-modal-title', { hasText: title }) });
  // 버튼 아이콘의 aria-label이 이름에 섞이므로 글자만 본다(2글자 버튼은 antd가 사이에 공백을 넣는다)
  const btn = (scope, name) => scope.locator('button').filter({ hasText: new RegExp('^\\s*' + [...name].join('\\s*') + '\\s*$') }).first();
  const confirmYes = async () => { await p.locator('.ant-modal-confirm').getByRole('button', { name: '예' }).click(); await p.waitForTimeout(600); };
  const headers = scope => scope.locator('.ag-header-cell[col-id]').evaluateAll(hs => hs.map(h => h.innerText.replace(/\n/g, ' ')));
  const rowOf = (scope, text) => scope.locator('.ag-row', { hasText: text }).first();
  // 셀 편집기 select 에서 고르기(text 없으면 목록만 읽고 닫는다)
  const pickSelect = async (scope, row, col, text) => {
    // 등록 직후 행은 useGridCrud.addRows가 첫 편집 칸 편집을 이미 시작해 둔다 — 또 더블클릭하면 편집이 풀린다
    if (!(await scope.locator('.ag-cell-inline-editing').count())) { await row.locator(`.ag-cell[col-id="${col}"]`).dblclick(); await p.waitForTimeout(500); }
    await scope.locator('.ag-cell-inline-editing .ag-picker-field-wrapper').first().click(); await p.waitForTimeout(400);
    const all = await p.locator('.ag-select-list .ag-list-item').allInnerTexts();
    if (text) { await p.locator('.ag-select-list').getByText(text === true ? all[0] : text, { exact: true }).first().click(); await p.waitForTimeout(300); }
    else { await p.keyboard.press('Escape'); await p.waitForTimeout(200); await p.keyboard.press('Escape'); await p.waitForTimeout(300); }
    return all;
  };
  const editText = async (scope, row, col, value) => {
    await row.locator(`.ag-cell[col-id="${col}"]`).dblclick(); await p.waitForTimeout(300);
    const input = scope.locator('.ag-cell-inline-editing input').first();
    await input.fill(value); await input.press('Enter'); await p.waitForTimeout(300);
  };
  const checkRow = async (row) => { await row.locator('.ag-selection-checkbox input').first().click({ force: true }); await p.waitForTimeout(300); };
  const delRows = scope => scope.locator('.ag-row[row-index]').count();

  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    const menu = p.getByText('고객별 시스템정보 관리', { exact: true }).first();
    if (!(await menu.isVisible().catch(() => false))) { await p.getByText('01. 고객관리', { exact: true }).first().click(); await p.waitForTimeout(500); }
    await menu.click(); await p.waitForTimeout(2500);
    await p.locator('.ant-splitter-panel').first().locator('.ag-cell[col-id="companyNm"]', { hasText: '한국펀드서비스(주)' }).first().click();
    await p.waitForTimeout(1500);
    await p.getByRole('tab', { name: '특정매뉴 권한' }).click(); await p.waitForTimeout(1800);

    // ── 탭 구성 ──
    const tab = out.tab = {};
    tab.buttons = await panel.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    tab.headers = await headers(panel);
    tab.rows0 = await delRows(panel);
    tab.firstRowMenu = await panel.locator('.ag-row[row-index="0"] .ag-cell[col-id="menuNm"]').innerText();
    tab.grid = await checkGrid(p, panel);
    await p.screenshot({ path: OUT + '/A15-4-tab.png' });
    // 구분 콤보: 목록 → '전체' 가 맨 앞, 업무 하나 고르면 행 수가 줄어든다
    await panel.locator('.ant-select').first().click(); await p.waitForTimeout(400);
    tab.comboItems = await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts();
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);

    // ── 등록 → 필수 검사 → 매뉴찾기 → 저장 ──
    await btn(panel, '등록').click(); await p.waitForTimeout(600);
    const nrow = panel.locator('.ag-row[row-id^="-"]').first();
    tab.newRowFound = await nrow.count();
    tab.saveEmptyMsg = (await btn(panel, '저장').click(), await msg()); // 아무것도 안 고치고 저장 → 메시지 없음(변경 아님)
    tab.workList = await pickSelect(panel, nrow, 'specificWorkNm', true);
    tab.saveNoMenuMsg = (await btn(panel, '저장').click(), await msg()); // 매뉴 필수
    // 매뉴찾기: 더블클릭 → 팝업. 선택 없이 확인 → 메시지. 검색 후 선택
    await nrow.locator('.ag-cell[col-id="menuNm"]').dblclick(); await p.waitForTimeout(1500);
    const mm = modal('매뉴찾기');
    tab.menuLookup = { visible: await mm.count(), buttons: await mm.locator('button').filter({ hasText: /\S/ }).allInnerTexts(), headers: await headers(mm),
      presetText: await mm.locator('input[type=text]').first().inputValue(), checkbox: await mm.locator('.ant-checkbox-wrapper').allInnerTexts() };
    await btn(mm, '확인').click(); tab.menuLookup.noSelectMsg = await msg();
    await mm.locator('input[type=text]').first().fill('연봉계약관리'); await mm.locator('input[type=text]').first().press('Enter'); await p.waitForTimeout(1200);
    tab.menuLookup.rows = await delRows(mm);
    await checkRow(mm.locator('.ag-row[row-index="0"]'));
    await btn(mm, '확인').click(); await p.waitForTimeout(800);
    tab.menuAfter = await nrow.locator('.ag-cell[col-id="menuNm"]').innerText();
    await editText(panel, nrow, 'note', 'A15-4 test');
    tab.saveMsg = (await btn(panel, '저장').click(), await msg());
    const row = rowOf(panel, 'A15-4 test');
    const rowId = await row.getAttribute('row-id');
    tab.savedRowId = rowId;
    tab.rowsAfterSave = await delRows(panel);

    // ── 문서권한(Sys52) ──
    await row.locator('.ag-cell[col-id="actionCell01"] button').click(); await p.waitForTimeout(1500);
    const lm = modal('문서권한설정'); const link = out.link = {};
    link.buttons = await lm.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    link.headers = await headers(lm);
    link.rows0 = await delRows(lm);
    await p.waitForTimeout(1500); link.rows0 = await delRows(lm);
    await btn(lm, '등록').click(); await p.waitForTimeout(900);
    await p.screenshot({ path: OUT + '/A15-4-link-new.png' });
    const lrow = lm.locator('.ag-row[row-id^="-"]').first();
    link.list = await pickSelect(lm, lrow, 'linkNm', true);
    await editText(lm, lrow, 'note', 'link test');
    link.saveMsg = (await btn(lm, '저장').click(), await msg());
    link.rows1 = await delRows(lm);
    await p.screenshot({ path: OUT + '/A15-4-link.png' });
    await checkRow(rowOf(lm, 'link test'));
    await btn(lm, '삭제').click(); await p.waitForTimeout(500);
    link.confirmText = await p.locator('.ant-modal-confirm-content').innerText();
    await confirmYes(); link.delMsg = await msg(); link.rows2 = await delRows(lm);
    await btn(lm, '닫기').click(); await p.waitForTimeout(500);

    // ── 사원권한(Sys51) + 사원찾기(Emp00_Lookup_SelectMulti) ──
    await row.locator('.ag-cell[col-id="actionCell02"] button').click(); await p.waitForTimeout(1500);
    const pm = modal('사원권한설정'); const per = out.person = {};
    per.buttons = await pm.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    per.headers = await headers(pm);
    per.rows0 = await delRows(pm);
    await btn(pm, '등록').click(); await p.waitForTimeout(1800);
    const em = modal('사원찾기');
    per.emp = { visible: await em.count(), buttons: await em.locator('button').filter({ hasText: /\S/ }).allInnerTexts(), headers: await headers(em), rows: await delRows(em) };
    await btn(em, '확인').click(); per.emp.noSelectMsg = await msg();
    await p.screenshot({ path: OUT + '/A15-4-emp.png' });
    await checkRow(em.locator('.ag-row[row-index="0"]'));
    await btn(em, '확인').click(); await p.waitForTimeout(800);
    per.rows1 = await delRows(pm);
    const prow = pm.locator('.ag-row[row-id^="-"]').first();
    per.newPersonNm = await prow.locator('.ag-cell[col-id="personNm"]').innerText();
    per.useYnChecked = await prow.locator('.ag-cell[col-id="useYn"] input').isChecked();
    per.groupBlockedMsg = (await btn(pm, '일괄 권한설정').click(), await msg()); // 저장 전 변경 → 막힘
    per.confirmOpen = await p.locator('.ant-modal-confirm').count();
    per.saveMsg = (await btn(pm, '저장').click(), await msg());
    await p.screenshot({ path: OUT + '/A15-4-person.png' });
    await checkRow(pm.locator('.ag-row').filter({ hasText: per.newPersonNm.trim() }).first());
    await btn(pm, '삭제').click(); await p.waitForTimeout(500); await confirmYes(); per.delMsg = await msg(); per.rows2 = await delRows(pm);
    await btn(pm, '닫기').click(); await p.waitForTimeout(500);

    // ── 요청이력(Sys54) + 참고내용(Sys54_Edit_Note) ──
    await btn(panel, '요청이력').click(); await p.waitForTimeout(1500);
    const hm = modal('요청이력'); const his = out.history = {};
    his.buttons = await hm.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    his.headers = await headers(hm);
    his.rows0 = await delRows(hm);
    await btn(hm, '등록').click(); await p.waitForTimeout(500);
    const hrow = hm.locator('.ag-row[row-id^="-"]').first();
    await editText(hm, hrow, 'confirmNm', 'a154test');
    his.newRegDate = await hrow.locator('.ag-cell[col-id="regDate"]').innerText();
    his.saveMsg = (await btn(hm, '저장').click(), await msg());
    const hsaved = rowOf(hm, 'a154test');
    his.rows1 = await delRows(hm);
    await hsaved.locator('.ag-cell[col-id="actionCell01"] button').click(); his.uploadMsg = await msg();
    await hsaved.locator('.ag-cell[col-id="actionCell03"] button').click(); await p.waitForTimeout(1500);
    const nm = modal('참고내용'); his.note = { visible: await nm.count(), buttons: await nm.locator('button').filter({ hasText: /\S/ }).allInnerTexts() };
    await nm.locator('.ProseMirror').click(); await p.keyboard.type('A154 note'); await p.waitForTimeout(300);
    await p.screenshot({ path: OUT + '/A15-4-note.png' });
    await btn(nm, '저장').click(); await p.waitForTimeout(1500);
    his.noteYn = await rowOf(hm, 'a154test').locator('.ag-cell[col-id="noteYnStr"]').innerText();
    await p.screenshot({ path: OUT + '/A15-4-history.png' });
    await hm.locator('.ag-body-horizontal-scroll-viewport').first().evaluate(el => { el.scrollLeft = 0; }); await p.waitForTimeout(300); // 아이콘 칸 클릭으로 오른쪽으로 밀렸다
    await checkRow(rowOf(hm, 'a154test'));
    await btn(hm, '삭제').click(); await p.waitForTimeout(500);
    his.confirmText = await p.locator('.ant-modal-confirm-content').innerText();
    await confirmYes(); his.delMsg = await msg(); his.rows2 = await delRows(hm);
    await btn(hm, '닫기').click(); await p.waitForTimeout(500);

    // ── 시험 행 삭제(탭) ──
    await row.locator('.ag-cell[col-id="specificWorkNm"]').click(); await p.waitForTimeout(300);
    await btn(panel, '삭제').click(); await p.waitForTimeout(500);
    tab.confirmText = await p.locator('.ant-modal-confirm-content').innerText();
    await confirmYes(); tab.delMsg = await msg(); tab.rowsAfterDelete = await delRows(panel);

    out.gridOk = gridOk(tab.grid);
  } catch (e) {
    out.error = e.message;
    await p.screenshot({ path: OUT + '/A15-4-error.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
  if (out.error) process.exit(1);
})();
