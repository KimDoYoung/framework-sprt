// A07 고객사별 메뉴권한 관리(Sys07_Tab_CompanyRoleMenu + Sys07_Tree_CompanyRoleMenu + Sys01_Lookup_SelectSingle) 화면 확인.
// admin 회사 메뉴라 admin 회사 admin으로 로그인한다(A08과 같음). 저장은 "바뀐 것 없음" 경로만 — 데이터 그대로.
// 회사 미선택 조회 경고 → 팝업(미선택 확인 경고, 검색, 더블클릭 선택) → 권한 조회 → 권한 선택 → 트리 → 펼치기·감추기
// → 매뉴명 칸 클릭(아무것도 안 함) → 권한 칸 클릭(연쇄) → 조회로 버림 → 저장(바뀐 것 없음) → 그리드 기본 점검 → 팝업 취소(회사·권한·트리 비움).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A07.js <스크린샷 폴더> [회사 서브도메인]'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'kfstest'] = process.argv.slice(2);
const ROLE = '일반 사용자';

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, msgs: [] };
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join(' / ');
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const wait = ms => p.waitForTimeout(ms);
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    await p.getByText('기초자료', { exact: true }).first().click(); await wait(600);
    await p.getByText('고객사별 메뉴권한 관리', { exact: true }).first().click(); await wait(2000);
    const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').last();
    out.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
    out.rightButtons = await right.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.rightHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();

    // [E2] 회사 없이 조회 → 경고
    await left.getByRole('button', { name: '조회' }).click(); await wait(500);
    out.msgs.push('noCompany: ' + await msgs());

    // [E1] 트리거 → 팝업
    const company = left.locator('input').first();
    await company.click(); await wait(1500);
    const modal = p.locator('.ant-modal').last();
    out.popupTitle = await modal.locator('.ant-modal-title').innerText();
    out.popupButtons = await modal.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.popupHeaders = await modal.locator('.ag-header-cell-text').allInnerTexts();
    out.popupRows = await countRows(modal);
    await wait(2500);
    await modal.getByRole('button', { name: '확인' }).click(); await wait(500);
    out.msgs.push('noSelect: ' + await msgs());
    out.popupGrid = await checkGrid(p, modal);
    await modal.locator('input[type=text], input:not([type])').first().fill(COMPANY);
    await modal.locator('input[type=text], input:not([type])').first().press('Enter'); await wait(1000);
    out.popupSearchRows = await countRows(modal);
    await modal.locator('.ag-row[row-index="0"] .ag-cell[col-id="companyNm"]').dblclick(); await wait(800);
    out.popupClosed = !(await p.locator('.ant-modal-wrap').filter({ has: p.locator('.ant-modal-title', { hasText: '고객사' }) }).isVisible().catch(() => false));
    out.companyName = await company.inputValue();

    // [E2] 조회 → 권한 목록
    await left.getByRole('button', { name: '조회' }).click(); await wait(1500);
    out.roles = await countRows(left);
    // [E3] 권한 선택 → 트리
    await left.locator('.ag-row', { hasText: ROLE }).first().locator('.ag-cell[col-id="roleNm"]').click(); await wait(2000);
    out.treeTop = await countRows(right);
    await right.getByRole('button', { name: '펼치기' }).click(); await wait(800);
    out.treeExpandedRendered = await countRows(right);
    await right.getByRole('button', { name: '감추기' }).click(); await wait(500);
    out.treeCollapsed = await countRows(right);
    // [E5] 매뉴명 칸 클릭 → 원본은 cellIndex 2(권한)만 처리 → 펼쳐지지 않아야 함
    await right.locator('.ag-row[row-index="0"] .ag-cell[col-id="seq"]').click(); await wait(500);
    out.otherCellRows = await countRows(right);
    // [E5] 권한 칸 클릭 → 깊게 펼침 + 루트·자손 같은 값 (저장하지 않음)
    const first = right.locator('.ag-row[row-index="0"]');
    out.rootBefore = await first.locator('.ag-cell[col-id="useYn"] input').isChecked();
    await first.locator('.ag-cell[col-id="useYn"]').click(); await wait(600);
    out.rootAfter = await first.locator('.ag-cell[col-id="useYn"] input').isChecked();
    out.childAfter = await right.locator('.ag-row[row-index="1"] .ag-cell[col-id="useYn"] input').isChecked();
    out.afterToggleRows = await countRows(right);
    await p.screenshot({ path: OUT + '/A07.png' });
    // [E1] 트리 조회 → 바꾼 것 버림 → [E4] 저장(바뀐 것 없음)
    await right.getByRole('button', { name: '조회' }).click(); await wait(1500);
    out.rootReloaded = await right.locator('.ag-row[row-index="0"] .ag-cell[col-id="useYn"] input').isChecked();
    await right.getByRole('button', { name: '저장' }).click(); await wait(500);
    out.msgs.push('saveNoChange: ' + await msgs());

    out.grid = { role: await checkGrid(p, left) };
    out.gridOk = Object.values(out.grid).every(gridOk) && gridOk(out.popupGrid);

    // 팝업 취소 → 회사명·ID 비움 → 조회 경고
    await company.click(); await wait(1200);
    await p.locator('.ant-modal').last().getByRole('button', { name: '취소' }).click(); await wait(500);
    out.companyAfterCancel = await company.inputValue();
    // 사용자 결정(2026-10-12): 취소로 회사가 지워지면 권한 목록·메뉴 트리도 비운다
    out.rolesAfterCancel = await countRows(left);
    out.treeAfterCancel = await countRows(right);
    await wait(2500);
    await left.getByRole('button', { name: '조회' }).click(); await wait(500);
    out.msgs.push('afterCancel: ' + await msgs());
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A07-error.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
