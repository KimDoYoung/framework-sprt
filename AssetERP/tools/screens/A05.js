// A05 고객사별 사용자권한그룹 관리(Sys05_Tab_CompanyUserRole + Sys05_Page_CompanyUserRole + Sys01_Lookup_SelectSingle) 화면 확인.
// admin 회사 메뉴라 admin 회사 admin으로 로그인한다(A07과 같음). 저장하지 않는다 — 데이터 그대로.
// 회사 없이 조회(0행) → 팝업 더블클릭 선택(바로 권한 조회·첫 행 선택 → 오른쪽 사원) → 권한명 거르기 → 등록(사원찾기 = 고른 회사 사원)
// → 한 명 추가 → 권한조직 조직찾기 열기·닫기 → 조회로 버림 → 저장(바뀐 것 없음) → 삭제(체크 없음) → 그리드 기본 점검 → 팝업 취소(회사·권한·사원 비움).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A05.js <스크린샷 폴더> [회사 서브도메인]'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'kfstest'] = process.argv.slice(2);

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
    await p.getByText('고객사별 사용자권한그룹 관리', { exact: true }).first().click(); await wait(2000);
    const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').last();
    out.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
    out.rightButtons = await right.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.rightHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();

    // [E1] 회사 없이 조회 → 원본은 검사 없이 0행
    await left.getByRole('button', { name: '조회' }).click(); await wait(500);
    out.rolesNoCompany = await countRows(left);

    // [E2] 트리거 → 팝업 → 더블클릭 선택 → retrieve()
    const company = left.locator('input').first();
    await company.click(); await wait(1500);
    const modal = p.locator('.ant-modal').last();
    out.popupTitle = await modal.locator('.ant-modal-title').innerText();
    await modal.locator('input[type=text], input:not([type])').first().fill(COMPANY);
    await modal.locator('input[type=text], input:not([type])').first().press('Enter'); await wait(1000);
    await modal.locator('.ag-row[row-index="0"] .ag-cell[col-id="companyNm"]').dblclick(); await wait(2000);
    out.companyName = await company.inputValue();
    out.roles = await countRows(left);
    out.firstSelected = await left.locator('.ag-row[row-index="0"]').getAttribute('class').then(c => c.includes('ag-row-selected'));
    out.userRoles = await countRows(right);

    // 권한명 거르기 + [E1] 조회
    await left.locator('input').nth(1).fill('관리'); await left.getByRole('button', { name: '조회' }).click(); await wait(1500);
    out.rolesFiltered = await countRows(left);
    await left.locator('input').nth(1).fill(''); await left.getByRole('button', { name: '조회' }).click(); await wait(1500);

    // [E3] 다른 권한 선택 → 오른쪽 다시 조회
    await left.locator('.ag-row[row-index="1"] .ag-cell[col-id="roleNm"]').click(); await wait(1500);
    out.userRolesRole2 = await countRows(right);
    await left.locator('.ag-row[row-index="0"] .ag-cell[col-id="roleNm"]').click(); await wait(1500);
    const before = await countRows(right);

    // 페이지 [E2] 등록 → 사원찾기(고른 회사)
    await right.getByRole('button', { name: '등록' }).click(); await wait(1500);
    const pm = p.locator('.ant-modal').last();
    out.personTitle = await pm.locator('.ant-modal-title').innerText();
    out.personRows = await countRows(pm);
    await pm.getByRole('button', { name: '확인' }).click(); await wait(500);
    out.msgs.push('noPerson: ' + await msgs());
    // 이미 이 권한에 없는 사람을 고르기 어렵다 → 첫 사람을 추가만 하고 저장하지 않는다
    await pm.locator('.ag-row[row-index="0"] .ag-selection-checkbox, .ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
    await pm.getByRole('button', { name: '확인' }).click(); await wait(800);
    out.afterAdd = (await countRows(right)) - before;

    // [E5] 권한조직 조직찾기 열기·닫기
    await right.locator('.ag-row[row-index="0"] .ag-cell[col-id="parentFullNm"] button').click(); await wait(1500);
    const om = p.locator('.ant-modal').last();
    out.orgTitle = await om.locator('.ant-modal-title').innerText();
    out.orgRows = await countRows(om);
    await om.getByRole('button', { name: '닫기' }).click(); await wait(500);
    await p.screenshot({ path: OUT + '/A05.png' });

    // [E1] 조회로 추가 행 버림 → [E3] 저장(바뀐 것 없음) → [E4] 삭제(체크 없음)
    await right.getByRole('button', { name: '조회' }).click(); await wait(1500);
    out.afterReload = await countRows(right);
    await wait(2500);
    await right.getByRole('button', { name: '저장' }).click(); await wait(500);
    out.msgs.push('saveNoChange: ' + await msgs());
    await wait(2500);
    await right.getByRole('button', { name: '삭제' }).click(); await wait(500);
    out.msgs.push('deleteNone: ' + await msgs());

    out.grid = { role: await checkGrid(p, left), userRole: await checkGrid(p, right) };
    out.gridOk = Object.values(out.grid).every(gridOk);

    // [E2] 팝업 취소 → 회사명·ID 비움 → retrieve() → 0행 → 오른쪽도 비움
    await company.click(); await wait(1200);
    // 닫힌 사원찾기·조직찾기 Modal도 DOM에 남아 있다 → 제목으로 고른다
    await p.locator('.ant-modal').filter({ has: p.locator('.ant-modal-title', { hasText: '고객사' }) }).getByRole('button', { name: '취소' }).click(); await wait(1000);
    out.companyAfterCancel = await company.inputValue();
    out.rolesAfterCancel = await countRows(left);
    out.userRolesAfterCancel = await countRows(right);
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A05-error.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
