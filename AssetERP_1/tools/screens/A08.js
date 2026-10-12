// A08 권한그룹별 메뉴권한 복사(Sys07_Tab_Company) 화면 확인. admin 회사 메뉴라 admin 회사 admin으로 로그인한다(A02와 같음).
// 열기 → 위/아래 회사 목록 → 위 COMPANY 클릭 → 권한 → '일반 사용자' 선택 → 트리 → 펼치기·감추기 → 메뉴 선택
// → 목적지 미선택 경고 → 아래 회사 2개 체크(권한 패널 비활성) → 1개(COMPANY 자신)만 → 권한그룹복사·매뉴권한복사(자기 자신 = 데이터 그대로) → 그리드 기본 점검.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A08.js <스크린샷 폴더> [회사 서브도메인]'"
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
    await p.getByText('권한그룹별 메뉴권한 복사', { exact: true }).first().click(); await wait(2500);
    const top = p.locator('.ant-splitter-panel').first(), bottom = p.locator('.ant-splitter-panel').last();
    const grids = s => s.locator('.ag-root-wrapper');
    out.toolbar = await p.locator('.flexlayout__tab').last().locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.headers = [0, 1, 2].map(() => null);
    for (const i of [0, 1, 2]) out.headers[i] = await grids(top).nth(i).locator('.ag-header-cell-text').allInnerTexts();
    out.topCompanies = await countRows(grids(top).nth(0));
    out.bottomCompanies = await countRows(grids(bottom).nth(0));

    // [In E2] 회사 클릭 → 권한
    await grids(top).nth(0).locator('.ag-row', { hasText: COMPANY }).first().locator('.ag-cell[col-id="companyNm"]').click(); await wait(1500);
    out.roles = await countRows(grids(top).nth(1));
    out.roleYn = await grids(top).nth(1).locator('.ag-row', { hasText: ROLE }).first().locator('.ag-cell[col-id="defaultRole"]').innerText();
    // [Role E2] 권한 선택 → 트리
    await grids(top).nth(1).locator('.ag-row', { hasText: ROLE }).first().locator('.ag-cell[col-id="roleNm"]').click(); await wait(1500);
    out.treeTop = await countRows(grids(top).nth(2));
    await top.getByRole('button', { name: '펼치기' }).click(); await wait(800);
    out.treeExpanded = await countRows(grids(top).nth(2));
    await top.getByRole('button', { name: '감추기' }).click(); await wait(500);
    out.treeCollapsed = await countRows(grids(top).nth(2));
    await grids(top).nth(2).locator('.ag-row[row-index="0"] .ag-cell[col-id="seq"]').click(); await wait(300);
    out.menuSelected = await grids(top).nth(2).locator('.ag-row.ag-row-selected .ag-cell[col-id="menuNoPlusNm"]').innerText().catch(() => '');
    await p.screenshot({ path: OUT + '/A08-1-source.png' });

    // [E1] 목적지 없음 → 경고
    await p.getByRole('button', { name: '권한그룹복사' }).click(); await wait(500);
    out.msgs.push('목적지 없음: ' + await msgs()); await wait(2500);

    // 아래: 체크 2개 → 권한 패널 비활성
    const bgrid = grids(bottom).nth(0);
    await bgrid.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click({ force: true }); await wait(300);
    await bgrid.locator('.ag-row[row-index="1"] .ag-selection-checkbox input').first().click({ force: true }); await wait(500);
    out.bottomChecked2 = await bgrid.locator('.ag-row.ag-row-selected').count();
    out.roleDisabled = await bottom.locator('[style*="pointer-events: none"]').count() > 0;
    // 행 클릭 → 그 행만 선택 + 권한 패널 활성 + 그 회사 권한
    await bgrid.locator('.ag-row', { hasText: COMPANY }).first().locator('.ag-cell[col-id="companyNm"]').click(); await wait(1500);
    out.bottomChecked1 = await bgrid.locator('.ag-row.ag-row-selected').count();
    out.roleEnabled = await bottom.locator('[style*="pointer-events: none"]').count() === 0;
    out.bottomRoles = await countRows(grids(bottom).nth(1));

    // [E1]→[E2] 권한그룹복사 (목적지 = 출발지 자신 → 같은 이름이 있어 아무것도 안 넣음)
    await p.getByRole('button', { name: '권한그룹복사' }).click(); await wait(500);
    out.confirmRole = await p.locator('.ant-modal-confirm-content').innerText();
    await p.getByRole('button', { name: '예' }).click(); await wait(1500);
    out.msgs.push('권한그룹복사: ' + await msgs());
    out.bottomCheckedAfter = await bgrid.locator('.ag-row.ag-row-selected').count();
    await wait(2500);

    // [E3]→[E4] 매뉴권한복사 (자기 자신 → 같은 값으로 UPDATE)
    await bgrid.locator('.ag-row', { hasText: COMPANY }).first().locator('.ag-cell[col-id="companyNm"]').click(); await wait(800);
    await p.getByRole('button', { name: '매뉴권한복사' }).click(); await wait(500);
    out.confirmMenu = await p.locator('.ant-modal-confirm-content').innerText();
    await p.getByRole('button', { name: '예' }).click(); await wait(1500);
    out.msgs.push('매뉴권한복사: ' + await msgs());
    await p.screenshot({ path: OUT + '/A08-2-copied.png' });

    // 그리드 기본 점검 (회사·권한 그리드 — 트리는 체크박스 없음)
    out.grid = {};
    for (const [k, s, i] of [['inCompany', top, 0], ['role', top, 1], ['tree', top, 2], ['outCompany', bottom, 0]]) {
      const holder = grids(s).nth(i).locator('xpath=..');
      out.grid[k] = await checkGrid(p, holder);
    }
    out.gridOk = Object.values(out.grid).every(gridOk);
  } catch (e) {
    out.error = e.message.slice(0, 300);
    await p.screenshot({ path: OUT + '/A08-error.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
