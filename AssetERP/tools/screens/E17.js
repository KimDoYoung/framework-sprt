// E17 문서분류지정(Dcr30_Tab_LinkAdmin #1280) 화면 확인.
// 열 때 부르는 POST /dcr/links/check는 모든 회사에 Link를 채우는 쓰기라 응답을 0건으로 대체한다(실제 동작은 DcrLinkDbTest가 롤백으로 확인).
// 쓰기는 비고 한 칸을 바꿔 저장했다가 원래 값으로 되돌리는 것뿐이다. 되돌리지 못하고 끝나면 마지막 줄 restore를 보고 `yunhee api PUT /api/v1/dcr/links …`로 되돌린다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E17.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const h = helpers(p);
  const { wait, msgs, btn, rows, rowsText, headers, confirmText, modal, scrollX } = h;
  const api = h.trackApi(['dcr/', 'com/', 'sys/companies']);
  const { writes, gets } = api;
  // 열 때 부르는 POST /dcr/links/check는 모든 회사에 Link를 채우는 쓰기라 응답을 대체한다
  const check = await h.mockWrite('**/api/v1/dcr/links/check');
  const restore = [];
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '문서분류지정');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2500);
    const grids = scr.locator('.ag-root-wrapper');
    const gm = grids.nth(0), gc = grids.nth(1), gd = grids.nth(2);
    out.checkCalls = check.calls;
    out.getsOpen = gets.slice();
    out.buttonsAll = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.label = (await scr.getByText('※ 상단').count()) > 0;
    out.searchPlaceholder = await scr.locator('input[placeholder="Link명/문서분류명"]').count();
    out.headersMain = await headers(gm);
    out.headersCompany = await headers(gc);
    out.headersDcr = await headers(gd);
    out.checkboxMain = await gm.locator('.ag-header-select-all, .ag-selection-checkbox').count() > 0;
    out.checkboxCompany = await gc.locator('.ag-header-select-all, .ag-selection-checkbox').count() > 0;
    out.checkboxDcr = await gd.locator('.ag-selection-checkbox').count() > 0;
    out.rowsMain = await rows(gm);
    out.rowsCompany = await rows(gc);
    out.rowsDcrOpen = await rows(gd);
    await p.screenshot({ path: `${OUT}/E17-open.png` });

    // 06 항목 6: 정렬 없음·체크박스 동작
    out.gridMain = await checkGrid(p, scr.locator('.ant-splitter-panel').nth(0));
    out.gridMainOk = gridOk(out.gridMain);

    // [E3] 변경이 없으면 저장(0)은 눌리지 않는다(UX-03)
    out.saveDisabledNoChange = await h.saveDisabled(scr);

    // [E4]/[E6] 목적지 회사 없이 복사 → 안내
    await btn(scr, /문서분류지정복사/).click(); out.msgDocCopyNoCo = await msgs(); await wait(2800);
    await btn(scr, /양식복사/).click(); out.msgFormCopyNoCo = await msgs(); await wait(2800);

    // [E3 TabPage] 회사 행 클릭 → 그 회사 Link 목록
    await gc.locator('.ag-row[row-index="0"] [col-id="companyNm"]').click(); await wait(1500);
    out.dcrAfterRowClick = await rows(gd);
    out.getsRowClick = gets.slice(-1);
    out.dcrFirst = (await rowsText(gd)).slice(0, 2);

    // 회사 하나 체크 → 복사 확인창(아니오로 닫음)
    await gc.locator('.ag-row[row-index="1"] input[type=checkbox]').first().click(); await wait(300);
    await btn(scr, /문서분류지정복사/).click(); await wait(600);
    out.confirmDocCopy = await confirmText();
    await p.locator('.ant-modal-confirm .ant-btn-default').click(); await wait(600);
    await btn(scr, /양식복사/).click(); await wait(600);
    out.confirmFormCopy = await confirmText();
    await p.locator('.ant-modal-confirm .ant-btn-default').click(); await wait(600);
    await gc.locator('.ag-row[row-index="1"] input[type=checkbox]').first().click(); await wait(300);
    out.copyWrites = writes.filter(w => w.includes('copy-')).length;

    // [E1][E2] 검색
    const search = scr.locator('input[placeholder="Link명/문서분류명"]');
    await search.fill('휴가'); await search.press('Enter'); await wait(1800);
    out.rowsSearchMain = await rows(gm);
    out.rowsSearchDcr = await rows(gd);
    out.getsSearch = gets.slice(-2);
    await search.fill(''); await search.press('Enter'); await wait(1500);
    out.rowsAfterClear = await rows(gm);

    // 회사명 검색 (TabPage E1)
    const coSearch = scr.locator('.ant-splitter-panel').nth(1).locator('input.ant-input').first();
    await coSearch.fill('한'); await coSearch.press('Enter'); await wait(1500);
    out.rowsCompanySearch = await rows(gc);
    await coSearch.fill(''); await coSearch.press('Enter'); await wait(1500);
    out.rowsCompanyBack = await rows(gc);

    // [E8] 문서분류명 아이콘 → 조회창(Dcr30_Move_DcrClass)
    const rowWithTree = gm.locator('.ag-row[row-index]').filter({ hasText: '/' }).first();
    await rowWithTree.locator('[col-id="classTreeFullName"] button').click(); await wait(1800);
    const mv = modal('문서분류');
    out.moveTitle = await mv.locator('.ant-modal-title').innerText();
    out.moveButtons = await h.buttons(mv);
    out.moveNodes = await mv.locator('.ant-tree-node-content-wrapper').count();
    out.getsMove = gets.slice(-1);
    await p.screenshot({ path: `${OUT}/E17-move.png` });
    // [E5] 최하위가 아닌 분류 → 확인 → 안내
    await mv.locator('.ant-tree-node-content-wrapper').first().click(); await wait(400);
    await btn(mv, /확\s*인/).click(); out.msgMoveNotLeaf = await msgs(); await wait(2800);
    // [E2][E1] 찾기: 휴가
    await mv.locator('input.ant-input').first().fill('휴가신청서'); await mv.locator('input.ant-input').first().press('Enter'); await wait(800);
    out.moveSelectedAfterSearch = (await mv.locator('.ant-tree-node-selected').allInnerTexts()).join('|');
    out.moveExpanded = await mv.locator('.ant-tree-switcher_open').count();
    // [E3] 확인 → 그 행이 바뀌고 저장(1)
    const origName = await rowWithTree.locator('[col-id="classTreeFullName"]').innerText();
    await btn(mv, /확\s*인/).click(); await wait(800);
    out.rowAfterPick = (await rowWithTree.locator('[col-id="classTreeFullName"]').innerText()).replace(/\s+/g, ' ');
    out.saveLabelAfterPick = (await btn(scr, /저\s*장/).first().innerText()).replace(/\s/g, '');
    out.origName = origName.replace(/\s+/g, ' ');
    // 되돌리기: 조회로 버린다
    await btn(scr, /^\s*조\s*회\s*$/).first().click(); await wait(1500);
    out.saveLabelAfterRetrieve = (await btn(scr, /저\s*장/).first().innerText()).replace(/\s/g, '');
    // [E4] 선택안함 / [E5] 닫기
    await rowWithTree.locator('[col-id="classTreeFullName"] button').click(); await wait(1500);
    await btn(modal('문서분류'), /닫\s*기/).click(); await wait(600);
    out.moveClosed = (await modal('문서분류').count()) === 0;

    // 데이터연결(양식) 아이콘: A01(휴가신청서) → 편집기 + 태그
    const rowA01 = gm.locator('.ag-row[row-index]').filter({ hasText: '휴가신청서' }).first();
    await rowA01.locator('[col-id="actionCell"] button').click(); await wait(1800);
    const cm = modal('양식 & 태그');
    out.cmOpen = await cm.count();
    out.cmTags = (await cm.locator('div[style*="line-height"] > div').allInnerTexts()).join(',');
    out.cmButtons = (await cm.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.cmEditor = await cm.locator('.ProseMirror').count();
    out.cmContentLen = (await cm.locator('.ProseMirror').innerText()).length;
    out.getsMapping = gets.filter(g => g.includes('form-mappings')).slice(-1);
    await cm.getByText('( 참 고 )').click(); await wait(1000);
    const ex = modal('참 고');
    out.exampleOpen = await ex.count();
    out.exampleImgLoaded = await ex.locator('img').evaluate(img => img.complete && img.naturalWidth > 0).catch(() => false);
    await ex.locator('img').click(); await wait(600);
    out.exampleClosed = (await modal('참 고').count()) === 0;
    await p.screenshot({ path: `${OUT}/E17-mapping.png` });
    await btn(cm, /닫\s*기/).click(); await wait(600);
    out.cmClosed = (await modal('양식 & 태그').count()) === 0;
    // 태그 목록이 없는 코드(A02 급여대장) → 안내
    const rowA02 = gm.locator('.ag-row[row-index]').filter({ hasText: '급여대장' }).first();
    await rowA02.locator('[col-id="actionCell"] button').click(); out.msgNoTags = await msgs(); await wait(2800);
    // D01 연봉계약현황 → 전용 안내
    const rowD01 = gm.locator('.ag-row[row-index]').filter({ hasText: '연봉계약현황' }).first();
    await rowD01.locator('[col-id="actionCell"] button').click(); out.msgD01 = await msgs(); await wait(2800);

    // TabPage dcrGrid: 비고 아이콘 → 비고 창
    await gc.locator('.ag-row[row-index="0"] [col-id="companyNm"]').click(); await wait(1500);
    const dRow = gd.locator('.ag-row[row-index="0"]');
    await scrollX(gd, 5000);
    await dRow.locator('[col-id="actionCell02"] button').click(); await wait(1000);
    const nt = modal('비고');
    out.noteOpen = await nt.count();
    out.noteButtons = (await nt.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.noteArea = await nt.locator('textarea').count();
    await p.screenshot({ path: `${OUT}/E17-note.png` });
    await btn(nt, /닫\s*기/).click(); await wait(600);
    out.noteClosed = (await modal('비고').count()) === 0;
    // TabPage 문서분류명 아이콘 → 제목 "문서분류 - 회사명" → 닫기
    await scrollX(gd, 0);
    await dRow.locator('[col-id="classTreeFullName"] button').click(); await wait(1800);
    out.moveCompanyTitle = await p.locator('.ant-modal:visible .ant-modal-title').last().innerText();
    await btn(p.locator('.ant-modal:visible').last(), /닫\s*기/).click(); await wait(600);
    // TabPage 데이터연결(양식) 아이콘 (A01 행) → 편집기 열렸다 닫힘
    const dA01 = gd.locator('.ag-row[row-index]').filter({ hasText: '휴가신청서' }).first();
    await scrollX(gd, 400);
    await dA01.locator('[col-id="actionCell01"] button').click(); await wait(1500);
    out.cmCompanyOpen = await modal('양식 & 태그').count();
    await btn(modal('양식 & 태그'), /닫\s*기/).click(); await wait(600);

    // [E3] 비고 한 칸 바꿔 저장 → 원래 값으로 되돌림
    const target = gm.locator('.ag-row[row-index]').filter({ hasText: '휴가신청서' }).first();
    const noteCell = target.locator('[col-id="note"]');
    const before = (await noteCell.innerText()).trim();
    const linkId = await target.getAttribute('row-id');
    out.noteBefore = before; out.linkId = linkId;
    restore.push({ linkId, note: before === '' ? null : before });
    await noteCell.dblclick(); await wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type('E17시험'); await p.keyboard.press('Enter'); await wait(500);
    out.saveLabelEdit = (await btn(scr, /저\s*장/).first().innerText()).replace(/\s/g, '');
    const wBefore = writes.length;
    await btn(scr, /저\s*장/).first().click(); await wait(2200);
    out.saveWrites = writes.slice(wBefore);
    out.noteAfterSave = (await target.locator('[col-id="note"]').innerText()).trim();
    out.msgSave = await msgs();
    await p.screenshot({ path: `${OUT}/E17-saved.png` });
    // 되돌림
    await target.locator('[col-id="note"]').dblclick(); await wait(300);
    await p.keyboard.press('Control+A');
    if (before === '') await p.keyboard.press('Delete'); else await p.keyboard.type(before);
    await p.keyboard.press('Enter'); await wait(500);
    await btn(scr, /저\s*장/).first().click(); await wait(2200);
    out.noteRestored = (await target.locator('[col-id="note"]').innerText()).trim();
    out.writes = writes;
    out.restore = restore;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E17-err.png` }).catch(() => {});
    out.writes = writes;
    out.restore = restore;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
