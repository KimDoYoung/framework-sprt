// C04 사원별 메뉴권한(View)(Emp00_Tab_RoleMenu) 화면 확인. 조회만 한다(데이터 변경 없음).
// 사용: NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C04.js <스크린샷 폴더> [회사] [검색어]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'kfstest', SEARCH = '사용자'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, msgs: [] };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  try {
    await login(p, COMPANY);
    await openMenu(p, '관리자', '사원별 메뉴권한(View)');
    const west = p.locator('.ant-splitter-panel').first(), east = p.locator('.ant-splitter-panel').last();
    // [E0] 열림 → 재직(100) 조회
    out.westLabels = await west.locator('.ant-typography').allInnerTexts();
    out.baseDate = await west.locator('.ant-picker input').inputValue();
    out.westButtons = await west.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.westHeaders = await west.locator('.ag-header-cell-text').allInnerTexts();
    out.users = await countRows(west);
    out.iconCells = await west.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').count();
    out.eastButtons = await east.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.searchPlaceholder = await east.locator('input.ant-input').getAttribute('placeholder');
    out.treeBefore = await countRows(east);
    // [E2] 사원 선택 → 트리 조회 (접힌 상태: 루트만)
    await west.locator('.ag-row[row-index="0"] .ag-cell[col-id="korNm"]').click(); await p.waitForTimeout(1500);
    out.selectedUser = await west.locator('.ag-row-selected .ag-cell[col-id="korNm"]').first().innerText().catch(() => '');
    out.treeRoots = await countRows(east);
    out.treeRootNames = await east.locator('.ag-row[row-index] .ag-cell').allInnerTexts();
    // 노드 한 번 클릭 → 펼침(깊게)
    await east.locator('.ag-row[row-index="0"] .ag-cell').click(); await p.waitForTimeout(500);
    out.afterNodeClick = await countRows(east);
    // [E3] 펼치기 / [E4] 감추기
    await east.getByRole('button', { name: '펼치기' }).click(); await p.waitForTimeout(600);
    out.expandAll = await countRows(east);
    await east.getByRole('button', { name: '감추기' }).click(); await p.waitForTimeout(600);
    out.collapseAll = await countRows(east);
    // [E1] 화면명 검색 Enter → 일치 행이 보이고 선택됨
    await east.locator('input.ant-input').fill(SEARCH); await east.locator('input.ant-input').press('Enter'); await p.waitForTimeout(800);
    out.searchVisible = await countRows(east);
    out.searchSelected = await east.locator('.ag-row-selected').count();
    // [E2] 조회 버튼 → 같은 사원 다시 조회 (펼침 초기화)
    await east.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1200);
    out.afterRefresh = await countRows(east);
    // 그룹 아이콘 → 권한그룹 조회창
    await west.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').click(); await p.waitForTimeout(1500);
    const modal = p.locator('.ant-modal');
    out.modalTitle = await modal.locator('.ant-modal-title').innerText();
    out.modalHeaders = await modal.locator('.ag-header-cell-text').allInnerTexts();
    out.modalRows = await countRows(modal);
    out.modalChecked = await modal.locator('.gb-check input:checked').count();
    out.modalButtons = await modal.locator('.ant-modal-footer button').allInnerTexts();
    await p.screenshot({ path: OUT + '/C04-modal.png' });
    await modal.locator('.ant-modal-footer button').click(); await p.waitForTimeout(600);
    out.modalClosed = (await p.locator('.ant-modal:visible').count()) === 0;
    // 조회 조건: 없는 이름 → 0건
    await west.locator('input.ant-input').fill('없는사원zzz'); await west.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1200);
    out.noUsers = await countRows(west);
    await west.locator('input.ant-input').fill(''); await west.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1200);
    // 7-1 그리드 점검 (사원 그리드)
    out.사원그리드 = await checkGrid(p, west);
    out.gridOk = gridOk(out.사원그리드);
    await p.screenshot({ path: OUT + '/C04.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/C04-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
